import React from 'react';
import {
  gistdaLogo,
  bsrcLogo,
  khaoKheowLogo,
} from '../assets/assets';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'h-6 max-w-[80px]',
  md: 'h-10 max-w-[120px]',
  lg: 'h-14 max-w-[160px]',
  xl: 'h-18 max-w-[200px]',
};

export const GistdaLogo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  showLabel = false,
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img
      src={gistdaLogo}
      alt="GISTDA"
      className={`${sizeClasses[size]} object-contain`}
    />
    {showLabel && (
      <div className="text-left">
        <div className="text-xs font-bold text-slate-800">GISTDA</div>
        <div className="text-[10px] text-slate-500">
          สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ
        </div>
      </div>
    )}
  </div>
);

export const BsrcLogo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  showLabel = false,
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img
      src={bsrcLogo}
      alt="BSRC Bangchak Sriracha"
      className={`${sizeClasses[size]} object-contain`}
    />
    {showLabel && (
      <div className="text-left">
        <div className="text-xs font-bold text-slate-800">BSRC</div>
        <div className="text-[10px] text-slate-500">
          บริษัท บางจาก ศรีราชา จำกัด (มหาชน)
        </div>
      </div>
    )}
  </div>
);

export const KhaoKheowZooLogo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  showLabel = false,
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img
      src={khaoKheowLogo}
      alt="Khao Kheow Open Zoo"
      className={`${sizeClasses[size]} object-contain`}
    />
    {showLabel && (
      <div className="text-left">
        <div className="text-xs font-bold text-slate-800">สวนสัตว์เปิดเขาเขียว</div>
        <div className="text-[10px] text-slate-500">Khao Kheow Open Zoo</div>
      </div>
    )}
  </div>
);

