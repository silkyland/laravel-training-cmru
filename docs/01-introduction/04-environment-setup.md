# 1.4 Environment Setup (การเตรียมสภาพแวดล้อม)

> **บทนี้คุณจะได้เรียนรู้**
> - การติดตั้ง PHP และเครื่องมือที่จำเป็น
> - การติดตั้ง Laravel ผ่าน Composer
> - การตั้งค่า VS Code สำหรับ AI-Assisted Development
> - การใช้ AI ช่วยแก้ปัญหาการติดตั้ง

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ติดตั้ง PHP, Composer และเครื่องมือพื้นฐานได้อย่างถูกต้อง
2. สร้างโปรเจกต์ Laravel ใหม่ด้วย Laravel Installer ได้
3. ตั้งค่า VS Code พร้อม AI Extensions สำหรับการพัฒนาได้
4. ใช้ AI ช่วยแก้ปัญหาที่เกิดขึ้นระหว่างการติดตั้งได้

---

## เนื้อหา

### 1. เครื่องมือพื้นฐาน (The Stack)

| เครื่องมือ | เวอร์ชัน | หน้าที่ | เปรียบเทียบ |
|----------|---------|--------|------------|
| **PHP** | 8.2+ | ภาษาโปรแกรมหลัก | - |
| **Composer** | 2.0+ | ตัวจัดการ Dependency | เปรียบเสมือน npm ของ JavaScript |
| **Database** | MariaDB/MySQL | จัดเก็บข้อมูล | แนะนำ Laragon (Windows) หรือ Herd (Mac) |
| **Node.js & NPM** | 16+ | จัดการ Frontend Assets | ใช้สำหรับ Vite, TailwindCSS |

### 2. การติดตั้ง Laravel

#### 2.1 ติดตั้ง Laravel Installer

```bash
# ติดตั้ง Laravel Installer ผ่าน Composer
composer global require laravel/installer
```

#### 2.2 สร้างโปรเจกต์ใหม่

```bash
# สร้างโปรเจกต์ Laravel ใหม่
laravel new my-project

# หรือใช้ Composer โดยตรง
composer create-project laravel/laravel my-project
```

#### 2.3 ทดสอบการทำงาน

```bash
# เข้าไปในโฟลเดอร์โปรเจกต์แล้วรัน Development Server
php artisan serve

# เปิดเบราว์เซอร์ไปที่ http://localhost:8000
```

### 3. การเตรียม AI Tools

ในหลักสูตรนี้เราจะเน้นใช้ AI เป็นผู้ช่วยในการพัฒนา เปรียบเสมือน **"ที่ปรึกษาส่วนตัว"** ที่คอยช่วยเหลือตลอดเวลา

| เครื่องมือ AI | ประเภท | ใช้สำหรับ |
|-------------|--------|---------|
| **GitHub Copilot** | VS Code Extension | Code Autocompletion ใน IDE |
| **Claude Dev/Continue** | VS Code Extension | Chat-based Coding Assistant |
| **ChatGPT/Claude Web** | Web Interface | ออกแบบ Database Schema, วางแผนสถาปัตยกรรม |

#### คำสั่งตรวจสอบเวอร์ชันเครื่องมือ

```bash
# ตรวจสอบเวอร์ชัน PHP
php -v

# ตรวจสอบเวอร์ชัน Composer
composer -V

# ตรวจสอบเวอร์ชัน Laravel Installer
laravel -V

# ตรวจสอบเวอร์ชัน Node.js
node -v
```

---

### 4. การใช้ AI ช่วยแก้ปัญหาการติดตั้ง

หากเจอ Error ระหว่างติดตั้ง สามารถ Copy error message มาถาม AI ได้เลย

#### Prompt ตัวอย่าง:

```
I am getting 'composer command not found' on Ubuntu.
How can I fix this and add it to my PATH?
```

#### การ Review คำตอบจาก AI

เมื่อได้คำตอบจาก AI ให้ตรวจสอบ:
- [ ] คำสั่งที่แนะนำเหมาะกับ OS ที่ใช้หรือไม่
- [ ] เวอร์ชันที่แนะนำตรงกับ Requirements ของหลักสูตรหรือไม่
- [ ] มีขั้นตอนที่อาจส่งผลกระทบต่อระบบหรือไม่

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| เครื่องมือพื้นฐาน | PHP 8.2+, Composer, Database, Node.js |
| การติดตั้ง Laravel | ใช้ `laravel new` หรือ `composer create-project` |
| AI Tools | GitHub Copilot, Claude Dev, ChatGPT สำหรับช่วยพัฒนา |
| แก้ปัญหาด้วย AI | Copy error message มาถาม AI พร้อมตรวจสอบคำตอบ |

---

**Navigation:**
[⬅️ ก่อนหน้า](03-ai-in-development.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../02-laravel-fundamentals/01-architecture.md)
