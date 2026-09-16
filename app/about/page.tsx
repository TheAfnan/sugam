import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { GraduationCap, Trophy, Users, Lightbulb, Target, Award, CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 bg-slate-50/70 pt-[68px]">
        {/* Header */}
        <section className="gradient-hero text-white py-16 sm:py-24">
          <div className="container-main text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-400 text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" /> DSMNRU Lucknow
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              About SIH 2026 Internal Qualifier
            </h1>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Dr. Shakuntala Misra National Rehabilitation University (DSMNRU), Lucknow is proud to organize the official institute-level qualifier for Smart India Hackathon 2026.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="container-main py-16 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#1a237e]">Overview</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">What is Smart India Hackathon?</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Smart India Hackathon (SIH) is a nationwide initiative by the Ministry of Education's Innovation Cell (MIC), AICTE, and Government of India to provide students with a platform to solve some of the pressing problems we face in our daily lives.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                The Internal Hackathon at DSMNRU serves as the primary screening process to select the top teams that will officially represent our university at the national level competition.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Key Highlights
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>200+ Verified Government Problem Statements (Software & Hardware)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Teams of 3 to 6 members with mandatory gender diversity encouraged</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Mentorship from DSMNRU faculty and industry experts</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Direct nomination to National SIH 2026 Grand Finale</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pillars */}
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-[#1a237e]">Focus Areas</span>
              <h2 className="text-2xl font-black text-slate-950 mt-1">Our Core Values & Inclusivity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Accessibility & Inclusion', desc: 'Encouraging solutions that empower Persons with Disabilities (Divyangjan) in alignment with DSMNRU\'s mission.', icon: Target },
                { title: 'Innovative Thinking', desc: 'Promoting out-of-the-box software and hardware prototypes for real-world governance problems.', icon: Lightbulb },
                { title: 'Team Collaboration', desc: 'Building interdisciplinary technical skills through collaborative problem solving and presentations.', icon: Users },
              ].map(({ title, desc, icon: Icon }) => (
                <div key={title} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-[#1a237e]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1a237e]" />
                  </div>
                  <h3 className="font-black text-slate-900">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
