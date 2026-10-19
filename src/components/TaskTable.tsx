import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Download,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types/task';

interface TaskTableProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddNewTask: () => void;
  selectedFilter: TaskStatus | 'ทั้งหมด';
  setSelectedFilter: (status: TaskStatus | 'ทั้งหมด') => void;
  selectedAssignee: string | null;
  setSelectedAssignee: (assignee: string | null) => void;
  selectedProject: string | null;
  setSelectedProject: (project: string | null) => void;
  onExportCSV: () => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onAddNewTask,
  selectedFilter,
  setSelectedFilter,
  selectedAssignee,
  setSelectedAssignee,
  selectedProject,
  setSelectedProject,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter tasks based on all active criteria
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.note.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      selectedFilter === 'ทั้งหมด' ||
      (selectedFilter === 'รอดำเนินการ'
        ? task.status === 'รอดำเนินการ' || task.status === 'ยังไม่เริ่ม'
        : task.status === selectedFilter);

    // Assignee filter
    const matchesAssignee = !selectedAssignee || task.assignee === selectedAssignee;

    // Project filter
    const matchesProject = !selectedProject || task.project === selectedProject;

    return matchesSearch && matchesStatus && matchesAssignee && matchesProject;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;
  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'กำลังดำเนินการ':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'เสร็จสิ้น':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'เกินกำหนด':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'รอดำเนินการ':
      case 'ยังไม่เริ่ม':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ยกเลิก':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'สูง':
        return 'text-rose-600 font-bold';
      case 'ปานกลาง':
        return 'text-amber-700 font-medium';
      case 'ต่ำ':
        return 'text-emerald-700 font-medium';
    }
  };

  const getProgressBarColor = (status: TaskStatus, progress: number) => {
    if (status === 'เสร็จสิ้น' || progress === 100) return 'bg-[#2e7d32]';
    if (status === 'เกินกำหนด') return 'bg-[#ef4444]';
    if (status === 'รอดำเนินการ' || status === 'ยังไม่เริ่ม') return 'bg-[#f59e0b]';
    return 'bg-[#1976d2]';
  };

  const hasActiveFilters =
    selectedFilter !== 'ทั้งหมด' || selectedAssignee !== null || selectedProject !== null || searchTerm !== '';

  const clearAllFilters = () => {
    setSelectedFilter('ทั้งหมด');
    setSelectedAssignee(null);
    setSelectedProject(null);
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Top Header & Search / Filter Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">รายการงาน</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 font-mono tabular-nums">
            {filteredTasks.length} รายการ
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหางาน..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown Filter */}
          <select
            value={selectedFilter}
            onChange={(e) => {
              setSelectedFilter(e.target.value as TaskStatus | 'ทั้งหมด');
              setCurrentPage(1);
            }}
            aria-label="กรองสถานะงาน"
            className="text-xs sm:text-sm py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ทั้งหมด">ทุกสถานะ</option>
            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
            <option value="รอดำเนินการ">รอดำเนินการ / ยังไม่เริ่ม</option>
            <option value="เกินกำหนด">เกินกำหนด</option>
            <option value="ยกเลิก">ยกเลิก</option>
          </select>

          {/* Export Button */}
          <button
            onClick={onExportCSV}
            title="ส่งออก CSV"
            className="p-2 text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* New Task Button */}
          <button
            onClick={onAddNewTask}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1976d2] hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">เพิ่มงานใหม่</span>
          </button>
        </div>
      </div>

      {/* Active Filter Badges Bar (if any) */}
      {hasActiveFilters && (
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200/70 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">ตัวกรองที่ใช้งาน:</span>
          {selectedFilter !== 'ทั้งหมด' && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md flex items-center gap-1">
              สถานะ: {selectedFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedFilter('ทั้งหมด')} />
            </span>
          )}
          {selectedAssignee && (
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md flex items-center gap-1">
              ผู้รับผิดชอบ: {selectedAssignee}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAssignee(null)} />
            </span>
          )}
          {selectedProject && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md flex items-center gap-1">
              โครงการ: {selectedProject}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedProject(null)} />
            </span>
          )}
          {searchTerm && (
            <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md flex items-center gap-1">
              คำค้น: "{searchTerm}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-blue-600 hover:text-blue-800 font-medium ml-auto cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="py-3 px-4 font-semibold">รหัสงาน</th>
              <th className="py-3 px-4 font-semibold">งาน/โครงการ</th>
              <th className="py-3 px-4 font-semibold">ผู้รับผิดชอบ</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">วันที่เริ่ม</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">กำหนดส่ง</th>
              <th className="py-3 px-4 font-semibold text-center">สถานะ</th>
              <th className="py-3 px-4 font-semibold min-w-[140px]">% ความคืบหน้า</th>
              <th className="py-3 px-4 font-semibold text-center">ความสำคัญ</th>
              <th className="py-3 px-4 font-semibold">หมายเหตุ</th>
              <th className="py-3 px-4 font-semibold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTasks.length > 0 ? (
              currentTasks.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* รหัสงาน */}
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                    {t.id}
                  </td>

                  {/* งาน/โครงการ */}
                  <td className="py-3 px-4 font-medium text-slate-900">
                    <div className="flex flex-col">
                      <span>{t.title}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{t.project}</span>
                    </div>
                  </td>

                  {/* ผู้รับผิดชอบ */}
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {t.assignee}
                  </td>

                  {/* วันที่เริ่ม */}
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                    {t.startDate}
                  </td>

                  {/* กำหนดส่ง */}
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                    {t.dueDate}
                  </td>

                  {/* สถานะ */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>
                  </td>

                  {/* % ความคืบหน้า */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor(
                            t.status,
                            t.progress
                          )}`}
                          style={{ width: `${Math.min(100, Math.max(0, t.progress))}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-600 tabular-nums w-8 text-right">
                        {t.progress}%
                      </span>
                    </div>
                  </td>

                  {/* ความสำคัญ */}
                  <td className={`py-3 px-4 text-center whitespace-nowrap text-xs ${getPriorityColor(t.priority)}`}>
                    {t.priority}
                  </td>

                  {/* หมายเหตุ */}
                  <td className="py-3 px-4 text-slate-500 text-xs truncate max-w-[120px]">
                    {t.note || '-'}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditTask(t)}
                        title="แก้ไขงาน"
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(t.id)}
                        title="ลบงาน"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500 text-sm">
                  ไม่พบรายการงานที่ตรงกับเงื่อนไขการค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200/80 flex items-center justify-between text-xs sm:text-sm text-slate-500">
        <div>
          แสดง {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, filteredTasks.length)} จาก {filteredTasks.length} รายการ
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-mono tabular-nums font-semibold text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
