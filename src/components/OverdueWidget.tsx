import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Task } from '../types/task';

interface OverdueWidgetProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onViewAllOverdue: () => void;
}

export const OverdueWidget: React.FC<OverdueWidgetProps> = ({
  tasks,
  onSelectTask,
  onViewAllOverdue,
}) => {
  // Filter overdue tasks and sort by daysOverdue descending
  const overdueTasks = tasks
    .filter((t) => t.status === 'เกินกำหนด' || (t.daysOverdue && t.daysOverdue > 0))
    .sort((a, b) => (b.daysOverdue || 0) - (a.daysOverdue || 0))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-rose-600">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            งานที่เกินกำหนด (Top 5)
          </h3>
        </div>
        <button
          onClick={onViewAllOverdue}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-0.5 cursor-pointer transition-colors"
        >
          <span>ดูทั้งหมด</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 text-slate-500 font-medium">
              <th className="pb-2.5 font-semibold text-slate-600">รหัสงาน</th>
              <th className="pb-2.5 font-semibold text-slate-600">งาน/โครงการ</th>
              <th className="pb-2.5 font-semibold text-slate-600">กำหนดส่ง</th>
              <th className="pb-2.5 font-semibold text-rose-600 text-right">วันเกินกำหนด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {overdueTasks.map((t) => (
              <tr
                key={t.id}
                onClick={() => onSelectTask(t)}
                className="hover:bg-rose-50/50 cursor-pointer transition-colors group"
              >
                <td className="py-2.5 font-medium text-slate-700 font-mono">
                  <span className="group-hover:text-blue-600 font-semibold">{t.id}</span>
                </td>
                <td className="py-2.5 text-slate-800 font-medium truncate max-w-[120px]">
                  {t.title}
                </td>
                <td className="py-2.5 text-slate-600 font-mono tabular-nums whitespace-nowrap">
                  {t.dueDate}
                </td>
                <td className="py-2.5 text-rose-600 font-bold font-mono tabular-nums text-right whitespace-nowrap">
                  {t.daysOverdue ?? 1} วัน
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
