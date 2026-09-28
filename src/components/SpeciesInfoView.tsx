import React from 'react';
import { hornbillPortrait, hornbillIcon } from '../assets/assets';
import { ShieldCheck, MapPin, Feather, Heart, Radio, Activity, Compass, Wind, Award } from 'lucide-react';
import { GistdaLogo, BsrcLogo, KhaoKheowZooLogo } from './PartnerLogos';

export const SpeciesInfoView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img src={hornbillPortrait} alt="Hornbill" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>สัตว์ป่าคุ้มครองตามพระราชบัญญัติสงวนและคุ้มครองสัตว์ป่า พ.ศ. 2562</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            นกกก (Great Hornbill)
          </h2>
          <p className="text-sm font-mono text-amber-300 mt-1">Buceros bicornis</p>
          <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed">
            นกกกเป็นนกเงือกขนาดใหญ่ที่สุดในประเทศไทย มีบทบาทสำคัญอย่างยิ่งต่อระบบนิเวศป่าดงดิบ ในฐานะ “นักปลูกป่าแห่งพงไพร” ด้วยการกระจายเมล็ดพันธุ์ไม้ป่าขนาดใหญ่ การติดตามด้วยอุปกรณ์ GPS ช่วยให้นักวิจัยเข้าใจถิ่นอาศัยและเส้นทางการหากิน เพื่อวางแผนอนุรักษ์พื้นที่ป่าได้อย่างยั่งยืน
          </p>
        </div>
      </div>

      {/* Grid of Ecology & Tracking Tech */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Feather className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">ลักษณะทางชีววิทยา</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            ลำตัวยาวประมาณ 130-150 เซนติเมตร ปีกกว้างกว่า 1.5 เมตร จงอยปากใหญ่สีเหลืองส้มและมีโหนกหนาด้านบน ขนสีดำตัดกับคอและหางสีขาวที่มีแถบสีดำคาด
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">อายุขัยเฉลี่ย:</span>
            <span className="font-bold text-slate-800">35 - 50 ปี</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">สัญลักษณ์รักเดียวใจเดียว</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            นกกกจับคู่แบบผัวเดียวเมียเดียวตลอดชีวิต ในช่วงทำรัง ตัวเมียจะเข้าไปขังตัวเองในโพรงต้นไม้ใหญ่และใช้โคลนปิดปากโพรง โดยตัวผู้จะคอยหาอาหารมาป้อนตลอดช่วงกกไข่
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">ฤดูผสมพันธุ์:</span>
            <span className="font-bold text-slate-800">มกราคม - พฤษภาคม</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">อุปกรณ์ติดตามดาวเทียม (KKOZ01)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            ใช้แท็กน้ำหนักเบาไม่เกิน 3% ของน้ำหนักตัวนก ติดตั้งระบบ Solar & Battery, เซนเซอร์ GPS/GNSS, วัดอุณหภูมิ และส่งสัญญาณผ่านระบบดาวเทียม GlobalStar IoT เครือข่าย LEO Satellite
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">รหัสอุปกรณ์:</span>
            <span className="font-bold text-slate-800 font-mono">KKOZ01 (Khao Kheow)</span>
          </div>
        </div>
      </div>

      {/* Conservation Partners Showcase Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900 text-base">
            ภาคีความร่วมมือโครงการติดตามและอนุรักษ์นกกก
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          ความร่วมมือทางเทคโนโลยีสารสนเทศ อวกาศ และการฟื้นฟูประชากรสัตว์ป่าหายากเพื่อระบบนิเวศไทย
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2.5">
            <GistdaLogo size="md" showLabel={true} />
            <p className="text-xs text-slate-600 leading-relaxed">
              สนับสนุนเทคโนโลยีภูมิสารสนเทศ ระบบดาวเทียมสำรวจและประมวลผลข้อมูลพิกัดเชิงพื้นที่ (GIS) แบบเรียลไทม์
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2.5">
            <BsrcLogo size="md" showLabel={true} />
            <p className="text-xs text-slate-600 leading-relaxed">
              บมจ. บางจาก ศรีราชา ร่วมสนับสนุนโครงการด้านสิ่งแวดล้อมและความยั่งยืน เพื่อการฟื้นฟูผืนป่าและสัตว์ป่า
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2.5">
            <KhaoKheowZooLogo size="md" showLabel={true} />
            <p className="text-xs text-slate-600 leading-relaxed">
              สวนสัตว์เปิดเขาเขียว ผู้นำด้านการเพาะขยายพันธุ์ วิจัยชีววิทยา และปล่อยนกกกคืนสู่ธรรมชาติ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
