'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_SECTIONS = [
  {
    category: "About BIS",
    items: [
      {
        q: "What is BIS?",
        a: "The Bureau of Indian Standards (BIS) is India's national standards body, established under the BIS Act 2016. It operates under the Ministry of Consumer Affairs, Food and Public Distribution. BIS develops Indian Standards (IS), runs certification schemes, and promotes standardization across industries."
      },
      {
        q: "What is an Indian Standard (IS)?",
        a: "An Indian Standard is a document published by BIS that specifies requirements, specifications, guidelines, or characteristics for products, materials, processes, or services. IS numbers like \"IS 302\" or \"IS 13252\" are used to identify specific standards."
      },
      {
        q: "What is the ISI Mark?",
        a: "The ISI Mark is a certification mark issued by BIS for products that conform to the relevant Indian Standard. Products bearing the ISI mark have been independently tested and found to meet quality and safety requirements. For many products, ISI mark is mandatory before they can be sold in India."
      },
      {
        q: "What is the CRS (Compulsory Registration Scheme)?",
        a: "The Compulsory Registration Scheme (CRS) is a BIS certification scheme for electronics and IT products. Under CRS, manufacturers must register their products with BIS before selling in India. Products covered include mobiles, laptops, power banks, LED lights, and more."
      }
    ]
  },
  {
    category: "Certification Process",
    items: [
      {
        q: "How long does BIS certification take?",
        a: "The timeline varies by product and standard. Typically: Electronics (CRS): 45–90 days, Food products: 45–75 days, Steel/Metal products: 60–90 days, Furniture: 30–60 days. SUGAM's AI assistant and Timeline Calculator can give you a precise estimate for any specific IS number."
      },
      {
        q: "How much does BIS certification cost?",
        a: "Costs vary widely depending on the standard, product type, and number of testing parameters. Typical ranges: Basic electronics: ₹20,000–50,000, Food products: ₹15,000–30,000, Steel/metal: ₹35,000–80,000. Use our Timeline & Cost Calculator for precise estimates."
      },
      {
        q: "Where do I apply for BIS certification?",
        a: "You can apply online at manakonline.in (BIS MANAK Online portal). You will need to create an account, upload required documents, pay fees, and submit your application. SUGAM's dossier generator provides a complete list of required documents."
      },
      {
        q: "What documents are required for BIS certification?",
        a: "Common documents include: Certificate of Incorporation, Product technical specifications, Factory layout plan, Quality Control Manual, Test reports from BIS-recognized labs, and Authorization letter. Exact requirements vary by standard."
      },
      {
        q: "Do I need to get my product tested before applying?",
        a: "Yes, for most certifications you need test reports from BIS-recognized (NABL-accredited) laboratories. You can submit existing test reports or arrange fresh testing. BIS also has its own testing laboratories at many locations."
      }
    ]
  },
  {
    category: "Using SUGAM",
    items: [
      {
        q: "What is SUGAM?",
        a: "SUGAM is an AI-powered assistant built for the SIH 2026 hackathon (Problem ID: SIH26107). It helps manufacturers, entrepreneurs, and compliance professionals find applicable Indian Standards, understand certification requirements, estimate timelines and costs, and navigate BIS services — all in 11 Indian languages."
      },
      {
        q: "Is SUGAM free to use?",
        a: "Yes, SUGAM is completely free to use. There are no subscription fees, no credit card required, and no usage limits. All features including AI chat, timeline calculator, PDF checklists, and the office locator are available at no cost."
      },
      {
        q: "Which languages does SUGAM support?",
        a: "SUGAM supports 11 Indian languages: English, Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Bengali, and Odia. You can switch languages anytime using the language selector."
      },
      {
        q: "How accurate is the AI assistant?",
        a: "The AI assistant is trained on authentic BIS standards repositories and regulatory knowledge. It provides accurate guidance for common Indian Standards, quality control orders (QCO), and laboratory testing procedures."
      },
      {
        q: "Can I download a certification checklist?",
        a: "Yes! Use the PDF download feature in the chat. Download an official dossier with required procedures, cost estimates, BIS office details, and compliance milestones."
      }
    ]
  },
  {
    category: "MSMEs & Small Businesses",
    items: [
      {
        q: "Are there any concessions for MSMEs in BIS certification?",
        a: "Yes, BIS provides concessions for Micro and Small enterprises. These include reduced application fees, relaxation in some technical requirements for initial certification, and priority processing in some schemes."
      },
      {
        q: "Is BIS certification mandatory for all products?",
        a: "No. Mandatory certification applies to specific products listed under Quality Control Orders (QCO) — mainly safety-critical items like electrical appliances, electronics, steel, cement, food products, and toys. Other products can voluntarily obtain certification for market trust."
      },
      {
        q: "Can foreign manufacturers get BIS certification for India?",
        a: "Yes. Foreign manufacturers can obtain BIS certification through the Foreign Manufacturers Certification Scheme (FMCS). The process involves an Indian Authorized Representative (IAR), product testing at BIS-recognized labs, and factory inspection in the country of manufacture."
      }
    ]
  }
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/70 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-teal-600 font-bold text-xl flex-shrink-0"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/30">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to know about Indian Standards, BIS certification, and how to use SUGAM
          </p>
        </div>

        <div className="space-y-10">
          {FAQ_SECTIONS.map((sec, idx) => (
            <div key={idx}>
              <h2 className="text-xl font-bold text-teal-950 mb-4 pb-2 border-b border-gray-200">
                {sec.category}
              </h2>
              <div className="space-y-3">
                {sec.items.map((item, iIdx) => (
                  <AccordionItem key={iIdx} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
