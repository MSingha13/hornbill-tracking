import React from 'react';
import { RefreshCw, Download, Github, Radio, CheckCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  onExportCSV: () => void;
  onOpenGitHubModal: () => void;
  lastUpdatedTime: string;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  autoRefreshCountdown: number;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isLoading,
  onExportCSV,
  onOpenGitHubModal,
  lastUpdatedTime,
  isDemoMode,
  onToggleDemoMode,
  autoRefreshCountdown,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Title & Slogan */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-sm">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-amber-400 font-bold text-lg">
            🦤
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              ระบบติดตามนกกก
            </span>
            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              HORNBILL TRACKING
            </h1>
            {isDemoMode ? (
              <span className="text-[11px] font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                ตัวอย่าง อช.แจ้ซ้อน
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                สัญญาณสด Google Apps Script
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            “เทคโนโลยีเพื่อการอนุรักษ์ สู่อนาคตที่ยั่งยืน”
          </p>
        </div>
      </div>

      {/* Right Section: Partner Badges & Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 lg:gap-3 w-full md:w-auto justify-end">
        {/* Partner Logos (matching mockup) */}
        <div className="hidden xl:flex items-center gap-3 pr-3 border-r border-slate-200">
          {/* Department of National Parks Badge */}
          <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-emerald-50/60 border border-emerald-100/80 text-[11px] text-emerald-900 font-medium">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[9px] shadow-xs">
              DNP
            </div>
            <span className="leading-tight">กรมอุทยานแห่งชาติ<br /><span className="text-[10px] text-emerald-700 font-normal">สัตว์ป่า และพันธุ์พืช</span></span>
          </div>

          {/* GISTDA Badge */}
          <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-sky-50/60 border border-sky-100/80 text-[11px] text-sky-900 font-medium">
            <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[8px] italic shadow-xs">
              GIS
            </div>
            <span className="font-bold tracking-tight text-sky-800 text-xs">GISTDA</span>
          </div>

          {/* Zoological Park Organization Badge */}
          <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-teal-50/60 border border-teal-100/80 text-[11px] text-teal-900 font-medium">
            <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[9px] shadow-xs">
              ZPO
            </div>
            <span className="leading-tight">องค์การสวนสัตว์<br /><span className="text-[10px] text-teal-700 font-normal">แห่งประเทศไทย</span></span>
          </div>
        </div>

        {/* Toggle Mode: Real API vs Demo Thai Park */}
        <button
          onClick={onToggleDemoMode}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all flex items-center gap-1.5 shadow-xs ${
            isDemoMode
              ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
          }`}
          title="สลับระหว่างข้อมูลสดจาก Google Apps Script และข้อมูลตัวอย่างอช.แจ้ซ้อน"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{isDemoMode ? 'สลับเป็นข้อมูลสด API' : 'สลับดูพิกัด อช.แจ้ซ้อน'}</span>
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-all disabled:opacity-70 active:scale-95"
          title={`อัปเดตอัตโนมัติในอีก ${autoRefreshCountdown} วินาที`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>อัปเดตข้อมูล</span>
          <span className="bg-emerald-700/80 text-[10px] px-1.5 py-0.5 rounded font-mono">
            {autoRefreshCountdown}s
          </span>
        </button>

        {/* Export CSV Button */}
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          title="ดาวน์โหลดไฟล์ CSV สำหรับเปิดใน Excel หรือ Google Sheets"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ส่งออก CSV</span>
        </button>

        {/* Deploy to GitHub Button */}
        <button
          onClick={onOpenGitHubModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 border border-slate-700"
          title="ดูวิธีนำโค้ดขึ้น GitHub และ GitHub Pages"
        >
          <Github className="w-3.5 h-3.5 text-slate-300" />
          <span className="hidden sm:inline">เอาลง GitHub</span>
        </button>
      </div>
    </header>
  );
};
