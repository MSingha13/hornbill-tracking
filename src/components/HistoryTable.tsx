import React, { useState } from 'react';
import { TrackingRecord } from '../types/tracking';
import { formatThaiDate, formatThaiTime } from '../utils/formatters';
import { History, Download, MapPin, ChevronLeft, ChevronRight, Search, FileSpreadsheet } from 'lucide-react';

interface HistoryTableProps {
  records: TrackingRecord[];
  selectedRecord?: TrackingRecord | null;
  onSelectRecord: (record: TrackingRecord) => void;
  onExportCSV: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  records,
  selectedRecord,
  onSelectRecord,
  onExportCSV,
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
      <div className="p-4 sm:px-6 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <History className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              ประวัติตำแหน่ง
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredRecords.length} รายการ
              </span>
            </h3>
          </div>
        </div>

        {/* Search & Export Buttons */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาพิกัด, พื้นที่..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl focus:outline-emerald-500 transition-colors w-40 sm:w-48"
            />
          </div>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all active:scale-95"
            title="ส่งออกไฟล์ CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-medium">
            <tr>
              <th className="py-3 px-4 w-12 text-center">ลำดับ</th>
              <th className="py-3 px-4">รหัสติดตาม</th>
              <th className="py-3 px-4">วันที่</th>
              <th className="py-3 px-4">เวลา</th>
              <th className="py-3 px-4">ละติจูด</th>
              <th className="py-3 px-4">ลองจิจูด</th>
              <th className="py-3 px-4">พื้นที่ / ที่อยู่</th>
              <th className="py-3 px-4 text-center">ระดับแบตเตอรี่</th>
              <th className="py-3 px-4 text-center">อุณหภูมิ (°C)</th>
              <th className="py-3 px-4 text-center">แผนที่</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
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

                return (
                  <tr
                    key={r.positionId || `${r.recordedAt}-${idx}`}
                    onClick={() => onSelectRecord(r)}
                    className={`hover:bg-emerald-50/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50/80 font-medium' : index % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{index}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {r.assetId || 'KKOZ01'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {formatThaiDate(r.recordedAt)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap font-mono">
                      {formatThaiTime(r.recordedAt)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {isNaN(latVal) ? '-' : latVal.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {isNaN(lngVal) ? '-' : lngVal.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={r.address || '-'}>
                      {r.address || 'อุทยานแห่งชาติแจ้ซ้อน จ.ลำปาง'}
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
            หน้า {currentPage} จากทั้งหมด {totalPages} หน้า
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-6 h-6 rounded flex items-center justify-center font-medium ${
                  currentPage === page ? 'bg-emerald-700 text-white' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
