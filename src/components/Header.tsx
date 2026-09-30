import React from 'react';
import { RefreshCw, Download, Menu, Radio } from 'lucide-react';
import { hornbillIcon } from '../assets/assets';
import { GistdaLogo, BsrcLogo, KhaoKheowZooLogo } from './PartnerLogos';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  onExportCSV: () => void;
  lastUpdatedTime: string;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isLoading,
  onExportCSV,
  lastUpdatedTime,
  onToggleMobileMenu,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-4 sticky top-0 z-30 shadow-xs">
      {/* Top / Left Section: Mobile Menu Button + Title + Status */}
      <div className="flex items-center justify-between md:justify-start gap-2.5">
        <div className="flex items-center gap-2.5">
          {/* Mobile Drawer Toggle Button */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 active:scale-95 transition-all"
              title="เปิดเมนูหลัก"
            >
              <Menu className="w-5 h-5 text-emerald-800" />
            </button>
          )}

          {/* Hornbill Logo Icon on mobile/tablet */}
          <div className="lg:hidden flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 to-emerald-500 shadow-xs">
            <img
              src={hornbillIcon}
              alt="Hornbill"
              className="w-full h-full object-cover rounded-[10px] bg-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="hidden xs:inline text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                ระบบติดตามนกกาฮัง
              </span>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
                HORNBILL TRACKING
              </h1>
              <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Radio className="w-3 h-3 text-emerald-700" />
                <span>สัญญาณ GlobalStar</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-normal hidden sm:block mt-0.5">
              “เทคโนโลยีเพื่อการอนุรักษ์ สู่อนาคตที่ยั่งยืน”
            </p>
          </div>
        </div>

        {/* Quick Refresh on mobile right header (Manual update via updateSportdata) */}
        <div className="md:hidden flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-xs transition-all disabled:opacity-70 active:scale-95 flex items-center gap-1.5 text-xs font-medium"
            title={`คลิกเพื่อรันคำสั่ง updateSportdata บน Google Apps Script Sheet ดึงข้อมูลดาวเทียมล่าสุด (อัปเดตล่าสุด: ${lastUpdatedTime})`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'อัปเดต...' : 'อัปเดต'}</span>
          </button>
        </div>
      </div>

      {/* Right Section: Partner Logos (GISTDA, BSRC, สวนสัตว์เปิดเขาเขียว - Pure Logos, No text) & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 md:pb-0 justify-start md:justify-end">
        {/* Partner Logos: GISTDA, BSRC, Khao Kheow Open Zoo */}
        <div className="flex items-center gap-1.5 sm:gap-2 pr-2 sm:pr-3 border-r border-slate-200 flex-shrink-0">
          <GistdaLogo size="sm" />
          <BsrcLogo size="sm" />
          <KhaoKheowZooLogo size="sm" />
        </div>

        {/* Manual Refresh Button (Visible on md+) */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-all disabled:opacity-70 active:scale-95 flex-shrink-0"
          title={`คลิกเพื่อรันคำสั่ง updateSportdata บน Google Apps Script Sheet ดึงข้อมูลดาวเทียมล่าสุด (อัปเดตล่าสุด: ${lastUpdatedTime})`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'กำลังอัปเดต (updateSportdata)...' : 'อัปเดตข้อมูล'}</span>
        </button>

        {/* Export CSV Button */}
        <button
          onClick={onExportCSV}
          className="flex-shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 text-[11px] sm:text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          title="ดาวน์โหลดไฟล์ CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">ส่งออก CSV</span>
        </button>
      </div>
    </header>
  );
};
