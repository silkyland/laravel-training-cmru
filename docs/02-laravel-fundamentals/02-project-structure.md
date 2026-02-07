# 2.2 Project Structure (โครงสร้างโฟลเดอร์)

> 📖 **บทนี้คุณจะได้เรียนรู้**
> - หน้าที่ของโฟลเดอร์หลักใน Laravel
> - ไฟล์คอนฟิกูเรชันที่สำคัญ (.env, config/)
> - การจัดการ Assets ใน resources/

---

## 🎯 วัตถุประสงค์
เพื่อให้สามารถหาไฟล์ที่ต้องการแก้ไขได้อย่างถูกต้องและรวดเร็ว

## 📚 เนื้อหา

### โฟลเดอร์ที่ต้องใช้งานบ่อย (The Essential Paths)

- **`app/`**: หัวใจของระบบ ประกอบด้วย Controllers, Models, และ Middleware
- **`config/`**: ไฟล์ตั้งค่าทั้งหมดของระบบ (App, Database, Mail)
- **`database/`**: ไฟล์ Migration (สร้างตาราง) และ Seeders (สร้างข้อมูลจำลอง)
- **`public/`**: จุดเริ่มต้นของแอปและที่เก็บภาพ, CSS, JS ที่เปิดต่อสาธารณะ
- **`resources/views/`**: ที่เก็บหน้าเว็บ (Blade files)
- **`routes/`**: ที่กำหนด URL ของระบบ (`web.php` สำหรับหน้าเว็บ, `api.php` สำหรับ API)
- **`storage/`**: ที่เก็บไฟล์ที่ User อัปโหลดและ Logs ของระบบ

#### ⚠️ ไฟล์ที่สำคัญที่สุด: `.env`
ใช้เก็บข้อมูลความลับ เช่น Password ฐานข้อมูล, API Key **ห้ามส่งไฟล์นี้ขึ้น GitHub เด็ดขาด!**

#### 💡 ตัวอย่างโครงสร้างเบื้องต้น
```text
project/
├── app/
│   ├── Http/Controllers/
│   └── Models/
├── database/
│   └── migrations/
├── routes/
│   └── web.php
└── .env
```

---

### 🤖 การใช้ AI ช่วยค้นหาไฟล์

#### Prompt ตัวอย่าง:
"In Laravel, where should I put my custom helper functions or service classes?"

---

## 📋 Checklist ทำความเข้าใจ
- [ ] เข้าใจว่า Model อยู่ในโฟลเดอร์ `app/Models`
- [ ] รู้ว่า Route อยู่ใน `routes/web.php`
- [ ] รู้ว่า View อยู่ใน `resources/views`

---

**Navigation:**
[⬅️ ก่อนหน้า](01-architecture.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-first-project.md)
