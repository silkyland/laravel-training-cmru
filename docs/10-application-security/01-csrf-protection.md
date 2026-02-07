# 10.1 CSRF Protection (การป้องกัน CSRF)

> 📖 **บทนี้คุณจะได้เรียนรู้**
> - CSRF Attack คืออะไร
> - การใช้ `@csrf` ใน Blade
> - วิธีจำกัด Route ที่ไม่ต้องเช็ค CSRF

---

## 🎯 วัตถุประสงค์
เพื่อป้องกันการปลอมแปลงคำขอข้ามไซต์ (Cross-Site Request Forgery) ซึ่งอาจทำให้ข้อมูลถูกแก้ไขโดยไม่ได้รับอนุญาต

## 📚 เนื้อหา

### 1. CSRF คืออะไร?
คือการที่ผู้โจมตีล่อลวงให้ผู้ใช้ส่งคำขอ (เช่น การลบข้อมูล) ไปยังเว็บไซต์ที่เราล็อกอินอยู่ โดยที่เราไม่ได้ตั้งใจ

### 2. การป้องกันใน Laravel
Laravel จะสร้าง **Token** สุ่มขึ้นมาสำหรับแต่ละ Session ทุกคำขอที่เป็น `POST`, `PUT`, `PATCH`, หรือ `DELETE` ต้องมีการส่ง Token นี้แนบไปกับฟอร์มเสมอ

#### 💡 ตัวอย่างใน Blade Form
```html
<form method="POST" action="/update-profile">
    @csrf <!-- สร้าง <input type="hidden" name="_token" value="..."> -->
    <input type="text" name="name">
    <button type="submit">Update</button>
</form>
```

#### 💡 การใช้กับ JavaScript (AJAX/Axios)
Laravel จะเก็บ Token ไว้ใน `<meta name="csrf-token">` เราสามารถดึงมาใส่ใน Header ของ Request ได้

---

### 🤖 การใช้ AI ตรวจสอบ

#### Prompt ตัวอย่าง:
"Check my Laravel form code for missing security features like CSRF protection."

---

**Navigation:**
[⬅️ ก่อนหน้า](../09-database-security/04-access-control.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](02-xss-prevention.md)
