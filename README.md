# SUGAM — BIS Compliance & Standards Intelligence Assistant

**SUGAM** is an AI-powered assistant for Bureau of Indian Standards (BIS) certification, Indian Standards (IS) discovery, testing laboratory locators, and regulatory compliance. Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS.

Supports **11 Indian languages**: English, हिन्दी (Hindi), தமிழ் (Tamil), తెలుగు (Telugu), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam), मराठी (Marathi), ગુજરાતી (Gujarati), ਪੰਜਾਬੀ (Punjabi), বাংলা (Bengali), and ଓଡ଼ିଆ (Odia).

---

## 🌟 Key Features

1. **Smart Standards Chat (`/chat`)**
   - Natural language queries to identify the applicable IS number and certification scheme.
   - Formatted Markdown responses with structured tables, parameters, and cited standards badges.
   - Timeline & cost summary badges.
   - One-click **PDF Compliance Dossier** generation via `jsPDF`.
   - Copy response to clipboard.

2. **Standards Comparison (`/compare`)**
   - Side-by-side comparison of 2–3 Indian Standards.
   - Comprehensive parameters: Standard Number, Title, Category, Mandatory vs Voluntary (QCO), Timeline, Application Fee, Testing Fee, Inspection Fee, Stages, and Related Standards.

3. **Timeline & Cost Calculator (`/timeline`)**
   - Interactive configuration: Product Category, Complexity, Urgency (Normal, Priority, Fast-track), Enterprise size (MSME / Large).
   - 4-Phase timeline breakdown with days estimation.
   - Itemized fee schedule with automatic 20% MSME concession calculation.

4. **Industry Guides (`/guides`)**
   - Sector-specific certification roadmaps: Electronics & IT, Food & Beverages, Furniture, Textiles, Steel & Metal, Chemicals.
   - Step-by-step milestones (Product Classification, Documentation, Lab Testing, BIS Application, Factory Audit, Certificate Issuance).

5. **BIS Office Locator (`/offices`)**
   - Geodesic search by city name or 6-digit PIN code.
   - Calculates distance (in km) to the nearest BIS branch, regional office, or testing facility.
   - Address, contact phone, email, and services roster.

6. **Frequently Asked Questions (`/faq`)**
   - Comprehensive accordions categorized by: About BIS, Certification Process, Using SUGAM, and MSMEs.

7. **User Dashboard & Auth (`/dashboard`, `/login`, `/signup`)**
   - Quick sign-in with demo credentials (`demo@bis-assistant.com` / `demo123`).
   - Live metrics: Total Conversations, Standards Explored, Saved Standards.
   - Recent queries history & saved favorites.

8. **Full API Suite (`/api`)**
   - `/api/chat`: AI Standards assistant RAG retrieval endpoint.
   - `/api/standards`: Standards query, category, and stats endpoint.
   - `/api/timeline`: Timeline and cost calculation engine.
   - `/api/auth/login`: Authentication endpoint.
   - `/api/auth/register`: User registration endpoint.
   - `/api/dashboard/stats`, `/api/dashboard/recent-searches`, `/api/dashboard/favorites`.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Deploy to Vercel

You can deploy this repository to Vercel in 1 click:

1. Push this repository to your **GitHub** or **GitLab** account:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sugam.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your `sugam` repository.
4. Click **Deploy**. (No extra environment variables required for standard operation!).
