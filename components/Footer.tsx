import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 text-sm text-gray-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-teal-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">SU</span>
            </div>
            <span className="font-bold text-gray-900 text-base">SUGAM</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            AI-powered Indian Standards and BIS certification guide. Supporting 11 Indian languages to empower businesses and consumers.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-xs tracking-wider uppercase">Features</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/chat" className="hover:text-teal-600">Smart Standards Chat</Link></li>
            <li><Link href="/compare" className="hover:text-teal-600">Standards Comparison</Link></li>
            <li><Link href="/timeline" className="hover:text-teal-600">Timeline Calculator</Link></li>
            <li><Link href="/offices" className="hover:text-teal-600">BIS Office Locator</Link></li>
            <li><Link href="/guides" className="hover:text-teal-600">Industry Guides</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-xs tracking-wider uppercase">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/faq" className="hover:text-teal-600">Frequently Asked Questions</Link></li>
            <li><a href="https://bis.gov.in" target="_blank" rel="noreferrer" className="hover:text-teal-600">Official BIS Portal</a></li>
            <li><a href="https://manakonline.in" target="_blank" rel="noreferrer" className="hover:text-teal-600">Manakonline Portal</a></li>
            <li><a href="https://services.bis.gov.in" target="_blank" rel="noreferrer" className="hover:text-teal-600">Know Your Standards</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-xs tracking-wider uppercase">Account</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/login" className="hover:text-teal-600">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-teal-600">Create Account</Link></li>
            <li><Link href="/dashboard" className="hover:text-teal-600">User Dashboard</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
        <p>© {new Date().getFullYear()} SUGAM. Built for Smart India Hackathon (SIH26107).</p>
        <p className="mt-2 sm:mt-0">Independent guide. Not officially affiliated with BIS.</p>
      </div>
    </footer>
  );
}
