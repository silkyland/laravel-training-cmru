# ระบบจองห้องประชุมออนไลน์ (Zoom & Google Meet Booking)

> Prompt สำหรับสร้างระบบจองห้องประชุมออนไลน์ที่สร้างลิงก์ Zoom / Google Meet อัตโนมัติผ่าน API

---

## Prompt 1: วางแผนโครงสร้างทั้งระบบ

```
สร้างระบบจองห้องประชุมออนไลน์สำหรับมหาวิทยาลัย ด้วย Laravel 11, MySQL, Blade + TailwindCSS
ที่สามารถสร้างลิงก์ Zoom Meeting และ Google Meet อัตโนมัติผ่าน API

ข้อมูลที่ต้องจัดการ:
- การจอง: ผู้จอง, หัวข้อ, วันที่, เวลาเริ่ม, เวลาสิ้นสุด, แพลตฟอร์ม (Zoom/Google Meet), จำนวนผู้เข้าร่วม, รายชื่อผู้เข้าร่วม (emails), หมายเหตุ, สถานะ
- ลิงก์ประชุม: meeting_url, meeting_id, password (Zoom), platform, สร้างอัตโนมัติเมื่ออนุมัติ
- ผู้ใช้: บุคลากร (จองได้), ผู้ดูแลระบบ (อนุมัติ/จัดการ)

ฟีเจอร์:
1. ฟอร์มจองประชุมออนไลน์: เลือก Zoom หรือ Google Meet
2. สร้างลิงก์ประชุมอัตโนมัติผ่าน API เมื่อการจองถูกอนุมัติ
3. ส่ง Email เชิญพร้อมลิงก์ประชุมให้ผู้เข้าร่วมทุกคน
4. ปฏิทินแสดงตารางประชุมรายวัน/รายสัปดาห์
5. แจ้งเตือนก่อนเวลาประชุม 15 นาที (Email)
6. ยกเลิกการจอง → ลบ Meeting จาก Zoom/Google Meet อัตโนมัติ
7. ประวัติการประชุม + สถิติการใช้งานแต่ละแพลตฟอร์ม
8. รองรับ Recurring Meeting (ประชุมซ้ำรายสัปดาห์/รายเดือน)

ให้สร้าง:
1. Migration: online_meetings table (เก็บข้อมูลจอง + ลิงก์)
2. Models: OnlineMeeting พร้อม Relationships
3. Controllers: OnlineMeetingController (CRUD + approve)
4. Services: ZoomService, GoogleMeetService (แยก API logic)
5. Form Requests: StoreOnlineMeetingRequest
6. Blade Views: ฟอร์มจอง, ปฏิทิน, รายการจอง
7. Notification: MeetingInvitation, MeetingReminder
8. Routes: web.php + Webhook routes สำหรับ callback
9. Config: zoom.php, google-meet.php สำหรับ API credentials
```

---

## Prompt 2: Zoom API Integration

```
สร้าง ZoomService class ใน Laravel สำหรับจัดการ Zoom Meeting ผ่าน API:

การตั้งค่า:
- ใช้ Zoom Server-to-Server OAuth App (Account-level)
- เก็บ credentials ใน .env: ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET
- สร้าง config/zoom.php สำหรับ configuration

ZoomService methods:
1. getAccessToken(): ขอ Access Token จาก Zoom OAuth
2. createMeeting($data): สร้าง Meeting ใหม่
   - topic: หัวข้อ
   - start_time: เวลาเริ่ม (ISO 8601)
   - duration: ระยะเวลา (นาที)
   - timezone: Asia/Bangkok
   - password: สร้างอัตโนมัติ
   - settings: waiting_room, join_before_host, mute_upon_entry
   - return: meeting_id, join_url, start_url, password
3. updateMeeting($meetingId, $data): แก้ไข Meeting
4. deleteMeeting($meetingId): ลบ Meeting
5. getMeeting($meetingId): ดูรายละเอียด Meeting

ให้สร้าง:
- app/Services/ZoomService.php
- config/zoom.php
- ตัวอย่าง .env variables
- Error Handling: จัดการ API errors, token expired, rate limit
- ใช้ Laravel HTTP Client (Http::)
- Log ทุก API call
```

---

## Prompt 3: Google Meet API Integration (Google Calendar)

