import React from 'react';
import { TrackingRecord } from '../types/tracking';
import { calculateDistanceKm, exportToCSV, exportToJSON, formatThaiDate, formatThaiTime } from '../utils/formatters';
import { BarChart3, Download, Route, BatteryCharging, Thermometer, Gauge, Clock, FileSpreadsheet, FileCode } from 'lucide-react';

interface ReportsViewProps {
  records: TrackingRecord[];
  latest?: TrackingRecord;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ records, latest }) => {
  // Calculate total distance traveled
  const validPoints = records
    .map((r) => ({
      lat: parseFloat(String(r.latitude)),
      lng: parseFloat(String(r.longitude)),
    }))
    .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));

  let totalDistanceKm = 0;
  for (let i = 0; i < validPoints.length - 1; i++) {
    totalDistanceKm += calculateDistanceKm(
      validPoints[i].lat,
      validPoints[i].lng,
      validPoints[i + 1].lat,
      validPoints[i + 1].lng
    );
  }

  // Battery statistics
  const batteries = records
    .map((r) => parseFloat(String(r.battery)))
    .filter((b) => !isNaN(b));
  const avgBattery = batteries.length > 0 ? batteries.reduce((a, b) => a + b, 0) / batteries.length : 81.25;

  // Temperature statistics
  const temps = records
    .map((r) => parseFloat(String(r.temperature)))
    .filter((t) => !isNaN(t));
  const avgTemp = temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : 16.5;
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 19.0;
  const minTemp = temps.length > 0 ? Math.min(...temps) : 15.5;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            รายงานการเคลื่อนที่และสถานะอุปกรณ์ (Telemetry Report)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            รหัสเป้าหมาย {latest?.assetId || 'KKOZ01'} • สรุปข้อมูลพิกัด {records.length} จุด
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(records)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ดาวน์โหลด CSV</span>
          </button>
          <button
            onClick={() => exportToJSON(records)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <FileCode className="w-4 h-4 text-emerald-700" />
            <span>ดาวน์โหลด JSON</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">ระยะทางสะสม</span>
            <Route className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {totalDistanceKm.toFixed(1)} <span className="text-sm font-normal text-slate-500">กม.</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            ครอบคลุมแนวป่าเขตอนุรักษ์
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">ระดับแบตเตอรี่เฉลี่ย</span>
            <BatteryCharging className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {avgBattery.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            สถานะพลังงานอยู่ในเกณฑ์ดีมาก
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">อุณหภูมิเฉลี่ย</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {avgTemp.toFixed(1)} °C
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ช่วง {minTemp.toFixed(1)}° - {maxTemp.toFixed(1)}° C
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">จำนวนจุดตรวจจับ</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {records.length} <span className="text-sm font-normal text-slate-500">ครั้ง</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ส่งข้อมูลต่อเนื่องตามรอบเวลา
          </div>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          แนวโน้มระดับพลังงานแบตเตอรี่และอุณหภูมิรายจุด
        </h3>
        <div className="space-y-3">
          {records.slice(0, 7).map((r, i) => {
            const b = parseFloat(String(r.battery)) || 0;
            const t = parseFloat(String(r.temperature)) || 0;
            return (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                <span className="w-32 text-slate-500 font-mono truncate">
                  {formatThaiTime(r.recordedAt)} ({formatThaiDate(r.recordedAt)})
                </span>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, b)}%` }}
                      title={`แบตเตอรี่: ${b}%`}
                    ></div>
                  </div>
                  <span className="w-14 text-right font-mono font-medium text-emerald-800">
                    {b.toFixed(1)}%
                  </span>
                  <span className="w-16 text-right font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    {t.toFixed(1)} °C
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
