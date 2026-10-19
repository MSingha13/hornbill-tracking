import React, { useState } from 'react';
import { Bell, ArrowRight, Send, CheckCircle2, MessageSquare, Mail, Settings } from 'lucide-react';
import { GoogleLogoIcon, LineIcon } from './Icons';
import { Task } from '../types/task';

interface EmailNotificationCardProps {
  task?: Task;
  onViewTaskDetail: (task: Task) => void;
  onOpenAppsScript: () => void;
}

export const EmailNotificationCard: React.FC<EmailNotificationCardProps> = ({
  task,
  onViewTaskDetail,
  onOpenAppsScript,
}) => {
  const [channel, setChannel] = useState<'email' | 'line'>('email');
  const [testSent, setTestSent] = useState(false);

  // Default to TASK-001 as shown in screenshot if not provided
  const targetTask: Task = task || {
    id: 'TASK-001',
    title: 'พัฒนาระบบติดตาม',
    project: 'โครงการพัฒนาระบบติดตาม',
    assignee: 'นาย A',
    startDate: '8 ต.ค. 69',
    dueDate: '15 ต.ค. 2569',
    status: 'กำลังดำเนินการ',
    progress: 60,
    priority: 'สูง',
    note: '-',
  };

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            ตัวอย่างการแจ้งเตือนอัตโนมัติ ({channel === 'email' ? 'Email' : 'LINE'})
          </h3>
        </div>

        {/* Channel toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setChannel('email')}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              channel === 'email' ? 'bg-white shadow-2xs text-blue-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setChannel('line')}
            className={`px-2 py-0.5 rounded-md font-medium transition-all ${
              channel === 'line' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            LINE
          </button>
        </div>
      </div>

      {/* Notification Body Card */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {channel === 'email' ? (
          /* Gmail / Google Workspace Card matching screenshot */
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs relative">
            {/* Top row: Google logo, subject, sender, time */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-2xs flex items-center justify-center shrink-0">
                <GoogleLogoIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    แจ้งเตือนงานใกล้ครบกำหนด
                  </h4>
                  <span className="text-[11px] text-slate-400 font-normal whitespace-nowrap">
                    เมื่อวานนี้ 09:00 น.
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  task-tracker@gistda.or.th
                </p>
              </div>
            </div>

            {/* Content text */}
            <div className="text-xs text-slate-700 space-y-1.5 pl-11 border-t border-slate-100 pt-3">
              <p className="font-semibold text-slate-900">
                เรียน คุณ{targetTask.assignee}
              </p>
              <p className="text-slate-600">
                มีงานที่ใกล้ครบกำหนดในอีก 3 วัน
              </p>

              <div className="mt-2 space-y-1 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 font-mono text-[11px] sm:text-xs">
                <div className="flex items-baseline">
                  <span className="text-slate-500 w-20">งาน:</span>
                  <span className="font-semibold text-slate-800">{targetTask.title}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-slate-500 w-20">รหัสงาน:</span>
                  <span className="font-semibold text-blue-700">{targetTask.id}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-slate-500 w-20">กำหนดส่ง:</span>
                  <span className="text-slate-700">{targetTask.dueDate}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-slate-500 w-20">ความคืบหน้า:</span>
                  <span className="font-semibold text-slate-800">{targetTask.progress}%</span>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-2">
                <button
                  onClick={() => onViewTaskDetail(targetTask)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group cursor-pointer"
                >
                  <span>ดูรายละเอียดเพิ่มเติม</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* LINE Notify Preview Card */
          <div className="bg-[#f7fafc] border border-emerald-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <LineIcon className="w-5 h-5 fill-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    LINE Notify (Task Bot)
                  </h4>
                  <span className="text-[11px] text-slate-400">09:00 น.</span>
                </div>
                <p className="text-xs text-emerald-700 font-medium">การแจ้งเตือนอัตโนมัติ</p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1 font-mono">
              <p className="font-bold text-slate-900 font-sans">🔔 [ระบบติดตามงาน] แจ้งเตือนงานใกล้ครบกำหนด</p>
              <p>👤 ผู้รับผิดชอบ: {targetTask.assignee}</p>
              <p>📌 งาน: {targetTask.title} ({targetTask.id})</p>
              <p>📅 กำหนดส่ง: {targetTask.dueDate}</p>
              <p>📊 ความคืบหน้า: {targetTask.progress}%</p>
              <p className="text-blue-600 font-sans mt-2 underline cursor-pointer">
                🔗 คลิกดูรายละเอียดในระบบ
              </p>
            </div>
          </div>
        )}

        {/* Bottom Interactive Trigger Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={onOpenAppsScript}
            className="text-xs text-slate-600 hover:text-blue-700 flex items-center gap-1 font-medium cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ตั้งค่า Apps Script Trigger</span>
          </button>

          <button
            onClick={handleSendTest}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              testSent
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            {testSent ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>จำลองส่งสำเร็จ!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>ทดสอบส่งจำลอง</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
