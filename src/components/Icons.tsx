import React from 'react';

export const GoogleSheetsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <path fill="#0F9D58" d="M29 4H10C7.79 4 6 5.79 6 8v32c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V17L29 4z" />
    <path fill="#0B8043" d="M29 4v13h13L29 4z" />
    <path fill="#EA4335" d="M0 0h48v48H0z" fillOpacity="0" />
    {/* Sheets Table Grid */}
    <rect x="14" y="22" width="20" height="15" rx="1" fill="#FFFFFF" fillOpacity="0.9" />
    <path fill="#0F9D58" d="M14 26.5h20v1H14zM14 31h20v1H14zM23.5 22v15h1V22z" />
  </svg>
);

export const GoogleAppsScriptIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <circle cx="24" cy="24" r="20" fill="#F8FAFC" />
    <path d="M15 17L9 24L15 31" stroke="#4285F4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M33 17L39 24L33 31" stroke="#EA4335" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M27 15L21 33" stroke="#FBBC05" strokeWidth="4" strokeLinecap="round" />
    <circle cx="24" cy="24" r="3.5" fill="#34A853" />
  </svg>
);

export const GoogleLogoIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1A11.996 11.996 0 0012 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.32a7.17 7.17 0 010-4.64V6.58H1.25a12.01 12.01 0 000 10.84l4.03-3.1z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.39 0 3.39 2.6 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
    />
  </svg>
);

export const LineIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#06C755">
    <path d="M12 2C6.48 2 2 5.92 2 10.76c0 4.31 3.59 7.94 8.44 8.63.33.07.78.22.89.51.1.26.07.67.03.94l-.15.9c-.05.29-.22 1.12.98.61 1.2-.51 6.47-3.81 8.83-6.53C22.61 13.9 22 12.38 22 10.76 22 5.92 17.52 2 12 2zm-4.7 11.23h-1.4a.6.6 0 01-.6-.6V8.37a.6.6 0 01.6-.6h1.4a.6.6 0 01.6.6v4.26a.6.6 0 01-.6.6zm3.3 0h-1.4a.6.6 0 01-.6-.6V8.37a.6.6 0 01.6-.6h1.4a.6.6 0 01.6.6v4.26a.6.6 0 01-.6.6zm3.9-.6a.6.6 0 01-.6.6h-2.1a.6.6 0 01-.6-.6V8.37a.6.6 0 01.6-.6h.7a.6.6 0 01.6.6v3.66h.8a.6.6 0 01.6.6zm3.5-3.06h-1.3v.8h1.3a.6.6 0 01.6.6v.1a.6.6 0 01-.6.6h-2a.6.6 0 01-.6-.6V8.37a.6.6 0 01.6-.6h2a.6.6 0 01.6.6v.1a.6.6 0 01-.6.6z" />
  </svg>
);
