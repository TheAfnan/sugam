-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE problem_category AS ENUM ('Software', 'Hardware');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE problem_status AS ENUM ('active', 'disabled', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE team_status AS ENUM ('forming', 'complete', 'submitted', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE selection_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE member_role AS ENUM ('leader', 'member');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- PROFILES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  enrollment_number TEXT UNIQUE,
  phone TEXT,
  department TEXT,
  year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 6),
  role user_role DEFAULT 'student',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROBLEMS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ps_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category problem_category NOT NULL,
  theme TEXT NOT NULL,
  ministry TEXT,
  organization TEXT NOT NULL,
  background TEXT,
  description TEXT NOT NULL,
  expected_solution TEXT,
  constraints TEXT,
  reference_links TEXT[],
  keywords TEXT[],
  max_teams INTEGER DEFAULT 3 CHECK (max_teams > 0),
  current_team_count INTEGER DEFAULT 0 CHECK (current_team_count >= 0),
  status problem_status DEFAULT 'active',
  is_featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT team_count_not_exceed_max CHECK (current_team_count <= max_teams)
);

CREATE INDEX IF NOT EXISTS idx_problems_status ON problems(status);
CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(category);
CREATE INDEX IF NOT EXISTS idx_problems_theme ON problems(theme);
CREATE INDEX IF NOT EXISTS idx_problems_ps_id ON problems(ps_id);
CREATE INDEX IF NOT EXISTS idx_problems_title_trgm ON problems USING gin (title gin_trgm_ops);

-- ============================================================
-- TEAMS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  leader_id UUID NOT NULL REFERENCES profiles(id),
  department TEXT,
  description TEXT,
  status team_status DEFAULT 'forming',
  max_size INTEGER DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_leader ON teams(leader_id);
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);

-- ============================================================
-- TEAM MEMBERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role member_role DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- A student can only be in ONE team
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);

-- ============================================================
-- PROBLEM SELECTIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS problem_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID UNIQUE NOT NULL REFERENCES teams(id) ON DELETE CASCADE,  -- One problem per team
  problem_id UUID NOT NULL REFERENCES problems(id),
  selected_by UUID NOT NULL REFERENCES profiles(id),
  status selection_status DEFAULT 'pending',
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_selections_team ON problem_selections(team_id);
CREATE INDEX IF NOT EXISTS idx_selections_problem ON problem_selections(problem_id);
CREATE INDEX IF NOT EXISTS idx_selections_status ON problem_selections(status);

-- ============================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_important BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  published_by UUID NOT NULL REFERENCES profiles(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);

-- ============================================================
-- EVENT SETTINGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS event_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  performed_by UUID REFERENCES profiles(id),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- ============================================================
-- TRIGGERS: auto update timestamps
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_problems_updated_at
  BEFORE UPDATE ON problems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ATOMIC PROBLEM SELECTION RPC
-- Prevents race conditions when multiple teams select same problem
-- ============================================================

