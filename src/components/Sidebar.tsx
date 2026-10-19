import React from 'react';
import {
  LayoutDashboard,
  Map,
  Satellite,
  Feather,
  Radio,
  X,
  Layers,
  HeartHandshake,
  Info,
} from 'lucide-react';
import {
  hornbillIcon,
  gistdaLogo,
  khaoKheowLogo,
  bsrcLogo,
} from '../assets/assets';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'ภาพรวม / แดชบอร์ด',
    subLabel: 'พิกัดล่าสุด & สถิติรวม',
    icon: LayoutDashboard,
  },
  {
    id: 'map',
    label: 'แผนที่ติดตามการบิน',
    subLabel: 'วิเคราะห์เส้นทางบิน GPS',
    icon: Map,
    badge: 'สด',
    badgeColor: 'bg-emerald-500 text-white',
  },
  {
    id: 'satmap',
    label: 'ดาวเทียม SatMap Space',
    subLabel: 'วงโคจรดาวเทียมผ่านไทย',
    icon: Satellite,
    badge: 'Globalstar',
    badgeColor: 'bg-indigo-500/20 text-indigo-700',
  },
  {
    id: 'species',
    label: 'ข้อมูลนกกก / นิเวศวิทยา',
    subLabel: 'ชีววิทยานกกาฮัง & พฤติกรรม',
    icon: Feather,
  },
];

const PARTNERS = [
  {
    name: 'GISTDA',
    sub: 'สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (องค์การมหาชน)',
    logo: gistdaLogo,
    url: 'https://www.gistda.or.th',
  },
  {
    name: 'BSRC',
    sub: 'บริษัท บางจาก ศรีราชา จำกัด (มหาชน)',
    logo: bsrcLogo,
    url: 'https://www.bsrc.co.th',
  },
  {
    name: 'สวนสัตว์เปิดเขาเขียว',
    sub: 'สวนสัตว์เปิดเขาเขียว (Khao Kheow Open Zoo)',
    logo: khaoKheowLogo,
    url: 'https://khaokheow.zoothailand.org',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-gradient-to-b from-slate-850 to-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={hornbillIcon}
                alt="Great Hornbill Icon"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/60 shadow-md shadow-emerald-950/50"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                  HORNBILL TRACKING
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
                ระบบติดตามนกกกเรียลไทม์
              </h1>
              <p className="text-[11px] text-slate-400 leading-tight">
                “เทคโนโลยีเพื่อการอนุรักษ์ สู่อนาคตที่ยั่งยืน”
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Signal Status Pill */}
        <div className="mt-3.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300 text-[11px]">ดาวเทียม Globalstar SPOT</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
            ONLINE
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          เมนูหลัก
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm leading-tight">{item.label}</div>
                  <div
                    className={`text-[10px] leading-tight mt-0.5 ${
                      isActive ? 'text-emerald-100/90' : 'text-slate-400'
                    }`}
                  >
                    {item.subLabel}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-emerald-900/80 text-emerald-100 border border-emerald-400/40'
                      : item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Partners & Collaboration Section */}
        <div className="pt-4 px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>หน่วยงานร่วมดำเนินการ</span>
          <HeartHandshake className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="grid grid-cols-3 gap-2 px-1 pt-1">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${p.name} - ${p.sub}`}
              className="bg-white hover:bg-slate-50 p-2 sm:p-2.5 rounded-xl flex items-center justify-center border border-slate-200/90 hover:border-emerald-500/80 transition-all group shadow-xs hover:shadow-md h-12"
            >
              <img
                src={p.logo}
                alt={p.name}
                className="max-h-8 max-w-[60px] w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 h-full border-r border-slate-800 shadow-xl z-30">
        {content}
      </aside>

      {/* Mobile Drawer (Slide-out) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
