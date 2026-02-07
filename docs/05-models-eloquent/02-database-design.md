# 5.2 Database Design with AI (การออกแบบฐานข้อมูลด้วย AI)

> 📖 **บทนี้คุณจะได้เรียนรู้**
> - การใช้ AI ช่วยวิเคราะห์ความสัมพันธ์ของข้อมูล
> - การสร้าง Migration
> - การทำ Database Schema แบบปลอดภัย

---

## 🎯 วัตถุประสงค์
เพื่อให้สามารถออกแบบโครงสร้างฐานข้อมูลที่มีประสิทธิภาพและรองรับการขยายตัวได้ โดยใช้ AI เป็นที่ปรึกษา

## 📚 เนื้อหา

### 1. วางแผนร่วมกับ AI
ก่อนที่เราจะเขียนโค้ด เราควรให้ AI ช่วยพิจารณาว่าระบบต้องมีตารางอะไรบ้าง และมีความสัมพันธ์กันอย่างไร

### 2. การสร้าง Migration
Migration คือระบบ Version Control สำหรับฐานข้อมูล ช่วยให้เราสร้างหรือแก้ไขตารางผ่านโค้ดได้

```bash
php artisan make:migration create_orders_table
```

#### 💡 ตัวอย่างไฟล์ Migration ที่ AI ช่วยออกแบบ
```php
public function up()
{
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // เชื่อมกับตาราง users
        $table->decimal('total_price', 10, 2);
        $table->string('status')->default('pending');
        $table->timestamps();
    });
}
```

---

### 🤖 การใช้ AI ออกแบบ Schema

#### Prompt ตัวอย่าง (Designing a Clinic System):
"Design a database schema for a clinic system. We need patients, doctors, and appointments. Show me the Laravel migration fields for each table and specify the relationships."

---

## 📋 Best Practices
- ใช้ `foreignId()` เสมอเพื่อรักษา Integrity ของข้อมูล
- ใช้ `timestamps()` เพื่อเก็บค่า created_at และ updated_at
- ตั้งชื่อตารางเป็นพหูพจน์ (Plural) และตัวเล็กทั้งหมด (Snake Case)

---

**Navigation:**
[⬅️ ก่อนหน้า](01-eloquent-introduction.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-relationships.md)
