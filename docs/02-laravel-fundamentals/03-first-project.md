# 2.3 Your First Laravel Project (โปรเจกต์แรกของคุณ)

> 📖 **บทนี้คุณจะได้เรียนรู้**
> - การสร้างโปรเจกต์ใหม่ด้วย Artisan
> - การรันเซิร์ฟเวอร์จำลอง
> - การแก้ไขหน้าแรกให้เป็นชื่อของคุณ

---

## 🎯 วัตถุประสงค์
เพื่อเริ่มต้นใช้งาน Laravel จริงและเห็นการแสดงผลครั้งแรกบน Browser

## 📚 เนื้อหา

### 1. การสร้างโปรเจกต์
รันคำสั่งนี้ใน Terminal:
```bash
laravel new my-first-app
```
(เลือก "No starter kit", เลือก "Pest" หรือ "PHPUnit" ก็ได้, และเลือกฐานข้อมูลที่ถนัด เช่น "MySQL" หรือ "SQLite")

### 2. การรันเซิร์ฟเวอร์
เข้าไปในโฟลเดอร์และใช้คำสั่ง Artisan:
```bash
cd my-first-app
php artisan serve
```
จากนั้นเปิด Browser ไปที่ `http://127.0.0.1:8000`

### 3. ต้อนรับสู่ Laravel: แก้ไขหน้าแรก
ไปที่ไฟล์ `resources/views/welcome.blade.php` แล้วลองหาคำว่า "Laravel" และเปลี่ยนเป็น "My AI Project"

#### 💡 ตัวอย่างคำสั่ง Artisan ที่สำคัญในขั้นแรก
```bash
php artisan about      # แสดงข้อมูลสรุปของแอป
php artisan list       # แสดงคำสั่งทั้งหมดที่สามารถใช้งานได้
```

---

### 🤖 การใช้ AI ช่วยเริ่มต้น

#### Prompt ตัวอย่าง:
"I want to create a new Laravel project with Tailwind CSS and a simple login system. What is the best command to use?"

---

## 🎓 แบบฝึกหัด
**โจทย์:** ลองรันคำสั่ง `php artisan serve` และแก้ไขหนา้ `welcome.blade.php` ให้มีข้อความ "Hello [ชื่อของคุณ]"

---

**Navigation:**
[⬅️ ก่อนหน้า](02-project-structure.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../03-routing/01-basic-routing.md)
