import React, { useState } from 'react';
import {
  Satellite,
  Globe,
  Radio,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  Info,
  Zap,
  ShieldCheck,
  Eye,
  Layers,
  Copy,
  Check,
  Clock,
  Compass,
  CalendarDays,
  Sparkles,
  ChevronRight,
  CheckSquare,
  Square,
  Filter,
  SlidersHorizontal,
  MapPin
} from 'lucide-react';
import { CHAE_SON_GLOBALSTAR_PASSES } from '../data/chaeSonPasses';
import { GlobalstarLiveMap, CHAE_SON_COORDS } from './GlobalstarLiveMap';
import { GLOBALSTAR_TLE_LIST } from '../data/globalstarTle';
import { gistdaLogo } from '../assets/assets';

export interface SatelliteItem {
  id: string;
  name: string;
  altName: string;
  noradId: string;
  category: 'thai' | 'globalstar' | 'earth' | 'station';
  categoryLabel: string;
  operator: string;
  altitudeKm: number;
  orbitType: string;
  periodMin: number;
  passFrequency: string;
  coverageInThailand: string;
  relationToHornbill: string;
  description: string;
  status: 'active' | 'operational';
  satmapQuery: string;
}

export interface GlobalstarPass {
  id: string;
  satName: string;
  startTimeVal?: number;
  startHour?: number;
  timeRange: string;
  peakTime: string;
  elevationDeg: number;
  durationMin: number;
  timeBlock?: '00_06' | '06_12' | '12_18' | '18_00';
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  azimuthDesc: string;
  isOverhead: boolean; // > 40 degrees
}

