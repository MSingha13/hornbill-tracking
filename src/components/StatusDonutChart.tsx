import React from 'react';
import { Task, TaskStatus } from '../types/task';

interface StatusDonutChartProps {
  tasks: Task[];
  selectedFilter: TaskStatus | 'ทั้งหมด';
  onSelectFilter: (status: TaskStatus | 'ทั้งหมด') => void;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({
  tasks,
  selectedFilter,
  onSelectFilter,
}) => {
  const total = tasks.length || 1;
  const completed = tasks.filter((t) => t.status === 'เสร็จสิ้น').length;
  const inProgress = tasks.filter((t) => t.status === 'กำลังดำเนินการ').length;
  const pending = tasks.filter((t) => t.status === 'รอดำเนินการ' || t.status === 'ยังไม่เริ่ม').length;
  const overdue = tasks.filter((t) => t.status === 'เกินกำหนด').length;
  const cancelled = tasks.filter((t) => t.status === 'ยกเลิก').length;

  const data = [
    {
      label: 'เสร็จสิ้น',
      status: 'เสร็จสิ้น' as TaskStatus,
      count: completed,
      pct: Math.round((completed / total) * 100),
      color: '#2e7d32', // green
      bg: 'bg-[#2e7d32]',
    },
    {
      label: 'กำลังดำเนินการ',
      status: 'กำลังดำเนินการ' as TaskStatus,
      count: inProgress,
      pct: Math.round((inProgress / total) * 100),
      color: '#1976d2', // blue
      bg: 'bg-[#1976d2]',
    },
    {
      label: 'รอดำเนินการ',
      status: 'รอดำเนินการ' as TaskStatus,
      count: pending,
      pct: Math.round((pending / total) * 100),
      color: '#f59e0b', // amber
      bg: 'bg-[#f59e0b]',
    },
    {
      label: 'เกินกำหนด',
      status: 'เกินกำหนด' as TaskStatus,
      count: overdue,
      pct: Math.round((overdue / total) * 100),
      color: '#ef4444', // red
      bg: 'bg-[#ef4444]',
    },
    {
      label: 'ยกเลิก',
      status: 'ยกเลิก' as TaskStatus,
      count: cancelled,
      pct: Math.round((cancelled / total) * 100),
      color: '#94a3b8', // gray
      bg: 'bg-[#94a3b8]',
    },
  ];

  // SVG Donut calculation
  const radius = 62;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const slices = data.map((item) => {
    const fraction = total > 0 ? item.count / total : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -(cumulativePercent * circumference);
    cumulativePercent += fraction;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">สถานะงาน</h3>
        {selectedFilter !== 'ทั้งหมด' && (
          <button
            onClick={() => onSelectFilter('ทั้งหมด')}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background track circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Colored segment arcs */}
            {slices.map((slice) =>
              slice.count > 0 ? (
                <circle
                  key={slice.label}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  onClick={() => onSelectFilter(slice.status)}
                />
              ) : null
            )}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-800 font-mono tabular-nums leading-none">
              {tasks.length}
            </span>
            <span className="text-xs font-medium text-slate-500 mt-0.5">งาน</span>
          </div>
        </div>

        {/* Legend list matching screenshot */}
        <div className="flex flex-col space-y-1.5 w-full sm:w-auto min-w-[150px]">
          {data.map((item) => {
            const isSelected = selectedFilter === item.status;
            return (
              <div
                key={item.label}
                onClick={() => onSelectFilter(item.status)}
                className={`flex items-center justify-between text-xs py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50 font-bold text-blue-900 ring-1 ring-blue-300'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="text-slate-500 font-mono tabular-nums ml-3">
                  <span className="font-semibold text-slate-800">{item.count}</span>
                  <span className="text-[11px] ml-1">({item.pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
