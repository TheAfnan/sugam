'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { calculateDistance, getCoordinatesFromQuery, isCity, isPincode } from '@/lib/utils';
import { Search, MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfficesPage() {
  const [allOffices, setAllOffices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedOffices, setMatchedOffices] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetch('/data/offices.json')
      .then((res) => res.json())
      .then((data) => {
        const list = data.offices || [];
        setAllOffices(list);
        setMatchedOffices(list.slice(0, 6));
      })
      .catch(() => setErrorMessage('Could not load office data.'));
  }, []);

  const handleSearch = () => {
    setErrorMessage('');
    const query = searchQuery.trim();

    if (!query) {
      setErrorMessage('Please enter a city name (e.g. Mumbai) or a 6-digit PIN code.');
      return;
    }

    if (!isCity(query) && !isPincode(query)) {
      setErrorMessage('Please enter a valid city name (e.g. "Delhi", "Bengaluru") or a 6-digit PIN code (e.g. "110002").');
      return;
    }

    const coords = getCoordinatesFromQuery(query);

    if (!coords) {
      // Filter by city or state text match
      const textMatches = allOffices.filter(
        (o) =>
          o.city.toLowerCase().includes(query.toLowerCase()) ||
          o.state.toLowerCase().includes(query.toLowerCase()) ||
          o.pinCode.includes(query)
      );
      setMatchedOffices(textMatches.length > 0 ? textMatches : allOffices.slice(0, 6));
      setHasSearched(true);
      return;
    }

    // Sort by geodesic distance
    const withDistance = allOffices.map((o) => ({
      ...o,
      distanceKm: calculateDistance(coords.lat, coords.lng, o.coordinates.lat, o.coordinates.lng),
    }));

    withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
    setMatchedOffices(withDistance.slice(0, 6));
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">📍 BIS Office Locator</h1>
          <p className="text-gray-500 text-sm">
            Find the nearest Bureau of Indian Standards branch office, inspection center, or laboratory
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setErrorMessage('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter city name (e.g. Mumbai, Delhi, Bengaluru) or 6-digit PIN code..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-50/50"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Search size={16} />
              <span>Search Offices</span>
            </button>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-600 font-medium mt-3">{errorMessage}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-gray-500">
            <span>Popular:</span>
            {['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSearchQuery(c);
                  setTimeout(handleSearch, 50);
                }}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Office Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {matchedOffices.map((office, idx) => (
            <motion.div
              key={office.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{office.name}</h3>
                    <p className="text-xs text-teal-700 font-semibold">{office.city}, {office.state}</p>
                  </div>
                  {office.distanceKm !== undefined && (
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full font-bold text-xs">
                      ~{office.distanceKm} km
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-gray-600 mb-5">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{office.streetAddress}, PIN: {office.pinCode}</span>
                  </div>
                  {office.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400 flex-shrink-0" />
                      <span>{office.phone}</span>
                    </div>
                  )}
                  {office.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400 flex-shrink-0" />
                      <span>{office.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400 flex-shrink-0" />
                    <span>Mon–Fri: 09:30 AM – 06:00 PM</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {(office.services || []).map((srv: string, sIdx: number) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-medium rounded"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
