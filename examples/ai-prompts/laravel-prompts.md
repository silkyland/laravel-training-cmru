# รวม AI Prompts สำหรับ Laravel Development

> ไฟล์นี้รวบรวม Prompt ตัวอย่างที่ใช้กับ AI (ChatGPT, Claude, Copilot) สำหรับพัฒนา Laravel

---

## 1. สร้างโปรเจกต์

### Prompt: วางแผนโครงสร้างโปรเจกต์

```
ช่วยวางแผนโครงสร้างโปรเจกต์ Laravel สำหรับระบบจัดการ [ชื่อระบบ] ที่มี:
- ตาราง: [รายชื่อตาราง]
- ฟีเจอร์: CRUD, Authentication, Authorization, Report
- ใช้ Laravel 11, MySQL, Blade + TailwindCSS

ให้แสดง:
1. รายชื่อ Models + Relationships
2. รายชื่อ Controllers
3. รายชื่อ Routes
4. Database Schema (Migration)
```

---

## 2. Model & Migration

### Prompt: สร้าง Migration

```
สร้าง Laravel Migration สำหรับตาราง [ชื่อตาราง] ที่มี columns:
- [column1] (ประเภท, nullable/required)
- [column2] (ประเภท, nullable/required)
- Foreign Key: [column] references [table]
- timestamps, softDeletes
- Index: [columns ที่ต้อง index]
```

### Prompt: สร้าง Model พร้อม Relationship

```
สร้าง Laravel Eloquent Model ชื่อ [ModelName] ที่มี:
- $fillable: [columns]
- Relationships:
  - belongsTo [Model]
  - hasMany [Model]
- Accessor: formatted_price (แสดงราคาเป็น "1,234.00 บาท")
- Scope: scopeActive() (where is_active = true)
- ใช้ SoftDeletes
```

---

## 3. Controller

### Prompt: สร้าง Resource Controller

```
สร้าง Laravel Resource Controller ชื่อ [Name]Controller ที่มี:
- ใช้ Route Model Binding
- index(): แสดงรายการพร้อม Pagination [N] รายการ, ค้นหาด้วย [field], กรองด้วย [field]
- create(): แสดงฟอร์ม พร้อมส่ง [related data]
- store(): ใช้ [Name]Request, อัปโหลดรูปภาพ
- show(): Eager Load [relationships]
- edit(): แสดงฟอร์มแก้ไข พร้อมค่าเดิม
- update(): จัดการรูปภาพเก่า/ใหม่
- destroy(): ลบรูปภาพ + ลบข้อมูล
- ทุก method มี Flash Message ภาษาไทย
```

### Prompt: สร้าง API Controller

```
สร้าง Laravel API Controller ชื่อ Api/[Name]Controller ที่มี:
- ใช้ Route Model Binding
- ใช้ [Name]Resource สำหรับ Response
- index(): Pagination + Search + Filter
- store(): Validation + Create
- show(): Eager Load
- update(): Validation + Update
- destroy(): Delete
- ทุก Response เป็น JSON format: { status, data, message }
```

---

## 4. Blade Views

### Prompt: สร้างหน้า Index

```
สร้าง Blade Template สำหรับหน้ารายการ [ชื่อ] ที่มี:
- ใช้ TailwindCSS
- ตารางแสดงข้อมูล: [columns]
- ช่องค้นหา + กรองตาม [field]
- Pagination
- ปุ่ม: เพิ่ม, ดู, แก้ไข, ลบ (พร้อม confirm)
- แสดง Flash Message (success/error)
- Responsive Design
```

### Prompt: สร้างหน้า Form (Create/Edit)

```
สร้าง Blade Template สำหรับฟอร์ม [สร้าง/แก้ไข] [ชื่อ] ที่มี:
- ใช้ TailwindCSS
- Fields: [รายชื่อ fields + ประเภท]
- แสดง Validation Error ใต้แต่ละ field
- ใช้ old() สำหรับ Create, old(field, model->field) สำหรับ Edit
- File Upload พร้อม Preview
- ปุ่ม: บันทึก, ยกเลิก
- @csrf, @method('PUT') สำหรับ Edit
```

---

## 5. Authentication & Authorization

### Prompt: สร้างระบบ Role

```
สร้างระบบ Role-based Authorization ใน Laravel ที่มี:
- Roles: admin, editor, user
- Migration สำหรับ roles table + role_user pivot
- Middleware: CheckRole
- Helper: $user->hasRole('admin'), $user->isAdmin()
- Blade Directive: @role('admin')
- ตัวอย่างการใช้ใน Route และ Controller
```

---

## 6. Testing

### Prompt: สร้าง Feature Test

```
สร้าง Laravel Feature Test สำหรับ [Name]Controller ที่ทดสอบ:
- test_user_can_view_[name]_list
- test_user_can_create_[name]
- test_user_can_update_[name]
- test_user_can_delete_[name]
- test_validation_errors_on_create
- test_unauthorized_user_cannot_access
- ใช้ Factory, RefreshDatabase, actingAs
```

---

## 7. Report & Export

### Prompt: สร้างรายงาน

```
สร้างระบบรายงานใน Laravel ที่มี:
- Controller: ReportController
- รายงานสรุป [ชื่อรายงาน] ตามช่วงเวลา (start_date, end_date)
- แสดงผลเป็นตาราง + กราฟ (Chart.js)
- Export เป็น PDF (DomPDF)
- Export เป็น Excel (Maatwebsite)
- ใช้ Aggregate Functions: SUM, COUNT, AVG, GROUP BY
```

---

## 8. Security Review

### Prompt: ตรวจสอบความปลอดภัย

```
ตรวจสอบโค้ด Laravel นี้ในด้านความปลอดภัย:
- SQL Injection
- XSS
- CSRF
- Mass Assignment
- Authentication/Authorization
- File Upload Security
- Sensitive Data Exposure

[วางโค้ดที่ต้องการตรวจ]

ให้แสดง:
1. ปัญหาที่พบ
2. ระดับความรุนแรง
3. วิธีแก้ไข พร้อมโค้ดตัวอย่าง
```

---

## 9. Debugging

### Prompt: ช่วย Debug

```
ช่วย Debug ปัญหานี้ใน Laravel:

Error Message: [วาง Error Message]

โค้ดที่เกี่ยวข้อง:
[วางโค้ด]

สิ่งที่ทำไปแล้ว:
- [สิ่งที่ลองแก้]

ให้อธิบาย:
1. สาเหตุของปัญหา
2. วิธีแก้ไข
3. วิธีป้องกันไม่ให้เกิดซ้ำ
```

---

## 10. Refactoring

### Prompt: Refactor โค้ด

```
Refactor โค้ด Laravel นี้ให้ดีขึ้น:
- แยก Validation เป็น Form Request
- แยก Business Logic ออกจาก Controller
- เพิ่ม Eager Loading
- ใช้ API Resource สำหรับ Response
- เพิ่ม Error Handling
- ปรับให้ตรงตาม Laravel Convention

[วางโค้ดที่ต้องการ Refactor]
```

---

## ระบบมหาวิทยาลัย (แยกไฟล์)

ดู Prompt เฉพาะระบบมหาวิทยาลัยในไฟล์แยก:
- [ระบบจองห้องประชุม](meeting-room-booking.md)
- [ระบบจองรถ](vehicle-booking.md)
- [ระบบจองประชุมออนไลน์ Zoom & Google Meet](online-meeting-booking.md)
- [ระบบแจ้งซ่อมบำรุง + LINE Notify](maintenance-request.md)
