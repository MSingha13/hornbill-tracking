import React from 'react';
import { TrackingRecord } from '../types/tracking';
import { formatThaiDate, formatThaiTime } from '../utils/formatters';
import { hornbillPortrait } from '../assets/assets';
import { MapPin, Battery, Thermometer, Clock, RotateCcw } from 'lucide-react';

interface LatestDetailCardProps {
  latest?: TrackingRecord;
  activeRecord?: TrackingRecord | null;
  onFocusOnMap: () => void;
  onResetToLatest?: () => void;
}

export const LatestDetailCard: React.FC<LatestDetailCardProps> = ({
  latest,
  activeRecord,
  onFocusOnMap,
  onResetToLatest,
}) => {
  const current = activeRecord || latest;
  const isSelectedHistorical = Boolean(
    activeRecord &&
    latest &&
    (activeRecord.positionId ? activeRecord.positionId !== latest.positionId : activeRecord.recordedAt !== latest.recordedAt)
  );

  const assetId = current?.assetId || 'KKOZ01';
  const dateStr = formatThaiDate(current);
  const timeStr = formatThaiTime(current);

  const latNum = current?.latitude !== undefined && current?.latitude !== '' ? parseFloat(String(current.latitude)) : null;
  const lngNum = current?.longitude !== undefined && current?.longitude !== '' ? parseFloat(String(current.longitude)) : null;

  const latFormatted = latNum !== null && !isNaN(latNum) ? `${Math.abs(latNum).toFixed(4)}° ${latNum >= 0 ? 'N' : 'S'}` : '-';
  const lngFormatted = lngNum !== null && !isNaN(lngNum) ? `${Math.abs(lngNum).toFixed(4)}° ${lngNum >= 0 ? 'E' : 'W'}` : '-';

  const address = current?.address || '-';
  const batteryNum = current?.battery !== undefined && current?.battery !== '' ? parseFloat(String(current.battery)) : null;
  const tempNum = current?.temperature !== undefined && current?.temperature !== '' ? parseFloat(String(current.temperature)) : null;

  return (
    <div className={`bg-white rounded-2xl p-4 lg:p-5 border shadow-xs flex flex-col justify-between transition-all ${
      isSelectedHistorical ? 'border-amber-400 ring-2 ring-amber-200/60' : 'border-slate-200/80'
    }`}>
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {isSelectedHistorical ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                <span className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                  <span>จุดที่เลือกในตาราง</span>
                </span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-bold text-slate-900 text-sm">ตำแหน่งล่าสุด</h3>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isSelectedHistorical && onResetToLatest && (
              <button
                onClick={onResetToLatest}
                className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                title="กลับไปแสดงตำแหน่งล่าสุด"
              >
                <RotateCcw className="w-3 h-3" />
                <span>จุดล่าสุด</span>
              </button>
            )}
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span title="เวลาท้องถิ่น (Local Time)">{timeStr}</span>
            </div>
          </div>
        </div>

        {/* Hornbill Photo */}
        <div className="relative rounded-xl overflow-hidden aspect-4/3 mb-4 shadow-inner bg-slate-900 group">
          <img
            src={hornbillPortrait}
            alt="นกกาฮัง Great Hornbill"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <span className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded backdrop-blur-xs ${
                isSelectedHistorical ? 'bg-amber-600/90 text-white' : 'bg-emerald-700/80 text-white'
              }`}>
                {isSelectedHistorical ? 'พิกัดประวัติการบิน' : 'สถานะปลอดภัย'}
              </span>
              <div className="font-bold text-sm drop-shadow-sm mt-1">นกกาฮัง (Great Hornbill)</div>
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
            <span className="font-medium text-slate-800">นกกาฮัง (Great Hornbill)</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">วันที่</span>
            <span className="font-medium text-slate-800">{dateStr}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500 flex items-center gap-1">
              <span>เวลา</span>
              <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">Local Time</span>
            </span>
            <span className="font-bold font-mono text-emerald-800 text-xs">{timeStr}</span>
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

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500">สัญญาณระบุพิกัด</span>
            <span className="font-semibold text-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              GlobalStar (Satellite IoT)
            </span>
          </div>

          {/* Battery Status Bar */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
            <span className="text-slate-500 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-600" />
              <span>ระดับแบตเตอรี่</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 font-mono">
                {batteryNum !== null && !isNaN(batteryNum) ? `${batteryNum.toFixed(2)}%` : '-'}
              </span>
              {batteryNum !== null && !isNaN(batteryNum) && (
                <div className="w-14 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, batteryNum)}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          {/* Temperature */}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-500 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              <span>อุณหภูมิอุปกรณ์</span>
            </span>
            <span className="font-bold text-slate-900 font-mono">
              {tempNum !== null && !isNaN(tempNum) ? `${tempNum.toFixed(2)} °C` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button: View on Map */}
      <button
        onClick={onFocusOnMap}
        className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all active:scale-[0.99] border shadow-xs ${
          isSelectedHistorical
            ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
        }`}
      >
        <MapPin className="w-4 h-4" />
        <span>{isSelectedHistorical ? 'ซูมดูจุดที่เลือกบนแผนที่' : 'ดูตำแหน่งบนแผนที่'}</span>
      </button>
    </div>
  );
};