CREATE OR REPLACE FUNCTION select_problem(
  p_user_id UUID,
  p_problem_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_team_id UUID;
  v_member_count INTEGER;
  v_min_size INTEGER;
  v_is_leader BOOLEAN;
  v_selection_locked BOOLEAN;
  v_allow_change BOOLEAN;
  v_problem RECORD;
  v_existing_selection UUID;
BEGIN
  -- Check selection lock
  SELECT (value::text)::boolean INTO v_selection_locked
  FROM event_settings WHERE key = 'selection_locked';
  IF v_selection_locked THEN
    RETURN jsonb_build_object('error', 'Problem selection is currently locked by administration');
  END IF;

  -- Get user team and role
  SELECT tm.team_id, (tm.role = 'leader') INTO v_team_id, v_is_leader
  FROM team_members tm
  WHERE tm.user_id = p_user_id;

  IF v_team_id IS NULL THEN
    RETURN jsonb_build_object('error', 'You must be in a team to select a problem');
  END IF;

  IF NOT v_is_leader THEN
    RETURN jsonb_build_object('error', 'Only the team leader can select a problem');
  END IF;

  -- Check minimum team size
  SELECT COUNT(*) INTO v_member_count FROM team_members WHERE team_id = v_team_id;
  SELECT (value::text)::integer INTO v_min_size FROM event_settings WHERE key = 'min_team_size';
  v_min_size := COALESCE(v_min_size, 3);

  IF v_member_count < v_min_size THEN
    RETURN jsonb_build_object('error', format('Your team needs at least %s members to select a problem (currently %s)', v_min_size, v_member_count));
  END IF;

  -- Check existing selection
  SELECT id INTO v_existing_selection FROM problem_selections WHERE team_id = v_team_id;
  IF v_existing_selection IS NOT NULL THEN
    -- Check if change is allowed
    SELECT (value::text)::boolean INTO v_allow_change FROM event_settings WHERE key = 'allow_problem_change';
    IF NOT COALESCE(v_allow_change, true) THEN
      RETURN jsonb_build_object('error', 'Problem changes are not allowed. Contact faculty.');
    END IF;
    -- Decrement old problem count
    UPDATE problems p
    SET current_team_count = current_team_count - 1
    FROM problem_selections ps
    WHERE ps.id = v_existing_selection AND p.id = ps.problem_id;
    -- Remove old selection
    DELETE FROM problem_selections WHERE id = v_existing_selection;
  END IF;

  -- Lock and check new problem (FOR UPDATE prevents race conditions)
  SELECT * INTO v_problem FROM problems WHERE id = p_problem_id FOR UPDATE;

  IF v_problem IS NULL THEN
    RETURN jsonb_build_object('error', 'Problem not found');
  END IF;

  IF v_problem.status != 'active' THEN
    RETURN jsonb_build_object('error', 'This problem is not available for selection');
  END IF;

  IF v_problem.current_team_count >= v_problem.max_teams THEN
    RETURN jsonb_build_object('error', 'This problem statement is full. No more teams can select it.');
  END IF;

  -- Create selection
  INSERT INTO problem_selections (team_id, problem_id, selected_by)
  VALUES (v_team_id, p_problem_id, p_user_id);

  -- Increment team count
  UPDATE problems SET current_team_count = current_team_count + 1 WHERE id = p_problem_id;

  -- Update team status
  UPDATE teams SET status = 'submitted' WHERE id = v_team_id;

  RETURN jsonb_build_object('success', true, 'message', 'Problem selected successfully');
END;
$$;

-- ============================================================
-- WITHDRAW PROBLEM SELECTION RPC
-- ============================================================

CREATE OR REPLACE FUNCTION withdraw_problem_selection(
  p_team_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_selection RECORD;
BEGIN
  SELECT * INTO v_selection FROM problem_selections WHERE team_id = p_team_id;
  IF v_selection IS NULL THEN
    RETURN jsonb_build_object('error', 'No selection found for this team');
  END IF;

  -- Decrement problem count
  UPDATE problems SET current_team_count = GREATEST(0, current_team_count - 1)
  WHERE id = v_selection.problem_id;

  -- Delete selection
  DELETE FROM problem_selections WHERE team_id = p_team_id;

  -- Revert team status
  UPDATE teams SET status = 'forming' WHERE id = p_team_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role::text FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES RLS
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (
  id = auth.uid() OR get_my_role() IN ('admin', 'faculty')
);
CREATE POLICY profiles_insert_own ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (
  id = auth.uid() OR get_my_role() = 'admin'
);

-- PROBLEMS RLS
CREATE POLICY problems_select_all ON problems FOR SELECT USING (
  status = 'active' OR get_my_role() IN ('admin', 'faculty')
);
CREATE POLICY problems_insert_admin ON problems FOR INSERT WITH CHECK (
  get_my_role() IN ('admin', 'faculty')
);
CREATE POLICY problems_update_admin ON problems FOR UPDATE USING (
  get_my_role() IN ('admin', 'faculty')
);
CREATE POLICY problems_delete_admin ON problems FOR DELETE USING (
  get_my_role() = 'admin'
);

-- TEAMS RLS
CREATE POLICY teams_select ON teams FOR SELECT USING (
  EXISTS (SELECT 1 FROM team_members WHERE team_id = teams.id AND user_id = auth.uid())
  OR get_my_role() IN ('admin', 'faculty')
);
CREATE POLICY teams_insert ON teams FOR INSERT WITH CHECK (
  leader_id = auth.uid()
);
CREATE POLICY teams_update ON teams FOR UPDATE USING (
  leader_id = auth.uid() OR get_my_role() IN ('admin', 'faculty')
);

-- TEAM MEMBERS RLS
CREATE POLICY team_members_select ON team_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM team_members tm2 WHERE tm2.team_id = team_members.team_id AND tm2.user_id = auth.uid())
  OR get_my_role() IN ('admin', 'faculty')
);
CREATE POLICY team_members_insert ON team_members FOR INSERT WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM teams WHERE id = team_id AND leader_id = auth.uid())
);
CREATE POLICY team_members_delete ON team_members FOR DELETE USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM teams WHERE id = team_id AND leader_id = auth.uid())
  OR get_my_role() IN ('admin', 'faculty')
);

-- PROBLEM SELECTIONS RLS
CREATE POLICY selections_select ON problem_selections FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = problem_selections.team_id AND user_id = auth.uid()
  )
  OR get_my_role() IN ('admin', 'faculty')
);

-- ANNOUNCEMENTS RLS
CREATE POLICY announcements_select ON announcements FOR SELECT USING (
  is_published = true OR get_my_role() IN ('admin', 'faculty')
);
CREATE POLICY announcements_manage ON announcements FOR ALL USING (
  get_my_role() IN ('admin', 'faculty')
);

-- EVENT SETTINGS RLS
CREATE POLICY settings_select ON event_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY settings_update ON event_settings FOR ALL USING (
  get_my_role() = 'admin'
);

-- AUDIT LOGS RLS
CREATE POLICY audit_select ON audit_logs FOR SELECT USING (
  get_my_role() IN ('admin', 'faculty')
);
CREATE POLICY audit_insert ON audit_logs FOR INSERT WITH CHECK (true);
