import React from 'react';
import { X, FileSpreadsheet, RefreshCw, CheckCircle2, ExternalLink, Database, Clock } from 'lucide-react';
import { API_ENDPOINT, GAS_PROJECT_URL } from '../assets/assets';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordsCount: number;
  lastUpdated: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  recordsCount,
  lastUpdated,
  isLoading,
  onRefresh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30 text-emerald-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                การเชื่อมต่อ Google Sheet Database
              </h3>
              <p className="text-[11px] text-emerald-200/80">
                อ่านข้อมูลพิกัดดาวเทียมโดยตรงจาก Google Sheet
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Status Box */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-2">
                <span>อ่านข้อมูลจาก Google Sheet สำเร็จ (ออนไลน์)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-800 leading-relaxed">
                ระบบอ่านข้อมูลพิกัดดาวเทียม SPOT ทั้งหมดจาก Google Sheet Database ผ่าน Google Apps Script API แบบเรียลไทม์
              </p>
            </div>
          </div>

          {/* Metric Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>จำนวนแถวใน Google Sheet</span>
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {recordsCount} <span className="text-xs font-normal text-slate-500">แถว / จุด</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>เวลาอ่านข้อมูลล่าสุด</span>
              </div>
              <div className="text-xs font-bold text-slate-800 font-mono truncate" title={lastUpdated}>
                {lastUpdated || '-'}
              </div>
            </div>
          </div>

          {/* Connection Endpoint Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-600">
              Web App API Endpoint (อ่าน Google Sheet อัตโนมัติ):
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-700 truncate select-all">
              {API_ENDPOINT}
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed pt-1">
              เมื่อเครื่องส่งสัญญาณ SPOT ส่งพิกัดใหม่มายังดาวเทียม Globalstar ระบบ Apps Script จะบันทึกลง Google Sheet และเว็บแอปนี้จะอ่านมาแสดงผลบนแผนที่และตารางทันที
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
          <a
            href={GAS_PROJECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <span>เปิด Google Apps Script</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
            >
              ปิด
            </button>
            <button
              type="button"
              onClick={() => {
                onRefresh();
              }}
              disabled={isLoading}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'กำลังอ่านข้อมูล...' : 'อ่านข้อมูลใหม่เดี๋ยวนี้'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
