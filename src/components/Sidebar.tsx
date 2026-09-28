import React from 'react';
import { hornbillIcon, forestBg } from '../assets/assets';
import { Home, Map, Feather, Leaf, X, Award } from 'lucide-react';
import { GistdaLogo, BsrcLogo, KhaoKheowZooLogo } from './PartnerLogos';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
    { id: 'map', label: 'แผนที่ติดตาม', icon: Map },
    { id: 'species', label: 'ข้อมูลนกกาฮัง', icon: Feather },
  ];

  const handleSelectTab = (tabId: string) => {
    onTabChange(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full relative z-10">
      {/* Top Branding Section */}
      <div className="p-5 sm:p-6 relative z-10">
        {/* Mobile Close Button */}
        {onCloseMobile && (
          <div className="lg:hidden flex justify-end mb-2">
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              title="ปิดเมนู"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          {/* Circular Hornbill Logo */}
          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-amber-200 shadow-xl mb-3">
            <img
              src={hornbillIcon}
              alt="Hornbill Tracking"
              className="w-full h-full object-cover rounded-full bg-slate-950"
            />
          </div>

          <h2 className="text-lg font-extrabold tracking-tight text-white leading-tight uppercase font-['Kanit']">
            HORNBILL TRACKING
          </h2>
          <p className="text-xs font-medium text-emerald-400/90 mt-0.5">
            ระบบติดตามนกกาฮัง
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-7 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Collaborative Partners: GISTDA, BSRC, Khao Kheow Zoo */}
        <div className="mt-7 pt-5 border-t border-emerald-900/60">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>ภาคีความร่วมมือ</span>
          </div>
          <div className="space-y-2">
            <div className="bg-white/95 rounded-xl p-1 shadow-sm hover:bg-white transition-all">
              <GistdaLogo size="sm" className="w-full !border-0 !shadow-none justify-center" />
            </div>
            <div className="bg-white/95 rounded-xl p-1 shadow-sm hover:bg-white transition-all">
              <BsrcLogo size="sm" className="w-full !border-0 !shadow-none justify-center" />
            </div>
            <div className="bg-white/95 rounded-xl p-1 shadow-sm hover:bg-white transition-all">
              <KhaoKheowZooLogo size="sm" className="w-full !border-0 !shadow-none justify-center" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Forest Silhouette & Slogan */}
      <div className="relative p-5 pt-6 z-10 mt-auto">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-bottom mix-blend-screen"
          style={{ backgroundImage: `url(${forestBg})` }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              โครงการอนุรักษ์
            </span>
          </div>
          <p className="text-sm font-bold text-white leading-tight">
            อนุรักษ์วันนี้<br />
            <span className="text-emerald-300 font-normal">เพื่ออนาคตที่ยั่งยืน</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 bg-[#0a2318] text-white flex-shrink-0 hidden lg:flex flex-col justify-between border-r border-emerald-950/40 relative z-20 shadow-xl overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[80vw] bg-[#0a2318] text-white flex flex-col justify-between z-10 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
