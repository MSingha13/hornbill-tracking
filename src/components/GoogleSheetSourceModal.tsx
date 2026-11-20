import React, { useState, useEffect } from 'react';
import {
  SheetSourceConfig,
  DEFAULT_SHEET_SOURCE_CONFIG,
  extractSpreadsheetInfo,
} from '../utils/googleSheetReader';
import { X, Table2, Link2, Code2, Copy, Check, RefreshCw, AlertCircle, RotateCcw } from 'lucide-react';

interface GoogleSheetSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SheetSourceConfig;
  currentRecordCount: number;
  onApplyConfig: (newConfig: SheetSourceConfig) => Promise<void>;
}

const APPS_SCRIPT_ALL_ROWS_SNIPPET = `function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ success: true, records: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0];
  var action = (e && e.parameter && e.parameter.action) || '';
  var limitParam = (e && e.parameter && e.parameter.limit) || '';
  var readAll = action === 'getAll' || limitParam === 'all';

  var rows = data.slice(1);
  if (!readAll && rows.length > 20) {
    rows = rows.slice(-20);
  }

  var records = rows.reverse().map(function(row) {
    var obj = {};
    headers.forEach(function(h, idx) {
      if (h) obj[String(h).trim()] = row[idx];
    });
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    latest: records[0] || null,
    records: records,
    totalRows: data.length - 1,
    message: 'โหลดข้อมูลสำเร็จ (' + records.length + ' แถว)'
  })).setMimeType(ContentService.MimeType.JSON);
}`;

export const GoogleSheetSourceModal: React.FC<GoogleSheetSourceModalProps> = ({
  isOpen,
  onClose,
  config,
  currentRecordCount,
  onApplyConfig,
}) => {
  const [mode, setMode] = useState<SheetSourceConfig['mode']>(config.mode);
  const [sheetUrlOrId, setSheetUrlOrId] = useState(config.sheetUrlOrId);
  const [sheetName, setSheetName] = useState(config.sheetName);
  const [customAppsScriptUrl, setCustomAppsScriptUrl] = useState(config.customAppsScriptUrl);
  const [showScriptCode, setShowScriptCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(config.mode === 'default_apps_script' ? 'public_google_sheet' : config.mode);
      setSheetUrlOrId(config.sheetUrlOrId);
      setSheetName(config.sheetName);
      setCustomAppsScriptUrl(config.customAppsScriptUrl);
      setLocalError(null);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_ALL_ROWS_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (mode === 'public_google_sheet') {
      const info = extractSpreadsheetInfo(sheetUrlOrId);
      if (!info) {
        setLocalError('กรุณาวางลิงก์ Google Sheet (docs.google.com/spreadsheets/d/...) หรือ Spreadsheet ID ให้ถูกต้อง');
        return;
      }
    } else if (mode === 'custom_apps_script') {
      if (!customAppsScriptUrl.trim().startsWith('https://script.google.com/')) {
        setLocalError('กรุณาระบุ URL ของ Google Apps Script Web App ที่ขึ้นต้นด้วย https://script.google.com/');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onApplyConfig({
        mode,
        sheetUrlOrId: sheetUrlOrId.trim(),
        sheetName: sheetName.trim(),
        customAppsScriptUrl: customAppsScriptUrl.trim(),
      });
      onClose();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'ไม่สามารถเชื่อมต่อข้อมูลจากแหล่งที่ระบุได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDefault = async () => {
    setIsSubmitting(true);
    setLocalError(null);
    try {
      await onApplyConfig(DEFAULT_SHEET_SOURCE_CONFIG);
      onClose();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการรีเซ็ตการเชื่อมต่อ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Table2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                อ่านค่าทั้งหมดจาก Google Sheet
              </h3>
              <p className="text-xs text-slate-500">
                เชื่อมต่อเพื่ออ่านข้อมูลพิกัดครบทุกบรรทัด (ปัจจุบันโหลดอยู่ {currentRecordCount} จุด)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>หมายเหตุ:</strong> Google Apps Script Endpoint เดิมส่งข้อมูลกลับมาสูงสุดครั้งละ 20 แถวล่าสุดเท่านั้น
            หากต้องการให้ปุ่ม <strong>"ทั้งหมด"</strong> อ่านข้อมูลทุกแถวใน Google Sheet สามารถเชื่อมต่อผ่านลิงก์ Google Sheet
            (ที่ตั้งค่าแชร์เป็นทุกคนที่มีลิงก์ดูได้) หรืออัปเดต Apps Script Web App URL ด้านล่าง
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('public_google_sheet');
                setLocalError(null);
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'public_google_sheet'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>ลิงก์ Google Sheet (อ่านทุกแถว)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('custom_apps_script');
                setLocalError(null);
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'custom_apps_script'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Apps Script URL ที่อ่านทุกแถว</span>
            </button>
          </div>

          {mode === 'public_google_sheet' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL หรือ Spreadsheet ID ของ Google Sheet
                </label>
                <input
                  type="text"
                  value={sheetUrlOrId}
                  onChange={(e) => setSheetUrlOrId(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/1ABC.../edit#gid=0"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  ตั้งค่าแชร์ใน Google Sheet เป็น <strong>"ทุกคนที่มีลิงก์" (Anyone with the link → Viewer)</strong> เพื่อให้อ่านข้อมูลทุกบรรทัดได้ทันทีโดยไม่ต้องล็อกอิน
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อแผ่นงาน (Sheet Tab Name) — ไม่บังคับ
                </label>
                <input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="เช่น Sheet1 หรือ SpotData (เว้นว่างเพื่อใช้ชีตแรก / gid จากลิงก์)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Apps Script Web App URL (/exec)
                </label>
                <input
                  type="text"
                  value={customAppsScriptUrl}
                  onChange={(e) => setCustomAppsScriptUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowScriptCode(!showScriptCode)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors"
                >
                  <span>ดูตัวอย่างโค้ด Apps Script (doGet) สำหรับส่งค่าทั้งหมดเมื่อกดเลือก "ทั้งหมด"</span>
                  <span>{showScriptCode ? 'ซ่อน' : 'แสดงโค้ด'}</span>
                </button>
                {showScriptCode && (
                  <div className="p-3 bg-slate-900 text-slate-100 text-[11px] font-mono relative">
                    <button
                      type="button"
                      onClick={handleCopySnippet}
                      className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-sans font-semibold flex items-center gap-1 border border-slate-700"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</span>
                    </button>
                    <pre className="overflow-x-auto pr-24 leading-relaxed">{APPS_SCRIPT_ALL_ROWS_SNIPPET}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {localError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{localError}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            {config.mode !== 'default_apps_script' ? (
              <button
                type="button"
                onClick={handleResetDefault}
                disabled={isSubmitting}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ใช้ค่าเริ่มต้น (Apps Script เดิม)</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{isSubmitting ? 'กำลังอ่านข้อมูล...' : 'บันทึกและอ่านค่าทั้งหมด'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