```
สร้าง GoogleMeetService class ใน Laravel สำหรับสร้าง Google Meet ผ่าน Google Calendar API:

การตั้งค่า:
- ใช้ Google Service Account หรือ OAuth 2.0
- ติดตั้ง: composer require google/apiclient
- เก็บ credentials ใน storage/app/google/service-account.json
- สร้าง config/google-meet.php

GoogleMeetService methods:
1. getClient(): สร้าง Google Client พร้อม credentials
2. createMeeting($data): สร้าง Calendar Event + Google Meet link
   - summary: หัวข้อ
   - start: วันเวลาเริ่ม
   - end: วันเวลาสิ้นสุด
   - attendees: รายชื่อ email ผู้เข้าร่วม
   - conferenceData: requestId สำหรับสร้าง Meet link
   - return: event_id, meet_link, calendar_link
3. updateMeeting($eventId, $data): แก้ไข Event
4. deleteMeeting($eventId): ลบ Event
5. getMeeting($eventId): ดูรายละเอียด Event

ให้สร้าง:
- app/Services/GoogleMeetService.php
- config/google-meet.php
- ตัวอย่าง Service Account setup steps
- Error Handling: จัดการ quota exceeded, invalid credentials
- ส่ง Calendar Invite ให้ผู้เข้าร่วมอัตโนมัติ
```

---

## Prompt 4: Controller + Workflow อัตโนมัติ

```
สร้าง OnlineMeetingController ใน Laravel ที่เชื่อมกับ ZoomService และ GoogleMeetService:

Workflow:
1. ผู้ใช้กรอกฟอร์มจอง → เลือก Zoom หรือ Google Meet
2. Admin อนุมัติ → ระบบเรียก API สร้างลิงก์อัตโนมัติ
3. ระบบส่ง Email เชิญพร้อมลิงก์ให้ผู้เข้าร่วมทุกคน
4. ก่อนเวลาประชุม 15 นาที → ส่ง Email แจ้งเตือน
5. ยกเลิก → ระบบลบ Meeting จาก Zoom/Google Meet + แจ้งผู้เข้าร่วม

Controller methods:
- index(): รายการจองทั้งหมด + กรองตามสถานะ/แพลตฟอร์ม
- create(): ฟอร์มจอง
- store(): บันทึกคำขอจอง (สถานะ: รออนุมัติ)
- approve($id): อนุมัติ → เรียก ZoomService หรือ GoogleMeetService สร้างลิงก์ → ส่ง Email
- reject($id): ไม่อนุมัติ พร้อมเหตุผล
- cancel($id): ยกเลิก → เรียก API ลบ Meeting → แจ้งผู้เข้าร่วม
- show($id): แสดงรายละเอียด + ลิงก์เข้าประชุม

ใช้ Strategy Pattern:
- MeetingServiceInterface: createMeeting(), updateMeeting(), deleteMeeting()
- ZoomService implements MeetingServiceInterface
- GoogleMeetService implements MeetingServiceInterface
- Factory: MeetingServiceFactory::make('zoom') หรือ make('google_meet')

Scheduled Task:
- ส่ง Reminder Email 15 นาทีก่อนประชุม (Laravel Scheduler)

ให้สร้าง:
- app/Contracts/MeetingServiceInterface.php
- app/Services/MeetingServiceFactory.php
- app/Http/Controllers/OnlineMeetingController.php
- app/Notifications/MeetingInvitation.php
- app/Notifications/MeetingReminder.php
- app/Console/Commands/SendMeetingReminders.php
- Kernel schedule: $schedule->command('meetings:remind')->everyMinute()
```

---

## Prompt 5: ฟอร์มจองและ Email Template

```
สร้าง Blade Templates สำหรับระบบจองประชุมออนไลน์:

1. ฟอร์มจอง (create.blade.php):
   - หัวข้อประชุม
   - วันที่ + เวลาเริ่ม + เวลาสิ้นสุด
   - เลือกแพลตฟอร์ม: Zoom / Google Meet (radio button พร้อมไอคอน)
   - จำนวนผู้เข้าร่วม
   - เพิ่ม Email ผู้เข้าร่วม (dynamic input, เพิ่ม/ลบได้)
   - หมายเหตุ
   - ใช้ TailwindCSS

2. Email เชิญประชุม (MeetingInvitation.blade.php):
   - หัวข้อ: "คุณได้รับเชิญเข้าร่วมประชุม: [หัวข้อ]"
   - รายละเอียด: วันที่, เวลา, แพลตฟอร์ม
   - ปุ่ม "เข้าร่วมประชุม" (ลิงก์ Zoom/Meet)
   - Meeting ID + Password (กรณี Zoom)
   - ปฏิทิน: ลิงก์เพิ่มเข้า Google Calendar
   - ดีไซน์สวยงาม ใช้ Laravel Mail Markdown

3. Email แจ้งเตือน (MeetingReminder.blade.php):
   - หัวข้อ: "การประชุมจะเริ่มใน 15 นาที: [หัวข้อ]"
   - ปุ่ม "เข้าร่วมประชุมเลย"
   - รายละเอียดสั้นๆ
```
