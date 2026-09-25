# 🦤 HORNBILL TRACKING - ระบบติดตามนกกกและนกหายากแบบเรียลไทม์

ระบบติดตามพิกัด GPS, สัญญาณอุปกรณ์ และช่วงเวลาการพบเห็นของนกกก (Great Hornbill - *Buceros bicornis*) แบบเรียลไทม์ โดยดึงข้อมูลอัตโนมัติจาก Google Apps Script API พร้อมแผนที่ระบุพิกัดดาวเทียม เส้นทางการบิน และประวัติย้อนหลัง

![Hornbill Tracking Preview](./src/assets/images/forest_mountains_bg_1790326339362.jpg)

---

## 📌 คุณสมบัติเด่น (Features)
- 🛰️ **ดึงข้อมูลพิกัด GPS สดอัตโนมัติ**: เชื่อมต่อ Google Apps Script API แบบเรียลไทม์
- 🗺️ **แผนที่จำลองการบินแบบ Interactive (Leaflet Map)**:
  - รองรับ 3 เลเยอร์: OpenStreetMap (มาตรฐาน), Esri World Imagery (ภาพถ่ายดาวเทียม), OpenTopoMap (ภูมิประเทศเทือกเขา)
  - เส้นทางการบินจำลองเชื่อมโยงทุกจุดพิกัด (Trajectory Flight Path)
  - ไอคอนระบุตำแหน่งล่าสุดพร้อม Radar Pulse Ring
  - ฟังก์ชัน **"เล่นเส้นทางบิน" (Flight Path Replay)** จำลองการเดินทางย้อนหลัง
- ⚡ **แดชบอร์ดสรุปสถิติ (KPI Metrics)**:
  - รหัสติดตามอุปกรณ์ (Asset ID เช่น `KKOZ01`)
  - ตำแหน่งล่าสุด (ละติจูด, ลองจิจูด, เขตพื้นที่)
  - ระดับแบตเตอรี่ของเครื่องติดตาม (%)
  - อุณหภูมิอุปกรณ์ (°C) และความเร็ว
- 📜 **ตารางบันทึกประวัติ (Telemetry History Table)**:
  - ค้นหาพิกัดและพื้นที่ได้ทันที
  - คลิกเพื่อ Zoom ไปยังจุดนั้นบนแผนที่
  - ส่งออกข้อมูลเป็น **CSV** หรือ **JSON**
- 🔄 **Auto-Refresh & Manual Sync**: อัปเดตข้อมูลอัตโนมัติพร้อมเวลานับถอยหลัง
- 🏞️ **โหมดสลับพิกัดจำลอง**: สลับดูข้อมูลจริงจาก API หรือข้อมูลพิกัดไทย (อช.แจ้ซ้อน - ดอยขุนตาล จ.ลำปาง)

---

## 🚀 วิธีนำโปรเจกต์นี้ขึ้น GitHub (How to Push to GitHub)

### 1. สร้าง Repository ใหม่บน GitHub
1. เข้าไปที่ [GitHub](https://github.com) แล้วกด **New repository**
2. ตั้งชื่อ เช่น `hornbill-tracking`
3. เลือก **Public** (หรือ Private) แล้วกด **Create repository**

### 2. นำโค้ดขึ้น GitHub ผ่าน Terminal / Git
เปิด Terminal ในโฟลเดอร์นี้ แล้วพิมพ์คำสั่งดังนี้:

```bash
# 1. กำหนดให้เป็น Git repository
git init

# 2. เพิ่มไฟล์ทั้งหมด
git add .

# 3. Commit การเปลี่ยนแปลง
git commit -m "feat: hornbill tracking real-time dashboard"

# 4. เปลี่ยนชื่อ branch เป็น main
git branch -M main

# 5. เชื่อมต่อกับ GitHub Repo ของคุณ (เปลี่ยน URL เป็นของคุณ)
git remote add origin https://github.com/YOUR_USERNAME/hornbill-tracking.git

# 6. Push โค้ดขึ้น GitHub
git push -u origin main
```

---

## 🌐 การเปิดใช้งานเว็บฟรีบน GitHub Pages (Deploy to GitHub Pages)
โปรเจกต์นี้ได้ตั้งค่า **GitHub Actions Workflow** ไว้ที่ `.github/workflows/deploy.yml` เรียบร้อยแล้ว:

1. บนหน้า GitHub Repository ของคุณ ไปที่แท็บ **Settings** > **Pages**
2. ในหัวข้อ **Build and deployment** > **Source**: ให้เลือก **GitHub Actions**
3. เมื่อคุณ `git push` โค้ดขึ้นไป ระบบจะทำการ Build และเปิดหน้าเว็บให้คุณอัตโนมัติ!
4. URL เว็บของคุณจะเป็น: `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/`

---

## 💻 การรันโปรเจกต์บนเครื่องของคุณ (Local Development)

```bash
# ติดตั้ง dependencies
npm install

# รัน Development Server (Vite)
npm run dev

# เข้าใช้งานที่
http://localhost:3000
```

---

## 🔗 ข้อมูล API
- **Endpoint**: `https://script.google.com/macros/s/AKfycbwZPgebby-VcBqA_y089FfcuzT-RuAwqeaMEUDx4X6uKLT5SvZ4yKVXbXSK-TZaQZaljg/exec`
- **Response Format**: JSON (`{ success: true, latest: {...}, records: [...] }`)

---

*เทคโนโลยีเพื่อการอนุรักษ์ สู่อนาคตที่ยั่งยืน 🌿*
