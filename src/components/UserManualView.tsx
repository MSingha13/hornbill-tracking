import React, { useState } from 'react';
import {
  BookOpen,
  Map,
  Satellite,
  Compass,
  Radio,
  Download,
  Search,
  CheckCircle2,
  HelpCircle,
  Server,
  Layers,
  ChevronDown,
  ChevronUp,
  Activity,
  ShieldCheck,
  Printer,
  FileText,
  Loader2,
  Eye,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  gistdaLogo,
  bsrcLogo,
  khaoKheowLogo,
  hornbillPortrait,
  hornbillCanopyPerch,
  hornbillFlightCanopy,
  hornbillCasqueCloseup,
  forestBg,
} from '../assets/assets';

export const UserManualView: React.FC = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [allExpanded, setAllExpanded] = useState<boolean>(true);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sec1: true,
    sec2: true,
    sec3: true,
    sec4: true,
    sec5: true,
    sec6: true,
    sec7: true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleAll = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    setExpandedSections({
      sec1: nextState,
      sec2: nextState,
      sec3: nextState,
      sec4: nextState,
      sec5: nextState,
      sec6: nextState,
      sec7: nextState,
    });
  };

  // Browser Native Print dialog (Save as PDF)
  const handlePrint = () => {
    // Ensure all sections are expanded before printing
    setExpandedSections({
      sec1: true,
      sec2: true,
      sec3: true,
      sec4: true,
      sec5: true,
      sec6: true,
      sec7: true,
    });
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Direct HTML-to-PDF generation via html2pdf.js
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    // Ensure all sections are expanded for export
    setExpandedSections({
      sec1: true,
      sec2: true,
      sec3: true,
      sec4: true,
      sec5: true,
      sec6: true,
      sec7: true,
    });

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule as any).default || html2pdfModule;

      const element = document.getElementById('printable-user-manual');
      if (!element) {
        throw new Error('ไม่พบเอกสารสำหรับแปลงเป็น PDF');
      }

      const opt = {
        margin: [8, 8, 8, 8],
        filename: 'hornbill-tracking-user-manual.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(opt).from(element).save();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.warn('html2pdf generation fallback to native print:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              คู่มือการใช้งานระบบ HORNBILL TRACKING
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            เอกสารคำแนะนำฉบับสมบูรณ์ พร้อมภาพประกอบและขั้นตอนการใช้งานทุกฟังก์ชัน
          </p>
        </div>

        {/* Export / Print Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleToggleAll}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5"
            title={allExpanded ? 'ย่อทุกบท' : 'ขยายทุกบท'}
          >
            {allExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{allExpanded ? 'ย่อทุกบท' : 'ขยายทุกบท'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 transition-all flex items-center gap-1.5 shadow-2xs"
            title="พิมพ์หรือบันทึกเป็น PDF ผ่านหน้าพิมพ์ของเบราว์เซอร์"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>พิมพ์ / บันทึก PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm text-white ${
              isGeneratingPdf
                ? 'bg-emerald-600/70 cursor-wait'
                : downloadSuccess
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
            }`}
            title="ดาวน์โหลดไฟล์ PDF คู่มือการใช้งานพร้อมรูปภาพ"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>กำลังสร้างไฟล์ PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดสำเร็จ!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>ส่งออกไฟล์ PDF (.pdf)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Printable Manual Document Container */}
      <div
        id="printable-user-manual"
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-slate-800 font-sans"
      >
        {/* Cover Header Banner */}
        <div className="avoid-break relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-emerald-900/60 shadow-md">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Partner Logos Header Row */}
          <div className="relative z-10 flex items-center justify-between gap-4 pb-6 border-b border-white/10 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase font-mono">
                HORNBILL TRACKING SYSTEM
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                Official User Manual v2.0
              </span>
            </div>

            {/* 3 Partner White Logos */}
            <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-2xl shadow-xs">
              <img src={gistdaLogo} alt="GISTDA" className="h-6 object-contain" />
              <span className="w-px h-4 bg-slate-300" />
              <img src={bsrcLogo} alt="BSRC" className="h-6 object-contain" />
              <span className="w-px h-4 bg-slate-300" />
              <img src={khaoKheowLogo} alt="Khao Kheow Zoo" className="h-6 object-contain" />
            </div>
          </div>

          {/* Title Lockup & Hero Image */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-semibold border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <Radio className="w-3.5 h-3.5 text-emerald-700" />
                <span>สัญญาณ GlobalStar</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                HORNBILL TRACKING
              </h1>
              <p className="text-sm sm:text-base font-medium text-emerald-300">
                คู่มือการใช้งานระบบติดตามนกกกและนกกาฮังผ่านดาวเทียมแบบเรียลไทม์
              </p>
              <p className="text-xs sm:text-sm text-slate-300 italic pt-1">
                “เทคโนโลยีเพื่อการอนุรักษ์ สู่อนาคตที่ยั่งยืน”
              </p>

              <div className="pt-3 flex items-center gap-4 text-xs text-slate-300 font-mono">
                <div>รหัสเป้าหมายหลัก: <strong className="text-emerald-400">KKOZ01</strong></div>
                <div>•</div>
                <div>ดาวเทียม: <strong className="text-emerald-400">Globalstar LEO</strong></div>
              </div>
            </div>

            {/* Cover Photograph */}
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 border-2 border-emerald-500/40 shadow-lg">
              <img
                src={hornbillPortrait}
                alt="นกกาฮัง Great Hornbill"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded">
                นกกาฮัง (Buceros bicornis) รหัส KKOZ01
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: สถาปัตยกรรมและกระบวนการรับส่งข้อมูล */}
        <div className="avoid-break space-y-4">
          <div
            onClick={() => toggleSection('sec1')}
            className="flex items-center justify-between pb-2 border-b border-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                สถาปัตยกรรมระบบและการรับส่งสัญญาณดาวเทียม (System & Telemetry Architecture)
              </h2>
            </div>
            <div className="text-slate-400">
              {expandedSections.sec1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedSections.sec1 && (
            <div className="space-y-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                ระบบทำงานโดยเชื่อมโยง 4 ขั้นตอนอย่างอัตโนมัติ เพื่อรับข้อมูลพิกัด GPS จากป่าธรรมชาติเข้าสู่ระบบคอมพิวเตอร์แบบเรียลไทม์:
              </p>

              {/* 4 Steps Telemetry Graphic */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div className="font-bold text-emerald-950 text-xs">อุปกรณ์ส่งสัญญาณ SPOT</div>
                  <p className="text-[11px] text-slate-600">
                    ติดตั้งบนหลังนกกาฮัง KKOZ01 ส่งคลื่นวิทยุ L-band (1610-1620 MHz) พร้อมพิกัด GPS อุณหภูมิ และระดับแบตเตอรี่
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div className="font-bold text-sky-950 text-xs">กลุ่มดาวเทียม Globalstar</div>
                  <p className="text-[11px] text-slate-600">
                    ดาวเทียมวงโคจรต่ำ (LEO) ทั้ง 28 ดวงที่โคจรผ่านประเทศไทย รับสัญญาณและส่งต่อลงมายังสถานีภาคพื้นดิน
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div className="font-bold text-indigo-950 text-xs">Google Apps Script API</div>
                  <p className="text-[11px] text-slate-600">
                    ประมวลผล ถอดรหัสพิกัด บันทึกลง Google Sheets Database และเปิด RESTful JSON API Endpoint
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div className="font-bold text-purple-950 text-xs">เว็บแอปพลิเคชัน GISTDA</div>
                  <p className="text-[11px] text-slate-600">
                    แสดงผลผ่านแผนที่ดาวเทียม GISTDA Basemap, คำนวณเส้นทางบินย้อนหลัง, สรุปสถิติ และเปิดให้ดาวน์โหลด CSV
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: การใช้งานแดชบอร์ดและตัวชี้วัดความปลอดภัย */}
        <div className="avoid-break space-y-4">
          <div
            onClick={() => toggleSection('sec2')}
            className="flex items-center justify-between pb-2 border-b border-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                การใช้งานแดชบอร์ดและการอ่านค่าตัวชี้วัด (Dashboard)
              </h2>
            </div>
            <div className="text-slate-400">
              {expandedSections.sec2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedSections.sec2 && (
            <div className="space-y-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                หน้าจอแดชบอร์ดหลักประกอบด้วย <strong>การ์ดตัวชี้วัดสำคัญ 4 ใบ</strong> เพื่อการเฝ้าระวังความปลอดภัยของนกอย่างรวดเร็ว:
              </p>

              {/* Simulated KPI Cards UI Graphic */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">รหัสติดตาม</div>
                  <div className="text-lg font-black text-slate-900 mt-1">KKOZ01</div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">นกกาฮังตัวหลัก</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">ตำแหน่งล่าสุด</div>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-1">13.2141° N, 101.0685° E</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">เขาเขียว ชลบุรี</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">ระดับแบตเตอรี่</div>
                  <div className="text-lg font-black text-emerald-600 mt-1">100%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">พลังงานแสงอาทิตย์</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">อุณหภูมิอุปกรณ์</div>
                  <div className="text-lg font-black text-amber-600 mt-1">29.5 °C</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">สภาวะปกติในร่มไม้</div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <strong className="text-emerald-950 block font-bold mb-1">
                  💡 เกณฑ์การประเมินความปลอดภัย:
                </strong>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>แบตเตอรี่:</strong> หากลดลงต่ำกว่า 30% ติดต่อกัน ควรตรวจสอบการรับแสงอาทิตย์ของแผงโซลาร์</li>
                  <li><strong>อุณหภูมิ:</strong> หากสูงเกิน 45°C นกอาจอยู่กลางแจ้งแดดจัด หากต่ำกว่า 15°C อาจอยู่ยอดดอยสูงช่วงกลางคืน</li>
                  <li><strong>พิกัดคงที่:</strong> หากพิกัดไม่เคลื่อนไหวเกิน 48 ชม. ควรส่งทีมภาคสนามเข้าตรวจสอบตำแหน่ง</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: แผนที่ติดตามการบินและชั้นข้อมูลดาวเทียม GISTDA */}
        <div className="avoid-break space-y-4">
          <div
            onClick={() => toggleSection('sec3')}
            className="flex items-center justify-between pb-2 border-b border-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                แผนที่ติดตามการบินและชั้นข้อมูลดาวเทียม GISTDA (Map & GISTDA Basemap)
              </h2>
            </div>
            <div className="text-slate-400">
              {expandedSections.sec3 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedSections.sec3 && (
            <div className="space-y-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                แผนที่ติดตามการบินเป็นหัวใจหลักในการวิเคราะห์การใช้พื้นที่ป่า โดยระบบได้ตั้งค่า <strong>แผนที่ดาวเทียม GISTDA (Basemap ล่าสุด)</strong> เป็นชั้นข้อมูลเริ่มต้น (Default Layer):
              </p>

              {/* Map Layer Specifications Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2.5">ชั้นข้อมูล (Layer)</th>
                      <th className="p-2.5">ความละเอียด</th>
                      <th className="p-2.5">การใช้งานที่เหมาะสม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="bg-emerald-50/50">
                      <td className="p-2.5 font-bold text-emerald-900">1. แผนที่ดาวเทียม GISTDA (ค่าเริ่มต้น)</td>
                      <td className="p-2.5 font-mono">512×512 (Tile)</td>
                      <td className="p-2.5">ภาพถ่ายดาวเทียมความละเอียดสูงของประเทศไทย แม่นยำ ตรงตามพิกัดจริง</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">2. Esri World Imagery</td>
                      <td className="p-2.5 font-mono">256×256</td>
                      <td className="p-2.5">ภาพถ่ายดาวเทียมสากล สำหรับดูผืนป่าขนาดใหญ่ข้ามเขตจังหวัด</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">3. OpenStreetMap (มาตรฐาน)</td>
                      <td className="p-2.5 font-mono">256×256</td>
                      <td className="p-2.5">แผนที่ลายเส้นถนน ทางหลวง ขอบเขตอุทยาน และชื่อหมู่บ้าน</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">4. OpenTopoMap (ภูมิประเทศ)</td>
                      <td className="p-2.5 font-mono">256×256</td>
                      <td className="p-2.5">เส้นชั้นความสูง (Contours) ยอดเขา แนวสันเขา และลำห้วย</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Map Controls Guide */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    ▶ เล่นเส้นทางบิน (Replay):
                  </strong>
                  <span className="text-[11px] text-slate-600">
                    กดปุ่มเพื่อเริ่มแอนิเมชันจำลองการบินของนกตามลำดับเวลาในอดีตสู่จุดปัจจุบัน
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    🎯 ชี้ตำแหน่งล่าสุด:
                  </strong>
                  <span className="text-[11px] text-slate-600">
                    กดเพื่อเลื่อนตำแหน่งแผนที่และซูมกลับมาที่จุดพิกัดปัจจุบันของนกทันที
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block font-bold text-xs mb-1">
                    🗂️ เปลี่ยนเลเยอร์ (แผนที่ ▾):
                  </strong>
                  <span className="text-[11px] text-slate-600">
                    คลิกปุ่มมุมขวาบนเพื่อสลับดูภาพดาวเทียม หรือแผนที่เส้นชั้นความสูงได้อิสระ
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: การค้นหา กรองข้อมูล และส่งออกไฟล์ */}
        <div className="avoid-break space-y-4">
          <div
            onClick={() => toggleSection('sec4')}
            className="flex items-center justify-between pb-2 border-b border-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                การค้นหา กรองข้อมูล และส่งออกไฟล์ (Search, Filter & Export)
              </h2>
            </div>
            <div className="text-slate-400">
              {expandedSections.sec4 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedSections.sec4 && (
            <div className="space-y-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <ul className="list-disc list-inside space-y-2 text-slate-700 pl-1">
                <li>
                  <strong>ตัวกรองช่วงวันที่ (Date Filters):</strong>
                  <ul className="list-circle list-inside pl-4 pt-1 text-slate-600 space-y-1">
                    <li><em>5 วันล่าสุด (ค่าเริ่มต้น):</em> แสดงข้อมูล 5 วันล่าสุดที่มีการบันทึกพิกัด</li>
                    <li><em>วันล่าสุด:</em> กรองดูเฉพาะข้อมูลของวันที่นกล่าสุดปรากฏตัว</li>
                    <li><em>เลือกเฉพาะวัน:</em> เลือกวันย้อนหลังเพื่อวิเคราะห์การเดินทางเฉพาะวันนั้น</li>
                  </ul>
                </li>
                <li>
                  <strong>การค้นหาพิกัดแบบทันที:</strong> สามารถพิมพ์ตัวเลขละติจูด ลองจิจูด หรือชื่อสถานที่ในช่องค้นหา ตารางจะแสดงเฉพาะแถวที่ตรงกับคำค้นทันที
                </li>
                <li>
                  <strong>การส่งออกไฟล์ CSV:</strong> กดปุ่ม <em>"ดาวน์โหลด CSV"</em> เพื่อนำชุดข้อมูลไปเปิดในโปรแกรม Microsoft Excel, Google Sheets, หรือโปรแกรม QGIS / ArcGIS
                </li>
                <li>
                  <strong>การส่งออกไฟล์ JSON:</strong> กดปุ่ม <em>"JSON"</em> ที่หัวตารางสำหรับนักพัฒนาซอฟต์แวร์นำไปใช้งานต่อ
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Section 5: เรดาร์สถานีแจ้ซ้อนและวงโคจรดาวเทียม Globalstar */}
        <div className="avoid-break space-y-4">
          <div
            onClick={() => toggleSection('sec5')}
            className="flex items-center justify-between pb-2 border-b border-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                เรดาร์สถานีแจ้ซ้อนและวงโคจรดาวเทียม Globalstar (Satellite Radar & Passes)
              </h2>
            </div>
            <div className="text-slate-400">
              {expandedSections.sec5 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedSections.sec5 && (
            <div className="space-y-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span>สถานีสังเกตการณ์: อุทยานแห่งชาติแจ้ซ้อน จ.ลำปาง</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">18.8350° N, 99.4715° E</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400">รัศมีตรวจจับเรดาร์:</div>
                    <div className="font-bold text-emerald-300 mt-0.5">2,000 กิโลเมตร</div>
                  </div>
                  <div>
                    <div className="text-slate-400">แบบจำลองคำนวณวงโคจร:</div>
                    <div className="font-bold text-emerald-300 mt-0.5">SGP4 Propagation & TLE ล่าสุด</div>
                  </div>
                  <div>
                    <div className="text-slate-400">กลุ่มดาวเทียมที่ติดตาม:</div>
                    <div className="font-bold text-emerald-300 mt-0.5">Globalstar LEO (28 ดวง)</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                ในแท็บ <strong>"ดาวเทียม SatMap Space"</strong> จะแสดงตำแหน่งสดของดาวเทียมที่กำลังโคจรผ่านประเทศไทย พร้อมตารางเวลารอบโคจรผ่าน (Pass Times) ที่คำนวณมุมเงยสูงสุด (Peak Elevation) เพื่อประเมินความแรงของการรับส่งข้อมูล
              </p>
            </div>
          )}
        </div>

        {/* Section 6: อัลบั้มภาพถ่ายธรรมชาติและชีววิทยานกกาฮัง */}
        <div className="avoid-break space-y-4">
          <div
            onClick={() => toggleSection('sec6')}
            className="flex items-center justify-between pb-2 border-b border-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                6
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                ภาพประกอบธรรมชาติและชีววิทยานกกาฮัง (Great Hornbill Photo Gallery)
              </h2>
            </div>
            <div className="text-slate-400">
              {expandedSections.sec6 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedSections.sec6 && (
            <div className="space-y-4 pt-1">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ภาพถ่ายประกอบการศึกษาพฤติกรรม ชีววิทยา และลักษณะทางกายวิภาคของนกกาฮัง (Great Hornbill - <em>Buceros bicornis</em>):
              </p>

              {/* 4 Photo Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 group">
                  <div className="aspect-4/3 overflow-hidden">
                    <img
                      src={hornbillCanopyPerch}
                      alt="นกกาฮังเกาะเรือนยอดไม้ธรรมชาติ"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 bg-white border-t border-slate-100">
                    <div className="font-bold text-slate-900 text-xs">
                      1. การเกาะสังเกตการณ์บนเรือนยอดไม้ธรรมชาติ
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      พฤติกรรมเกาะกิ่งไม้ใหญ่ในป่าดงดิบเพื่อหาผลไม้สุกและสังเกตศัตรูตามธรรมชาติ
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 group">
                  <div className="aspect-4/3 overflow-hidden">
                    <img
                      src={hornbillFlightCanopy}
                      alt="นกกาฮังขณะบินสยายปีก"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 bg-white border-t border-slate-100">
                    <div className="font-bold text-slate-900 text-xs">
                      2. การสยายปีกบินสำรวจแนวเทือกเขา
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ช่วงปีกกว้างกว่า 1.5 เมตร ช่วยให้บินข้ามหุบเขาและกระจายเมล็ดพันธุ์ไม้ป่าได้ไกล
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 group">
                  <div className="aspect-4/3 overflow-hidden">
                    <img
                      src={hornbillCasqueCloseup}
                      alt="ลักษณะโหนก Casque สีเหลืองทอง"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 bg-white border-t border-slate-100">
                    <div className="font-bold text-slate-900 text-xs">
                      3. ลักษณะโหนกและจะงอยปากสีเหลืองทอง (Casque)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      โหนกหนาขนาดใหญ่สีเหลืองส้ม เอกลักษณ์ทางกายวิภาคที่ช่วยสะท้อนเสียงร้องก้องป่า
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 group">
                  <div className="aspect-4/3 overflow-hidden">
                    <img
                      src={hornbillPortrait}
                      alt="พอร์ตเทรตนกกาฮัง"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 bg-white border-t border-slate-100">
                    <div className="font-bold text-slate-900 text-xs">
                      4. ราชานกเงือก สัตว์สัญลักษณ์แห่งพงไพร
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ตัวแทนความอุดมสมบูรณ์ของระบบนิเวศป่าดงดิบและความร่วมมือด้านการอนุรักษ์
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 7: การแก้ไขปัญหาและคำถามที่พบบ่อย */}
        <div className="avoid-break space-y-4">
          <div
            onClick={() => toggleSection('sec7')}
            className="flex items-center justify-between pb-2 border-b border-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                7
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                การแก้ไขปัญหาเบื้องต้นและข้อแนะนำ (Troubleshooting & FAQs)
              </h2>
            </div>
            <div className="text-slate-400">
              {expandedSections.sec7 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedSections.sec7 && (
            <div className="space-y-3 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="space-y-2.5">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-1">
                    Q1: เปิดหน้าเว็บแล้วยังเห็นหน้าจอหรือเมนูเดิม?
                  </strong>
                  <p className="text-xs text-slate-600">
                    ตอบ: เบราว์เซอร์อาจจำแคชเดิมไว้ ให้กดปุ่ม <strong>Hard Refresh</strong> (<kbd className="bg-white px-1.5 py-0.5 border rounded text-[11px]">Ctrl</kbd> + <kbd className="bg-white px-1.5 py-0.5 border rounded text-[11px]">F5</kbd> บน Windows หรือ <kbd className="bg-white px-1.5 py-0.5 border rounded text-[11px]">Cmd</kbd> + <kbd className="bg-white px-1.5 py-0.5 border rounded text-[11px]">Shift</kbd> + <kbd className="bg-white px-1.5 py-0.5 border rounded text-[11px]">R</kbd> บน Mac)
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-1">
                    Q2: แผนที่ดาวเทียม GISTDA โหลดช้าหรือไม่แสดงผล?
                  </strong>
                  <p className="text-xs text-slate-600">
                    ตอบ: ตรวจสอบการเชื่อมต่อเครือข่ายอินเทอร์เน็ต หากใช้งานเครือข่ายภายในองค์กร ให้ตรวจสอบว่าไฟร์วอลล์อนุญาตการเชื่อมต่อพอร์ต 443 ไปยัง <code className="bg-white px-1 py-0.5 rounded border text-[11px]">api-gateway.gistda.or.th</code> หรือไม่ หรือสามารถสลับไปใช้ชั้นข้อมูล Esri Satellite ชั่วคราวได้
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-1">
                    Q3: วิธีส่งออกไฟล์ PDF ไปใช้งานหรือจัดพิมพ์เอกสาร?
                  </strong>
                  <p className="text-xs text-slate-600">
                    ตอบ: สามารถกดปุ่ม <strong>"ส่งออกไฟล์ PDF (.pdf)"</strong> ที่ด้านบนของหน้านี้ ระบบจะสร้างไฟล์และดาวน์โหลดลงเครื่องทันที หรือกดปุ่ม <strong>"พิมพ์ / บันทึก PDF"</strong> เพื่อสั่งพิมพ์ผ่านเครื่องพิมพ์หรือบันทึกผ่านเบราว์เซอร์
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Document Footer */}
        <div className="avoid-break pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>โครงการศึกษาวิจัยและติดตามการปล่อยนกกาฮังคืนสู่ธรรมชาติ</span>
          </div>
          <div>ความร่วมมือ: GISTDA • BSRC • สวนสัตว์เปิดเขาเขียว</div>
        </div>
      </div>
    </div>
  );
};
