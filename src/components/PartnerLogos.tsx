import React from 'react';
import { gistdaLogo, bsrcLogo, khaoKheowLogo } from '../assets/assets';

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
 * Circular emblem with 4 colored quadrants (Blue, Yellow, Green, Pink)
 * and negative space forming "K", matching Screenshot 2026-09-28 091515.png.
 */
export const KhaoKheowZooLogo: React.FC<PartnerLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const badgeHeights = {
    sm: 'h-8 px-1.5',
    md: 'h-9 sm:h-10 px-2',
    lg: 'h-12 px-2.5',
  };

  const imgHeights = {
    sm: 'h-5.5 sm:h-6 w-auto max-w-[28px]',
    md: 'h-6.5 sm:h-7.5 w-auto max-w-[34px]',
    lg: 'h-8.5 sm:h-9.5 w-auto max-w-[44px]',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all flex-shrink-0 ${badgeHeights[size]} ${className}`}
      title="สวนสัตว์เปิดเขาเขียว"
    >
      <img
        src={khaoKheowLogo}
        alt="สวนสัตว์เปิดเขาเขียว"
        className={`${imgHeights[size]} object-contain select-none`}
        loading="eager"
        decoding="sync"
      />
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
