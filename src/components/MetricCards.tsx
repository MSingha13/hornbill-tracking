import React from 'react';
import { TrackingRecord } from '../types/tracking';
import { formatLatitude, formatLongitude } from '../utils/formatters';
import { hornbillIcon } from '../assets/assets';
import { MapPin, BatteryCharging, Thermometer, Zap, BarChart2 } from 'lucide-react';

interface MetricCardsProps {
  latest?: TrackingRecord;
  activeRecord?: TrackingRecord | null;
  recordsCount: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ latest, activeRecord, recordsCount }) => {
  const current = activeRecord || latest;
  const isSelectedHistorical = Boolean(
    activeRecord &&
    latest &&
    (activeRecord.positionId ? activeRecord.positionId !== latest.positionId : activeRecord.recordedAt !== latest.recordedAt)
  );

  const assetId = current?.assetId || 'KKOZ01';
  const address = current?.address || '-';
  const batteryNum = current?.battery !== undefined && current?.battery !== '' ? parseFloat(String(current.battery)) : null;
  const tempNum = current?.temperature !== undefined && current?.temperature !== '' ? parseFloat(String(current.temperature)) : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-3 sm:mb-4">
      {/* Card 1: Asset Code & Species */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-center gap-3 sm:gap-3.5">
        <div className="relative flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 to-emerald-500 shadow-sm">
          <img
            src={hornbillIcon}
            alt="Great Hornbill"
            className="w-full h-full object-cover rounded-[14px] bg-slate-900"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>รหัสติดตาม</span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              {recordsCount} จุด
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight truncate">
            {assetId}
          </div>
          <div className="text-xs text-slate-500 truncate mt-0.5">
            Great Hornbill <span className="text-emerald-700 font-medium">นกกาฮัง (Buceros bicornis)</span>
          </div>
        </div>
      </div>

      {/* Card 2: Location (Latest vs Selected) */}
      <div className={`bg-white rounded-2xl p-3.5 sm:p-4 border shadow-xs hover:shadow-md transition-all flex items-center gap-3 sm:gap-3.5 ${
        isSelectedHistorical ? 'border-amber-400 ring-2 ring-amber-200/50' : 'border-slate-200/80'
      }`}>
        <div className={`flex-shrink-0 w-13 h-13 rounded-2xl text-white flex items-center justify-center shadow-md ${
          isSelectedHistorical ? 'bg-amber-500 shadow-amber-500/20' : 'bg-blue-500 shadow-blue-500/20'
        }`}>
          <MapPin className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            {isSelectedHistorical ? (
              <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                พิกัดที่เลือกในตาราง
              </span>
            ) : (
              <span className="text-slate-400">ตำแหน่งล่าสุด</span>
            )}
          </div>
          <div className="font-mono text-slate-900 tracking-tight leading-tight mt-0.5">
            <div className="text-sm sm:text-base font-bold flex items-center gap-1">
              <span className="text-[10px] font-medium text-slate-400 font-sans uppercase">Lat</span>
              <span>{current?.latitude ? formatLatitude(current.latitude) : '-'}</span>
            </div>
            <div className="text-sm sm:text-base font-bold flex items-center gap-1">
              <span className="text-[10px] font-medium text-slate-400 font-sans uppercase">Lng</span>
              <span>{current?.longitude ? formatLongitude(current.longitude) : '-'}</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 truncate mt-1" title={address}>
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
            <span>{batteryNum !== null && !isNaN(batteryNum) ? `${batteryNum.toFixed(2)}%` : '-'}</span>
            {batteryNum !== null && !isNaN(batteryNum) && (
              <span className="text-[11px] font-medium text-emerald-600">ปกติ</span>
            )}
          </div>
          <div className="mt-1 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                batteryNum !== null && batteryNum > 50
                  ? 'bg-emerald-500'
                  : batteryNum !== null && batteryNum > 20
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, batteryNum || 0))}%` }}
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
            <span>{tempNum !== null && !isNaN(tempNum) ? tempNum.toFixed(2) : '-'}</span>
            {tempNum !== null && !isNaN(tempNum) && (
              <span className="text-sm font-semibold text-slate-600">°C</span>
            )}
          </div>
        </div>
        <BarChart2 className="absolute -right-1 -bottom-1 w-14 h-14 text-amber-500/10 pointer-events-none" />
      </div>
    </div>
  );
};
