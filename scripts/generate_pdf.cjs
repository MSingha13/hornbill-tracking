const fs = require('fs');
const path = require('path');

// Convert an image file to Base64 data URL
function toBase64(filePath, mimeType) {
  const fileData = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${fileData.toString('base64')}`;
}

const gistdaLogo = toBase64(path.join(__dirname, '../src/assets/images/gistda_logo.png'), 'image/png');
const bsrcLogo = toBase64(path.join(__dirname, '../src/assets/images/bsrc_logo.png'), 'image/png');
const khaoKheowLogo = toBase64(path.join(__dirname, '../src/assets/images/khao_kheow_logo.png'), 'image/png');
const hornbillPortrait = toBase64(path.join(__dirname, '../src/assets/images/hornbill_branch_openbeak_1790837302278.jpg'), 'image/jpeg');
const hornbillFlight = toBase64(path.join(__dirname, '../src/assets/images/hornbill_flight_canopy_1790564582357.jpg'), 'image/jpeg');
const hornbillCasque = toBase64(path.join(__dirname, '../src/assets/images/hornbill_casque_closeup_1790564593257.jpg'), 'image/jpeg');
const hornbillPerch = toBase64(path.join(__dirname, '../src/assets/images/hornbill_wild_canopy_1791190326897.jpg'), 'image/jpeg');

const htmlContent = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>คู่มือการใช้งานระบบ HORNBILL TRACKING</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800;900&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
      @bottom-right {
        content: counter(page);
      }
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    body {
      font-family: 'Prompt', -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 0;
      color: #1e293b;
      background: #ffffff;
      font-size: 11pt;
      line-height: 1.6;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    .avoid-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Cover Page */
    .cover {
      background: linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%);
      color: #ffffff;
      padding: 30px;
      border-radius: 20px;
      margin-bottom: 25px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }

    .partner-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.96);
      padding: 8px 16px;
      border-radius: 14px;
      margin-bottom: 25px;
    }

    .partner-bar img {
      height: 32px;
      object-fit: contain;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 900;
      line-height: 1.15;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .cover-sub {
      font-size: 13pt;
      color: #6ee7b7;
      font-weight: 600;
      margin: 0 0 10px 0;
    }

    .cover-tagline {
      font-size: 11pt;
      font-style: italic;
      color: #cbd5e1;
      margin-bottom: 20px;
    }

    .cover-hero-img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 14px;
      border: 3px solid rgba(110, 231, 183, 0.5);
    }

    /* Sections */
    .section-title {
      font-size: 14pt;
      font-weight: 800;
      color: #064e3b;
      border-bottom: 2px solid #10b981;
      padding-bottom: 6px;
      margin-top: 25px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-num {
      background: #10b981;
      color: white;
      width: 26px;
      height: 26px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11pt;
      font-weight: bold;
    }

    /* Grid cards */
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 15px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 15px;
    }

    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 14px;
    }

    .card-title {
      font-size: 9pt;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .card-val {
      font-size: 14pt;
      font-weight: 800;
      color: #0f172a;
    }

    .card-sub {
      font-size: 8.5pt;
      color: #059669;
      font-weight: 600;
      margin-top: 2px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 9.5pt;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }

    th {
      background: #ecfdf5;
      color: #065f46;
      font-weight: 700;
    }

    .gallery-img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
    }

    .gallery-caption {
      font-size: 9pt;
      font-weight: 600;
      color: #1e293b;
      margin-top: 6px;
    }

    .gallery-desc {
      font-size: 8pt;
      color: #64748b;
    }

    .highlight-box {
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 12px 16px;
      border-radius: 0 10px 10px 0;
      margin: 14px 0;
      font-size: 10pt;
    }

    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover avoid-break">
    <div class="partner-bar">
      <img src="${gistdaLogo}" alt="GISTDA" />
      <img src="${bsrcLogo}" alt="BSRC" />
      <img src="${khaoKheowLogo}" alt="Khao Kheow Zoo" />
    </div>

    <div class="cover-title">HORNBILL TRACKING</div>
    <div class="cover-sub">คู่มือการใช้งานระบบติดตามนกกกและนกกาฮังผ่านดาวเทียมแบบเรียลไทม์</div>
    <div class="cover-tagline">“เทคโนโลยีเพื่อการอนุรักษ์ สู่อนาคตที่ยั่งยืน”</div>

    <img src="${hornbillPortrait}" class="cover-hero-img" alt="นกกาฮัง KKOZ01" />

    <div style="margin-top: 15px; font-size: 9.5pt; color: #a7f3d0; display: flex; justify-content: space-between;">
      <span>รหัสเป้าหมายหลัก: <strong>KKOZ01</strong> (นกกาฮัง เขาเขียว)</span>
      <span>เครือข่ายดาวเทียม: <strong>Globalstar LEO (28 ดวง)</strong></span>
      <span>แผนที่หลัก: <strong>Google Maps (Satellite Hybrid)</strong></span>
    </div>
  </div>

  <!-- Section 1 -->
  <div class="avoid-break">
    <div class="section-title">
      <span class="section-num">1</span>
      สถาปัตยกรรมระบบและการรับส่งสัญญาณดาวเทียม (Telemetry Architecture)
    </div>
    <p>ระบบทำการเชื่อมโยงข้อมูลจากเครื่องส่งสัญญาณ GPS สู่เซิร์ฟเวอร์แบบเรียลไทม์ ผ่าน 4 กลไกหลัก:</p>

    <div class="grid-4">
      <div class="card">
        <div class="card-title">1. อุปกรณ์บนตัวนก</div>
        <div style="font-size: 9.5pt; font-weight: bold; color: #065f46;">SPOT Gen4 Tracker</div>
        <div style="font-size: 8.5pt; color: #475569; margin-top: 4px;">ติดตั้งบนหลังนกกาฮัง KKOZ01 พร้อมโซลาร์เซลล์ชาร์จไฟ ส่งคลื่น L-band (1610-1620 MHz)</div>
      </div>
      <div class="card">
        <div class="card-title">2. ดาวเทียมอวกาศ</div>
        <div style="font-size: 9.5pt; font-weight: bold; color: #0369a1;">Globalstar LEO</div>
        <div style="font-size: 8.5pt; color: #475569; margin-top: 4px;">กลุ่มดาวเทียมวงโคจรต่ำ 28 ดวง รับสัญญาณเหนือท้องฟ้าไทยตลอด 24 ชั่วโมง</div>
      </div>
      <div class="card">
        <div class="card-title">3. สถานีภาคพื้นดิน</div>
        <div style="font-size: 9.5pt; font-weight: bold; color: #4338ca;">Apps Script Gateway</div>
        <div style="font-size: 8.5pt; color: #475569; margin-top: 4px;">ถอดรหัสพิกัด บันทึกลง Google Sheets Database และเปิด REST JSON API</div>
      </div>
      <div class="card">
        <div class="card-title">4. เว็บแอปพลิเคชัน</div>
        <div style="font-size: 9.5pt; font-weight: bold; color: #7e22ce;">GISTDA Tracking Web</div>
        <div style="font-size: 8.5pt; color: #475569; margin-top: 4px;">แสดงผลบนแผนที่ดาวเทียม GISTDA, วิเคราะห์เส้นทางบินย้อนหลัง และส่งออก CSV</div>
      </div>
    </div>
  </div>

  <!-- Section 2 -->
  <div class="avoid-break">
    <div class="section-title">
      <span class="section-num">2</span>
      การใช้งานแดชบอร์ดและการอ่านค่าตัวชี้วัดความปลอดภัย (Dashboard & KPIs)
    </div>
    <p>หน้าแดชบอร์ดสรุปสถิติล่าสุดของการติดตามนกกาฮัง KKOZ01 ผ่านการ์ดตัวชี้วัด 4 ใบ:</p>

    <div class="grid-4">
      <div class="card">
        <div class="card-title">รหัสติดตาม</div>
        <div class="card-val">KKOZ01</div>
        <div class="card-sub">นกกาฮังตัวหลัก</div>
      </div>
      <div class="card">
        <div class="card-title">ตำแหน่งล่าสุด</div>
        <div style="font-size: 11pt; font-weight: 800; color: #0f172a;">13.2141° N, 101.0685° E</div>
        <div style="font-size: 8.5pt; color: #64748b;">เขาเขียว จ.ชลบุรี</div>
      </div>
      <div class="card">
        <div class="card-title">ระดับแบตเตอรี่</div>
        <div class="card-val" style="color: #059669;">100%</div>
        <div class="card-sub">ชาร์จพลังงานแสงอาทิตย์</div>
      </div>
      <div class="card">
        <div class="card-title">อุณหภูมิเซนเซอร์</div>
        <div class="card-val" style="color: #d97706;">29.5 °C</div>
        <div class="card-sub">สภาวะปกติในร่มไม้</div>
      </div>
    </div>

    <div class="highlight-box">
      <strong>เกณฑ์การประเมินความปลอดภัย:</strong>
      <ul>
        <li><strong>แบตเตอรี่:</strong> หากลดลงต่ำกว่า 30% ติดต่อกัน ควรตรวจสอบว่าแผงโซลาร์เซลล์ถูกกิ่งไม้บดบังหรือไม่</li>
        <li><strong>อุณหภูมิ:</strong> หากเกิน 45°C นกอาจอยู่กลางแดดจัด หากต่ำกว่า 15°C นกอาจอยู่ยอดดอยสูงช่วงกลางคืน</li>
        <li><strong>พิกัดคงที่:</strong> หากพิกัดไม่ขยับเกิน 48 ชม. ควรส่งเจ้าหน้าที่ภาคสนามเข้าสำรวจตรวจสอบทันที</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- Section 3 -->
  <div class="avoid-break">
    <div class="section-title">
      <span class="section-num">3</span>
      แผนที่ติดตามการบินและชั้นข้อมูลดาวเทียม GISTDA (Map & GISTDA Basemap)
    </div>
    <p>แผนที่ Interactive Leaflet ออกแบบมาเพื่อแสดงพิกัดที่แม่นยำสูง โดยตั้งค่า <strong>แผนที่ดาวเทียม GISTDA</strong> เป็นชั้นข้อมูลเริ่มต้น:</p>

    <table>
      <thead>
        <tr>
          <th>ชั้นข้อมูลแผนที่ (Layer)</th>
          <th>แหล่งข้อมูล</th>
          <th>ขนาด Tile</th>
          <th>การใช้งานที่เหมาะสม</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background: #f0fdf4;">
          <td><strong>1. Google Maps - Satellite Hybrid (ค่าเริ่มต้น)</strong></td>
          <td>Google Maps</td>
          <td>256 × 256</td>
          <td>ภาพถ่ายดาวเทียมความละเอียดสูงพร้อมชื่อสถานที่ ถนน และขอบเขตภูมิศาสตร์คมชัด</td>
        </tr>
        <tr>
          <td><strong>2. แผนที่ดาวเทียม GISTDA</strong></td>
          <td>GISTDA API Gateway</td>
          <td>512 × 512</td>
          <td>ภาพถ่ายดาวเทียมความละเอียดสูงของไทย อัปเดตล่าสุด คมชัดและตรงตามพิกัดจริง</td>
        </tr>
        <tr>
          <td><strong>3. ภาพถ่ายดาวเทียม (Esri Satellite)</strong></td>
          <td>Esri World Imagery</td>
          <td>256 × 256</td>
          <td>ภาพถ่ายดาวเทียมสากล เหมาะสำหรับดูแนวเขตผืนป่าระดับภูมิภาค</td>
        </tr>
        <tr>
          <td><strong>4. OpenStreetMap (มาตรฐาน)</strong></td>
          <td>OSM Community</td>
          <td>256 × 256</td>
          <td>แผนที่ถนน ทางหลวง และขอบเขตการปกครอง/ชื่อหมู่บ้าน</td>
        </tr>
        <tr>
          <td><strong>5. OpenTopoMap (ภูมิประเทศ)</strong></td>
          <td>OpenTopoMap / SRTM</td>
          <td>256 × 256</td>
          <td>เส้นชั้นความสูง (Contours) ยอดดอย แนวสันเขา และลำห้วย</td>
        </tr>
      </tbody>
    </table>

    <div class="grid-2">
      <div class="card">
        <strong>ฟังก์ชันการควบคุมบนแผนที่:</strong>
        <ul style="margin: 6px 0; padding-left: 20px; font-size: 9pt;">
          <li><strong>เล่นเส้นทางบิน (Replay):</strong> จำลองการบินย้อนหลังตามลำดับเวลาในอดีตสู่จุดปัจจุบัน</li>
          <li><strong>ชี้ตำแหน่งล่าสุด:</strong> เลื่อนแผนที่และซูมกลับมาที่จุดพิกัดปัจจุบันของนกทันที</li>
          <li><strong>สลับชั้นข้อมูล (แผนที่ ▾):</strong> สลับดูภาพดาวเทียมหรือเส้นชั้นความสูงได้อิสระ</li>
        </ul>
      </div>
      <div class="card">
        <strong>การค้นหาและส่งออกข้อมูล (Export):</strong>
        <ul style="margin: 6px 0; padding-left: 20px; font-size: 9pt;">
          <li><strong>กรองช่วงวันที่:</strong> 5 วันล่าสุด, วันล่าสุด, หรือเลือกดูเฉพาะวัน</li>
          <li><strong>ส่งออกเป็น CSV:</strong> นำข้อมูลไปวิเคราะห์ต่อใน Microsoft Excel หรือโปรแกรม GIS</li>
          <li><strong>ส่งออกเป็น JSON:</strong> เหมาะสำหรับนักพัฒนาเชื่อมโยงฐานข้อมูล</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Section 4 -->
  <div class="avoid-break">
    <div class="section-title">
      <span class="section-num">4</span>
      เรดาร์สถานีแจ้ซ้อนและวงโคจรดาวเทียม Globalstar (Satellite Radar & Orbit)
    </div>
    <p>ระบบติดตามสัญญาณดาวเทียม Globalstar ทั้ง 28 ดวงที่โคจรผ่านประเทศไทย โดยอ้างอิงสถานีสังเกตการณ์ภาคเหนือ:</p>

    <div class="card" style="background: #0f172a; color: white; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px;">
        <span style="color: #34d399; font-weight: bold;">📍 สถานีสังเกตการณ์: อุทยานแห่งชาติแจ้ซ้อน จ.ลำปาง</span>
        <span style="font-family: monospace; color: #94a3b8;">18.8350° N, 99.4715° E</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 9pt;">
        <div>รัศมีตรวจจับเรดาร์: <strong style="color: #6ee7b7;">2,000 กิโลเมตร</strong></div>
        <div>แบบจำลองวงโคจร: <strong style="color: #6ee7b7;">SGP4 & TLE ล่าสุด</strong></div>
        <div>กลุ่มดาวเทียม: <strong style="color: #6ee7b7;">Globalstar LEO (28 ดวง)</strong></div>
      </div>
    </div>
    <p style="font-size: 9.5pt; color: #475569;">
      ในแท็บ <strong>"ดาวเทียม SatMap Space"</strong> จะแสดงการคำนวณตำแหน่งจริงของดาวเทียมแต่ละดวงเหนือน่านฟ้าไทย พร้อมตารางรอบเวลาที่ดาวเทียมจะโคจรผ่าน (Pass Times) ราย 6 ชั่วโมง เพื่อประเมินช่วงเวลาที่การรับส่งข้อมูลมีความแรงสัญญาณสูงสุด
    </p>
  </div>

  <div class="page-break"></div>

  <!-- Section 5 -->
  <div class="avoid-break">
    <div class="section-title">
      <span class="section-num">5</span>
      ภาพประกอบธรรมชาติและชีววิทยานกกาฮัง (Great Hornbill Illustrated Gallery)
    </div>
    <p>ภาพถ่ายธรรมชาติประกอบการศึกษาพฤติกรรม ชีววิทยา และการปล่อยนกกาฮังคืนสู่ป่า:</p>

    <div class="grid-2">
      <div>
        <img src="${hornbillPerch}" class="gallery-img" alt="เกาะเรือนยอดไม้" />
        <div class="gallery-caption">1. การเกาะพักบนเรือนยอดไม้ธรรมชาติ</div>
        <div class="gallery-desc">พฤติกรรมเกาะสังเกตการณ์บนกิ่งไม้ใหญ่ในป่าดงดิบเพื่อหาผลไม้สุกและระวังภัย</div>
      </div>

      <div>
        <img src="${hornbillFlight}" class="gallery-img" alt="บินสยายปีก" />
        <div class="gallery-caption">2. การบินสยายปีกสำรวจแนวเทือกเขา</div>
        <div class="gallery-desc">ช่วงปีกกว้างกว่า 1.5 เมตร ช่วยให้บินข้ามหุบเขาและทำหน้าที่กระจายเมล็ดพันธุ์ไม้ป่า</div>
      </div>

      <div>
        <img src="${hornbillCasque}" class="gallery-img" alt="โหนก Casque" />
        <div class="gallery-caption">3. โหนกและจะงอยปากสีเหลืองทอง (Casque)</div>
        <div class="gallery-desc">เอกลักษณ์เฉพาะของนกกาฮัง โหนกหนาช่วยสะท้อนเสียงร้องดังก้องหุบเขา</div>
      </div>

      <div>
        <img src="${hornbillPortrait}" class="gallery-img" alt="พอร์ตเทรตนกกาฮัง" />
        <div class="gallery-caption">4. ราชานกเงือก สัตว์สัญลักษณ์แห่งพงไพร</div>
        <div class="gallery-desc">ตัวแทนความสมบูรณ์ของระบบนิเวศป่าดงดิบและความร่วมมือด้านการอนุรักษ์</div>
      </div>
    </div>
  </div>

  <!-- Section 6: ข้อจำกัดในการใช้งานอุปกรณ์ติดตามนกกาฮัง -->
  <div class="avoid-break">
    <div class="section-title">
      <span class="section-num">6</span>
      ข้อจำกัดในการใช้งานอุปกรณ์ติดตามนกกาฮัง (Device Limitations)
    </div>
    <p style="font-size: 9.5pt; color: #475569; margin-bottom: 10px;">
      เพื่อให้การวิเคราะห์ข้อมูลพิกัด การประเมินสุขภาพ และการเฝ้าระวังทางชีววิทยาเป็นไปอย่างถูกต้อง โปรดทำความเข้าใจข้อจำกัดทางเทคนิคและสภาวะแวดล้อมดังนี้:
    </p>

    <div class="grid-2">
      <div class="card" style="border-left: 3px solid #f59e0b;">
        <strong style="color: #92400e; font-size: 9.5pt;">1. ข้อจำกัดด้านการรับสัญญาณ GNSS/GPS</strong>
        <p style="font-size: 8.5pt; color: #475569; margin: 4px 0 0 0;">
          พื้นที่ป่าทึบ เรือนยอดไม้หนาแน่น และหุบเขา อาจบดบังสัญญาณจากดาวเทียม ทำให้อุปกรณ์ไม่สามารถระบุตำแหน่งได้อย่างต่อเนื่อง ส่งผลให้จำนวนพิกัดที่บันทึกได้ลดลง
        </p>
      </div>

      <div class="card" style="border-left: 3px solid #f59e0b;">
        <strong style="color: #92400e; font-size: 9.5pt;">2. ข้อจำกัดจากสัญญาณรบกวน GPS Jamming</strong>
        <p style="font-size: 8.5pt; color: #475569; margin: 4px 0 0 0;">
          สัญญาณรบกวนคลื่นความถี่วิทยุที่ส่งผลต่อระบบ GNSS อาจทำให้เครื่องรับไม่สามารถรับสัญญาณดาวเทียมเพื่อคำนวณตำแหน่งได้ หรือทำให้การระบุตำแหน่งขาดช่วง ทั้งนี้ การไม่พบพิกัดเพียงอย่างเดียวยังไม่สามารถยืนยันได้ว่าเกิด GPS Jamming
        </p>
      </div>

      <div class="card" style="border-left: 3px solid #f59e0b;">
        <strong style="color: #92400e; font-size: 9.5pt;">3. ข้อจำกัดด้านการส่งข้อมูลผ่านดาวเทียม Globalstar</strong>
        <p style="font-size: 8.5pt; color: #475569; margin: 4px 0 0 0;">
          แม้อุปกรณ์จะสามารถระบุตำแหน่ง GNSS ได้แล้ว แต่ข้อมูลอาจไม่สามารถส่งขึ้นไปยังดาวเทียม Globalstar ได้สำเร็จ เนื่องจากสิ่งบดบังท้องฟ้า ภูมิประเทศ สัญญาณรบกวนในย่านความถี่ขาขึ้น (Uplink Interference) หรือสภาพแวดล้อมที่ไม่เหมาะสม ส่งผลให้ข้อมูลตำแหน่งไม่ปรากฏในระบบติดตามตามเวลาที่กำหนด
        </p>
      </div>

      <div class="card" style="border-left: 3px solid #f59e0b;">
        <strong style="color: #92400e; font-size: 9.5pt;">4. ข้อจำกัดด้านความถี่ในการส่งข้อมูล</strong>
        <p style="font-size: 8.5pt; color: #475569; margin: 4px 0 0 0;">
          การตั้งค่าให้รายงานตำแหน่งประมาณ 6 ครั้งต่อวัน หรือเฉลี่ยทุก 4 ชั่วโมง ไม่ได้รับประกันว่าจะได้รับข้อมูลครบทุกครั้ง เนื่องจากการรับพิกัดและการส่งข้อมูลผ่านดาวเทียมอาจไม่สำเร็จในบางช่วงเวลา
        </p>
      </div>

      <div class="card" style="border-left: 3px solid #f59e0b;">
        <strong style="color: #92400e; font-size: 9.5pt;">5. ข้อจำกัดด้านพลังงาน</strong>
        <p style="font-size: 8.5pt; color: #475569; margin: 4px 0 0 0;">
          ระยะเวลาการทำงานขึ้นอยู่กับความจุแบตเตอรี่และปริมาณแสงอาทิตย์ที่ได้รับ หากอุปกรณ์อยู่ใต้เรือนยอดไม้หนาแน่นหรือมีแสงแดดไม่เพียงพอ อาจทำให้การชาร์จพลังงานลดลงและระยะเวลาการทำงานสั้นกว่าที่คาดการณ์ไว้
        </p>
      </div>

      <div class="card" style="border-left: 3px solid #f59e0b;">
        <strong style="color: #92400e; font-size: 9.5pt;">6. ข้อจำกัดด้านสภาพอากาศและสิ่งแวดล้อม</strong>
        <p style="font-size: 8.5pt; color: #475569; margin: 4px 0 0 0;">
          ความชื้น ฝน และสภาพพื้นที่ที่มีสิ่งบดบังสัญญาณ อาจส่งผลต่อประสิทธิภาพการรับพิกัด GNSS การรับพลังงานแสงอาทิตย์ และการส่งข้อมูลผ่านดาวเทียม โดยขึ้นอยู่กับสภาพแวดล้อมและลักษณะการติดตั้ง
        </p>
      </div>
    </div>
  </div>

  <!-- Section 7 -->
  <div class="avoid-break">
    <div class="section-title">
      <span class="section-num">7</span>
      การแก้ไขปัญหาเบื้องต้นและคำถามที่พบบ่อย (Troubleshooting & FAQs)
    </div>
    
    <div class="card" style="margin-bottom: 8px;">
      <strong>Q1: เปิดหน้าเว็บแล้วยังเห็นหน้าจอหรือเมนูเดิม ไม่อัปเดต?</strong>
      <p style="font-size: 9pt; color: #475569; margin: 4px 0 0 0;">
        ตอบ: เบราว์เซอร์อาจจำแคชเดิม ให้กดปุ่ม <strong>Hard Refresh</strong> (<kbd>Ctrl</kbd> + <kbd>F5</kbd> บน Windows หรือ <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> บน Mac)
      </p>
    </div>

    <div class="card" style="margin-bottom: 8px;">
      <strong>Q2: แผนที่ดาวเทียม GISTDA แสดงผลช้าหรือไม่ขึ้น?</strong>
      <p style="font-size: 9pt; color: #475569; margin: 4px 0 0 0;">
        ตอบ: ตรวจสอบการเชื่อมต่อเครือข่ายอินเทอร์เน็ตว่าไฟร์วอลล์อนุญาตพอร์ต 443 ไปยัง <code>api-gateway.gistda.or.th</code> หรือสามารถสลับไปใช้ชั้นข้อมูล Esri Satellite ชั่วคราวได้
      </p>
    </div>

    <div class="card">
      <strong>Q3: ทำไมข้อมูลพิกัดไม่อัปเดตทุกนาที?</strong>
      <p style="font-size: 9pt; color: #475569; margin: 4px 0 0 0;">
        ตอบ: เครื่องส่งสัญญาณ SPOT ได้รับการตั้งโปรแกรมส่งข้อมูลตามรอบเวลา (เช่น ทุก 1-2 ชม.) เพื่อบริหารพลังงานแบตเตอรี่ให้สามารถติดตามนกในป่าได้ยาวนานต่อเนื่องหลายปี
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer avoid-break">
    <div>โครงการศึกษาวิจัยและติดตามการปล่อยนกกาฮังคืนสู่ธรรมชาติ (KKOZ01)</div>
    <div>ความร่วมมือ: GISTDA • BSRC • สวนสัตว์เปิดเขาเขียว</div>
  </div>

</body>
</html>`;

// Write HTML file to public/ and dist/
const publicDir = path.join(__dirname, '../public');
const distDir = path.join(__dirname, '../dist');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'user-manual.html'), htmlContent);
console.log('Successfully generated public/user-manual.html');

if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'user-manual.html'), htmlContent);
  console.log('Successfully copied to dist/user-manual.html');
}

// Generate PDF via Playwright if available
(async () => {
  try {
    const { chromium } = require('playwright');
    console.log('Launching Playwright Chromium to export PDF...');
    const browser = await chromium.launch({
      executablePath: '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    
    // Save to root, public, and dist
    const pdfPath = path.join(__dirname, '../hornbill-tracking-user-manual.pdf');
    const publicPdfPath = path.join(publicDir, 'hornbill-tracking-user-manual.pdf');
    
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        bottom: '12mm',
        left: '12mm',
        right: '12mm'
      }
    });
    console.log(`Successfully exported PDF to: ${pdfPath}`);

    fs.copyFileSync(pdfPath, publicPdfPath);
    console.log(`Copied PDF to: ${publicPdfPath}`);

    if (fs.existsSync(distDir)) {
      fs.copyFileSync(pdfPath, path.join(distDir, 'hornbill-tracking-user-manual.pdf'));
      console.log('Copied PDF to dist/hornbill-tracking-user-manual.pdf');
    }

    await browser.close();
    console.log('PDF export completed successfully!');
  } catch (err) {
    console.error('Playwright PDF generation note:', err.message);
  }
})();
