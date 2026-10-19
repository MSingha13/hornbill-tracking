import React from 'react';
import {
  Menu,
  RefreshCw,
  Download,
  Clock,
  Radio,
  ExternalLink,
  Satellite,
  Compass,
} from 'lucide-react';
import { GAS_PROJECT_URL, hornbillIcon } from '../assets/assets';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  onExportCSV: () => void;
  lastUpdatedTime: string;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isLoading,
  onExportCSV,
  lastUpdatedTime,
  onToggleMobileMenu,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
      <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Toggle + Title Lockup */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            title="เปิดเมนูด้านข้าง"
            aria-label="เปิดเมนูด้านข้าง"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex-shrink-0 hidden sm:block">
              <img
                src={hornbillIcon}
                alt="Hornbill Icon"
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/50 shadow-2xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-base sm:text-lg lg:text-xl font-black text-slate-950 tracking-tight leading-tight">
                  HORNBILL TRACKING
                </h1>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100/90 px-3 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <Radio className="w-3.5 h-3.5 text-emerald-700" />
                  <span>สัญญาณ GlobalStar</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 truncate leading-tight mt-1 font-normal">
                “เทคโนโลยีเพื่อการอนุรักษ์ สู่อนาคตที่ยั่งยืน”
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions (Timestamp, Refresh, CSV Export) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Last Update Info (Hidden on small mobile) */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-slate-400 font-medium">สัญญาณล่าสุด:</span>
            <span className="font-semibold text-slate-800">{lastUpdatedTime || '-'}</span>
          </div>

          {/* Refresh Data Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
              isLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
            }`}
            title="ดึงข้อมูลสัญญาณดาวเทียมล่าสุด"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            <span className="hidden sm:inline">
              {isLoading ? 'กำลังโหลด...' : 'อัปเดตข้อมูล'}
            </span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all active:scale-95"
            title="ดาวน์โหลดพิกัดเป็นไฟล์ CSV"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
            <span className="hidden md:inline">ส่งออก CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
