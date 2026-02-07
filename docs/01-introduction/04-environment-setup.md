# 1.4 Environment Setup (การเตรียมสภาพแวดล้อม)

> 📖 **บทนี้คุณจะได้เรียนรู้**
> - การติดตั้ง PHP และเครื่องมือที่จำเป็น
> - การติดตั้ง Laravel ผ่าน Composer
> - การตั้งค่า VS Code สำหรับ AI-Assisted Development

---

## 🎯 วัตถุประสงค์
เพื่อให้เครื่องคอมพิวเตอร์ของผู้เข้าอบรมพร้อมสำหรับการพัฒนาโปรเจกต์จริง

## 📚 เนื้อหา

### 1. เครื่องมือพื้นฐาน (The Stack)
1. **PHP 8.2+**: ภาษาหลักที่ใช้
2. **Composer**: ตัวจัดการ Library (เปรียบเสมือน npm ของ JavaScript)
3. **Database**: MariaDB หรือ MySQL (แนะนำใช้ Laragon สำหรับ Windows หรือ Herd สำหรับ Mac)

### 2. การติดตั้ง Laravel
ใช้คำสั่งผ่าน Terminal/Command Prompt:
```bash
composer global require laravel/installer
```

### 3. การเตรียม AI Tools
ในหลักสูตรนี้เราจะเน้นใช้:
- **VS Code** + **Claude Dev/Continue** หรือ **GitHub Copilot**
- **ChatGPT/Claude Web Interface** สำหรับการออกแบบ Database Schema

#### 💡 ตัวอย่างการเช็คเวอร์ชันเครื่องมือ

```bash
php -v          # ตรวจสอบเวอร์ชัน PHP
composer -V     # ตรวจสอบเวอร์ชัน Composer
laravel -V      # ตรวจสอบเวอร์ชัน Laravel Installer
```

---

### 🤖 การใช้ AI ช่วยแก้ปัญหาการติดตั้ง

หากเจอ Error ระหว่างติดตั้ง สามารถ Copy error message มาถาม AI ได้เลย

#### Prompt ตัวอย่าง:
"I am getting 'composer command not found' on Ubuntu. How can I fix this and add it to my PATH?"

---

**Navigation:**
[⬅️ ก่อนหน้า](03-ai-in-development.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../02-laravel-fundamentals/01-architecture.md)
