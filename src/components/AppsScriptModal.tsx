import React, { useState } from 'react';
import { X, Copy, Check, Code2, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { GoogleAppsScriptIcon, GoogleSheetsIcon } from './Icons';

interface AppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'reminder' | 'line' | 'webapp'>('reminder');

  if (!isOpen) return null;

  const emailReminderCode = `/**
 * ระบบติดตามงาน - Google Apps Script (Email Notification)
 * ตั้งค่า Trigger: รายวัน (Time-driven -> Every day at 9:00 AM)
 */
function sendDailyTaskReminders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("งานทั้งหมด");
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const headers = data[0]; // [รหัสงาน, งาน/โครงการ, ผู้รับผิดชอบ, วันที่เริ่ม, กำหนดส่ง, สถานะ, % ความคืบหน้า, ความสำคัญ]
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // กำหนดอีเมลผู้รับผิดชอบ (ปรับแก้ตามองค์กรของคุณ เช่น GISTDA หรือหน่วยงาน)
  const assigneeEmails = {
    "นาย A": "singha13@gmail.com",
    "นาย B": "user_b@example.com",
    "นางสาว C": "user_c@example.com",
    "นาย D": "user_d@example.com",
    "นางสาว E": "user_e@example.com"
  };

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const taskId = row[0];
    const title = row[1];
    const assignee = row[2];
    const dueDateStr = row[4];
    const status = row[5];
    const progress = row[6];

    // ข้ามงานที่เสร็จสิ้นหรือยกเลิกแล้ว
    if (status === "เสร็จสิ้น" || status === "ยกเลิก") continue;

    // คำนวณวันคงเหลือก่อนครบกำหนด
    const dueDate = parseThaiDate(dueDateStr);
    if (!dueDate) continue;

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    // แจ้งเตือนถ้างวดส่งอยู่ในช่วง 1 - 3 วัน หรือ เกินกำหนด
    if (diffDays <= 3 && diffDays >= 0) {
      const email = assigneeEmails[assignee] || Session.getActiveUser().getEmail();
      const subject = \`[แจ้งเตือน] งาน \${taskId} (\${title}) ใกล้ครบกำหนดใน \${diffDays} วัน\`;
      
      const htmlBody = \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #1976d2; margin-top: 0;">แจ้งเตือนงานใกล้ครบกำหนด</h2>
          <p>เรียน คุณ\${assignee},</p>
          <p>ระบบตรวจพบว่ามีงานที่ใกล้ถึงกำหนดส่งในอีก <b>\${diffDays} วัน</b></p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #f8fafc; border-radius: 8px; padding: 12px;">
            <tr><td style="padding: 8px; color: #64748b; width: 120px;">รหัสงาน:</td><td style="padding: 8px; font-weight: bold; color: #1976d2;">\${taskId}</td></tr>
            <tr><td style="padding: 8px; color: #64748b;">งาน/โครงการ:</td><td style="padding: 8px; font-weight: bold;">\${title}</td></tr>
            <tr><td style="padding: 8px; color: #64748b;">กำหนดส่ง:</td><td style="padding: 8px;">\${dueDateStr}</td></tr>
            <tr><td style="padding: 8px; color: #64748b;">ความคืบหน้า:</td><td style="padding: 8px; font-weight: bold;">\${progress}%</td></tr>
          </table>
          <p style="color: #64748b; font-size: 13px;">ระบบติดตามงานอัตโนมัติ Task Tracking System (Google Sheets + Apps Script)</p>
        </div>
      \`;

      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody
      });
      Logger.log(\`ส่งการแจ้งเตือนงาน \${taskId} ไปยัง \${email} สำเร็จ\`);
    }
  }
}

function parseThaiDate(dateStr) {
  // รองรับรูปแบบ วัน/เดือน/ปี หรือ "15 ต.ค. 69"
  try {
    return new Date(dateStr);
  } catch(e) {
    return null;
  }
}`;

  const lineNotifyCode = `/**
 * ส่งแจ้งเตือนงานใกล้ครบกำหนดผ่าน LINE Notify
 * รับ Token ได้ที่ https://notify-bot.line.me/
 */
function sendLineNotification() {
  const LINE_TOKEN = "YOUR_LINE_NOTIFY_TOKEN"; // ใส่ Token ที่นี่
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("งานทั้งหมด");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const [taskId, title, assignee, , dueDate, status, progress] = data[i];
    if (status === "เกินกำหนด") {
      const message = \`\\n⚠️ [แจ้งเตือนงานเกินกำหนด]\\nรหัส: \${taskId}\\nชื่องาน: \${title}\\nผู้รับผิดชอบ: \${assignee}\\nกำหนดส่ง: \${dueDate}\\nความคืบหน้า: \${progress}%\`;
      
      UrlFetchApp.fetch("https://notify-api.line.me/api/notify", {
        method: "post",
        headers: { "Authorization": "Bearer " + LINE_TOKEN },
        payload: { "message": message }
      });
    }
  }
}`;

  const webAppCode = `/**
 * Web App API สำหรับเชื่อมต่อหน้าบ้าน React เข้ากับ Google Sheet โดยตรง
 * Deploy เป็น Web App (Execute as: Me, Who has access: Anyone)
 */
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("งานทั้งหมด");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];
  
  for (let i = 1; i < data.length; i++) {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = data[i][idx];
    });
    rows.push(obj);
  }
  
  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("งานทั้งหมด");
  const params = JSON.parse(e.postData.contents);
  // เพิ่มแถวใหม่ลง Google Sheet
  sheet.appendRow([
    params.id,
    params.title,
    params.assignee,
    params.startDate,
    params.dueDate,
    params.status,
    params.progress,
    params.priority,
    params.note || "-"
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'reminder':
        return emailReminderCode;
      case 'line':
        return lineNotifyCode;
      case 'webapp':
        return webAppCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <GoogleAppsScriptIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Google Apps Script Code (.gs)
              </h3>
              <p className="text-xs text-slate-300">
                โค้ดสำหรับนำไปวางใน Extensions &gt; Apps Script ของ Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('reminder')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'reminder'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. แจ้งเตือน Email อัตโนมัติ
          </button>
          <button
            onClick={() => setActiveTab('line')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'line'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. แจ้งเตือน LINE Notify
          </button>
          <button
            onClick={() => setActiveTab('webapp')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'webapp'
                ? 'bg-white text-purple-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. เชื่อมต่อ Web App API (2-Way Sync)
          </button>

          <button
            onClick={handleCopy}
            className="ml-auto px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>คัดลอกแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอกโค้ด</span>
              </>
            )}
          </button>
        </div>

        {/* Code View */}
        <div className="flex-1 p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-y-auto max-h-[420px] select-all">
          <pre>{getCurrentCode()}</pre>
        </div>

        {/* Instructions Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <b>วิธีใช้งาน:</b> เปิด Google Sheet &gt; ไปที่เมนู <b>ส่วนขยาย (Extensions)</b> &gt; <b>Apps Script</b> &gt; วางโค้ด &gt; ตั้งเวลาที่เมนู <b>ทริกเกอร์ (Triggers)</b>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors whitespace-nowrap self-end sm:self-auto"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
