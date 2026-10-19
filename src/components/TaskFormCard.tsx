import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, X, Calendar, User, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types/task';

interface TaskFormCardProps {
  editingTask: Task | null;
  onSaveTask: (task: Partial<Task>) => void;
  onCancel: () => void;
}

export const TaskFormCard: React.FC<TaskFormCardProps> = ({
  editingTask,
  onSaveTask,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('โครงการพัฒนาระบบติดตาม');
  const [assignee, setAssignee] = useState('นาย A');
  const [startDate, setStartDate] = useState('8 ต.ค. 69');
  const [dueDate, setDueDate] = useState('15 ต.ค. 69');
  const [status, setStatus] = useState<TaskStatus>('กำลังดำเนินการ');
  const [progress, setProgress] = useState(60);
  const [priority, setPriority] = useState<TaskPriority>('สูง');
  const [note, setNote] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setProject(editingTask.project || 'โครงการพัฒนาระบบติดตาม');
      setAssignee(editingTask.assignee);
      setStartDate(editingTask.startDate);
      setDueDate(editingTask.dueDate);
      setStatus(editingTask.status);
      setProgress(editingTask.progress);
      setPriority(editingTask.priority);
      setNote(editingTask.note === '-' ? '' : editingTask.note);
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setProject('โครงการพัฒนาระบบติดตาม');
    setAssignee('นาย A');
    setStartDate('10 ต.ค. 69');
    setDueDate('18 ต.ค. 69');
    setStatus('กำลังดำเนินการ');
    setProgress(50);
    setPriority('สูง');
    setNote('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: editingTask?.id,
      title: title.trim(),
      project,
      assignee,
      startDate,
      dueDate,
      status,
      progress: Number(progress),
      priority,
      note: note.trim() || '-',
    });

    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      if (!editingTask) resetForm();
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <PlusCircle className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            ฟอร์มเพิ่ม/แก้ไขงาน
          </h3>
        </div>
        {editingTask && (
          <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded-md font-semibold">
            {editingTask.id}
          </span>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 flex-1 overflow-y-auto max-h-[350px]">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            {editingTask ? `แก้ไขงาน ${editingTask.id}` : 'เพิ่มงานใหม่'}
          </h4>
          {submittedMessage && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" /> บันทึกสำเร็จ
            </span>
          )}
        </div>

        {/* งาน/โครงการ */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            งาน/โครงการ <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="กรอกชื่องาน/โครงการ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs sm:text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* โครงการหลัก & ผู้รับผิดชอบ (2 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              โครงการหลัก
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="โครงการพัฒนาระบบติดตาม">โครงการพัฒนาระบบติดตาม</option>
              <option value="โครงการทดสอบระบบ">โครงการทดสอบระบบ</option>
              <option value="โครงการอบรม/พัฒนา">โครงการอบรม/พัฒนา</option>
              <option value="โครงการวิจัยและพัฒนา">โครงการวิจัยและพัฒนา</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ผู้รับผิดชอบ <span className="text-rose-500">*</span>
            </label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="นาย A">นาย A</option>
              <option value="นาย B">นาย B</option>
              <option value="นางสาว C">นางสาว C</option>
              <option value="นาย D">นาย D</option>
              <option value="นางสาว E">นางสาว E</option>
            </select>
          </div>
        </div>

        {/* วันที่เริ่ม & กำหนดส่ง (2 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              วันที่เริ่ม
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd/mm/yy"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
              />
              <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              กำหนดส่ง
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd/mm/yy"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
              />
              <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ความสำคัญ & สถานะ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ความสำคัญ
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full text-xs sm:text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="สูง">สูง</option>
              <option value="ปานกลาง">ปานกลาง</option>
              <option value="ต่ำ">ต่ำ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              สถานะ
            </label>
            <select
              value={status}
              onChange={(e) => {
                const s = e.target.value as TaskStatus;
                setStatus(s);
                if (s === 'เสร็จสิ้น') setProgress(100);
              }}
              className="w-full text-xs sm:text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
              <option value="เสร็จสิ้น">เสร็จสิ้น</option>
              <option value="รอดำเนินการ">รอดำเนินการ</option>
              <option value="ยังไม่เริ่ม">ยังไม่เริ่ม</option>
              <option value="เกินกำหนด">เกินกำหนด</option>
              <option value="ยกเลิก">ยกเลิก</option>
            </select>
          </div>
        </div>

        {/* % ความคืบหน้า Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>ความคืบหน้า</span>
            <span className="font-mono text-blue-600 font-bold">{progress}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* หมายเหตุ */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            หมายเหตุ
          </label>
          <input
            type="text"
            placeholder="กรอกหมายเหตุ (ถ้ามี)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-xs sm:text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onCancel();
            }}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-5 py-1.5 rounded-lg text-xs font-medium text-white bg-[#1976d2] hover:bg-blue-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>บันทึก</span>
          </button>
        </div>
      </form>
    </div>
  );
};
