import React from 'react';
import { TrackingRecord } from '../types/tracking';
import { formatCoordinates } from '../utils/formatters';
import { hornbillIcon } from '../assets/assets';
import { MapPin, BatteryCharging, Thermometer, Zap, BarChart2 } from 'lucide-react';

interface MetricCardsProps {
  latest?: TrackingRecord;
  recordsCount: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ latest, recordsCount }) => {
  const assetId = latest?.assetId || 'KKOZ01';
  const coordsFormatted = formatCoordinates(latest?.latitude, latest?.longitude);
  const address = latest?.address || 'อุทยานแห่งชาติแจ้ซ้อน จ.ลำปาง';
  const batteryNum = latest?.battery ? parseFloat(String(latest?.battery)) : 81.25;
  const tempNum = latest?.temperature ? parseFloat(String(latest?.temperature)) : 15.5;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
      {/* Card 1: Asset Code & Species */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-center gap-3.5">
        <div className="relative flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 to-emerald-500 shadow-sm">
          <img
            src={hornbillIcon}
            alt="Great Hornbill"
            className="w-full h-full object-cover rounded-[14px] bg-slate-900"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            รหัสติดตาม
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight truncate">
            {assetId}
          </div>
          <div className="text-xs text-slate-500 truncate mt-0.5">
            Great Hornbill <span className="text-emerald-700 font-medium">นกกก (Buceros bicornis)</span>
          </div>
        </div>
      </div>

      {/* Card 2: Latest Location */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-center gap-3.5">
        <div className="flex-shrink-0 w-13 h-13 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            ตำแหน่งล่าสุด
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 font-mono tracking-tight truncate">
            {coordsFormatted !== '-' ? coordsFormatted : '17.3345° N, 98.9752° E'}
          </div>
          <div className="text-xs text-slate-500 truncate mt-0.5" title={address}>
            {address}
          </div>
        </div>
      </div>

      {/* Card 3: Battery Level */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-center gap-3.5 relative overflow-hidden">
        <div className="flex-shrink-0 w-13 h-13 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
          <BatteryCharging className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            ระดับแบตเตอรี่
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1.5">
            <span>{batteryNum.toFixed(2)}%</span>
            <span className="text-[11px] font-medium text-emerald-600">ปกติ</span>
          </div>
          <div className="mt-1 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                batteryNum > 50 ? 'bg-emerald-500' : batteryNum > 20 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, batteryNum))}%` }}
            ></div>
          </div>
        </div>
        <Zap className="absolute -right-2 -bottom-2 w-16 h-16 text-emerald-500/10 pointer-events-none" />
      </div>

      {/* Card 4: Device Temperature */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-center gap-3.5 relative overflow-hidden">
        <div className="flex-shrink-0 w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
          <Thermometer className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            อุณหภูมิอุปกรณ์
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
            <span>{tempNum.toFixed(2)}</span>
            <span className="text-sm font-semibold text-slate-600">°C</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <span>สภาพอากาศป่าดิบเขา</span>
          </div>
        </div>
        <BarChart2 className="absolute -right-1 -bottom-1 w-14 h-14 text-amber-500/10 pointer-events-none" />
      </div>
    </div>
  );
};
