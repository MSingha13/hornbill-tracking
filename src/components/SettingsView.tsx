import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Mail, 
  Bell, 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  Code2, 
  ShieldCheck,
  Send,
  Network,
  ArrowRight
} from 'lucide-react';
import { GoogleSheetsIcon, GoogleAppsScriptIcon, LineIcon } from './Icons';

interface SettingsViewProps {
  onOpenAppsScript: () => void;
  onResetData: () => void;
  onGoToDiagram?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onOpenAppsScript,
  onResetData,
  onGoToDiagram,
}) => {
  const [sheetId, setSheetId] = useState('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
  const [sheetName, setSheetName] = useState('งานทั้งหมด');
  const [appsScriptUrl, setAppsScriptUrl] = useState('https://script.google.com/macros/s/AKfycbz_example_track/exec');
  const [emailSender, setEmailSender] = useState('task-tracker@gistda.or.th');
  const [emailRecipient, setEmailRecipient] = useState('singha13@gmail.com');
  const [daysNotice, setDaysNotice] = useState(3);
  const [lineToken, setLineToken] = useState('LINE_TOKEN_EXAMPLE_123');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>การตั้งค่าระบบ (System Configuration)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            กำหนดค่าการเชื่อมต่อ Google Sheets, Google Apps Script และการแจ้งเตือนอัตโนมัติ
          </p>
        </div>
        {savedSuccess && (
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> บันทึกการตั้งค่าแล้ว
          </span>
        )}
      </div>

      {/* Banner Link to System Diagram & Admin Manual */}
      {onGoToDiagram && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                ไดอะแกรมสถาปัตยกรรมและรายละเอียดของผู้ดูแลระบบ (Admin)
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">
                ดูแผนผังการไหลของข้อมูล 4 ระดับชั้น, วงจรการทำงานของ Admin, ตารางสิทธิ์ RBAC และคู่มือแก้ไขข้อผิดพลาด
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onGoToDiagram}
            className="px-4 py-2 bg-white hover:bg-amber-50 text-amber-900 rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>เปิดดูไดอะแกรม</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Google Sheets Connection */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <GoogleSheetsIcon className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-800">
              การเชื่อมโยง Google Sheets
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Spreadsheet ID
              </label>
              <input
                type="text"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                placeholder="กรอก ID ของ Google Sheets"
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                คัดลอกจาก URL: docs.google.com/spreadsheets/d/[ID]/edit
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อแผ่นงาน (Sheet Tab Name)
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="งานทั้งหมด"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                แท็บเริ่มต้นที่ใช้บันทึกตารางงาน
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Google Apps Script Webhook / Triggers */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <GoogleAppsScriptIcon className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-800">
                Google Apps Script Web App Endpoint
              </h3>
            </div>
            <button
              type="button"
              onClick={onOpenAppsScript}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>เปิดดูโค้ด .gs</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Web App URL (doGet / doPost Endpoint)
            </label>
            <input
              type="text"
              value={appsScriptUrl}
              onChange={(e) => setAppsScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              URL ที่ได้จากการ Deploy เป็น Web App ใน Apps Script เพื่อซิงค์ 2 ทาง
            </span>
          </div>
        </div>

        {/* Section 3: Notification Rules */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">
              การแจ้งเตือนอัตโนมัติ (Email & LINE Notify)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                อีเมลผู้ส่ง (Sender Email / System Account)
              </label>
              <input
                type="email"
                value={emailSender}
                onChange={(e) => setEmailSender(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                อีเมลผู้รับเริ่มต้น (Default Recipient)
              </label>
              <input
                type="email"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                แจ้งเตือนล่วงหน้า (วัน)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={daysNotice}
                onChange={(e) => setDaysNotice(Number(e.target.value))}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                ส่งการแจ้งเตือนเมื่องานเหลือเวลา 1 - {daysNotice} วัน
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                LINE Notify Access Token
              </label>
              <input
                type="text"
                value={lineToken}
                onChange={(e) => setLineToken(e.target.value)}
                placeholder="กรอก Line Notify Token"
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Data Management & Reset */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-bold text-slate-800">
              การจัดการฐานข้อมูลตัวอย่าง
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                คืนค่าข้อมูลมาตรฐาน 128 รายการ (Reset to Default)
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                รีเซ็ตข้อมูลงานทั้ง 128 รายการตามหน้าจอต้นฉบับ (งานเสร็จ 76, กำลังทำ 42, เกินกำหนด 10, รอดำเนินการ 5)
              </p>
            </div>

            <button
              type="button"
              onClick={onResetData}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>รีเซ็ตข้อมูล 128 รายการ</span>
            </button>
          </div>
        </div>

        {/* Form Submit Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1976d2] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>
      </form>
    </div>
  );
};
