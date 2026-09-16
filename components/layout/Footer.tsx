import Link from 'next/link'
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react'

const footerLinks = {
  event: [
    { href: '/', label: 'Home' },
    { href: '/problems', label: 'Problem Statements' },
    { href: '/announcements', label: 'Announcements' },
    { href: '/about', label: 'About SIH 2026' },
  ],
  participate: [
    { href: '/auth/register', label: 'Register Team' },
    { href: '/auth/login', label: 'Sign In to Dashboard' },
    { href: 'https://www.sih.gov.in', label: 'SIH Official Portal', external: true },
    { href: 'https://www.dsmnru.ac.in', label: 'University Website', external: true },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      {/* SIH Info Banner */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#0d1240]">
        <div className="container-main py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-white">Smart India Hackathon 2026</h3>
              <p className="text-white/70 text-sm mt-1 max-w-md">
                World&apos;s largest open innovation model — DSMNRU Internal qualifier for national SIH 2026.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/problems"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm rounded-xl transition-all shadow-lg no-underline text-center"
              >
                Explore Problems
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all no-underline text-center"
              >
                Register Team
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-main py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* University Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a237e] to-[#0d1240] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Internal Hackathon Portal</p>
                <p className="text-sm font-black text-[#1a237e]">DSMNRU · SIH 2026</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Dr. Shakuntala Misra National Rehabilitation University (DSMNRU), Lucknow, UP — 
              Official internal qualifier portal for Smart India Hackathon 2026.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                <span>Mohaan Road, Lucknow, Uttar Pradesh — 226 017</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <a href="mailto:sih2026@dsmnru.ac.in" className="hover:text-[#1a237e] transition-colors no-underline">
                  sih2026@dsmnru.ac.in
                </a>
              </div>
            </div>
          </div>

          {/* Event Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">Event</h4>
            <ul className="space-y-2.5">
              {footerLinks.event.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-[#1a237e] font-medium transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Participate Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">Participate</h4>
            <ul className="space-y-2.5">
              {footerLinks.participate.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-600 hover:text-[#1a237e] font-medium transition-colors no-underline flex items-center gap-1"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-[#1a237e] font-medium transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © 2026 Dr. Shakuntala Misra National Rehabilitation University, Lucknow.
            Internal SIH 2026 Portal. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400" /> for DSMNRU students
          </p>
        </div>
      </div>
    </footer>
  )
}
