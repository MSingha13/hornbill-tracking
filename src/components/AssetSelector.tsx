import React from 'react';
import { AssetFilterType } from '../types/tracking';
import { Feather, Radio, Layers } from 'lucide-react';

interface AssetSelectorProps {
  selectedAsset: AssetFilterType;
  onChange: (asset: AssetFilterType) => void;
  kkoz01Count: number;
  kkoz02Count: number;
  totalCount: number;
  compact?: boolean;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({
  selectedAsset,
  onChange,
  kkoz01Count,
  kkoz02Count,
  totalCount,
  compact = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white sm:bg-slate-100/90 rounded-2xl border border-slate-200 shadow-xs">
      {/* KKOZ01 Button */}
      <button
        type="button"
        onClick={() => onChange('KKOZ01')}
        className={`flex items-center gap-1.5 rounded-xl transition-all ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 sm:px-3.5 py-1.5 text-xs'
        } ${
          selectedAsset === 'KKOZ01'
            ? 'bg-emerald-600 text-white font-bold shadow-xs ring-2 ring-emerald-300'
            : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 bg-transparent'
        }`}
        title="เลือกดูเฉพาะข้อมูลพิกัดนกกาฮัง KKOZ01 (เขาเขียว ชลบุรี)"
      >
        <span className={`w-2 h-2 rounded-full ${selectedAsset === 'KKOZ01' ? 'bg-white' : 'bg-emerald-500'} animate-pulse`}></span>
        <Feather className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-semibold">KKOZ01</span>
        <span className="hidden sm:inline font-normal text-[11px] opacity-90">(เขาเขียว)</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            selectedAsset === 'KKOZ01'
              ? 'bg-emerald-800 text-emerald-100'
              : 'bg-emerald-100 text-emerald-800 font-medium'
          }`}
        >
          {kkoz01Count} จุด
        </span>
      </button>

      {/* KKOZ02 Button */}
      <button
        type="button"
        onClick={() => onChange('KKOZ02')}
        className={`flex items-center gap-1.5 rounded-xl transition-all ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 sm:px-3.5 py-1.5 text-xs'
        } ${
          selectedAsset === 'KKOZ02'
            ? 'bg-blue-600 text-white font-bold shadow-xs ring-2 ring-blue-300'
            : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 bg-transparent'
        }`}
        title="เลือกดูเฉพาะข้อมูลพิกัดนกกาฮัง KKOZ02 (ตัวส่งสัญญาณชุดที่ 2)"
      >
        <span className={`w-2 h-2 rounded-full ${selectedAsset === 'KKOZ02' ? 'bg-white' : 'bg-blue-500'} animate-pulse`}></span>
        <Radio className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-semibold">KKOZ02</span>
        <span className="hidden sm:inline font-normal text-[11px] opacity-90">(ชุดที่ 2)</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            selectedAsset === 'KKOZ02'
              ? 'bg-blue-800 text-blue-100'
              : 'bg-blue-100 text-blue-800 font-medium'
          }`}
        >
          {kkoz02Count} จุด
        </span>
      </button>

      {/* ALL Button */}
      <button
        type="button"
        onClick={() => onChange('ALL')}
        className={`flex items-center gap-1.5 rounded-xl transition-all ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 sm:px-3.5 py-1.5 text-xs'
        } ${
          selectedAsset === 'ALL'
            ? 'bg-slate-900 text-white font-bold shadow-xs ring-2 ring-slate-400'
            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 bg-transparent'
        }`}
        title="แสดงข้อมูลพิกัดรวมทั้ง KKOZ01 และ KKOZ02 บนหน้าจอเดียวกัน"
      >
        <Layers className="w-3.5 h-3.5 flex-shrink-0" />
        <span>ทั้งหมด (ALL)</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            selectedAsset === 'ALL'
              ? 'bg-slate-700 text-slate-100'
              : 'bg-slate-200 text-slate-700 font-medium'
          }`}
        >
          {totalCount}
        </span>
      </button>
    </div>
  );
};
