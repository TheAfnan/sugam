'use client';

import React from 'react';
import Image from 'next/image';
import {
  Search, FileText, Compass, Users, Sparkles, ArrowRight,
  Leaf, BarChart3, Settings
} from 'lucide-react';

export default function HeroFeatures() {
  return (
    <div className="w-full h-full relative flex flex-col justify-between overflow-hidden">
      {/* 2x Retina Visual Composition */}
      <div className="relative w-full h-full min-h-[460px] lg:min-h-full">
        <Image
          src="/images/left_hero_retina.jpg"
          alt="Bureau of Indian Standards SUGAM-AI - Simpler Standards, Stronger Bharat"
          fill
          className="object-contain lg:object-cover object-top"
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>
    </div>
  );
}
