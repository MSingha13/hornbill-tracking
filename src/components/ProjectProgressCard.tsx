import React from 'react';
import { Task } from '../types/task';

interface ProjectProgressCardProps {
  tasks: Task[];
  selectedProject: string | null;
  onSelectProject: (project: string | null) => void;
}

export const ProjectProgressCard: React.FC<ProjectProgressCardProps> = ({
  tasks,
  selectedProject,
  onSelectProject,
}) => {
  // The 4 main projects shown in the screenshot
  const projectList = [
    {
      name: 'โครงการพัฒนาระบบติดตาม',
      color: 'bg-[#1976d2]',
      textColor: 'text-[#1976d2]',
      defaultPct: 72,
    },
    {
      name: 'โครงการทดสอบระบบ',
      color: 'bg-[#00897b]',
      textColor: 'text-[#00897b]',
      defaultPct: 45,
    },
    {
      name: 'โครงการอบรม/พัฒนา',
      color: 'bg-[#f59e0b]',
      textColor: 'text-[#f59e0b]',
      defaultPct: 80,
    },
    {
      name: 'โครงการวิจัยและพัฒนา',
      color: 'bg-[#8e24aa]',
      textColor: 'text-[#8e24aa]',
      defaultPct: 30,
    },
  ];

  // Calculate dynamic progress if tasks are edited
  const projectsData = projectList.map((p) => {
    const projTasks = tasks.filter((t) => t.project === p.name);
    if (projTasks.length === 0) {
      return { ...p, pct: p.defaultPct, count: 0 };
    }
    const totalProgress = projTasks.reduce((sum, t) => sum + (t.progress || 0), 0);
    const avgProgress = Math.round(totalProgress / projTasks.length);
    return {
      ...p,
      pct: avgProgress,
      count: projTasks.length,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          ความคืบหน้าแต่ละโครงการ
        </h3>
        {selectedProject && (
          <button
            onClick={() => onSelectProject(null)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-around">
        {projectsData.map((proj) => {
          const isSelected = selectedProject === proj.name;
          return (
            <div
              key={proj.name}
              onClick={() => onSelectProject(isSelected ? null : proj.name)}
              className={`group cursor-pointer p-2 rounded-xl transition-all ${
                isSelected ? 'bg-blue-50/80 ring-1 ring-blue-300' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-1.5">
                <span className="text-slate-800 group-hover:text-blue-700 truncate max-w-[200px]">
                  {proj.name}
                </span>
                <span className="font-bold text-slate-700 font-mono tabular-nums ml-2">
                  {proj.pct}%
                </span>
              </div>

              {/* Progress bar container */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${proj.color}`}
                  style={{ width: `${Math.min(100, Math.max(0, proj.pct))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
