import React from 'react';
import { gistdaLogo, bsrcLogo } from '../assets/assets';

interface PartnerLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 1. GISTDA Official Logo (Pure Logo, No extra text)
 * High-definition official logo matching the agency's master graphic.
 */
export const GistdaLogo: React.FC<PartnerLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const badgeHeights = {
    sm: 'h-8 px-2',
    md: 'h-9 sm:h-10 px-2.5',
    lg: 'h-12 px-3.5',
  };

  const imgHeights = {
    sm: 'h-5 w-auto max-w-[86px]',
    md: 'h-6 sm:h-7 w-auto max-w-[110px]',
    lg: 'h-8 sm:h-9 w-auto max-w-[140px]',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all ${badgeHeights[size]} ${className}`}
      title="GISTDA"
    >
      <img
        src={gistdaLogo}
        alt="GISTDA"
        className={`${imgHeights[size]} object-contain select-none`}
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};

/**
 * 2. BSRC Official Logo (Pure Logo, No extra text)
 * High-definition master graphic: Energy leaf droplet loop + green 'b' + red 'src'.
 */
export const BsrcLogo: React.FC<PartnerLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const badgeHeights = {
    sm: 'h-8 px-2',
    md: 'h-9 sm:h-10 px-2.5',
    lg: 'h-12 px-3.5',
  };

  const imgHeights = {
    sm: 'h-5 w-auto max-w-[80px]',
    md: 'h-6 sm:h-7 w-auto max-w-[96px]',
    lg: 'h-8 sm:h-9 w-auto max-w-[125px]',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all ${badgeHeights[size]} ${className}`}
      title="BSRC (Bangchak Sriracha)"
    >
      <img
        src={bsrcLogo}
        alt="BSRC"
        className={`${imgHeights[size]} object-contain select-none`}
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};

/**
 * 3. สวนสัตว์เปิดเขาเขียว Official Logo (Pure Emblem, No text)
 * Circular emblem with 4 colored quadrants and "K" negative space
 * matching Screenshot 2026-09-28 091515.png
 */
export const KhaoKheowZooLogo: React.FC<PartnerLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const badgeHeights = {
    sm: 'h-8 w-8 p-1',
    md: 'h-9 sm:h-10 w-9 sm:w-10 p-1',
    lg: 'h-12 w-12 p-1.5',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all flex-shrink-0 ${badgeHeights[size]} ${className}`}
      title="สวนสัตว์เปิดเขาเขียว"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full object-contain"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. Left Segment: Blue (#38a2db) with flying birds & elephant line art */}
        <path
          d="M 32 4 C 15 5, 2 18, 1 38 C 0 57, 13 74, 30 77 C 32 77, 34 74, 35 66 C 38 42, 40 20, 41 6 C 39 4, 35 4, 32 4 Z"
          fill="#38a2db"
        />
        {/* Flying birds */}
        <path
          d="M 12 21 Q 17 16 22 19 Q 26 14 30 20"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 19 28 Q 23 25 26 27 Q 29 24 32 28"
          stroke="#ffffff"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Elephant outline */}
        <path
          d="M 4 45 Q 14 37 24 40 Q 31 43 34 50"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 10 54 Q 14 62 18 67 Q 24 71 28 63"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 2. Top Sector: Golden Yellow (#f59e0b) with Great Hornbill on branch */}
        <path
          d="M 44 4 C 47 4, 66 6, 76 15 C 72 23, 63 33, 56 42 C 52 35, 47 16, 44 4 Z"
          fill="#f59e0b"
        />
        {/* Hornbill with casque and bill */}
        <path
          d="M 51 12 C 55 8, 61 10, 64 13 C 61 16, 58 18, 55 17 Z"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 53 17 C 53 24, 58 30, 64 32"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Perch branch */}
        <path
          d="M 49 36 L 68 29"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 3. Bottom Sector: Leaf Green (#22c55e) with Gibbon/Monkey */}
        <path
          d="M 57 44 C 63 53, 72 66, 77 71 C 68 79, 54 81, 43 81 C 41 75, 47 59, 57 44 Z"
          fill="#22c55e"
        />
        {/* Monkey swinging */}
        <path
          d="M 53 55 Q 57 49 61 53 Q 66 60 62 67"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Curly monkey tail */}
        <path
          d="M 58 71 Q 53 75 57 78 Q 61 79 60 74"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* 4. Right Sector: Magenta Pink (#e8267a) with Lion and tropical leaves */}
        <path
          d="M 82 19 C 91 28, 97 41, 97 53 C 97 65, 90 75, 82 79 C 76 73, 66 55, 63 47 C 66 39, 76 27, 82 19 Z"
          fill="#e8267a"
        />
        {/* Lion mane line art */}
        <path
          d="M 70 42 Q 76 35 82 41 Q 90 45 92 55 Q 88 63 81 62"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Fern foliage */}
        <path
          d="M 77 27 Q 84 22 90 25 M 80 23 L 85 21 M 83 27 L 87 25"
          stroke="#ffffff"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 82 71 Q 87 65 91 69"
          stroke="#ffffff"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

/**
 * Combined Group of all 3 Partner Logos (GISTDA, BSRC, สวนสัตว์เปิดเขาเขียว)
 * Pure Logos without text labels
 */
export const PartnerLogosGroup: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${compact ? 'gap-1.5' : 'gap-2.5'} ${className}`}>
      <GistdaLogo size={compact ? 'sm' : 'md'} />
      <BsrcLogo size={compact ? 'sm' : 'md'} />
      <KhaoKheowZooLogo size={compact ? 'sm' : 'md'} />
    </div>
  );
};
