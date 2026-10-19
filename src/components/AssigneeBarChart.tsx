import React from 'react';
import { Task } from '../types/task';

interface AssigneeBarChartProps {
  tasks: Task[];
  selectedAssignee: string | null;
  onSelectAssignee: (assignee: string | null) => void;
}

export const AssigneeBarChart: React.FC<AssigneeBarChartProps> = ({
  tasks,
  selectedAssignee,
  onSelectAssignee,
}) => {
  const assignees = [
    { name: 'นาย A', color: '#1976d2', defaultCount: 18 },
    { name: 'นาย B', color: '#2e7d32', defaultCount: 24 },
    { name: 'นางสาว C', color: '#f59e0b', defaultCount: 16 },
    { name: 'นาย D', color: '#7b1fa2', defaultCount: 12 },
    { name: 'นางสาว E', color: '#00acc1', defaultCount: 8 },
  ];

  const chartData = assignees.map((a) => {
    const userTasks = tasks.filter((t) => t.assignee === a.name);
    // If user edited tasks, reflect live count, otherwise default
    const count = userTasks.length > 0 ? userTasks.length : a.defaultCount;
    return {
      ...a,
      count,
    };
  });

  const maxVal = 30; // Max tick on y-axis matching screenshot

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          งานแยกตามผู้รับผิดชอบ
        </h3>
        {selectedAssignee && (
          <button
            onClick={() => onSelectAssignee(null)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      <div className="relative flex-1 flex flex-col justify-end pt-6 pb-1">
        {/* Y Axis Guide Lines */}
        <div className="absolute inset-x-8 top-6 bottom-7 flex flex-col justify-between pointer-events-none">
          <div className="border-b border-dashed border-slate-200 w-full flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono -ml-6">30</span>
          </div>
          <div className="border-b border-dashed border-slate-200 w-full flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono -ml-6">20</span>
          </div>
          <div className="border-b border-dashed border-slate-200 w-full flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono -ml-6">10</span>
          </div>
          <div className="border-b border-slate-200 w-full flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono -ml-6">0</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="relative pl-6 pr-2 h-44 flex items-end justify-around gap-2 sm:gap-3 z-10">
          {chartData.map((item) => {
            const heightPct = Math.min(100, Math.max(5, (item.count / maxVal) * 100));
            const isSelected = selectedAssignee === item.name;

            return (
              <div
                key={item.name}
                onClick={() => onSelectAssignee(isSelected ? null : item.name)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
              >
                {/* Value number on top of bar */}
                <span className="text-xs font-bold text-slate-700 font-mono tabular-nums mb-1 transition-transform group-hover:-translate-y-0.5">
                  {item.count}
                </span>

                {/* Vertical Bar */}
                <div className="w-8 sm:w-10 max-w-full rounded-t-md transition-all duration-300 relative group-hover:opacity-90 overflow-hidden"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: item.color,
                    boxShadow: isSelected ? '0 0 0 2px #3b82f6' : undefined,
                  }}
                >
                  {/* Subtle top reflection */}
                  <div className="w-full h-1 bg-white/20" />
                </div>

                {/* Assignee Label */}
                <span
                  className={`text-[11px] sm:text-xs mt-2 text-center truncate max-w-full transition-colors ${
                    isSelected ? 'font-bold text-blue-700' : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                  title={item.name}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
