# ระบบแจ้งซ่อมบำรุง (Maintenance Request System)

> Prompt สำหรับสร้างระบบแจ้งซ่อมบำรุงมหาวิทยาลัย พร้อมแจ้งเตือนผ่าน LINE Notify

---

## Prompt 1: วางแผนโครงสร้างทั้งระบบ

```
สร้างระบบแจ้งซ่อมบำรุงสำหรับมหาวิทยาลัย ด้วย Laravel 11, MySQL, Blade + Bootstrapcss
พร้อมแจ้งเตือนผ่าน LINE Notify ทุกขั้นตอน

ข้อมูลที่ต้องจัดการ:
- อาคาร/สถานที่: ชื่ออาคาร, ชั้น, ห้อง
- งานแจ้งซ่อม: ผู้แจ้ง, สถานที่, ประเภทงาน (ไฟฟ้า/ประปา/แอร์/อาคาร/IT/อื่นๆ), รายละเอียด, รูปภาพ (หลายรูป), ระดับความเร่งด่วน (ปกติ/เร่งด่วน/ฉุกเฉิน), สถานะ
- สถานะงาน: แจ้งซ่อม → รับเรื่อง → กำลังดำเนินการ → เสร็จสิ้น / ไม่สามารถซ่อมได้
- ช่างซ่อม: ชื่อ, เบอร์โทร, ความเชี่ยวชาญ (ไฟฟ้า/ประปา/แอร์/IT), สถานะ (ว่าง/ไม่ว่าง)
- บันทึกการซ่อม: วันที่ซ่อม, ช่างที่ซ่อม, อะไหล่ที่ใช้, ค่าใช้จ่าย, รูปภาพหลังซ่อม, หมายเหตุ
- ผู้ใช้: บุคลากร (แจ้งซ่อม), หัวหน้าช่าง (รับเรื่อง/มอบหมายงาน), ช่าง (ดำเนินการ), ผู้บริหาร (ดูรายงาน)

ฟีเจอร์:
1. แจ้งซ่อมพร้อมอัปโหลดรูปภาพหลายรูป
2. หัวหน้าช่างรับเรื่อง + มอบหมายช่างตามประเภทงาน
3. ช่างอัปเดตสถานะ + บันทึกการซ่อม + รูปหลังซ่อม
4. แจ้งเตือนผ่าน LINE Notify ทุกครั้งที่สถานะเปลี่ยน
5. ผู้แจ้งให้คะแนนความพึงพอใจหลังซ่อมเสร็จ (1-5 ดาว)
6. Dashboard: งานค้าง, งานวันนี้, สถิติรายเดือน
7. รายงาน: ประเภทงานที่ซ่อมบ่อย, เวลาเฉลี่ยในการซ่อม, ค่าใช้จ่ายรายเดือน, คะแนนความพึงพอใจ
8. ค้นหา/กรอง: ตามสถานะ, ประเภท, อาคาร, ช่วงเวลา
9. Export รายงานเป็น PDF/Excel
10. Timeline แสดงประวัติการเปลี่ยนสถานะของแต่ละงาน

ให้สร้าง:
1. Migration: buildings, maintenance_requests, technicians, repair_logs, ratings
2. Models พร้อม Relationships, Scopes, Accessors
3. Controllers: MaintenanceRequestController, TechnicianController, RepairLogController, ReportController
4. Form Requests: StoreMaintenanceRequest, StoreRepairLog
5. Services: LineNotifyService
6. Blade Views: ฟอร์มแจ้งซ่อม, Dashboard, รายการงาน, บันทึกซ่อม, รายงาน
7. Middleware: CheckRole (admin/head_tech/technician/staff)
8. Routes: web.php แบ่งตาม Role
9. Seeders: อาคาร 10 หลัง, ช่าง 8 คน
```

---

## Prompt 2: LINE Notify Integration

```
สร้าง LineNotifyService class ใน Laravel สำหรับส่งแจ้งเตือนผ่าน LINE Notify API:

การตั้งค่า:
- สมัคร LINE Notify: https://notify-bot.line.me/
- สร้าง Token สำหรับกลุ่ม LINE ของทีมช่าง
- เก็บ Token ใน .env: LINE_NOTIFY_TOKEN
- รองรับหลาย Token (กลุ่มช่างไฟฟ้า, กลุ่มช่างประปา, กลุ่มผู้บริหาร)
- สร้าง config/line-notify.php

LineNotifyService methods:
1. send($message, $token = null): ส่งข้อความ
2. sendWithImage($message, $imagePath, $token = null): ส่งข้อความพร้อมรูป
3. sendSticker($message, $stickerPackageId, $stickerId, $token = null): ส่งพร้อม Sticker
4. notifyNewRequest($request): แจ้งงานซ่อมใหม่
5. notifyStatusChanged($request, $oldStatus, $newStatus): แจ้งสถานะเปลี่ยน
6. notifyAssigned($request, $technician): แจ้งช่างที่ได้รับมอบหมาย
7. notifyCompleted($request): แจ้งซ่อมเสร็จ

รูปแบบข้อความ:
- แจ้งซ่อมใหม่:
  "🔧 แจ้งซ่อมใหม่ #[ID]
  📍 สถานที่: [อาคาร] ชั้น [ชั้น] ห้อง [ห้อง]
  🔹 ประเภท: [ประเภท]
  ⚡ ความเร่งด่วน: [ระดับ]
  📝 รายละเอียด: [รายละเอียด]
  👤 ผู้แจ้ง: [ชื่อ]
  🔗 ดูรายละเอียด: [URL]"

- สถานะเปลี่ยน:
  "📋 อัปเดตงานซ่อม #[ID]
  📍 [สถานที่]
  🔄 สถานะ: [สถานะเดิม] → [สถานะใหม่]
  👷 ช่าง: [ชื่อช่าง]"

ให้สร้าง:
- app/Services/LineNotifyService.php
- config/line-notify.php
- ตัวอย่าง .env variables
- Error Handling: จัดการ token invalid, rate limit
- ใช้ Laravel HTTP Client
- Log ทุก notification ที่ส่ง
- Queue: ส่งผ่าน Job เพื่อไม่ให้ blocking
```

