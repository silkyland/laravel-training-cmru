# 16.3 Project Requirements (ข้อกำหนดโปรเจกต์)

> **บทนี้คุณจะได้เรียนรู้**
> - ข้อกำหนดทางเทคนิคของโปรเจกต์
> - โครงสร้างไฟล์ที่ต้องส่ง
> - เกณฑ์การประเมิน
> - การนำเสนอผลงาน

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. เข้าใจข้อกำหนดทางเทคนิคของโปรเจกต์
2. จัดเตรียมไฟล์และเอกสารสำหรับส่งงานได้
3. นำเสนอผลงานได้อย่างมีประสิทธิภาพ

---

## เนื้อหา

### 1. ข้อกำหนดทางเทคนิค

| ข้อกำหนด | รายละเอียด |
|---------|-----------|
| **Framework** | Laravel 11+ |
| **Database** | MySQL / SQLite |
| **Frontend** | Blade + TailwindCSS |
| **Authentication** | Laravel Breeze / Fortify |
| **Version Control** | Git + GitHub |
| **PHP** | 8.2+ |

### 2. โครงสร้างโปรเจกต์ที่ต้องส่ง

```
project/
├── app/
│   ├── Http/Controllers/    ← Resource Controllers
│   ├── Models/              ← Eloquent Models
│   └── Http/Requests/       ← Form Requests
├── database/
│   ├── migrations/          ← Database Migrations
│   ├── seeders/             ← Sample Data
│   └── factories/           ← Test Factories
├── resources/views/         ← Blade Templates
├── routes/web.php           ← Web Routes
├── tests/                   ← Feature Tests
├── README.md                ← คำอธิบายโปรเจกต์
└── .env.example             ← ตัวอย่าง Environment
```

### 3. เกณฑ์การประเมิน

| เกณฑ์ | คะแนน | รายละเอียด |
|-------|-------|-----------|
| **Functionality** | 40 | ฟีเจอร์ทำงานถูกต้องครบถ้วน |
| **Code Quality** | 20 | โค้ดสะอาด ตาม Convention |
| **Security** | 15 | ป้องกัน CSRF, XSS, SQL Injection |
| **UI/UX** | 15 | หน้าตาสวยงาม ใช้งานง่าย |
| **Presentation** | 10 | นำเสนอชัดเจน ตอบคำถามได้ |
| **รวม** | **100** | |

### 4. การนำเสนอ

| ลำดับ | หัวข้อ | เวลา |
|-------|-------|------|
| 1 | แนะนำโปรเจกต์ | 2 นาที |
| 2 | Demo ฟีเจอร์หลัก | 5 นาที |
| 3 | อธิบายโค้ดสำคัญ | 3 นาที |
| 4 | ถาม-ตอบ | 5 นาที |
| | **รวม** | **15 นาที** |

### 5. README.md ที่ต้องมี

```markdown
# ชื่อโปรเจกต์

## รายละเอียด
อธิบายว่าโปรเจกต์ทำอะไร

## วิธีติดตั้ง
1. git clone ...
2. composer install
3. cp .env.example .env
4. php artisan key:generate
5. php artisan migrate --seed
6. npm install && npm run build
7. php artisan serve

## ฟีเจอร์
- Authentication (Login/Register)
- CRUD สินค้า
- ค้นหาและกรอง
- Export PDF/Excel

## ผู้พัฒนา
- ชื่อ-นามสกุล
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| ข้อกำหนด | Laravel 11+, MySQL, Blade, TailwindCSS |
| ไฟล์ที่ส่ง | Source Code + README + .env.example |
| การประเมิน | Functionality 40, Code 20, Security 15, UI 15, Present 10 |
| นำเสนอ | 15 นาที: Demo + อธิบายโค้ด + Q&A |

---

**Navigation:**
[⬅️ ก่อนหน้า](02-ai-prompting.md) | [📚 สารบัญ](../../README.md)