// 28 Globalstar satellites extracted from SatMap.space TLE dataset
export const GLOBALSTAR_28_SATELLITES: SatelliteItem[] = GLOBALSTAR_TLE_LIST.map((tle, idx) => ({
  id: `globalstar-${tle.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
  name: tle.name,
  altName: `ดาวเทียมเครือข่าย Globalstar LEO (#${idx + 1})`,
  noradId: tle.noradId,
  category: 'globalstar' as const,
  categoryLabel: 'รับสัญญาณติดตามสัตว์ป่า (Globalstar / SPOT)',
  operator: 'Globalstar, Inc. (สหรัฐฯ)',
  altitudeKm: 1414,
  orbitType: 'LEO วงโคจรต่ำ ความเอียง 52°',
  periodMin: 114,
  passFrequency: 'โคจรผ่านน่านฟ้าไทยสม่ำเสมอตลอด 24 ชม. (สถานี อช.แจ้ซ้อน ลำปาง)',
  coverageInThailand: 'รับสัญญาณพิกัดครอบคลุมผืนป่าธรรมชาติและแนวเทือกเขาทั่วประเทศไทย',
  relationToHornbill: 'รับสัญญาณพิกัด GPS SPOT จากอุปกรณ์บนตัวนกกาฮัง (KKOZ01) ส่งต่อสถานีสังเกตการณ์อุทยานแห่งชาติแจ้ซ้อน',
  description: `ดาวเทียมสื่อสารวงโคจรต่ำกลุ่ม Globalstar Constellation (NORAD ID: ${tle.noradId}) รับส่งข้อมูลพิกัดจากเครื่องส่ง SPOT Tracker บนตัวนกกาฮังและอุปกรณ์ IoT`,
  status: 'active' as const,
  satmapQuery: tle.name,
}));

const SATELLITES_LIST: SatelliteItem[] = [
  ...GLOBALSTAR_28_SATELLITES,
];

// Calculated orbital passes over Observation Station: Chae Son National Park (อช.แจ้ซ้อน จ.ลำปาง: 18.8350°N, 99.4715°E) today via SGP4 propagation model
const TODAY_GLOBALSTAR_PASSES: GlobalstarPass[] = CHAE_SON_GLOBALSTAR_PASSES;

export const SatMapView: React.FC = () => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedSatId, setCopiedSatId] = useState<string | null>(null);
  const [mapFilterMode, setMapFilterMode] = useState<'globalstar_live' | 'globalstar_only'>('globalstar_live');

  const [passPeriodFilter, setPassPeriodFilter] = useState<'00_06' | '06_12' | '12_18' | '18_00' | 'all'>('06_12');
  const onlyOver40Deg = true; // แสดงเฉพาะดาวเทียมมุมเงย > 40 องศาบนการ์ดเสมอตามที่กำหนด

  // Filter passes based on selected 6-hour time block and elevation > 40 degrees
  const filteredPasses = TODAY_GLOBALSTAR_PASSES.filter((p) => {
    // 1. Time range filter (00:00 - 06:00, 06:00 - 12:00, 12:00 - 18:00, 18:00 - 00:00)
    let matchesTime = true;
    if (passPeriodFilter !== 'all') {
      const pBlock = p.timeBlock || (p.startHour !== undefined
        ? (p.startHour < 6 ? '00_06' : p.startHour < 12 ? '06_12' : p.startHour < 18 ? '12_18' : '18_00')
        : '06_12');
      matchesTime = pBlock === passPeriodFilter;
    }

    // 2. Elevation filter (> 40 degrees)
    let matchesElevation = true;
    if (onlyOver40Deg) {
      matchesElevation = p.elevationDeg > 40;
    }

    return matchesTime && matchesElevation;
  });

  // Counts per 6-hour time block (taking into account elevation > 40 deg filter)
  const count00_06 = TODAY_GLOBALSTAR_PASSES.filter(p => (p.timeBlock === '00_06' || (p.startHour !== undefined && p.startHour < 6)) && (!onlyOver40Deg || p.elevationDeg > 40)).length;
  const count06_12 = TODAY_GLOBALSTAR_PASSES.filter(p => (p.timeBlock === '06_12' || (p.startHour !== undefined && p.startHour >= 6 && p.startHour < 12)) && (!onlyOver40Deg || p.elevationDeg > 40)).length;
  const count12_18 = TODAY_GLOBALSTAR_PASSES.filter(p => (p.timeBlock === '12_18' || (p.startHour !== undefined && p.startHour >= 12 && p.startHour < 18)) && (!onlyOver40Deg || p.elevationDeg > 40)).length;
  const count18_00 = TODAY_GLOBALSTAR_PASSES.filter(p => (p.timeBlock === '18_00' || (p.startHour !== undefined && p.startHour >= 18)) && (!onlyOver40Deg || p.elevationDeg > 40)).length;
  const countAll = TODAY_GLOBALSTAR_PASSES.filter(p => !onlyOver40Deg || p.elevationDeg > 40).length;

  const handleCopySatName = (satQuery: string, id: string) => {
    navigator.clipboard?.writeText(satQuery);
    setCopiedSatId(id);
    setTimeout(() => {
      setCopiedSatId(null);
    }, 2000);
  };

  const handleReloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-emerald-900/40 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Satellite className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Globalstar SPOT & SatMap Space</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-xs border border-emerald-500/40 font-mono shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>สถานีสังเกตการณ์: อุทยานแห่งชาติแจ้ซ้อน ({CHAE_SON_COORDS.lat}°N, {CHAE_SON_COORDS.lng}°E)</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-bold">
                ● Live 24/7
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5 tracking-tight">
              <span>แผนที่ดาวเทียม & วงโคจรผ่านประเทศไทย</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              ติดตามตำแหน่งและวงโคจรของกลุ่มดาวเทียม <strong className="text-amber-300">Globalstar (28 ดวง)</strong> ที่รับสัญญาณพิกัดจากเครื่องส่ง SPOT บนตัวนกกาฮัง อ้างอิงจุดรับสัญญาณ ณ <strong className="text-emerald-300">สถานีสังเกตการณ์อุทยานแห่งชาติแจ้ซ้อน จ.ลำปาง</strong> แบบเรียลไทม์
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            <a
              href="https://satmap.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-all shadow-xs backdrop-blur-sm"
              title="เปิดดูเว็บ SatMap แยกต่างหาก"
            >
              <span>เปิดเว็บ SatMap เต็มจอ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleReloadIframe}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs"
              title="โหลดแผนที่ SatMap ใหม่"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>รีโหลดแผนที่</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Switcher Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-700 border border-emerald-200 flex-shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                เมนูเลือกแผนที่และเครือข่ายดาวเทียม:
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {mapFilterMode === 'globalstar_live'
                  ? '✓ เรดาร์สด Globalstar (สถานี อช.แจ้ซ้อน)'
                  : '✓ SatMap.space: เฉพาะ Globalstar (28 ดวง)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {mapFilterMode === 'globalstar_live'
                ? 'คำนวณตำแหน่งดาวเทียม Globalstar 28 ดวงแบบสดด้วยแบบจำลอง SGP4 เทียบกับพิกัดอุทยานแห่งชาติแจ้ซ้อน จ.ลำปาง รัศมีรับสัญญาณ 2,000 กม.'
                : 'แผนที่ 3D satmap.space กรองแสดงเฉพาะดาวเทียมเครือข่าย Globalstar 28 ดวงที่รับสัญญาณพิกัดของนกกาฮัง'}
            </p>
          </div>
        </div>

        {/* Toggle Mode Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold flex-wrap sm:flex-nowrap flex-shrink-0">
          <button
            type="button"
            onClick={() => setMapFilterMode('globalstar_live')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mapFilterMode === 'globalstar_live'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>เรดาร์สด (อช.แจ้ซ้อน)</span>
          </button>

          <button
            type="button"
            onClick={() => setMapFilterMode('globalstar_only')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mapFilterMode === 'globalstar_only'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>SatMap (เฉพาะ Globalstar)</span>
          </button>
        </div>
      </div>

      {/* Main Section: Viewport based on selected mode */}
      {mapFilterMode === 'globalstar_live' ? (
        <GlobalstarLiveMap />
      ) : (
        <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all ${
          isFullscreen ? 'fixed inset-4 z-50 rounded-2xl flex flex-col' : ''
        }`}>
          {/* Frame Control Bar */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="font-mono text-slate-300 ml-2 hidden sm:inline">
                {mapFilterMode === 'globalstar_only'
                  ? 'https://satmap.space/ [Filter: Globalstar Only (28 Sats) • Thailand Focus]'
                  : 'https://satmap.space/ [All Satellites]'}
              </span>
              <span className="text-amber-400 font-semibold text-[11px] ml-1">
                {mapFilterMode === 'globalstar_only' ? '• Globalstar Mode' : '• Full Map'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition-colors"
                title={isFullscreen ? 'ย่อหน้าจอ' : 'ขยายเต็มกรอบ'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ย่อหน้าต่าง</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ขยายเต็มกรอบ</span>
                  </>
                )}
              </button>

              <a
                href="https://satmap.space/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs flex items-center gap-1 transition-colors"
                title="เปิดในแท็บใหม่"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">เปิดแท็บใหม่</span>
              </a>
            </div>
          </div>

          {/* Iframe Viewport */}
          <div className={`relative bg-slate-950 ${isFullscreen ? 'flex-1 h-full' : 'h-[490px] sm:h-[570px] lg:h-[630px]'}`}>
            <iframe
              key={`${iframeKey}-${mapFilterMode}`}
              src={mapFilterMode === 'globalstar_only' ? './satmap-globalstar.html' : 'https://satmap.space/'}
              title="SatMap Space - Real-Time Satellite Orbit Map"
              className="w-full h-full border-0"
              allow="fullscreen; geolocation"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* NEW SECTION: ตารางรอบวงโคจรดาวเทียม Globalstar ผ่านประเทศไทยวันนี้ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-7 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
                <Clock className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>วงโคจรที่ผ่านประเทศไทยวันนี้: ดาวเทียม Globalstar</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  SPOT Tracking Network
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              คำนวณจากแบบจำลอง SGP4 & ข้อมูล TLE ล่าสุด ณ <strong>สถานีสังเกตการณ์: อุทยานแห่งชาติแจ้ซ้อน จ.ลำปาง</strong>: ดาวเทียม Globalstar โคจรผ่านน่านฟ้าไทยสม่ำเสมอทุก ~10-15 นาที รวมกว่า <strong>{TODAY_GLOBALSTAR_PASSES.length} รอบในวันนี้</strong> เพื่อรับสัญญาณพิกัดจากเครื่องส่ง SPOT บนตัวนกกาฮัง
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-950 bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-300 shadow-xs">
            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" />
            <span>สถานีสังเกตการณ์: {CHAE_SON_COORDS.name} {CHAE_SON_COORDS.province} ({CHAE_SON_COORDS.lat}°N, {CHAE_SON_COORDS.lng}°E)</span>
          </div>
        </div>

        {/* Observation Station Specifications Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>ที่ตั้งสถานี</span>
            </div>
            <div className="font-bold text-slate-800">อช.แจ้ซ้อน จ.ลำปาง</div>
            <div className="text-[10px] text-slate-500">อ.เมืองปาน ภาคเหนือ</div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>พิกัดภูมิศาสตร์ (GPS)</span>
            </div>
            <div className="font-bold text-slate-800 font-mono">18.8350° N, 99.4715° E</div>
            <div className="text-[10px] text-slate-500">ความสูง: ~500 ม. (MSL)</div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>รัศมีการรับสัญญาณ</span>
            </div>
            <div className="font-bold text-emerald-700">2,000 กม.</div>
            <div className="text-[10px] text-slate-500">ครอบคลุมทั้งประเทศไทย</div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Satellite className="w-3.5 h-3.5 text-emerald-600" />
              <span>เครือข่ายดาวเทียม</span>
            </div>
            <div className="font-bold text-amber-600">Globalstar 28 ดวง</div>
            <div className="text-[10px] text-slate-500">รับสัญญาณ SPOT L-band</div>
          </div>
        </div>

        {/* User Request: 1. เลือกตามช่วงเวลา (00:00 - 06:00, 06:00 - 12:00, 12:00 - 18:00, 18:00 - 00:00) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <span className="text-slate-500 text-xs font-bold flex items-center gap-1 whitespace-nowrap pl-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>เลือกช่วงเวลา:</span>
          </span>

          <button
            onClick={() => setPassPeriodFilter('00_06')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 font-bold ${
              passPeriodFilter === '00_06'
                ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>00:00 - 06:00</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
              passPeriodFilter === '00_06' ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-200 text-slate-700'
            }`}>
              {count00_06} รอบ
            </span>
          </button>

          <button
            onClick={() => setPassPeriodFilter('06_12')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 font-bold ${
              passPeriodFilter === '06_12'
                ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>06:00 - 12:00</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
              passPeriodFilter === '06_12' ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-200 text-slate-700'
            }`}>
              {count06_12} รอบ
            </span>
          </button>

          <button
            onClick={() => setPassPeriodFilter('12_18')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 font-bold ${
              passPeriodFilter === '12_18'
                ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>12:00 - 18:00</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
              passPeriodFilter === '12_18' ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-200 text-slate-700'
            }`}>
              {count12_18} รอบ
            </span>
          </button>

          <button
            onClick={() => setPassPeriodFilter('18_00')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 font-bold ${
              passPeriodFilter === '18_00'
                ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>18:00 - 00:00</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
              passPeriodFilter === '18_00' ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-200 text-slate-700'
            }`}>
              {count18_00} รอบ
            </span>
          </button>

          <button
            onClick={() => setPassPeriodFilter('all')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 font-bold ${
              passPeriodFilter === 'all'
                ? 'bg-slate-800 text-white shadow-xs ring-2 ring-slate-600/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>ทั้งหมด 24 ชม.</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
              passPeriodFilter === 'all' ? 'bg-slate-950 text-slate-200' : 'bg-slate-200 text-slate-700'
            }`}>
              {countAll} รอบ
            </span>
          </button>
        </div>

        {/* Globalstar Passes Grid */}
        {filteredPasses.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500">
            <Radio className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-pulse" />
            <p className="font-bold text-slate-700">ไม่พบดาวเทียมที่ตรงตามเงื่อนไขในช่วงเวลานี้</p>
            <p className="text-xs text-slate-500 mt-1">ลองเลือกช่วงเวลาอื่น หรือคลิกดู "ทั้งหมด 24 ชม."</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPasses.map((pass) => {
              const isOver40 = pass.elevationDeg > 40;
              return (
                <div
                  key={pass.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all text-left relative ${
                    isOver40
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-300/60'
                      : 'bg-white border-slate-200/90 hover:border-amber-300 hover:bg-slate-50/60'
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-mono font-black text-slate-900 text-xs sm:text-sm">
                        {pass.satName}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs ${
                      isOver40
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-100 text-slate-600 font-mono'
                    }`}>
                      <Sparkles className="w-3 h-3" />
                      <span>มุมเงย {pass.elevationDeg}°</span>
                    </span>
                  </div>

                  {/* Time row */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 mb-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>ช่วงเวลาบินผ่าน:</span>
                      </span>
                      <strong className="text-slate-900 font-mono text-xs sm:text-sm">
                        {pass.timeRange}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                      <span>จุดสูงสุด (Peak): <strong className="text-emerald-700">{pass.peakTime}</strong></span>
                      <span>ระยะเวลา: <strong className="text-slate-800">{pass.durationMin} นาที</strong></span>
                    </div>
                  </div>

                  {/* Footnote & Action */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="text-[10px] text-slate-400 truncate max-w-[170px]" title={pass.azimuthDesc}>
                      🧭 {pass.azimuthDesc}
                    </span>

                    <button
                      onClick={() => handleCopySatName(pass.satName, pass.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold transition-all"
                      title="คัดลอกชื่อไปค้นหาในแผนที่ SatMap ด้านบน"
                    >
                      {copiedSatId === pass.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>ดูใน SatMap</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Technology & Knowledge Section: How Satellite Tracking Works for Hornbills */}
      <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-7 shadow-sm border border-emerald-800 space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-emerald-800 text-amber-300">
            <Globe className="w-5 h-5" />
          </span>
          <h3 className="text-base sm:text-lg font-bold">
            เทคโนโลยีอวกาศกับภารกิจอนุรักษ์นกกาฮัง (Space Technology for Wildlife Conservation)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span>1. เครื่องส่งสัญญาณ SPOT (GPS Messenger)</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              อุปกรณ์ขนาดกะทัดรัดติดตั้งบนหลังนกกาฮัง (KKOZ01) ระบุพิกัดด้วย GPS แล้วส่งคลื่นวิทยุความถี่ L-band (1610-1620 MHz) ขึ้นสู่กลุ่มดาวเทียมในอวกาศ
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span>2. กลุ่มดาวเทียม Globalstar เหนือน่านฟ้าไทย</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              ดาวเทียมสื่อสารวงโคจรต่ำเครือข่าย Globalstar (LEO ~1,414 กม.) ที่โคจรผ่านประเทศไทย รับสัญญาณจากตัว SPOT แล้วส่งถ่ายทอดลงสถานีภาคพื้นดิน (Ground Gateway)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span>3. การประมวลผลและการปกป้องผืนป่า</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              ข้อมูลพิกัดถูกส่งผ่าน SPOT API เข้าสู่ระบบประมวลผลของ GISTDA และแดชบอร์ดนี้ทันที ช่วยให้นักวิจัยและเจ้าหน้าที่เฝ้าระวังและปกป้องนกกาฮังได้แบบเรียลไทม์
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
