# 2.2 Project Structure (โครงสร้างโฟลเดอร์)

> **บทนี้คุณจะได้เรียนรู้**
> - หน้าที่ของโฟลเดอร์หลักใน Laravel
> - ไฟล์คอนฟิกูเรชันที่สำคัญ (.env, config/)
> - การจัดการ Assets ใน resources/
> - การใช้ AI ช่วยค้นหาไฟล์

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. อธิบายหน้าที่ของโฟลเดอร์หลักใน Laravel ได้
2. หาไฟล์ที่ต้องการแก้ไขได้อย่างถูกต้องและรวดเร็ว
3. เข้าใจความสำคัญของไฟล์ `.env` และการรักษาความปลอดภัย
4. ใช้ AI ช่วยค้นหาตำแหน่งไฟล์ที่เหมาะสมได้

---

## เนื้อหา

### 1. โฟลเดอร์ที่ต้องใช้งานบ่อย (The Essential Paths)

| โฟลเดอร์ | หน้าที่ | ไฟล์สำคัญ |
|---------|--------|----------|
| **`app/`** | หัวใจของระบบ (Controllers, Models, Middleware) | `app/Http/Controllers/`, `app/Models/` |
| **`config/`** | ไฟล์ตั้งค่าทั้งหมดของระบบ | `app.php`, `database.php`, `mail.php` |
| **`database/`** | Migration (สร้างตาราง) และ Seeders (ข้อมูลจำลอง) | `migrations/`, `seeders/` |
| **`public/`** | จุดเริ่มต้นของแอป, ไฟล์ที่เปิดต่อสาธารณะ | `index.php`, ภาพ, CSS, JS |
| **`resources/`** | ที่เก็บ Views และ Frontend Assets | `views/`, `css/`, `js/` |
| **`routes/`** | กำหนด URL ของระบบ | `web.php`, `api.php` |
| **`storage/`** | ไฟล์ที่ User อัปโหลดและ Logs | `app/`, `logs/` |

### 2. โครงสร้างโฟลเดอร์

```
project/
├── app/
│   ├── Http/
│   │   ├── Controllers/     ← Controller ทั้งหมด
│   │   └── Middleware/       ← Middleware ทั้งหมด
│   ├── Models/               ← Model ทั้งหมด
│   └── Providers/            ← Service Providers
├── config/                   ← ไฟล์ตั้งค่า
├── database/
│   ├── migrations/           ← สร้าง/แก้ไขตาราง
│   └── seeders/              ← ข้อมูลจำลอง
├── public/                   ← จุดเริ่มต้นของแอป
├── resources/
│   └── views/                ← Blade Templates
├── routes/
│   ├── web.php               ← Route สำหรับหน้าเว็บ
│   └── api.php               ← Route สำหรับ API
├── storage/                  ← ไฟล์อัปโหลด, Logs
├── .env                      ← ข้อมูลความลับ (ห้ามขึ้น Git!)
└── composer.json             ← Dependencies ของโปรเจกต์
```

### 3. ไฟล์ที่สำคัญที่สุด: `.env`

ไฟล์ `.env` ใช้เก็บข้อมูลความลับ เช่น Password ฐานข้อมูล, API Key เปรียบเสมือน **"ตู้เซฟ"** ที่เก็บกุญแจทั้งหมดของระบบ

| ข้อควรระวัง | รายละเอียด |
|------------|-----------|
| **ห้ามขึ้น Git** | ไฟล์ `.env` ถูก ignore ใน `.gitignore` อยู่แล้ว ห้ามลบออก |
| **ใช้ `.env.example`** | เก็บโครงสร้างตัวอย่างสำหรับทีม (ไม่มีค่าจริง) |
| **แยกตาม Environment** | ใช้ค่าต่างกันสำหรับ local, staging, production |

```bash
# ตัวอย่างเนื้อหาในไฟล์ .env
APP_NAME=MyApp
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=my_database
DB_USERNAME=root
DB_PASSWORD=secret
```

---

### การใช้ AI ช่วยค้นหาไฟล์

#### Prompt ตัวอย่าง:

```
In Laravel, where should I put my custom helper functions
or service classes?
```

#### การ Review คำตอบจาก AI

เมื่อได้คำตอบจาก AI ให้ตรวจสอบ:
- [ ] ตำแหน่งไฟล์ตรงกับ Convention ของ Laravel หรือไม่
- [ ] Namespace ถูกต้องตามโครงสร้างโฟลเดอร์หรือไม่
- [ ] ต้อง Register ใน Service Provider เพิ่มเติมหรือไม่

---

## แบบฝึกหัด

### Exercise 1: ค้นหาไฟล์

**โจทย์:** ตอบคำถามต่อไปนี้:
1. ถ้าต้องการสร้าง Route ใหม่ ต้องแก้ไขไฟล์ไหน?
2. ถ้าต้องการสร้างหน้าเว็บใหม่ ต้องสร้างไฟล์ไว้ที่โฟลเดอร์ไหน?
3. ถ้าต้องการสร้างตารางใหม่ในฐานข้อมูล ต้องสร้างไฟล์ไว้ที่โฟลเดอร์ไหน?

<details>
<summary>ดูเฉลย</summary>

1. **`routes/web.php`** — สำหรับ Route หน้าเว็บ หรือ `routes/api.php` สำหรับ API
2. **`resources/views/`** — สร้างไฟล์ `.blade.php` ในโฟลเดอร์นี้
3. **`database/migrations/`** — ใช้คำสั่ง `php artisan make:migration` เพื่อสร้าง Migration

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| โฟลเดอร์หลัก | `app/`, `config/`, `database/`, `routes/`, `resources/` |
| โครงสร้างไฟล์ | แยกตามหน้าที่ชัดเจนตาม MVC Pattern |
| ไฟล์ `.env` | เก็บข้อมูลความลับ ห้ามขึ้น Git เด็ดขาด |
| AI ช่วยค้นหา | ใช้ AI ถามตำแหน่งไฟล์ที่เหมาะสมตาม Convention |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-architecture.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-first-project.md)
