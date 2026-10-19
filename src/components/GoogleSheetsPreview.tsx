import React, { useState } from 'react';
import { GoogleSheetsIcon } from './Icons';
import { Task } from '../types/task';
import { ExternalLink, Code2, Download } from 'lucide-react';

interface GoogleSheetsPreviewProps {
  tasks: Task[];
  onOpenAppsScript: () => void;
  onExportCSV: () => void;
}

export const GoogleSheetsPreview: React.FC<GoogleSheetsPreviewProps> = ({
  tasks,
  onOpenAppsScript,
  onExportCSV,
}) => {
  const [activeSheetTab, setActiveSheetTab] = useState<'all' | 'dash' | 'report'>('all');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string; val: string }>({
    row: 2,
    col: 'B',
    val: tasks[0]?.title || 'พัฒนาระบบติดตาม',
  });

  // Display top 5-6 tasks inside the spreadsheet simulation
  const displayTasks = tasks.slice(0, 6);

  const getStatusColorStyle = (status: string) => {
    switch (status) {
      case 'กำลังดำเนินการ':
        return 'bg-blue-100 text-blue-800';
      case 'เสร็จสิ้น':
        return 'bg-emerald-100 text-emerald-800';
      case 'เกินกำหนด':
        return 'bg-rose-100 text-rose-800';
      case 'ยังไม่เริ่ม':
      case 'รอดำเนินการ':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GoogleSheetsIcon className="w-5 h-5" />
          <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            มุมมองใน Google Sheet (ข้อมูลพื้นฐาน)
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenAppsScript}
            title="ดู Google Apps Script"
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button
            onClick={onExportCSV}
            title="ดาวน์โหลดข้อมูล"
            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Google Sheets Formula Bar */}
      <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 flex items-center gap-2 text-xs font-mono">
        <div className="w-10 px-1 py-0.5 bg-white border border-slate-300 rounded text-center font-bold text-slate-700 shadow-2xs">
          {selectedCell.col}{selectedCell.row}
        </div>
        <div className="text-slate-400 font-bold italic">fx</div>
        <div className="flex-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800 truncate shadow-2xs">
          {selectedCell.val}
        </div>
      </div>

      {/* Spreadsheet Grid Table */}
      <div className="overflow-x-auto flex-1 max-h-[310px]">
        <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
          {/* Column Letters (A, B, C, D...) */}
          <thead>
            <tr className="bg-slate-100/90 text-slate-500 font-mono text-center select-none border-b border-slate-200">
              <th className="w-7 py-1 px-1 bg-slate-200/70 border-r border-slate-300 font-normal"></th>
              <th className="py-1 px-2 border-r border-slate-200 font-normal">A</th>
              <th className="py-1 px-2 border-r border-slate-200 font-normal">B</th>
              <th className="py-1 px-2 border-r border-slate-200 font-normal">C</th>
              <th className="py-1 px-2 border-r border-slate-200 font-normal">D</th>
              <th className="py-1 px-2 border-r border-slate-200 font-normal">E</th>
              <th className="py-1 px-2 border-r border-slate-200 font-normal">F</th>
              <th className="py-1 px-2 border-r border-slate-200 font-normal">G</th>
              <th className="py-1 px-2 font-normal">H</th>
            </tr>
            {/* Header row in sheet (Row 1) */}
            <tr className="bg-slate-50/80 font-semibold text-slate-700 border-b border-slate-200">
              <td className="text-center font-mono text-slate-400 bg-slate-100/70 border-r border-slate-200 select-none py-1">
                1
              </td>
              <td className="p-1.5 border-r border-slate-200 whitespace-nowrap">รหัสงาน</td>
              <td className="p-1.5 border-r border-slate-200 whitespace-nowrap">งาน/โครงการ</td>
              <td className="p-1.5 border-r border-slate-200 whitespace-nowrap">ผู้รับผิดชอบ</td>
              <td className="p-1.5 border-r border-slate-200 whitespace-nowrap">วันที่เริ่ม</td>
              <td className="p-1.5 border-r border-slate-200 whitespace-nowrap">กำหนดส่ง</td>
              <td className="p-1.5 border-r border-slate-200 whitespace-nowrap">สถานะ</td>
              <td className="p-1.5 border-r border-slate-200 whitespace-nowrap">% ความคืบหน้า</td>
              <td className="p-1.5 whitespace-nowrap">ความสำคัญ</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayTasks.map((t, idx) => {
              const rowNum = idx + 2;
              return (
                <tr key={t.id} className="hover:bg-blue-50/40 transition-colors">
                  {/* Row number index */}
                  <td className="text-center font-mono text-[10px] text-slate-400 bg-slate-50 border-r border-slate-200 select-none py-1">
                    {rowNum}
                  </td>
                  {/* A: ID */}
                  <td
                    onClick={() => setSelectedCell({ row: rowNum, col: 'A', val: t.id })}
                    className={`p-1.5 border-r border-slate-200 font-mono font-medium text-slate-700 cursor-cell whitespace-nowrap ${
                      selectedCell.row === rowNum && selectedCell.col === 'A' ? 'bg-blue-100 ring-1 ring-blue-500' : ''
                    }`}
                  >
                    {t.id}
                  </td>
                  {/* B: Title */}
                  <td
                    onClick={() => setSelectedCell({ row: rowNum, col: 'B', val: t.title })}
                    className={`p-1.5 border-r border-slate-200 text-slate-800 cursor-cell truncate max-w-[110px] ${
                      selectedCell.row === rowNum && selectedCell.col === 'B' ? 'bg-blue-100 ring-1 ring-blue-500' : ''
                    }`}
                  >
                    {t.title}
                  </td>
                  {/* C: Assignee */}
                  <td
                    onClick={() => setSelectedCell({ row: rowNum, col: 'C', val: t.assignee })}
                    className={`p-1.5 border-r border-slate-200 text-slate-600 cursor-cell whitespace-nowrap ${
                      selectedCell.row === rowNum && selectedCell.col === 'C' ? 'bg-blue-100 ring-1 ring-blue-500' : ''
                    }`}
                  >
                    {t.assignee}
                  </td>
                  {/* D: StartDate */}
                  <td
                    onClick={() => setSelectedCell({ row: rowNum, col: 'D', val: t.startDate })}
                    className={`p-1.5 border-r border-slate-200 text-slate-600 font-mono cursor-cell whitespace-nowrap ${
                      selectedCell.row === rowNum && selectedCell.col === 'D' ? 'bg-blue-100 ring-1 ring-blue-500' : ''
                    }`}
                  >
                    {t.startDate}
                  </td>
                  {/* E: DueDate */}
                  <td
                    onClick={() => setSelectedCell({ row: rowNum, col: 'E', val: t.dueDate })}
                    className={`p-1.5 border-r border-slate-200 text-slate-600 font-mono cursor-cell whitespace-nowrap ${
                      selectedCell.row === rowNum && selectedCell.col === 'E' ? 'bg-blue-100 ring-1 ring-blue-500' : ''
                    }`}
                  >
                    {t.dueDate}
                  </td>
                  {/* F: Status */}
                  <td
                    onClick={() => setSelectedCell({ row: rowNum, col: 'F', val: t.status })}
                    className={`p-1 border-r border-slate-200 text-center cursor-cell whitespace-nowrap ${
                      selectedCell.row === rowNum && selectedCell.col === 'F' ? 'bg-blue-100 ring-1 ring-blue-500' : ''
                    }`}
                  >
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColorStyle(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  {/* G: Progress */}
                  <td
                    onClick={() => setSelectedCell({ row: rowNum, col: 'G', val: `${t.progress}%` })}
                    className={`p-1.5 border-r border-slate-200 text-slate-700 font-mono text-right cursor-cell whitespace-nowrap ${
                      selectedCell.row === rowNum && selectedCell.col === 'G' ? 'bg-blue-100 ring-1 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1 justify-end">
                      <div className="w-10 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${t.progress}%` }}
                        />
                      </div>
                      <span>{t.progress}%</span>
                    </div>
                  </td>
                  {/* H: Priority */}
                  <td
                    onClick={() => setSelectedCell({ row: rowNum, col: 'H', val: t.priority })}
                    className={`p-1.5 text-slate-700 cursor-cell whitespace-nowrap text-center ${
                      selectedCell.row === rowNum && selectedCell.col === 'H' ? 'bg-blue-100 ring-1 ring-blue-500' : ''
                    }`}
                  >
                    {t.priority}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Google Sheets Tab Bar at Bottom */}
      <div className="bg-slate-100 border-t border-slate-200 px-3 py-1 flex items-center space-x-1 text-xs">
        <button
          onClick={() => setActiveSheetTab('all')}
          className={`px-3 py-1 rounded-t-md font-medium text-xs transition-colors cursor-pointer border-t border-x ${
            activeSheetTab === 'all'
              ? 'bg-white border-slate-300 text-emerald-800 font-semibold shadow-2xs'
              : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200'
          }`}
        >
          งานทั้งหมด
        </button>
        <button
          onClick={() => setActiveSheetTab('dash')}
          className={`px-3 py-1 rounded-t-md font-medium text-xs transition-colors cursor-pointer border-t border-x ${
            activeSheetTab === 'dash'
              ? 'bg-white border-slate-300 text-emerald-800 font-semibold shadow-2xs'
              : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveSheetTab('report')}
          className={`px-3 py-1 rounded-t-md font-medium text-xs transition-colors cursor-pointer border-t border-x ${
            activeSheetTab === 'report'
              ? 'bg-white border-slate-300 text-emerald-800 font-semibold shadow-2xs'
              : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200'
          }`}
        >
          รายงาน
        </button>
      </div>
    </div>
  );
};