---

## Prompt 3: ระบบมอบหมายงานและติดตามสถานะ

```
สร้างระบบมอบหมายงานซ่อมและติดตามสถานะใน Laravel:

Workflow:
1. บุคลากรแจ้งซ่อม → สถานะ "แจ้งซ่อม" → LINE แจ้งกลุ่มช่าง
2. หัวหน้าช่างรับเรื่อง + มอบหมายช่างตามประเภทงาน → สถานะ "รับเรื่อง" → LINE แจ้งช่างที่ได้รับมอบหมาย
3. ช่างเริ่มดำเนินการ → สถานะ "กำลังดำเนินการ" → LINE แจ้งผู้แจ้ง
4. ช่างซ่อมเสร็จ + บันทึกรายละเอียด + รูปหลังซ่อม → สถานะ "เสร็จสิ้น" → LINE แจ้งผู้แจ้ง
5. ผู้แจ้งให้คะแนนความพึงพอใจ

ให้สร้าง:
- Migration: เพิ่ม status_logs table (เก็บประวัติการเปลี่ยนสถานะ + เวลา + ผู้เปลี่ยน)
- Model: StatusLog, methods changeStatus(), assignTechnician()
- Controller: methods assign(), startWork(), complete(), rate()
- Blade: หน้ามอบหมายงาน (เลือกช่างจาก dropdown กรองตามความเชี่ยวชาญ)
- Blade: Timeline แสดงประวัติสถานะ
- Blade: ฟอร์มให้คะแนน (1-5 ดาว)
- Observer: MaintenanceRequestObserver → เรียก LineNotifyService เมื่อสถานะเปลี่ยน
- Policy: ตรวจสิทธิ์ว่าใครเปลี่ยนสถานะอะไรได้
```

---

## Prompt 4: Dashboard และรายงาน

```
สร้าง Dashboard และรายงานสำหรับระบบแจ้งซ่อมบำรุง:

Dashboard (หน้าแรกหลัง Login):
- การ์ดสรุป: งานแจ้งใหม่วันนี้, งานค้าง, งานกำลังดำเนินการ, งานเสร็จเดือนนี้
- กราฟวงกลม: สัดส่วนงานตามประเภท (ไฟฟ้า/ประปา/แอร์/IT)
- กราฟแท่ง: จำนวนงานซ่อมรายเดือน (6 เดือนล่าสุด)
- ตารางงานเร่งด่วน/ฉุกเฉินที่ยังไม่เสร็จ
- คะแนนความพึงพอใจเฉลี่ย
- ใช้ Chart.js

รายงาน:
1. รายงานงานซ่อมรายเดือน: กรองตามเดือน, ประเภท, อาคาร
2. รายงานประสิทธิภาพช่าง: จำนวนงาน, เวลาเฉลี่ย, คะแนนเฉลี่ย
3. รายงานค่าใช้จ่าย: อะไหล่ + ค่าแรง รายเดือน แยกตามประเภท
4. รายงานอาคาร: อาคารไหนแจ้งซ่อมบ่อย, ประเภทงานที่พบบ่อย
5. Export ทุกรายงานเป็น PDF และ Excel

ให้สร้าง:
- Controller: DashboardController, ReportController
- Blade: dashboard.blade.php พร้อม Chart.js
- Blade: report pages พร้อม date range picker
- Export: MonthlyReportExport, TechnicianReportExport
- Query: ใช้ Eloquent aggregate + groupBy + raw expressions
```

---

## Prompt 5: อัปโหลดรูปภาพหลายรูป + Timeline

```
สร้างระบบอัปโหลดรูปภาพหลายรูปสำหรับงานแจ้งซ่อม:

อัปโหลดรูป:
- ตาราง maintenance_images: maintenance_request_id, image_path, type (before/after), uploaded_by
- ฟอร์มแจ้งซ่อม: อัปโหลดรูปก่อนซ่อมได้สูงสุด 5 รูป
- ฟอร์มบันทึกซ่อม: อัปโหลดรูปหลังซ่อมได้สูงสุด 5 รูป
- Preview รูปก่อนอัปโหลด (JavaScript)
- Validation: image, max:5MB, mimes:jpg,png,webp
- เก็บใน storage/app/public/maintenance/

Timeline:
- แสดงประวัติทั้งหมดของงานซ่อมเรียงตามเวลา:
  - 10:00 - ผู้แจ้ง: แจ้งซ่อม + รูปก่อนซ่อม
  - 10:30 - หัวหน้าช่าง: รับเรื่อง มอบหมาย นายช่าง ก
  - 11:00 - ช่าง ก: เริ่มดำเนินการ
  - 14:00 - ช่าง ก: ซ่อมเสร็จ + รูปหลังซ่อม + บันทึก "เปลี่ยนหลอดไฟ 2 หลอด"
  - 14:30 - ผู้แจ้ง: ให้คะแนน 5 ดาว
- ใช้ TailwindCSS แสดงเป็น vertical timeline
- แสดงรูปภาพเป็น gallery (คลิกขยายได้)

ให้สร้าง:
- Migration: maintenance_images table
- Model: MaintenanceImage
- Blade: multiple file upload component
- Blade: timeline component
- JavaScript: image preview before upload
- Controller: จัดการ upload/delete images
```
