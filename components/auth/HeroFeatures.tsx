'use client';

import React from 'react';
import Image from 'next/image';
import {
  Search, FileText, Compass, Users, Sparkles, ArrowRight,
  Leaf, BarChart3, Settings
} from 'lucide-react';

export default function HeroFeatures() {
  return (
    <div className="w-full h-full relative flex flex-col justify-between overflow-hidden rounded-3xl">
      <div className="relative w-full h-full min-h-[480px] sm:min-h-[560px] lg:min-h-[620px]">
        <Image
          src="/images/left_hero_clean_2x.jpg"
          alt="Bureau of Indian Standards SUGAM-AI - Simpler Standards, Stronger Bharat"
          fill
          className="object-cover object-center rounded-3xl"
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>
    </div>
  );
}
