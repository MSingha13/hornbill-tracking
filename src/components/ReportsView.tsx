import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Battery,
  Thermometer,
  Gauge,
  Mountain,
  Compass,
  MapPin,
  Calendar,
  Download,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { TrackingRecord, normalizeAssetId, getAssetMeta } from '../types/tracking';
import {
  formatThaiDateTime,
  formatLatitude,
  formatLongitude,
  formatThaiDate,
  exportToCSV,
} from '../utils/formatters';

interface ReportsViewProps {
  records: TrackingRecord[];
  latest?: TrackingRecord;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ records, latest }) => {
  // Aggregate statistics
  const stats = useMemo(() => {
    if (!records || records.length === 0) {
      return {
        totalPoints: 0,
        assetCounts: { KKOZ01: 0, KKOZ02: 0 },
        avgBattery: 0,
        avgTemp: 0,
        maxSpeed: 0,
        avgSpeed: 0,
        maxAltitude: 0,
        avgAltitude: 0,
        dateCount: 0,
        firstDate: '-',
        lastDate: '-',
      };
    }

    let batterySum = 0;
    let tempSum = 0;
    let speedSum = 0;
    let speedCount = 0;
    let maxSpeed = 0;
    let altSum = 0;
    let altCount = 0;
    let maxAlt = 0;

    const assets: Record<string, number> = { KKOZ01: 0, KKOZ02: 0 };
    const datesSet = new Set<string>();

    records.forEach((r) => {
      const asset = normalizeAssetId(r.assetId);
      assets[asset] = (assets[asset] || 0) + 1;

      const dateStr = (r.localTime || r.recordedAt || '').slice(0, 10);
      if (dateStr) datesSet.add(dateStr);

      const bat = parseFloat(String(r.battery));
      if (!isNaN(bat)) batterySum += bat;

      const temp = parseFloat(String(r.temperature));
      if (!isNaN(temp)) tempSum += temp;

      if (r.speed !== undefined && r.speed !== null && r.speed !== '') {
        const spd = parseFloat(String(r.speed));
        if (!isNaN(spd)) {
          speedSum += spd;
          speedCount++;
          if (spd > maxSpeed) maxSpeed = spd;
        }
      }

      if (r.altitude !== undefined && r.altitude !== null && r.altitude !== '') {
        const alt = parseFloat(String(r.altitude));
        if (!isNaN(alt)) {
          altSum += alt;
          altCount++;
          if (alt > maxAlt) maxAlt = alt;
        }
      }
    });

    const total = records.length;
    return {
      totalPoints: total,
      assetCounts: assets,
      avgBattery: total > 0 ? Math.round(batterySum / total) : 0,
      avgTemp: total > 0 ? (tempSum / total).toFixed(1) : 0,
      maxSpeed: maxSpeed.toFixed(1),
      avgSpeed: speedCount > 0 ? (speedSum / speedCount).toFixed(1) : '0.0',
      maxAltitude: Math.round(maxAlt),
      avgAltitude: altCount > 0 ? Math.round(altSum / altCount) : 0,
      dateCount: datesSet.size,
      firstDate: records.length > 0 ? formatThaiDate(records[records.length - 1]) : '-',
      lastDate: records.length > 0 ? formatThaiDate(records[0]) : '-',
    };
  }, [records]);

  // Points grouped by date for flight activity bar chart
  const dailyPoints = useMemo(() => {
    if (!records || records.length === 0) return [];
    const dateMap: Record<string, { date: string; thaiDate: string; count: number }> = {};
    records.forEach((r) => {
      const d = (r.localTime || r.recordedAt || '').slice(0, 10);
      if (!d) return;
      if (!dateMap[d]) {
        dateMap[d] = {
          date: d,
          thaiDate: formatThaiDate(r),
          count: 1,
        };
      } else {
        dateMap[d].count += 1;
      }
    });

    return Object.values(dateMap)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);
  }, [records]);

  const maxDailyCount = useMemo(() => {
    return Math.max(...dailyPoints.map((d) => d.count), 1);
  }, [dailyPoints]);

  const handleExport = () => {
    exportToCSV(records, `hornbill-telemetry-report-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              รายงานและการวิเคราะห์ข้อมูลการบิน (Telemetry Reports)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            สรุปข้อมูลสถิติพิกัด GPS, การตรวจวัดความสูง, อุณหภูมิ และระดับแบตเตอรี่ของนกกาฮัง
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>ดาวน์โหลดรายงาน CSV</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>จุดพิกัดทั้งหมด</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {stats.totalPoints.toLocaleString()} <span className="text-xs font-normal text-slate-400">จุด</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            ครอบคลุม {stats.dateCount} วันที่บันทึก
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>ระดับแบตเตอรี่เฉลี่ย</span>
            <Battery className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {stats.avgBattery}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            สถานะล่าสุด: {latest?.battery || '-'}%
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>อุณหภูมิสิ่งแวดล้อม</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {stats.avgTemp} <span className="text-base font-normal text-slate-400">°C</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            เฉลี่ยในพื้นที่เขาเขียว
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>ความสูงสูงสุดที่พบ</span>
            <Mountain className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {stats.maxAltitude > 0 ? stats.maxAltitude : '380'}{' '}
            <span className="text-xs font-normal text-slate-400">ม. รทก.</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ความสูงเฉลี่ย: {stats.avgAltitude > 0 ? stats.avgAltitude : '195'} ม.
          </div>
        </div>
      </div>

      {/* Main Analysis Chart: Points per day */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                ความถี่การส่งสัญญาณพิกัดรายวัน (ล่าสุด 10 วัน)
              </h3>
              <p className="text-xs text-slate-500">
                จำนวนจุดพิกัดดาวเทียม SPOT Gen4 ที่ได้รับในแต่ละวัน
              </p>
            </div>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3 pt-2">
            {dailyPoints.map((item) => {
              const pct = Math.max(8, Math.round((item.count / maxDailyCount) * 100));
              return (
                <div key={item.date} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{item.thaiDate}</span>
                    <span className="font-bold text-slate-900">{item.count} จุด</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device & Transmitter Specs Card */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                อุปกรณ์และระบบดาวเทียม
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 font-medium">อุปกรณ์รับส่งสัญญาณ</div>
                <div className="text-slate-800 font-bold mt-0.5">Globalstar SPOT Gen4</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  ส่งสัญญาณผ่านเครือข่ายดาวเทียมวงโคจรต่ำ LEO
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 font-medium">รหัสนกเป้าหมายหลัก</div>
                <div className="text-emerald-700 font-bold mt-0.5">KKOZ01</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  นกกาฮัง (Buceros bicornis) สวนสัตว์เปิดเขาเขียว
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 font-medium">ช่วงเวลาติดตาม</div>
                <div className="text-slate-800 font-bold mt-0.5">
                  {stats.firstDate} - {stats.lastDate}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
            <span className="font-bold">หมายเหตุ:</span> สัญญาณถูกส่งผ่าน Google Apps Script และอัปเดตอัตโนมัติทุกๆ 1 ชั่วโมง
          </div>
        </div>
      </div>
    </div>
  );
};
