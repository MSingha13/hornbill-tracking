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
  Cpu,
  Activity,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface ManualSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  summary: string;
  content: React.ReactNode;
}

export const UserManualView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    modules: true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sections: ManualSection[] = [
    {
      id: 'overview',
      title: '1. บทนำและสถาปัตยกรรมระบบ',
      icon: Compass,
      tag: 'บทนำ',
      summary: 'วัตถุประสงค์โครงการและโครงสร้างการรับส่งข้อมูลผ่านดาวเทียม',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            ระบบ <strong>HORNBILL TRACKING</strong> พัฒนาขึ้นเพื่อติดตามตำแหน่ง พฤติกรรมการบิน การใช้พื้นที่ป่าธรรมชาติ และประเมินสุขภาพของนกกาฮัง (Great Hornbill - <em>Buceros bicornis</em>) ภายใต้โครงการความร่วมมือระหว่าง <strong>GISTDA</strong>, <strong>BSRC</strong> และ <strong>สวนสัตว์เปิดเขาเขียว</strong>
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-xs">
            <div className="font-bold text-emerald-400 font-sans flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>ลำดับการรับ-ส่งข้อมูล (Telemetry Flow):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-emerald-300 font-bold">1. อุปกรณ์บนตัวนก</div>
                <div className="text-slate-300 text-[10px] mt-1">เครื่องส่ง SPOT ส่งคลื่น L-band (1610-1620 MHz)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-emerald-300 font-bold">2. ดาวเทียม Globalstar</div>
                <div className="text-slate-300 text-[10px] mt-1">กลุ่มดาวเทียม LEO 28 ดวงรับสัญญาณในอวกาศ</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-emerald-300 font-bold">3. สถานีภาคพื้นดิน</div>
                <div className="text-slate-300 text-[10px] mt-1">ส่งต่อไปยัง Google Apps Script Sheet API</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-emerald-300 font-bold">4. เว็บแอปพลิเคชัน</div>
                <div className="text-slate-300 text-[10px] mt-1">แสดงผลแผนที่ GISTDA, สถิติ, และส่งออก CSV</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dashboard',
      title: '2. การใช้งานแดชบอร์ดและตัวชี้วัด (Dashboard & KPIs)',
      icon: Activity,
      tag: 'แดชบอร์ด',
      summary: 'วิธีอ่านการ์ดตัวชี้วัด 4 ใบ แผนที่จำลอง และตารางประวัติย้อนหลัง',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <strong className="text-emerald-900 block font-bold mb-1">
                📌 รหัสติดตาม KKOZ01 (ตัวหลัก):
              </strong>
              <span>
                แสดงรหัสประจำตัวนกกาฮังเป้าหมายหลัก พร้อมนับจำนวนจุดพิกัดทั้งหมดที่มีการบันทึกในระบบ
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200">
              <strong className="text-sky-900 block font-bold mb-1">
                📍 ตำแหน่งล่าสุด (Location):
              </strong>
              <span>
                พิกัดละติจูด (N) และลองจิจูด (E) พร้อมชื่อเขตพื้นที่ อำเภอ จังหวัด ที่ตรวจพบล่าสุด
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <strong className="text-amber-900 block font-bold mb-1">
                🔋 ระดับแบตเตอรี่ (Battery %):
              </strong>
              <span>
                ประเมินพลังงานคงเหลือของอุปกรณ์ หากต่ำกว่า 30% ควรเฝ้าระวังการชาร์จจากแสงอาทิตย์
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
              <strong className="text-rose-900 block font-bold mb-1">
                🌡️ อุณหภูมิอุปกรณ์ (°C):
              </strong>
              <span>
                ตรวจวัดอุณหภูมิเซนเซอร์ บ่งบอกสภาวะแวดล้อม เช่น ป่าทึบ หรือที่โล่งแจ้งกลางแดด
              </span>
            </div>
          </div>

          <div className="pt-2">
            <strong className="text-slate-900 block font-bold mb-1">
              ฟังก์ชันบนแผนที่:
            </strong>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li><strong>เล่นเส้นทางบิน (Flight Path Replay):</strong> แสดงแอนิเมชันจำลองการบินย้อนหลังตามลำดับเวลา</li>
              <li><strong>ชี้ตำแหน่งล่าสุด:</strong> เลื่อนตำแหน่งแผนที่และซูมกลับมาที่จุดพิกัดปัจจุบันของนกทันที</li>
              <li><strong>คลิกจุดบนตาราง:</strong> เลือกดูข้อมูลพิกัดในอดีต แผนที่จะแพนไปยังจุดนั้นโดยอัตโนมัติ</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'map_layers',
      title: '3. ชั้นข้อมูลแผนที่ดาวเทียม GISTDA (Map Layers)',
      icon: Layers,
      tag: 'แผนที่',
      summary: 'รายละเอียด 4 ชั้นข้อมูลแผนที่ และการตั้งค่าแผนที่ GISTDA Basemap',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            ระบบได้ติดตั้ง <strong>GISTDA Basemap API</strong> เป็นชั้นข้อมูลเริ่มต้น (Default Layer) พร้อมรองรับอีก 3 ชั้นข้อมูลสากล:
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-emerald-950 font-bold">1. แผนที่ดาวเทียม GISTDA (ค่าเริ่มต้น)</strong>
                <p className="text-xs text-emerald-900 mt-0.5">
                  ภาพถ่ายดาวเทียมความละเอียดสูงจากคลังข้อมูลภูมิสารสนเทศของ GISTDA อัปเดตล่าสุด คมชัด และตรงตามพิกัดประเทศไทย
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 font-bold">2. ภาพถ่ายดาวเทียม (Esri World Imagery)</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  ภาพถ่ายดาวเทียมระดับสากล เหมาะสำหรับดูภาพรวมระดับภูมิภาค
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 font-bold">3. OpenStreetMap (มาตรฐาน)</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  แผนที่ลายเส้นถนน ทางหลวง และชื่อสถานที่/หมู่บ้าน
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 font-bold">4. แผนที่ภูมิประเทศ (OpenTopoMap)</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  แสดงเส้นชั้นความสูง (Elevation Contours) ยอดเขา และแนวสันเขาชัน
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'export_filter',
      title: '4. การค้นหา กรองข้อมูล และส่งออกไฟล์ (Search & Export)',
      icon: Download,
      tag: 'ส่งออกข้อมูล',
      summary: 'การดาวน์โหลดข้อมูล CSV/JSON และการกรองตามช่วงวันที่',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <ul className="list-disc list-inside space-y-2 text-slate-700 pl-1">
            <li>
              <strong>ตัวกรองช่วงเวลา:</strong> สามารถคลิกปุ่ม <em>"5 วันล่าสุด"</em>, <em>"วันล่าสุด"</em> หรือเลือกเฉพาะวันที่จาก Dropdown เพื่อจำกัดจำนวนจุดที่แสดงบนแผนที่และตาราง
            </li>
            <li>
              <strong>ช่องค้นหา:</strong> พิมพ์ค้นหาตามพิกัด ละติจูด ลองจิจูด หรือชื่อตำบล/อำเภอ/จังหวัด ระบบจะกรองตารางทันทีแบบ Real-time
            </li>
            <li>
              <strong>การส่งออกไฟล์ CSV:</strong> กดปุ่ม <em>"ดาวน์โหลด CSV"</em> ที่แถบด้านบน หรือปุ่ม <em>"CSV"</em> ในหัวตาราง ข้อมูลจะถูกบันทึกเป็นไฟล์ `.csv` พร้อมเปิดใน Excel หรือโปรแกรม GIS
            </li>
            <li>
              <strong>การส่งออกไฟล์ JSON:</strong> กดปุ่ม <em>"JSON"</em> ที่หัวตาราง เหมาะสำหรับนักพัฒนาซอฟต์แวร์หรือการเชื่อมต่อระบบ API
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'satellite_radar',
      title: '5. แผนที่ดาวเทียม SatMap & เรดาร์สถานีแจ้ซ้อน',
      icon: Satellite,
      tag: 'ดาวเทียม',
      summary: 'การติดตามดาวเทียม Globalstar 28 ดวง และตารางรอบโคจรผ่านไทย',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            ในแท็บ <strong>"ดาวเทียม SatMap Space"</strong> มีเครื่องมือคำนวณวงโคจรดาวเทียมแบบเรียลไทม์:
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>สถานีสังเกตการณ์อุทยานแห่งชาติแจ้ซ้อน จ.ลำปาง</span>
            </div>
            <p className="text-xs text-slate-600">
              พิกัด: 18.8350°N, 99.4715°E (ความสูง ~450 ม.) ระบบวาดวงกลมรัศมีตรวจจับสัญญาณ 2,000 กม. พร้อมแสดงตำแหน่งดาวเทียม Globalstar ทั้ง 28 ดวงที่กำลังโคจรผ่านน่านฟ้าไทย
            </p>
            <p className="text-xs text-slate-600">
              <strong>ตารางรอบวงโคจร:</strong> สามารถดูรอบเวลา (Passes) ที่ดาวเทียมจะโคจรผ่านในแต่ละช่วง 6 ชั่วโมง พร้อมค่ามุมเงยสูงสุด (Peak Elevation)
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'troubleshooting',
      title: '6. การแก้ไขปัญหาเบื้องต้น (FAQs & Troubleshooting)',
      icon: HelpCircle,
      tag: 'ช่วยเหลือ',
      summary: 'วิธีแก้ปัญหาหน้าเว็บไม่เปลี่ยน และการเชื่อมต่ออินเทอร์เน็ต',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-bold mb-0.5">
                Q: ทำไมเปิดหน้าเว็บแล้วยังเห็นหน้าจอหรือเมนูเดิม?
              </strong>
              <p className="text-xs text-slate-600">
                A: เบราว์เซอร์อาจจำแคชเดิม ให้กดปุ่ม <strong>Hard Refresh</strong> (<kbd className="bg-white px-1.5 py-0.5 border rounded text-[11px]">Ctrl</kbd> + <kbd className="bg-white px-1.5 py-0.5 border rounded text-[11px]">F5</kbd> บน Windows หรือ <kbd className="bg-white px-1.5 py-0.5 border rounded text-[11px]">Cmd</kbd> + <kbd className="bg-white px-1.5 py-0.5 border rounded text-[11px]">Shift</kbd> + <kbd className="bg-white px-1.5 py-0.5 border rounded text-[11px]">R</kbd> บน Mac)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-bold mb-0.5">
                Q: เครื่องส่งสัญญาณส่งข้อมูลบ่อยแค่ไหน?
              </strong>
              <p className="text-xs text-slate-600">
                A: อุปกรณ์ SPOT ได้รับการตั้งโปรแกรมส่งสัญญาณพิกัดตามรอบเวลาที่กำหนด (เช่น ทุก 1-2 ชม.) เพื่อบริหารจัดการพลังงานแบตเตอรี่จากแผงโซลาร์เซลล์ให้ทำงานได้ยาวนานที่สุด
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>เอกสารคู่มือการใช้งานระบบฉบับสมบูรณ์</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            คู่มือการใช้งานระบบ HORNBILL TRACKING
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            คำแนะนำขั้นตอนการใช้งานระบบติดตามนกกกและนกกาฮังผ่านดาวเทียมแบบเรียลไทม์ การวิเคราะห์ข้อมูลพิกัด การใช้แผนที่ GISTDA และการส่งออกข้อมูลสำหรับงานอนุรักษ์
          </p>
        </div>
      </div>

      {/* Quick Navigation Accordion List */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections[section.id] ?? false;

          return (
            <div
              key={section.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                        {section.title}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 hidden sm:inline-block">
                        {section.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {section.summary}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 text-slate-400 p-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-white">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
