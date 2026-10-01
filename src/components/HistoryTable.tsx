import React, { useState } from 'react';
import { TrackingRecord } from '../types/tracking';
import { formatThaiDate, formatThaiTime } from '../utils/formatters';
import { History, Download, MapPin, ChevronLeft, ChevronRight, Search, Battery, Thermometer, Calendar, Clock, Gauge, RefreshCw } from 'lucide-react';

export interface AvailableDateOption {
  dateKey: string;
  thaiDate: string;
  count: number;
}

interface HistoryTableProps {
  records: TrackingRecord[];
  allRecordsCount?: number;
  latestDateText?: string;
  filterMode?: 'five_days' | 'latest_day' | 'specific_date';
  onToggleFilterMode?: (mode: 'five_days' | 'latest_day' | 'specific_date') => void;
  availableDates?: AvailableDateOption[];
  selectedDateKey?: string;
  onSelectDateKey?: (dateKey: string) => void;
  selectedRecord?: TrackingRecord | null;
  onSelectRecord: (record: TrackingRecord) => void;
  onExportCSV: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  records,
  allRecordsCount,
  latestDateText,
  filterMode = 'five_days',
  onToggleFilterMode,
  availableDates = [],
  selectedDateKey = '',
  onSelectDateKey,
  selectedRecord,
  onSelectRecord,
  onExportCSV,
  onRefresh,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredRecords = records.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (r.assetId && r.assetId.toLowerCase().includes(term)) ||
      (r.address && r.address.toLowerCase().includes(term)) ||
      (r.recordedAt && r.recordedAt.includes(term)) ||
      String(r.latitude).includes(term) ||
      String(r.longitude).includes(term)
    );
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const currentRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header Bar */}
      <div className="p-3.5 sm:px-6 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <History className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                ประวัติตำแหน่ง
                <span className="text-[11px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {filteredRecords.length} จุด
                </span>
              </h3>
            </div>
          </div>

          {/* Date Filter Controls */}
          {onToggleFilterMode && (
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => {
                  onToggleFilterMode('five_days');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  filterMode === 'five_days'
                    ? 'bg-emerald-800 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="แสดงพิกัด 5 วันล่าสุด"
              >
                <Calendar className="w-3 h-3" />
                <span>5 วันล่าสุด</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleFilterMode('latest_day');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  filterMode === 'latest_day'
                    ? 'bg-emerald-800 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="แสดงพิกัดเฉพาะวันล่าสุดที่มีการบันทึก"
              >
                <span>เฉพาะวันล่าสุด</span>
              </button>

              {/* Specific Date Dropdown Picker */}
              {availableDates.length > 0 && (
                <div className="relative flex items-center">
                  <select
                    value={filterMode === 'specific_date' ? selectedDateKey : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        onSelectDateKey?.(val);
                        onToggleFilterMode('specific_date');
                        setCurrentPage(1);
                      }
                    }}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all appearance-none cursor-pointer pr-5 ${
                      filterMode === 'specific_date'
                        ? 'bg-emerald-800 text-white font-bold border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                    }`}
                    title="เลือกวันที่เฉพาะเจาะจงเพื่อแสดงพิกัด"
                  >
                    <option value="" disabled className="text-slate-400 bg-white">
                      📅 เลือกวันที่...
                    </option>
                    {availableDates.map((item) => (
                      <option key={item.dateKey} value={item.dateKey} className="text-slate-800 bg-white">
                        วันที่ {item.thaiDate} ({item.count} จุด)
                      </option>
                    ))}
                  </select>
                  <span className={`pointer-events-none absolute right-1.5 text-[9px] ${
                    filterMode === 'specific_date' ? 'text-amber-200' : 'text-slate-400'
                  }`}>▾</span>
                </div>
              )}
            </div>
          )}

          {/* Quick actions on mobile header */}
          <div className="sm:hidden flex items-center gap-1.5">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-all disabled:opacity-60 active:scale-95"
                title="คลิกดึงข้อมูลดาวเทียมล่าสุด"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? '...' : 'อัปเดต'}</span>
              </button>
            )}
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
              title="ส่งออก CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Search, Refresh & Export Buttons (Desktop) */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาพิกัด, พื้นที่..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl focus:outline-emerald-500 transition-colors"
            />
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-all disabled:opacity-60 active:scale-95"
              title="คลิกดึงข้อมูลดาวเทียมล่าสุด"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูล'}</span>
            </button>
          )}

          <button
            onClick={onExportCSV}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all active:scale-95"
            title="ส่งออกไฟล์ CSV สำหรับ Excel"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Mobile Card List View (Visible on small screens < sm) */}
      <div className="block sm:hidden divide-y divide-slate-100">
        {currentRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            ไม่พบข้อมูลพิกัดการติดตาม
          </div>
        ) : (
          currentRecords.map((r, idx) => {
            const index = (currentPage - 1) * pageSize + idx + 1;
            const isSelected =
              selectedRecord?.positionId === r.positionId ||
              (selectedRecord?.recordedAt === r.recordedAt && selectedRecord?.latitude === r.latitude);
            const batteryVal = typeof r.battery === 'number' ? r.battery : parseFloat(String(r.battery) || '0');
            const tempVal = typeof r.temperature === 'number' ? r.temperature : parseFloat(String(r.temperature) || '0');
            const latVal = typeof r.latitude === 'number' ? r.latitude : parseFloat(String(r.latitude) || '0');
            const lngVal = typeof r.longitude === 'number' ? r.longitude : parseFloat(String(r.longitude) || '0');
            const speedVal = r.speed !== undefined && r.speed !== null && r.speed !== ''
              ? (typeof r.speed === 'number' ? r.speed : parseFloat(String(r.speed)))
              : null;

            return (
              <div
                key={r.positionId || `${r.recordedAt}-${idx}`}
                onClick={() => onSelectRecord(r)}
                className={`p-3.5 transition-colors cursor-pointer active:bg-emerald-50 ${
                  isSelected ? 'bg-amber-50/90 border-l-4 border-amber-500' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] flex items-center justify-center font-bold">
                      {index}
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 font-mono font-bold text-xs px-2 py-0.5 rounded">
                      {r.assetId || 'KKOZ01'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span className="flex items-center gap-1 font-sans">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatThaiDate(r)}
                    </span>
                    <span className="flex items-center gap-1 font-mono font-medium text-slate-700" title="เวลาท้องถิ่น (Local Time)">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {formatThaiTime(r)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 mb-2 line-clamp-2" title={r.address || '-'}>
                  📍 {r.address || '-'}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100/80 text-[11px]">
                  <div className="font-mono text-slate-700 leading-tight">
                    <div><span className="text-[10px] text-slate-400 font-sans">Lat:</span> {isNaN(latVal) ? '-' : `${latVal.toFixed(4)}° N`}</div>
                    <div><span className="text-[10px] text-slate-400 font-sans">Lng:</span> {isNaN(lngVal) ? '-' : `${lngVal.toFixed(4)}° E`}</div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {speedVal !== null && !isNaN(speedVal) && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 font-mono text-[10px] border border-sky-100">
                        <Gauge className="w-3 h-3 text-sky-600" />
                        {speedVal.toFixed(2)} กม./ชม.
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                        batteryVal > 50
                          ? 'bg-emerald-100 text-emerald-800'
                          : batteryVal > 20
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      <Battery className="w-3 h-3" />
                      {isNaN(batteryVal) ? '-' : `${batteryVal.toFixed(1)}%`}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px]">
                      <Thermometer className="w-3 h-3 text-amber-500" />
                      {isNaN(tempVal) ? '-' : `${tempVal.toFixed(1)}°C`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecord(r);
                      }}
                      className="p-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
                      title="ดูบนแผนที่"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop/Tablet Table View (Visible on screens >= sm) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-medium">
            <tr>
              <th className="py-3 px-4 w-12 text-center">ลำดับ</th>
              <th className="py-3 px-4">รหัสติดตาม</th>
              <th className="py-3 px-4">วันที่</th>
              <th className="py-3 px-4">
                <span className="flex items-center gap-1">
                  <span>เวลา</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">Local Time</span>
                </span>
              </th>
              <th className="py-3 px-4">ละติจูด</th>
              <th className="py-3 px-4">ลองจิจูด</th>
              <th className="py-3 px-4">พื้นที่ / ที่อยู่</th>
              <th className="py-3 px-4 text-center">ความเร็ว (Speed)</th>
              <th className="py-3 px-4 text-center">ระดับแบตเตอรี่</th>
              <th className="py-3 px-4 text-center">อุณหภูมิ (°C)</th>
              <th className="py-3 px-4 text-center">แผนที่</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-400 text-xs">
                  ไม่พบข้อมูลพิกัดการติดตาม
                </td>
              </tr>
            ) : (
              currentRecords.map((r, idx) => {
                const index = (currentPage - 1) * pageSize + idx + 1;
                const isSelected =
                  selectedRecord?.positionId === r.positionId ||
                  (selectedRecord?.recordedAt === r.recordedAt && selectedRecord?.latitude === r.latitude);
                const batteryVal = typeof r.battery === 'number' ? r.battery : parseFloat(String(r.battery) || '0');
                const tempVal = typeof r.temperature === 'number' ? r.temperature : parseFloat(String(r.temperature) || '0');
                const latVal = typeof r.latitude === 'number' ? r.latitude : parseFloat(String(r.latitude) || '0');
                const lngVal = typeof r.longitude === 'number' ? r.longitude : parseFloat(String(r.longitude) || '0');
                const speedVal = r.speed !== undefined && r.speed !== null && r.speed !== ''
                  ? (typeof r.speed === 'number' ? r.speed : parseFloat(String(r.speed)))
                  : null;

                return (
                  <tr
                    key={r.positionId || `${r.recordedAt}-${idx}`}
                    onClick={() => onSelectRecord(r)}
                    className={`hover:bg-emerald-50/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50/90 font-medium border-l-4 border-amber-500' : index % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{index}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {r.assetId || 'KKOZ01'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {formatThaiDate(r)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap font-mono font-medium">
                      {formatThaiTime(r)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {isNaN(latVal) ? '-' : latVal.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {isNaN(lngVal) ? '-' : lngVal.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={r.address || '-'}>
                      {r.address || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {speedVal !== null && !isNaN(speedVal) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-100">
                          <Gauge className="w-3 h-3 text-sky-600" />
                          <span>{speedVal.toFixed(2)}</span>
                          <span className="text-[10px] text-slate-500 font-normal">กม./ชม.</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold ${
                          batteryVal > 50
                            ? 'bg-emerald-100 text-emerald-800'
                            : batteryVal > 20
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isNaN(batteryVal) ? '-' : `${batteryVal.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-700 font-semibold">
                      {isNaN(tempVal) ? '-' : `${tempVal.toFixed(2)}`}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord(r);
                        }}
                        className="p-1.5 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                        title="ดูจุดนี้บนแผนที่"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            หน้า {currentPage} จาก {totalPages} หน้า
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-medium text-xs transition-colors ${
                      currentPage === pageNum
                        ? 'bg-emerald-700 text-white font-bold shadow-xs'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
