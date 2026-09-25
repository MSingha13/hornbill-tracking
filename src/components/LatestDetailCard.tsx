import React from 'react';
import { TrackingRecord } from '../types/tracking';
import { formatThaiDate, formatThaiTime } from '../utils/formatters';
import { hornbillPortrait } from '../assets/assets';
import { MapPin, Battery, Thermometer, Calendar, Clock, Compass, ShieldCheck } from 'lucide-react';

interface LatestDetailCardProps {
  latest?: TrackingRecord;
  onFocusOnMap: () => void;
}

export const LatestDetailCard: React.FC<LatestDetailCardProps> = ({ latest, onFocusOnMap }) => {
  const assetId = latest?.assetId || 'KKOZ01';
  const recordedAt = latest?.recordedAt || '2026-10-21 14:35:00';
  const dateStr = formatThaiDate(recordedAt);
  const timeStr = formatThaiTime(recordedAt);

  const latNum = latest?.latitude ? parseFloat(String(latest.latitude)) : 17.3345;
  const lngNum = latest?.longitude ? parseFloat(String(latest.longitude)) : 98.9752;

  const latFormatted = `${Math.abs(latNum).toFixed(4)}° ${latNum >= 0 ? 'N' : 'S'}`;
  const lngFormatted = `${Math.abs(lngNum).toFixed(4)}° ${lngNum >= 0 ? 'E' : 'W'}`;

  const address = latest?.address || 'อุทยานแห่งชาติแจ้ซ้อน จ.ลำปาง';
  const batteryNum = latest?.battery ? parseFloat(String(latest.battery)) : 81.25;
  const tempNum = latest?.temperature ? parseFloat(String(latest.temperature)) : 15.5;

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="font-bold text-slate-900 text-sm">ตำแหน่งล่าสุด</h3>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>อัปเดตล่าสุด: {dateStr} {timeStr}</span>
          </div>
        </div>

        {/* Hornbill Photo */}
        <div className="relative rounded-xl overflow-hidden aspect-4/3 mb-4 shadow-inner bg-slate-900 group">
          <img
            src={hornbillPortrait}
            alt="นกกก Great Hornbill"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-emerald-700/80 px-2 py-0.5 rounded backdrop-blur-xs">
                สถานะปลอดภัย
              </span>
              <div className="font-bold text-sm drop-shadow-sm mt-1">นกกก (Great Hornbill)</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-300 font-mono">Buceros bicornis</span>
            </div>
          </div>
        </div>

        {/* Detailed Attribute Rows */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">รหัสติดตาม</span>
            <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">
              {assetId}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">ชนิด</span>
            <span className="font-medium text-slate-800">นกกก (Great Hornbill)</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">วันที่</span>
            <span className="font-medium text-slate-800">{dateStr}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">เวลา</span>
            <span className="font-medium text-slate-800">{timeStr}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">ละติจูด</span>
            <span className="font-mono font-medium text-slate-900">{latFormatted}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">ลองจิจูด</span>
            <span className="font-mono font-medium text-slate-900">{lngFormatted}</span>
          </div>

          <div className="py-1 border-b border-slate-50">
            <div className="text-slate-500 mb-0.5">พื้นที่</div>
            <div className="font-medium text-slate-800 leading-snug line-clamp-2" title={address}>
              {address}
            </div>
          </div>

          {/* Battery Status Bar */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
            <span className="text-slate-500 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-600" />
              <span>ระดับแบตเตอรี่</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 font-mono">{batteryNum.toFixed(2)}%</span>
              <div className="w-14 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, batteryNum)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Temperature */}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-500 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              <span>อุณหภูมิอุปกรณ์</span>
            </span>
            <span className="font-bold text-slate-900 font-mono">{tempNum.toFixed(2)} °C</span>
          </div>
        </div>
      </div>

      {/* Action Button: View on Map */}
      <button
        onClick={onFocusOnMap}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-xl transition-all active:scale-[0.99] border border-emerald-300 shadow-xs"
      >
        <MapPin className="w-4 h-4 text-emerald-800" />
        <span>ดูตำแหน่งบนแผนที่</span>
      </button>
    </div>
  );
};
