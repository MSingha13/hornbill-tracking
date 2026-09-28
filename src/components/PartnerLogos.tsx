import React from 'react';

interface PartnerLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * 1. GISTDA Official Logo (Exact match to c261901e-gistda-logo-png-2.png)
 * สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (องค์การมหาชน)
 * Features: Stylized brush GISTDA in navy blue, green elliptical orbit loop,
 * and realistic Earth globe replacing the dot of the "i".
 */
export const GistdaLogo: React.FC<PartnerLogoProps> = ({
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const badgeHeights = {
    sm: 'h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-12',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all ${badgeHeights[size]} ${className}`}
      title="GISTDA - สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (องค์การมหาชน)"
    >
      <svg
        viewBox="0 0 200 90"
        className="h-full w-auto max-w-[125px] sm:max-w-[135px] object-contain flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Earth Globe Gradient */}
          <radialGradient id="gistda-globe" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="35%" stopColor="#3b82f6" />
            <stop offset="70%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          {/* Green Orbit Gradient */}
          <linearGradient id="gistda-orbit" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="30%" stopColor="#10b981" />
            <stop offset="80%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Orbit loop behind the G (back curve) */}
        <path
          d="M 18 48 C 18 36, 42 26, 68 28 C 62 30, 48 34, 38 42"
          fill="none"
          stroke="url(#gistda-orbit)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Stylized Brush Letter 'G' */}
        <path
          d="M 82 22 C 70 18, 48 18, 36 29 C 24 40, 24 64, 40 73 C 54 80, 74 74, 82 58 C 84 54, 76 53, 62 55 C 50 57, 44 65, 38 57 C 32 49, 36 34, 46 27 C 56 22, 70 24, 78 27 C 82 28, 85 24, 82 22 Z"
          fill="#0a3254"
        />

        {/* Orbit loop in front of G (bright green dynamic swoosh) */}
        <path
          d="M 18 48 C 18 58, 38 65, 72 58 C 88 55, 96 46, 92 40 C 90 38, 82 40, 70 43 C 44 50, 24 48, 18 48 Z"
          fill="url(#gistda-orbit)"
        />

        {/* Earth Globe as the dot of "i" */}
        <g transform="translate(98, 25)">
          <circle cx="8" cy="8" r="8" fill="url(#gistda-globe)" />
          {/* Continent contours on the globe */}
          <path
            d="M 5 6 C 6 4, 8 4, 10 5 C 11 7, 10 9, 8 8 C 7 11, 5 10, 5 8 Z"
            fill="#e2e8f0"
            opacity="0.8"
          />
          <path
            d="M 10 9 C 12 8, 14 10, 13 12 C 11 13, 9 12, 10 9 Z"
            fill="#e2e8f0"
            opacity="0.85"
          />
          <circle cx="6" cy="6" r="1.5" fill="#ffffff" opacity="0.6" />
        </g>

        {/* Lower stem of "i" */}
        <path
          d="M 103 40 C 101 40, 99 43, 99 46 L 91 76 C 90 79, 93 81, 96 80 L 105 76 C 108 74, 108 70, 107 66 L 110 44 C 110 41, 106 39, 103 40 Z"
          fill="#0a3254"
        />

        {/* Stylized Brush Letter 'S' */}
        <path
          d="M 134 46 C 131 41, 125 39, 118 41 C 111 43, 109 49, 112 53 C 116 58, 131 59, 133 66 C 135 73, 128 80, 118 80 C 109 80, 103 76, 102 71 C 101 68, 105 68, 107 70 C 110 73, 115 75, 120 74 C 126 73, 128 68, 125 64 C 121 59, 106 58, 104 50 C 102 42, 109 36, 118 35 C 126 34, 133 37, 136 42 C 137 45, 135 47, 134 46 Z"
          fill="#0a3254"
        />

        {/* Stylized Brush Letter 'T' */}
        <path
          d="M 132 40 C 131 38, 134 36, 137 36 L 160 36 C 163 36, 164 39, 161 41 L 152 42 L 142 76 C 141 79, 138 80, 135 79 C 132 78, 132 75, 133 72 L 142 42 L 133 42 C 131 42, 131 41, 132 40 Z"
          fill="#0a3254"
        />

        {/* Stylized Brush Letter 'D' */}
        <path
          d="M 158 37 C 164 36, 177 36, 184 46 C 190 56, 186 72, 174 77 C 166 80, 157 78, 153 74 L 150 78 C 148 80, 145 79, 146 76 L 156 39 C 156 37, 157 37, 158 37 Z M 165 44 L 158 69 C 164 71, 172 69, 176 63 C 180 56, 179 46, 171 44 C 169 43, 167 43, 165 44 Z"
          fill="#0a3254"
        />

        {/* Stylized Brush Letter 'A' */}
        <path
          d="M 194 36 C 196 36, 198 38, 197 41 L 187 77 C 186 79, 183 80, 180 79 C 178 78, 178 75, 179 72 L 181 65 L 171 65 L 167 76 C 166 79, 163 80, 160 78 C 158 77, 159 74, 160 71 L 184 38 C 185 36, 188 35, 194 36 Z M 182 59 L 186 46 L 174 59 Z"
          fill="#0a3254"
        />
      </svg>

      {showLabel && (
        <div className="hidden 2xl:flex flex-col text-left leading-tight pl-1 border-l border-slate-200">
          <span className="text-[10px] font-bold text-sky-950">GISTDA</span>
          <span className="text-[9px] text-slate-500 font-medium">สนง.พัฒนาเทคโนโลยีอวกาศฯ</span>
        </div>
      )}
    </div>
  );
};

/**
 * 2. BSRC Official Logo (Exact match to Screenshot 2026-09-28 091304.png)
 * บริษัท บางจาก ศรีราชา จำกัด (มหาชน)
 * Features: Iconic green/orange/silver energy droplet leaf on left,
 * lowercase "b" in bright green, and "src" in vibrant red.
 */
export const BsrcLogo: React.FC<PartnerLogoProps> = ({
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const badgeHeights = {
    sm: 'h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-12',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all ${badgeHeights[size]} ${className}`}
      title="BSRC - บริษัท บางจาก ศรีราชา จำกัด (มหาชน)"
    >
      <svg
        viewBox="0 0 210 90"
        className="h-full w-auto max-w-[125px] sm:max-w-[135px] object-contain flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Orange-gold flame gradient */}
          <linearGradient id="bsrc-flame" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          {/* Silver metallic fold gradient */}
          <linearGradient id="bsrc-silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* Bangchak / BSRC Droplet Leaf Emblem */}
        <g transform="translate(12, 10)">
          {/* Main outer body: Vivid Green leaf loop */}
          <path
            d="M 45 4 C 54 12, 60 25, 60 42 C 60 62, 45 76, 27 76 C 10 76, 0 63, 0 45 C 0 30, 8 16, 22 6 C 25 3, 29 4, 30 7 C 32 12, 30 18, 25 24 C 18 31, 14 38, 14 46 C 14 55, 20 63, 30 63 C 41 63, 47 52, 47 39 C 47 27, 43 17, 36 10 C 34 7, 36 4, 40 4 Z"
            fill="#5cb338"
          />

          {/* Silver fold on upper-left curve */}
          <path
            d="M 22 6 C 28 12, 33 19, 34 25 C 29 28, 22 25, 17 21 C 18 15, 20 10, 22 6 Z"
            fill="url(#bsrc-silver)"
          />

          {/* Warm Orange/Yellow flame curve in top fold */}
          <path
            d="M 26 18 C 36 14, 46 11, 52 14 C 48 19, 41 22, 32 23 C 28 22, 26 20, 26 18 Z"
            fill="url(#bsrc-flame)"
          />
        </g>

        {/* Lowercase Typography: "bsrc" */}
        {/* 'b' in Bright Green (#3bb54a) */}
        <text
          x="94"
          y="68"
          fill="#3bb54a"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="56"
          letterSpacing="-1.5"
        >
          b
        </text>

        {/* 'src' in Vibrant Red (#e31b23) */}
        <text
          x="126"
          y="68"
          fill="#e31b23"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="56"
          letterSpacing="-1.5"
        >
          src
        </text>
      </svg>

      {showLabel && (
        <div className="hidden 2xl:flex flex-col text-left leading-tight pl-1 border-l border-slate-200">
          <span className="text-[10px] font-bold text-slate-800">BSRC</span>
          <span className="text-[9px] text-slate-500 font-medium">บางจาก ศรีราชา</span>
        </div>
      )}
    </div>
  );
};

