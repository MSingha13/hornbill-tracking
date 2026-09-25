import React from 'react';
import { hornbillIcon, forestBg } from '../assets/assets';
import { Home, Map, BarChart3, Feather, Github, Leaf, RefreshCw } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenGitHubModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenGitHubModal,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
    { id: 'map', label: 'แผนที่ติดตาม', icon: Map },
    { id: 'reports', label: 'รายงาน', icon: BarChart3 },
    { id: 'species', label: 'ข้อมูลนกกก', icon: Feather },
  ];

  return (
    <aside className="w-64 bg-[#0a2318] text-white flex-shrink-0 hidden lg:flex flex-col justify-between border-r border-emerald-950/40 relative z-20 shadow-xl overflow-hidden">
      {/* Top Branding Section */}
      <div className="p-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Circular Hornbill Logo */}
          <div className="w-22 h-22 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-amber-200 shadow-xl mb-3">
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
            ระบบติดตามนกกก
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
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

          {/* GitHub Deployment Button */}
          <button
            onClick={onOpenGitHubModal}
            className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-200 border border-emerald-800/60 transition-all hover:scale-[1.02]"
          >
            <Github className="w-5 h-5 text-amber-300" />
            <span>เอาลง GitHub</span>
          </button>
        </nav>
      </div>

      {/* Bottom Forest Silhouette & Slogan */}
      <div className="relative p-6 pt-12 z-10 mt-auto">
        {/* Forest background graphic backdrop */}
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
    </aside>
  );
};
