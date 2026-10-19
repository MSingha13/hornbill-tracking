import React, { useState } from 'react';
import {
  Layers,
  Network,
  Shield,
  ShieldCheck,
  Cpu,
  Database,
  Mail,
  Send,
  Users,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Terminal,
  Settings,
  Code2,
  FileSpreadsheet,
  Workflow,
  Copy,
  Check,
  Download,
  BookOpen,
  ArrowRight,
  Key,
  Bell,
  HardDrive,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import { GoogleSheetsIcon, GoogleAppsScriptIcon, LineIcon } from './Icons';

interface DiagramViewProps {
  onOpenAppsScriptModal: () => void;
  onGoToSettings: () => void;
}

export const DiagramView: React.FC<DiagramViewProps> = ({
  onOpenAppsScriptModal,
  onGoToSettings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'admin-workflow' | 'rbac' | 'admin-manual'>('architecture');
  const [selectedNode, setSelectedNode] = useState<string | null>('admin-node');
  const [copiedDoc, setCopiedDoc] = useState(false);

  const handleCopyMarkdownDoc = () => {
    const markdownContent = `# เอกสารรายละเอียดไดอะแกรมสถาปัตยกรรมและคู่มือผู้ดูแลระบบ (System Architecture & Administrator Manual)
ระบบติดตามงาน (Task Tracking System) เชื่อมโยง Google Sheets และ Google Apps Script

## 1. ข้อมูลสถาปัตยกรรมระบบ (System Architecture)
- **Frontend / Client Layer**: React 19 + TypeScript + Vite + Tailwind CSS (Interactive Dashboard)
- **API & Automation Layer**: Google Apps Script (REST Web App endpoints + Time-driven Triggers)
- **Database / Persistence Layer**: Google Sheets (Spreadsheet ID: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms)
- **Notification Services**: Gmail API (MailApp), LINE Notify Webhook, Drive Backup

## 2. บทบาทและความรับผิดชอบของผู้ดูแลระบบ (System Administrator Responsibilities)
1. **ผู้ดูแลฐานข้อมูล (Database Administrator - DBA)**
   - ควบคุม Header Schema ในแท็บ "งานทั้งหมด" (A: รหัสงาน, B: งาน/โครงการ, C: ผู้รับผิดชอบ, D: วันที่เริ่ม, E: กำหนดส่ง, F: สถานะ, G: % ความคืบหน้า, H: ความสำคัญ, I: หมายเหตุ)
   - ป้องกันสูตรและการแก้ไขคอลัมน์สำคัญด้วยการตั้งค่า Protected Range
2. **ผู้ดูแลระบบอัตโนมัติ (Automation & Scheduler Admin)**
   - ตั้งค่า Time-driven Trigger ใน Google Apps Script ให้รันฟังก์ชัน sendDailyTaskReminders() ทุกวันเวลา 09:00 น.
   - เฝ้าระวัง Quota ของ MailApp (100 - 1,500 ฉบับ/วัน ตามประเภทบัญชี Google Workspace)
3. **ผู้ควบคุมความปลอดภัยและสิทธิ์การเข้าถึง (IAM & Access Controller)**
   - จัดการสิทธิ์การแชร์ชีต (Editor, Commenter, Viewer)
   - ดูแลรักษา LINE Notify Token และ Apps Script Deployment Web App URL
4. **การเฝ้าระวังและกู้คืนระบบ (Monitoring & Incident Response)**
   - ตรวจสอบ Apps Script Execution Logs ประจำวัน
   - สำรองข้อมูลตารางงาน (Backup CSV/JSON) ทุกสิ้นเดือน
`;
    navigator.clipboard.writeText(markdownContent);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Network className="w-3 h-3" />
                SYSTEM DIAGRAM & ARCHITECTURE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                ADMINISTRATOR SPECIFICATION
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>ไดอะแกรมระบบและรายละเอียดของผู้ดูแลระบบ</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              แผนผังสถาปัตยกรรมระบบติดตามงาน การเชื่อมโยง Google Sheets & Apps Script พร้อมโครงสร้างสิทธิ์และคู่มือการปฏิบัติงานสำหรับผู้ดูแลระบบ (Admin)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyMarkdownDoc}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
              title="คัดลอกเอกสารข้อกำหนดเป็น Markdown"
            >
              {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDoc ? 'คัดลอกข้อกำหนดแล้ว' : 'คัดลอกคู่มือ Admin (.md)'}</span>
            </button>

            <button
              onClick={onOpenAppsScriptModal}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>ดูสคริปต์ Apps Script</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-2 mt-5 border-t border-slate-100 pt-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'architecture'
                ? 'bg-[#1b3a5b] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. ผังสถาปัตยกรรมระบบรวม (Architecture Diagram)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('admin-workflow')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'admin-workflow'
                ? 'bg-[#1b3a5b] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>2. ผังการทำงานของ Admin (Admin Workflow)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('rbac')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'rbac'
                ? 'bg-[#1b3a5b] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>3. ตารางสิทธิ์เข้าถึง (RBAC Matrix)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('admin-manual')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'admin-manual'
                ? 'bg-[#1b3a5b] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>4. คู่มือ & ข้อกำหนดผู้ดูแลระบบ (Admin SOP & Runbook)</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: ARCHITECTURE DIAGRAM */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          {/* Main Visual Flow Canvas */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-7">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Network className="w-5 h-5 text-blue-600" />
                  <span>แผนผังสถาปัตยกรรมระบบ 4 ระดับชั้น (4-Tier System Architecture)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  คลิกที่บล็อกแต่ละส่วนเพื่อดูรายละเอียดและข้อกำหนดทางเทคนิค (Technical Specs)
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Architecture
              </span>
            </div>

            {/* Visual Node Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
              {/* TIER 1: CLIENT / ACTOR LAYER */}
              <div className="flex flex-col gap-4">
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                  <span>ชั้นที่ 1: ผู้ใช้งาน & ผู้ดูแล</span>
                  <Users className="w-4 h-4 text-slate-500" />
                </div>

                {/* Node: System Administrator */}
                <div
                  onClick={() => setSelectedNode('admin-node')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    selectedNode === 'admin-node'
                      ? 'bg-amber-50/80 border-amber-400 shadow-md ring-2 ring-amber-300'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">ผู้ดูแลระบบ (Admin)</h4>
                      <p className="text-[11px] text-amber-700 font-medium">System Administrator</p>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>กำหนดโครงสร้างชีต (Schema)</li>
                    <li>ตั้งค่า Trigger & Automation</li>
                    <li>บริหารสิทธิ์ & จัดการ Token</li>
                    <li>ตรวจสอบ Log และแก้ไขข้อผิดพลาด</li>
                  </ul>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-amber-700">
                    <span>คลิกเพื่อดูบทบาท</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Node: End Users */}
                <div
                  onClick={() => setSelectedNode('user-node')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedNode === 'user-node'
                      ? 'bg-blue-50/80 border-blue-400 shadow-md ring-2 ring-blue-300'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">ทีมปฏิบัติงาน (Staff/Users)</h4>
                      <p className="text-[11px] text-blue-700 font-medium">นาย A, นาย B, นางสาว C...</p>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>อัปเดต % ความคืบหน้างาน</li>
                    <li>บันทึกงานใหม่ & เปลี่ยนสถานะ</li>
                    <li>รับอีเมลแจ้งเตือนงานใกล้กำหนด</li>
                  </ul>
                </div>
              </div>

              {/* TIER 2: FRONTEND DASHBOARD */}
              <div className="flex flex-col gap-4">
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                  <span>ชั้นที่ 2: เว็บแดชบอร์ด</span>
                  <HardDrive className="w-4 h-4 text-slate-500" />
                </div>

                <div
                  onClick={() => setSelectedNode('frontend-node')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex-1 flex flex-col justify-between ${
                    selectedNode === 'frontend-node'
                      ? 'bg-indigo-50/80 border-indigo-400 shadow-md ring-2 ring-indigo-300'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">Task Tracking Dashboard</h4>
                        <p className="text-[11px] text-indigo-700 font-medium">React 19 + Vite + Tailwind</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-2 mt-3">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="font-semibold text-slate-800 block mb-0.5">ส่วนแสดงผล (UI Components)</span>
                        <p className="text-[11px] text-slate-500">Metric 4 การ์ด, กราฟโดนัทสถานะ, ความคืบหน้ารายโครงการ, กราฟแท่งผู้รับผิดชอบ, Top 5 เกินกำหนด</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="font-semibold text-slate-800 block mb-0.5">ฟังก์ชันควบคุม (Operations)</span>
                        <p className="text-[11px] text-slate-500">ค้นหา, กรองสถานะ, เพิ่ม/แก้ไขงาน, ส่งออก CSV / JSON</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-700">
                    <span>คลิกเพื่อดูรายละเอียด UI</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* TIER 3: GOOGLE APPS SCRIPT (ENGINE) */}
              <div className="flex flex-col gap-4">
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                  <span>ชั้นที่ 3: ระบบอัตโนมัติ (GAS)</span>
                  <GoogleAppsScriptIcon className="w-4 h-4" />
                </div>

                <div
                  onClick={() => setSelectedNode('gas-node')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex-1 flex flex-col justify-between ${
                    selectedNode === 'gas-node'
                      ? 'bg-blue-50/80 border-blue-400 shadow-md ring-2 ring-blue-300'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                        <GoogleAppsScriptIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">Google Apps Script Engine</h4>
                        <p className="text-[11px] text-blue-700 font-medium">Backend & Automation Logic</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-2 mt-3">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="font-semibold text-slate-800 block mb-0.5">Time-driven Trigger (Cron)</span>
                        <p className="text-[11px] text-slate-500">รันทุกวันเวลา 09:00 น. ตรวจสอบงานที่เหลือเวลา &le; 3 วัน หรือ เกินกำหนด</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="font-semibold text-slate-800 block mb-0.5">Web App REST Endpoints</span>
                        <p className="text-[11px] text-slate-500">doGet() รับคำขออ่านข้อมูล / doPost() บันทึกงานใหม่เข้าสู่สเปรดชีต</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="font-semibold text-slate-800 block mb-0.5">Execution & Error Logger</span>
                        <p className="text-[11px] text-slate-500">บันทึก Logger.log() รายการส่งสำเร็จ หรือล้มเหลว</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-700">
                    <span>คลิกเพื่อดูสคริปต์</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* TIER 4: STORAGE & INTEGRATION */}
              <div className="flex flex-col gap-4">
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                  <span>ชั้นที่ 4: ฐานข้อมูล & แจ้งเตือน</span>
                  <Database className="w-4 h-4 text-slate-500" />
                </div>

                {/* Node: Google Sheets DB */}
                <div
                  onClick={() => setSelectedNode('sheets-node')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedNode === 'sheets-node'
                      ? 'bg-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-300'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                      <GoogleSheetsIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">Google Sheets Database</h4>
                      <p className="text-[11px] text-emerald-700 font-medium">แท็บ &quot;งานทั้งหมด&quot; (128 งาน)</p>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>9 คอลัมน์มาตรฐาน A:I</li>
                    <li>สูตรคำนวณวันคงเหลือ / % ความคืบหน้า</li>
                    <li>ประวัติเวอร์ชันกู้คืนได้ตลอดเวลา</li>
                  </ul>
                </div>

                {/* Node: Notifications */}
                <div
                  onClick={() => setSelectedNode('notification-node')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedNode === 'notification-node'
                      ? 'bg-rose-50/80 border-rose-400 shadow-md ring-2 ring-rose-300'
                      : 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">Dispatchers (แจ้งเตือน)</h4>
                      <p className="text-[11px] text-rose-700 font-medium">Gmail & LINE Notify API</p>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>MailApp: อีเมล HTML สวยงามส่งตรงถึงผู้รับผิดชอบ</li>
                    <li>LINE Notify: แจ้งเตือนด่วนผ่าน Group Chat</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FLOW ARROWS INDICATOR BAR */}
            <div className="mt-6 bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-semibold">
                <Workflow className="w-4 h-4 text-emerald-400" />
                <span>ทิศทางการไหลของข้อมูล (Data Flow Sequence):</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-slate-300">
                <span className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700">1. Admin/User กรอกงาน</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700">2. Dashboard ส่ง HTTPS POST</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700">3. Apps Script บันทึก Sheets</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700">4. Trigger 09:00 น. ตรวจสอบ</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="px-2 py-1 bg-emerald-950 text-emerald-300 rounded-md border border-emerald-700 font-bold">5. ส่ง Email & LINE แจ้งเตือน</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC NODE INSPECTOR CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>รายละเอียดเจาะลึกของส่วนประกอบที่เลือก (Component Specifications)</span>
            </h4>

            {selectedNode === 'admin-node' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-amber-900">ผู้ดูแลระบบ (System Administrator / Super Admin)</h5>
                    <p className="text-xs text-amber-800 mt-1">
                      มีสิทธิ์ระดับสูงสุด (Full Access) ในการควบคุมโครงสร้างสเปรดชีต กฎการเข้าถึง การรัน Apps Script และการตั้งค่าระบบแจ้งเตือนทั้งหมด
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      1. การจัดการฐานข้อมูล
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li>• ควบคุมชื่อคอลัมน์ A:I ห้ามเปลี่ยนสลับลำดับ</li>
                      <li>• ล็อกสูตรคำนวณวันคงเหลือใน Google Sheets</li>
                      <li>• ทำการ Archive งานที่เสร็จสิ้นทุกสิ้นไตรมาส</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      2. การบริหารเวลา & Trigger
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li>• ติดตั้ง Time-driven Trigger: ทุกวัน 09:00 น.</li>
                      <li>• ตรวจสอบ Quota การส่งอีเมลของ Google Workspace</li>
                      <li>• เฝ้าระวัง Execution Timeout (ไม่เกิน 6 นาที/ครั้ง)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                      <Key className="w-4 h-4 text-purple-600" />
                      3. ความปลอดภัย & สิทธิ์ (Security)
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li>• จัดการ LINE Notify Token ให้เป็นความลับ</li>
                      <li>• ตั้งค่า Web App Deployment: Execute as Me</li>
                      <li>• จำกัดสิทธิ์ผู้เข้าถึงชีตเฉพาะบุคลากรในองค์กร</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedNode === 'gas-node' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <GoogleAppsScriptIcon className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-blue-900">Google Apps Script Engine (JavaScript ES6)</h5>
                    <p className="text-xs text-blue-800 mt-1">
                      เป็น Backend ไร้เซิร์ฟเวอร์ (Serverless) ของ Google ทำหน้าที่รันตามรอบเวลา (Trigger) และเป็น API Endpoint ในการรับ/ส่งข้อมูล
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto space-y-2">
                  <div className="text-slate-400">// โครงสร้างการทำงานหลักใน Apps Script (.gs)</div>
                  <div><span className="text-purple-400">function</span> <span className="text-blue-400">sendDailyTaskReminders</span>() &#123;</div>
                  <div className="pl-4 text-emerald-400">const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(&quot;งานทั้งหมด&quot;);</div>
                  <div className="pl-4 text-slate-300">// 1. ดึงข้อมูล 128 งาน พร้อมตรวจสอบ Due Date</div>
                  <div className="pl-4 text-amber-400">if (diffDays &lt;= 3 &amp;&amp; status !== &quot;เสร็จสิ้น&quot;) &#123;</div>
                  <div className="pl-8 text-cyan-400">MailApp.sendEmail(&#123; to, subject, htmlBody &#125;);</div>
                  <div className="pl-8 text-cyan-400">UrlFetchApp.fetch(&quot;https://notify-api.line.me/api/notify&quot;, options);</div>
                  <div className="pl-4">&#125;</div>
                  <div>&#125;</div>
                </div>
              </div>
            )}

            {selectedNode === 'sheets-node' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <GoogleSheetsIcon className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-emerald-900">Google Sheets Database Specification</h5>
                    <p className="text-xs text-emerald-800 mt-1">
                      สเปรดชีตหลักทำหน้าที่เป็นตารางฐานข้อมูลเชิงสัมพันธ์แบบ NoSQL/Tabular ที่รองรับการแชร์ร่วมกันในองค์กร
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5">คอลัมน์</th>
                        <th className="p-2.5">ชื่อฟิลด์</th>
                        <th className="p-2.5">ประเภทข้อมูล</th>
                        <th className="p-2.5">ตัวอย่างข้อมูล</th>
                        <th className="p-2.5">การตรวจสอบ (Validation)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr><td className="p-2 font-mono font-bold text-blue-600">A</td><td className="p-2 font-semibold">รหัสงาน</td><td className="p-2">String (Key)</td><td className="p-2 font-mono">TASK-001</td><td className="p-2 text-emerald-700 font-medium">ห้ามซ้ำ (Unique)</td></tr>
                      <tr><td className="p-2 font-mono font-bold text-blue-600">B</td><td className="p-2 font-semibold">งาน/โครงการ</td><td className="p-2">String</td><td className="p-2">พัฒนาระบบติดตาม</td><td className="p-2">ข้อความความยาว 5-255 อักษร</td></tr>
                      <tr><td className="p-2 font-mono font-bold text-blue-600">C</td><td className="p-2 font-semibold">ผู้รับผิดชอบ</td><td className="p-2">String (Lookup)</td><td className="p-2">นาย A, นาย B</td><td className="p-2">ตรงกับตารางรายชื่อเจ้าหน้าที่</td></tr>
                      <tr><td className="p-2 font-mono font-bold text-blue-600">D</td><td className="p-2 font-semibold">วันที่เริ่ม</td><td className="p-2">Date / Thai Str</td><td className="p-2">10 ต.ค. 69</td><td className="p-2">วันที่ถูกต้อง</td></tr>
                      <tr><td className="p-2 font-mono font-bold text-blue-600">E</td><td className="p-2 font-semibold">กำหนดส่ง</td><td className="p-2">Date / Thai Str</td><td className="p-2">17 ต.ค. 69</td><td className="p-2 text-amber-700 font-medium">ใช้คำนวณวันเกินกำหนด</td></tr>
                      <tr><td className="p-2 font-mono font-bold text-blue-600">F</td><td className="p-2 font-semibold">สถานะ</td><td className="p-2">Enum</td><td className="p-2">กำลังดำเนินการ / เสร็จสิ้น / เกินกำหนด</td><td className="p-2">Dropdown List ใน Google Sheets</td></tr>
                      <tr><td className="p-2 font-mono font-bold text-blue-600">G</td><td className="p-2 font-semibold">% ความคืบหน้า</td><td className="p-2">Integer</td><td className="p-2">75%</td><td className="p-2">0 ถึง 100</td></tr>
                      <tr><td className="p-2 font-mono font-bold text-blue-600">H</td><td className="p-2 font-semibold">ความสำคัญ</td><td className="p-2">Enum</td><td className="p-2">ด่วนมาก / ด่วน / ปานกลาง / ต่ำ</td><td className="p-2">Dropdown List</td></tr>
                      <tr><td className="p-2 font-mono font-bold text-blue-600">I</td><td className="p-2 font-semibold">หมายเหตุ</td><td className="p-2">String</td><td className="p-2">รออนุมัติแบบ</td><td className="p-2">ไม่บังคับกรอก</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedNode === 'frontend-node' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <HardDrive className="w-6 h-6 text-indigo-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-indigo-900">React Single Page Application (Client Architecture)</h5>
                    <p className="text-xs text-indigo-800 mt-1">
                      เว็บแอปพลิเคชันทำงานบนเบราว์เซอร์ของผู้ใช้งาน แสดงผลตอบสนองฉับไว (Instant Response) พร้อมระบบ Local Cache สำรองข้อมูลอัตโนมัติ
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">State Management</span>
                    <p className="text-slate-600">ใช้ React Hooks (useState, useEffect) ควบคุมตารางงาน 128 รายการ และฟิลเตอร์หลายมิติ</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">Offline & Storage Resilience</span>
                    <p className="text-slate-600">เชื่อมโยง localStorage อัตโนมัติ ป้องกันข้อมูลสูญหายแม้เน็ตตัด</p>
                  </div>
                </div>
              </div>
            )}

            {selectedNode === 'notification-node' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <Bell className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-rose-900">Notification Services Pipeline</h5>
                    <p className="text-xs text-rose-800 mt-1">
                      ช่องทางการแจ้งเตือนอัตโนมัติ 2 ช่องทางหลัก: Gmail MailApp API และ LINE Notify Webhook
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>Gmail (MailApp.sendEmail)</span>
                    </div>
                    <p className="text-slate-600 mb-2">ส่งตรงถึงอีเมลผู้รับผิดชอบงาน เช่น singha13@gmail.com หรือบัญชีบุคลากร</p>
                    <div className="bg-white p-2 rounded border border-slate-200 text-[11px] text-slate-500 font-mono">
                      Quota: 1,500 อีเมล/วัน (Workspace) หรือ 100 อีเมล/วัน (Gmail ส่วนตัว)
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                      <LineIcon className="w-4 h-4" />
                      <span>LINE Notify API</span>
                    </div>
                    <p className="text-slate-600 mb-2">ส่งข้อความสรุปงานค้างเข้ากลุ่ม LINE ทีมงานแบบ Real-time</p>
                    <div className="bg-white p-2 rounded border border-slate-200 text-[11px] text-slate-500 font-mono">
                      Endpoint: https://notify-api.line.me/api/notify (Bearer Token)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedNode === 'user-node' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Users className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-blue-900">ทีมปฏิบัติงาน (Assignees / Staff Users)</h5>
                    <p className="text-xs text-blue-800 mt-1">
                      บุคลากรผู้รับผิดชอบงาน เช่น นาย A, นาย B, นางสาว C, นาย D, นางสาว E
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                  <p>• สามารถเข้าใช้งานระบบติดตามเพื่อดูรายการงานที่ตนเองรับผิดชอบได้โดยตรง</p>
                  <p>• สามารถอัปเดต % ความคืบหน้า (0% - 100%) และเปลี่ยนสถานะเป็น &quot;เสร็จสิ้น&quot;</p>
                  <p>• ได้รับการแจ้งเตือนล่วงหน้า 1-3 วันทางอีเมลอัตโนมัติ เพื่อไม่ให้งานเกินกำหนดส่ง</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ADMIN WORKFLOW */}
      {activeSubTab === 'admin-workflow' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-7">
            <div className="pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-amber-600" />
                <span>ผังกระบวนการทำงานและวงจรชีวิตของผู้ดูแลระบบ (Admin Operation & Lifecycle Flow)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ขั้นตอนการปฏิบัติงานของผู้ดูแลระบบตั้งแต่การติดตั้ง เริ่มใช้งาน จนถึงการเฝ้าระวังและบำรุงรักษา
              </p>
            </div>

            {/* Step-by-Step Interactive Workflow */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  01
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      การติดตั้งและจัดเตรียมโครงสร้าง (Setup & Schema Provisioning)
                    </h4>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                      ครั้งแรก (One-time)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    สร้าง Google Spreadsheet และตั้งชื่อชีตว่า &quot;งานทั้งหมด&quot; กำหนดหัวตาราง 9 คอลัมน์ (A:I) ให้ตรงกับมาตรฐาน จากนั้นเปิดเมนู ส่วนขยาย (Extensions) &gt; Apps Script วางโค้ดระบบติดตามงาน
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-slate-700">Sheet ID: 1BxiMVs0XRA5...</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">Tab: งานทั้งหมด</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-purple-200 bg-purple-50/50">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  02
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      การตั้งค่าความปลอดภัยและสิทธิ์การเข้าถึง (IAM & Protected Ranges)
                    </h4>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-md">
                      ความปลอดภัย (Security)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    ผู้ดูแลระบบกำหนดสิทธิ์การแชร์ชีต โดยล็อกคอลัมน์สำคัญ (เช่น คอลัมน์ A รหัสงาน) ด้วย Protected Range ป้องกันผู้ใช้ทั่วไปลบหรือแก้ไขรหัสงานโดยไม่ตั้งใจ และกำหนดสิทธิ์การแก้ไขเฉพาะทีมงานที่เกี่ยวข้อง
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  03
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      การตั้งค่าตัวกระตุ้นอัตโนมัติ (Trigger Configuration)
                    </h4>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                      ระบบอัตโนมัติ (Automation)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    ในหน้าต่าง Google Apps Script ไปที่เมนู &quot;ทริกเกอร์&quot; (นาฬิกาปลุก) &gt; เพิ่มทริกเกอร์ &gt; เลือกฟังก์ชัน <code className="text-emerald-800 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">sendDailyTaskReminders</code> &gt; ประเภทเหตุการณ์: ตามเวลา (Time-driven) &gt; ตัวจับเวลาวัน: 09:00 - 10:00 น.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  04
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      การตรวจสอบการทำงานประจำวัน (Daily Execution Monitoring)
                    </h4>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                      ประจำวัน (Daily 09:15 น.)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    ผู้ดูแลระบบตรวจเช็คหน้าต่างการประมวลผล (Executions) ใน Apps Script เพื่อดูสถานะ &quot;เสร็จสมบูรณ์&quot; (Completed) หากพบ &quot;ล้มเหลว&quot; (Failed) ให้ตรวจสอบ Error Log ทันที เช่น โควตาอีเมลเต็ม หรือผู้รับผิดชอบไม่มีอีเมล
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  05
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      การสำรองข้อมูลและการบำรุงรักษาประจำเดือน (Backup & Data Archiving)
                    </h4>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                      ประจำเดือน (Monthly)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    กดปุ่มดาวน์โหลด CSV / JSON จากหน้าแดชบอร์ดเพื่อเก็บ Snapshot ข้อมูล และย้ายงานที่มีสถานะ &quot;เสร็จสิ้น&quot; เกินกว่า 90 วันไปยังชีต Archive เพื่อรักษาความเร็วในการประมวลผลของสเปรดชีต
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RBAC MATRIX */}
      {activeSubTab === 'rbac' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-7">
            <div className="pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>ตารางเมทริกซ์สิทธิ์การใช้งาน (Role-Based Access Control - RBAC Matrix)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                เปรียบเทียบสิทธิ์การเข้าถึงระหว่าง ผู้ดูแลระบบ (Admin), หัวหน้าโครงการ (Manager), ผู้รับผิดชอบงาน (Assignee) และผู้ชมรายงาน (Viewer)
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#1b3a5b] text-white">
                  <tr>
                    <th className="p-3 font-semibold">ฟังก์ชัน / ขอบเขตงาน (Feature Scope)</th>
                    <th className="p-3 font-bold text-center bg-amber-600">ผู้ดูแลระบบ (Super Admin)</th>
                    <th className="p-3 font-semibold text-center">หัวหน้าโครงการ (PM)</th>
                    <th className="p-3 font-semibold text-center">ผู้รับผิดชอบงาน (Assignee)</th>
                    <th className="p-3 font-semibold text-center">ผู้ชมรายงาน (Viewer)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold">ดูแดชบอร์ดภาพรวม & กราฟสรุป</td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-amber-50/50"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold">สร้างงานใหม่ (Add Task)</td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-amber-50/50"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-slate-300">-</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold">อัปเดต % ความคืบหน้า & บันทึกงาน</td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-amber-50/50"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-slate-300">-</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold">ลบรายการงาน (Delete Task)</td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-amber-50/50"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-rose-500 font-medium">เฉพาะงานตนเอง</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold">ดาวน์โหลดส่งออกไฟล์ CSV / JSON</td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-amber-50/50"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-amber-50/20">
                    <td className="p-3 font-bold text-amber-950">แก้ไขการเชื่อมต่อ Google Sheets & ID</td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-amber-100/50"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-slate-300">-</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-amber-50/20">
                    <td className="p-3 font-bold text-amber-950">เข้าถึงและแก้ไขโค้ด Apps Script (.gs)</td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-amber-100/50"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-slate-300">-</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-amber-50/20">
                    <td className="p-3 font-bold text-amber-950">จัดการ LINE Notify Token & Trigger 09:00 น.</td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-amber-100/50"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-slate-300">-</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-amber-50/20">
                    <td className="p-3 font-bold text-amber-950">รีเซ็ตฐานข้อมูลหรือ Restore ระบบ</td>
                    <td className="p-3 text-center text-emerald-600 font-bold bg-amber-100/50"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-slate-300">-</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                    <td className="p-3 text-center text-slate-300">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ADMIN SOP & RUNBOOK */}
      {activeSubTab === 'admin-manual' && (
        <div className="space-y-6">
          {/* Section: 4 Core Administrator Responsibilities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-7 space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>คู่มือการปฏิบัติงานสำหรับผู้ดูแลระบบ (Administrator Standard Operating Procedures)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ข้อกำหนด บทบาทหน้าที่ และแนวทางปฏิบัติเมื่อเกิดเหตุขัดข้อง (Troubleshooting Playbook)
              </p>
            </div>

            {/* Checklist Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Daily Checklist */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    D
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Checklist ประจำวัน (Daily)</h4>
                </div>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>09:15 น. ตรวจสอบว่าระบบส่งอีเมลแจ้งเตือนงานใกล้กำหนดสำเร็จตาม Trigger หรือไม่</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>ตรวจสอบสถานะงานที่ &quot;เกินกำหนด&quot; ในหน้าหลัก และแจ้งเตือนผู้รับผิดชอบ</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>ตรวจดู Apps Script Executions Logs ว่ามี Error สีแดงหรือไม่</span>
                  </li>
                </ul>
              </div>

              {/* Weekly Checklist */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    W
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Checklist ประจำสัปดาห์ (Weekly)</h4>
                </div>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>ตรวจสอบความถูกต้องของรายชื่อและอีเมลผู้รับผิดชอบในระบบ</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>ตรวจสอบความคืบหน้าภาพรวมโครงการในรายงาน (Reports View)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>ตรวจสอบว่าคอลัมน์และสูตรใน Google Sheets ไม่ถูกแก้ไขผิดเพี้ยน</span>
                  </li>
                </ul>
              </div>

              {/* Monthly Checklist */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Checklist ประจำเดือน (Monthly)</h4>
                </div>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>ดาวน์โหลดสำรองข้อมูลฐานข้อมูลงาน (Backup CSV & JSON Export)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>ทำ Archive ย้ายงานที่เสร็จสิ้นเกิน 90 วันออกจากตารางทำงานหลัก</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>ตรวจสอบและต่ออายุ LINE Notify Token หากใกล้หมดอายุ</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Troubleshooting Playbook Table */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>คู่มือการแก้ไขปัญหาเมื่อเกิดข้อผิดพลาด (Troubleshooting & Incident Playbook)</span>
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded-xl text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3">ปัญหา / รหัสข้อผิดพลาด</th>
                      <th className="p-3">สาเหตุที่เป็นไปได้</th>
                      <th className="p-3">แนวทางแก้ไขสำหรับผู้ดูแลระบบ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-3 font-semibold text-rose-700">อีเมลแจ้งเตือนไม่ถูกส่งออก</td>
                      <td className="p-3">1. Trigger ถูกปิดหรือลบ<br />2. เกินโควตาอีเมลรายวันของ Google</td>
                      <td className="p-3">
                        เข้าหน้า Apps Script ตรวจสอบแท็บ ทริกเกอร์ หาก Trigger หายให้สร้างใหม่ หรือตรวจสอบว่าใช้อีเมลโดเมน Workspace ส่งแทนบัญชีฟรี
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-rose-700">Exceeded maximum execution time</td>
                      <td className="p-3">Apps Script รันเกินเวลาจำกัด 6 นาที เนื่องจากจำนวนงานมีมากเกินไป</td>
                      <td className="p-3">
                        ทำการ Archive งานที่เสร็จสิ้นแล้ว ย้ายไปอีกชีตหนึ่งเพื่อลดจำนวนแถวที่ลูปประมวลผล
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-rose-700">ตารางแสดงผลเพี้ยน / ข้อมูลไม่ตรงแถว</td>
                      <td className="p-3">มีผู้แก้ไขชื่อหัวตาราง หรือสลับลำดับคอลัมน์ A:I ใน Google Sheets</td>
                      <td className="p-3">
                        เปิดชีต &gt; ประวัติเวอร์ชัน (Version History) แล้ว Restore กลับไปเป็นโครงสร้างที่ถูกต้อง และเปิด Protected Range
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-rose-700">LINE Notify ส่งข้อความไม่สำเร็จ (401 Unauthorized)</td>
                      <td className="p-3">Token หมดอายุหรือถูกเพิกถอนในระบบ LINE Notify</td>
                      <td className="p-3">
                        สร้าง Token ใหม่ที่ notify-bot.line.me แล้วนำมากรอกในหน้า การตั้งค่า (Settings)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