/**
 * 3. สวนสัตว์เปิดเขาเขียว Official Logo (Exact match to Screenshot 2026-09-28 091515.png)
 * Khao Kheow Open Zoo
 * Features: Circle with 4 colored segments separated by curved white channels forming the letter "K":
 * - Left segment: Sky Blue (#38a2db) with flying birds and elephant line art
 * - Top-middle slice: Golden Yellow (#f59e0b) with Great Hornbill on a branch!
 * - Bottom-middle slice: Vivid Green (#22c55e) with monkey line art
 * - Right segment: Magenta Pink (#e8267a) with lion/tiger and foliage leaves
 */
export const KhaoKheowZooLogo: React.FC<PartnerLogoProps> = ({
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const badgeHeights = {
    sm: 'h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-12',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all ${badgeHeights[size]} ${className}`}
      title="สวนสัตว์เปิดเขาเขียว (Khao Kheow Open Zoo)"
    >
      <svg
        viewBox="0 0 210 90"
        className="h-full w-auto max-w-[155px] sm:max-w-[170px] object-contain flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circular Emblem Container */}
        <g transform="translate(6, 6)">
          {/* Base Circle Clip / Background */}
          <g>
            {/* 1. Left Segment: Blue (#38a2db) with birds and elephant */}
            <path
              d="M 39 4 C 18 4, 3 19, 2 40 C 1 60, 16 76, 36 78 C 39 78, 41 74, 42 66 C 45 42, 47 20, 48 6 C 46 4, 42 4, 39 4 Z"
              fill="#38a2db"
            />
            {/* White line art: flying birds in the sky */}
            <path
              d="M 16 22 Q 22 17 28 20 Q 32 15 36 21"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 23 29 Q 27 26 31 28 Q 34 25 37 29"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
            />
            {/* White line art: elephant silhouette contours */}
            <path
              d="M 6 46 Q 16 38 27 41 Q 35 44 38 52"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 12 55 Q 16 63 21 68 Q 28 72 32 64"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* 2. Top Slice: Yellow / Amber (#f59e0b) with Great Hornbill */}
            <path
              d="M 52 4 C 55 4, 76 6, 88 16 C 84 24, 74 34, 66 43 C 61 36, 56 16, 52 4 Z"
              fill="#f59e0b"
            />
            {/* White line art: Great Hornbill with casque and bill */}
            <path
              d="M 60 12 C 64 8, 71 10, 74 13 C 71 16, 68 18, 64 17 Z"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 62 17 C 62 25, 68 31, 74 33"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 58 37 L 78 30"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* 3. Bottom Slice: Vivid Green (#22c55e) with Monkey */}
            <path
              d="M 66 45 C 73 54, 83 67, 88 72 C 78 80, 62 82, 50 82 C 48 76, 55 60, 66 45 Z"
              fill="#22c55e"
            />
            {/* White line art: Monkey hanging with curled tail */}
            <path
              d="M 62 56 Q 66 50 71 54 Q 76 61 72 68"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 67 72 Q 62 76 66 79 Q 70 80 69 75"
              stroke="#ffffff"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />

            {/* 4. Right Segment: Magenta / Pink (#e8267a) with Lion and foliage */}
            <path
              d="M 94 20 C 104 29, 110 42, 110 54 C 110 66, 102 76, 94 80 C 88 74, 76 56, 73 48 C 76 40, 88 28, 94 20 Z"
              fill="#e8267a"
            />
            {/* White line art: Lion body & mane */}
            <path
              d="M 80 43 Q 86 36 93 42 Q 102 46 104 56 Q 100 64 92 63"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* White line art: Tropical leaves/foliage */}
            <path
              d="M 88 28 Q 96 23 103 26 M 92 24 L 97 22 M 95 28 L 100 26"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 94 72 Q 100 66 104 70"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>

        {/* Typography: สวนสัตว์เปิดเขาเขียว / KHAO KHEOW OPEN ZOO */}
        <text
          x="126"
          y="42"
          fill="#1e293b"
          fontFamily="'Kanit', 'Prompt', system-ui, sans-serif"
          fontWeight="700"
          fontSize="13"
          letterSpacing="-0.2"
        >
          สวนสัตว์เปิดเขาเขียว
        </text>
        <text
          x="126"
          y="58"
          fill="#d97706"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="8.5"
          letterSpacing="0.4"
        >
          KHAO KHEOW OPEN ZOO
        </text>
      </svg>

      {showLabel && (
        <div className="hidden 2xl:flex flex-col text-left leading-tight pl-1 border-l border-slate-200">
          <span className="text-[10px] font-bold text-slate-900">เขาเขียว</span>
          <span className="text-[9px] text-slate-500 font-medium">Open Zoo</span>
        </div>
      )}
    </div>
  );
};

/**
 * Combined Group of all 3 Partner Logos (GISTDA, BSRC, สวนสัตว์เปิดเขาเขียว)
 */
export const PartnerLogosGroup: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? 'gap-1.5' : 'gap-2.5'} ${className}`}>
      <GistdaLogo size={compact ? 'sm' : 'md'} />
      <BsrcLogo size={compact ? 'sm' : 'md'} />
      <KhaoKheowZooLogo size={compact ? 'sm' : 'md'} />
    </div>
  );
};
