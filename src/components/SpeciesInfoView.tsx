import React, { useState } from 'react';
import {
  hornbillPortrait,
  hornbillCanopyPerch,
  hornbillFlightCanopy,
  hornbillCasqueCloseup,
} from '../assets/assets';
import {
  ShieldCheck,
  Feather,
  Heart,
  Radio,
  Award,
  Camera,
  X,
  Maximize2,
  TreePine,
  Sparkles,
} from 'lucide-react';
import { GistdaLogo, BsrcLogo, KhaoKheowZooLogo } from './PartnerLogos';

interface GalleryPhoto {
  title: string;
  subtitle: string;
  tag: string;
  src: string;
  aspect: string;
}

export const SpeciesInfoView: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryPhoto | null>(null);

  const galleryPhotos: GalleryPhoto[] = [
    {
      title: 'นกกาฮังเกาะกิ่งไม้ในป่าดงดิบ',
      subtitle: 'พฤติกรรมเกาะสังเกตการณ์บนต้นไม้ขนาดใหญ่ในเรือนยอดไม้ธรรมชาติ',
      tag: 'ถิ่นอาศัยธรรมชาติ',
      src: hornbillCanopyPerch,
      aspect: 'aspect-4/3',
    },
    {
      title: 'นกกาฮังขณะบินเหนือผืนป่า',
      subtitle: 'การสยายปีกกว้างกว่า 1.5 เมตร ขนปีกสีดำขอบขาวอันเป็นเอกลักษณ์โดดเด่น',
      tag: 'การบินและสำรวจพื้นที่',
      src: hornbillFlightCanopy,
      aspect: 'aspect-16/9',
    },
    {
      title: 'โหนกและจะงอยปากสีเหลืองทอง (Casque)',
      subtitle: 'โหนกหนาขนาดใหญ่สีเหลืองส้มและดวงตาวาววับ เอกลักษณ์เฉพาะของนกกาฮัง',
      tag: 'ลักษณะทางกายวิภาค',
      src: hornbillCasqueCloseup,
      aspect: 'aspect-square',
    },
    {
      title: 'พอร์ตเทรตนกกาฮังตัวเต็มวัย',
      subtitle: 'ราชานกเงือก สัตว์สัญลักษณ์แห่งความอุดมสมบูรณ์และความรักมั่นคง',
      tag: 'ทูตแห่งพงไพร',
      src: hornbillPortrait,
      aspect: 'aspect-4/3',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-800">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img
            src={hornbillCanopyPerch}
            alt="นกกาฮัง Great Hornbill"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>สัตว์ป่าคุ้มครองตามพระราชบัญญัติสงวนและคุ้มครองสัตว์ป่า พ.ศ. 2562</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            นกกาฮัง (Great Hornbill)
          </h2>
          <p className="text-sm sm:text-base font-mono text-amber-300 mt-1 flex items-center gap-2">
            <span>Buceros bicornis</span>
            <span className="text-xs text-slate-400 font-sans">(นกกาฮัง หรือ นกกก)</span>
          </p>
          <p className="text-xs sm:text-sm text-slate-200 mt-3.5 leading-relaxed">
            นกกาฮัง (หรือที่รู้จักกันในชื่อ นกกก) เป็นนกเงือกขนาดใหญ่ที่สุดในประเทศไทย
            มีบทบาทสำคัญอย่างยิ่งต่อระบบนิเวศป่าดงดิบ ในฐานะ “นักปลูกป่าแห่งพงไพร”
            ด้วยการกระจายเมล็ดพันธุ์ไม้ป่าขนาดใหญ่ การติดตามด้วยอุปกรณ์ GPS
            ช่วยให้นักวิจัยเข้าใจถิ่นอาศัยและเส้นทางการหากิน เพื่อวางแผนอนุรักษ์พื้นที่ป่าได้อย่างยั่งยืน
          </p>
        </div>
      </div>

      {/* Photo Gallery Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                รูปภาพนกกาฮัง (Great Hornbill Photo Gallery)
              </h3>
              <p className="text-xs text-slate-500">
                รวมภาพถ่ายชีววิทยา พฤติกรรมการหากิน และการบินของนกกาฮังในธรรมชาติ
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>4 ภาพถ่ายความคมชัดสูง</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryPhotos.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(photo)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-semibold bg-emerald-600/90 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {photo.tag}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/80 group-hover:text-white group-hover:bg-emerald-600 transition-all">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="p-3.5 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {photo.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {photo.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Ecology & Tracking Tech */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Feather className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">ลักษณะทางชีววิทยานกกาฮัง</h3>
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
            นกกาฮังจับคู่แบบผัวเดียวเมียเดียวตลอดชีวิต ในช่วงทำรัง ตัวเมียจะเข้าไปขังตัวเองในโพรงต้นไม้ใหญ่และใช้โคลนปิดปากโพรง โดยตัวผู้จะคอยหาอาหารมาป้อนตลอดช่วงกกไข่
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
            ภาคีความร่วมมือโครงการติดตามและอนุรักษ์นกกาฮัง (Great Hornbill)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          ความร่วมมือทางเทคโนโลยีสารสนเทศ อวกาศ และการฟื้นฟูประชากรสัตว์ป่าหายากเพื่อระบบนิเวศไทย
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2.5">
            <GistdaLogo size="md" />
            <p className="text-xs text-slate-600 leading-relaxed">
              สนับสนุนเทคโนโลยีภูมิสารสนเทศ ระบบดาวเทียมสำรวจและประมวลผลข้อมูลพิกัดเชิงพื้นที่ (GIS) แบบเรียลไทม์
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2.5">
            <BsrcLogo size="md" />
            <p className="text-xs text-slate-600 leading-relaxed">
              บมจ. บางจาก ศรีราชา ร่วมสนับสนุนโครงการด้านสิ่งแวดล้อมและความยั่งยืน เพื่อการฟื้นฟูผืนป่าและสัตว์ป่า
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2.5">
            <KhaoKheowZooLogo size="md" />
            <p className="text-xs text-slate-600 leading-relaxed">
              สวนสัตว์เปิดเขาเขียว ผู้นำด้านการเพาะขยายพันธุ์ วิจัยชีววิทยา และปล่อยนกกาฮังคืนสู่ธรรมชาติ
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              title="ปิด"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 sm:p-6 bg-slate-900 text-white">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-semibold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                  {selectedImage.tag}
                </span>
                <span className="text-xs text-slate-400 font-mono">Buceros bicornis</span>
              </div>
              <h4 className="text-lg font-bold text-white">{selectedImage.title}</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {selectedImage.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
