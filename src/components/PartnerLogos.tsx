import React from 'react';
import {
  gistdaLogo,
  bsrcLogo,
  khaoKheowLogo,
  zpoLogo,
  dnpLogo,
  hrfLogo,
} from '../assets/assets';

export interface PartnerLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 1. GISTDA Official Logo
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
      title="GISTDA (สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ)"
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
 * 2. BSRC Official Logo
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
      title="BSRC (บมจ. บางจาก ศรีราชา)"
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
 * 3. สวนสัตว์เปิดเขาเขียว Official Logo
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
      title="สวนสัตว์เปิดเขาเขียว (Khao Kheow Open Zoo)"
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
 * 4. องค์การสวนสัตว์แห่งประเทศไทย ในพระบรมราชูปถัมภ์ (ZPO)
 */
export const ZpoLogo: React.FC<PartnerLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const badgeHeights = {
    sm: 'h-8 px-1.5',
    md: 'h-9 sm:h-10 px-2',
    lg: 'h-12 px-2.5',
  };

  const imgHeights = {
    sm: 'h-5.5 sm:h-6 w-auto max-w-[30px]',
    md: 'h-6.5 sm:h-7.5 w-auto max-w-[36px]',
    lg: 'h-8.5 sm:h-9.5 w-auto max-w-[46px]',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all flex-shrink-0 ${badgeHeights[size]} ${className}`}
      title="องค์การสวนสัตว์แห่งประเทศไทย ในพระบรมราชูปถัมภ์"
    >
      <img
        src={zpoLogo}
        alt="องค์การสวนสัตว์แห่งประเทศไทย"
        className={`${imgHeights[size]} object-contain select-none`}
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};

/**
 * 5. กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช (DNP)
 */
export const DnpLogo: React.FC<PartnerLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const badgeHeights = {
    sm: 'h-8 px-1.5',
    md: 'h-9 sm:h-10 px-2',
    lg: 'h-12 px-2.5',
  };

  const imgHeights = {
    sm: 'h-5.5 sm:h-6 w-auto max-w-[30px]',
    md: 'h-6.5 sm:h-7.5 w-auto max-w-[36px]',
    lg: 'h-8.5 sm:h-9.5 w-auto max-w-[46px]',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-green-300 hover:shadow-sm transition-all flex-shrink-0 ${badgeHeights[size]} ${className}`}
      title="กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช"
    >
      <img
        src={dnpLogo}
        alt="กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช"
        className={`${imgHeights[size]} object-contain select-none`}
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};

/**
 * 6. มูลนิธิศึกษาวิจัยนกเงือก (Hornbill Research Foundation)
 */
export const HrfLogo: React.FC<PartnerLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const badgeHeights = {
    sm: 'h-8 px-2',
    md: 'h-9 sm:h-10 px-2.5',
    lg: 'h-12 px-3',
  };

  const imgHeights = {
    sm: 'h-5 w-auto max-w-[90px]',
    md: 'h-6 sm:h-7 w-auto max-w-[120px]',
    lg: 'h-8 sm:h-9 w-auto max-w-[150px]',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all flex-shrink-0 ${badgeHeights[size]} ${className}`}
      title="มูลนิธิศึกษาวิจัยนกเงือก (Hornbill Research Foundation)"
    >
      <img
        src={hrfLogo}
        alt="มูลนิธิศึกษาวิจัยนกเงือก"
        className={`${imgHeights[size]} object-contain select-none`}
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};

/**
 * Combined Group of Key Partner Logos
 */
export const PartnerLogosGroup: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center flex-wrap gap-2 ${compact ? 'gap-1.5' : 'gap-2.5'} ${className}`}>
      <GistdaLogo size={compact ? 'sm' : 'md'} />
      <BsrcLogo size={compact ? 'sm' : 'md'} />
      <KhaoKheowZooLogo size={compact ? 'sm' : 'md'} />
      <ZpoLogo size={compact ? 'sm' : 'md'} />
      <DnpLogo size={compact ? 'sm' : 'md'} />
      <HrfLogo size={compact ? 'sm' : 'md'} />
    </div>
  );
};
