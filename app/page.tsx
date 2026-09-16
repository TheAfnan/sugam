'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HomePage() {
  const featureList = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Smart Standards Chat",
      description: "Describe your product, get the exact IS number and certification path instantly."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: "Timeline Calculator",
      description: "Phase-by-phase timelines and cost breakdowns for any Indian Standard."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "11 Indian Languages",
      description: "Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, and more."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "PDF Checklist",
      description: "Download a complete checklist with documents, costs, and BIS office details."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Standards Comparison",
      description: "Compare 2–3 standards side-by-side with cost and timeline data."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Office Locator",
      description: "Find nearest BIS office with contact details and services offered."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Describe Your Product",
      description: "Tell SUGAM what you make — in any Indian language."
    },
    {
      number: "2",
      title: "Get Instant Guidance",
      description: "AI finds the IS number, mandatory status, timeline and cost."
    },
    {
      number: "3",
      title: "Download & Apply",
      description: "Get a PDF checklist and apply for certification with confidence."
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 py-24 text-center">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          initial={{ backgroundPosition: "0 0" }}
          animate={{ backgroundPosition: ["0 0", "48px 48px"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: "linear-gradient(rgba(13, 148, 136, 0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(13, 148, 136, 0.09) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-full w-1/3 -translate-x-1/2 bg-white/30 blur-3xl"
          animate={{ x: ["-35%", "35%", "-35%"], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {[18, 52, 78].map((top, idx) => (
          <motion.div
            key={top}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 h-px w-2/3 bg-teal-300/30 blur-[1px]"
            style={{ top: `${top}%` }}
            animate={{ x: ["-42%", "42%", "-42%"], opacity: [0, 0.55, 0] }}
            transition={{ duration: 8 + 1.5 * idx, delay: 1.2 * idx, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <motion.h1
            className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Find Your{" "}
            <span className="inline-block text-teal-600">Indian Standard</span>
            <br />
            in Seconds
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            AI-powered assistant for Bureau of Indian Standards. Get IS numbers, certification timelines, costs — in{" "}
            <strong className="text-gray-900 font-semibold">11 Indian languages</strong>.
          </motion.p>

          <motion.div
            className="mb-16 flex flex-col justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-700/20 transition-all text-base"
              >
                Start Free
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { number: "500+", label: "Standards" },
              { number: "11", label: "Languages" },
              { number: "Free", label: "Always" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + 0.1 * i }}
              >
                <div className="text-3xl font-extrabold text-gray-900">{stat.number}</div>
                <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="mb-3 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600">
              From finding the right standard to downloading your complete compliance checklist
            </p>
          </motion.div>

          <div className="mb-12 grid gap-8 md:grid-cols-3">
            {featureList.map((item, idx) => (
              <motion.div
                key={item.title}
                className="group min-h-[250px] rounded-2xl border border-gray-200/80 bg-white p-8 text-left shadow-sm transition-all duration-300 hover:shadow-xl hover:border-teal-200 flex flex-col justify-start"
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.08 * idx, ease: "easeOut" }}
                whileHover={{ y: -6 }}
              >
                <motion.div
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 shadow-md shadow-teal-600/20"
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 mb-16">
              Get certified in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + 0.15 * idx }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-teal-700/25"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {step.number}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready To Get Certified CTA Banner */}
      <motion.section
        className="py-20 bg-teal-600 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Ready to Get Certified?
          </h2>
          <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-xl mx-auto">
            Join thousands of businesses navigating BIS certification with confidence
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-600 font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
            >
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
