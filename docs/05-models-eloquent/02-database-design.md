# 5.2 Database Design with AI (การออกแบบฐานข้อมูลด้วย AI)

> **บทนี้คุณจะได้เรียนรู้**
> - การใช้ AI ช่วยวิเคราะห์ความสัมพันธ์ของข้อมูล
> - การสร้างและจัดการ Migration
> - Column Types ที่ใช้บ่อย
> - Best Practices ในการออกแบบฐานข้อมูล

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ใช้ AI ช่วยวิเคราะห์และออกแบบ Database Schema ได้
2. สร้างและจัดการ Migration ใน Laravel ได้
3. เลือกใช้ Column Types ที่เหมาะสมกับข้อมูลแต่ละประเภทได้
4. ปฏิบัติตาม Best Practices ในการออกแบบฐานข้อมูลได้

---

## เนื้อหา

### 1. วางแผนร่วมกับ AI

ก่อนที่เราจะเขียนโค้ด เราควรให้ AI ช่วยพิจารณาว่าระบบต้องมีตารางอะไรบ้าง และมีความสัมพันธ์กันอย่างไร เปรียบเสมือน **"สถาปนิกที่ช่วยวาดพิมพ์เขียว"** ก่อนลงมือสร้างบ้าน

```mermaid
graph LR
    A[วิเคราะห์ Requirements] --> B[ออกแบบ Schema ด้วย AI]
    B --> C[สร้าง Migration]
    C --> D[รัน Migration]
    D --> E[สร้าง Model + Relationships]
```

### 2. การสร้าง Migration

**Migration** คือระบบ Version Control สำหรับฐานข้อมูล ช่วยให้เราสร้างหรือแก้ไขตารางผ่านโค้ดได้

```bash
# สร้าง Migration สำหรับตารางใหม่
php artisan make:migration create_orders_table

# สร้าง Migration สำหรับแก้ไขตาราง
php artisan make:migration add_phone_to_users_table

# รัน Migration ทั้งหมด
php artisan migrate

# ย้อนกลับ Migration ล่าสุด
php artisan migrate:rollback
```

#### คำสั่ง Migration ที่สำคัญ

| คำสั่ง | หน้าที่ |
|--------|--------|
| `php artisan migrate` | รัน Migration ที่ยังไม่ได้รัน |
| `php artisan migrate:rollback` | ย้อนกลับ Migration ล่าสุด |
| `php artisan migrate:fresh` | ลบตารางทั้งหมดแล้วรันใหม่ |
| `php artisan migrate:status` | ดูสถานะ Migration ทั้งหมด |

#### ตัวอย่างไฟล์ Migration

```php
public function up()
{
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->decimal('total_price', 10, 2);
        $table->string('status')->default('pending');
        $table->text('note')->nullable();
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('orders');
}
```

### 3. Column Types ที่ใช้บ่อย

| Column Type | ใช้สำหรับ | ตัวอย่าง |
|------------|---------|---------|
| `$table->id()` | Primary Key (auto-increment) | รหัสอัตโนมัติ |
| `$table->string('name')` | ข้อความสั้น (max 255) | ชื่อ, อีเมล, สถานะ |
| `$table->text('description')` | ข้อความยาว | รายละเอียด, หมายเหตุ |
| `$table->integer('quantity')` | จำนวนเต็ม | จำนวน, อายุ |
| `$table->decimal('price', 10, 2)` | ทศนิยม | ราคา, เงิน |
| `$table->boolean('is_active')` | จริง/เท็จ | สถานะเปิด/ปิด |
| `$table->date('birth_date')` | วันที่ | วันเกิด |
| `$table->datetime('published_at')` | วันที่+เวลา | วันที่เผยแพร่ |
| `$table->enum('status', [...])` | ค่าที่กำหนด | pending, approved, rejected |
| `$table->foreignId('user_id')` | Foreign Key | เชื่อมกับตารางอื่น |
| `$table->timestamps()` | created_at, updated_at | เวลาสร้าง/แก้ไข |
| `$table->softDeletes()` | deleted_at | ลบแบบ Soft Delete |

---

### การใช้ AI ออกแบบ Schema

#### Prompt ตัวอย่าง:

```
Design a database schema for a clinic system.
We need patients, doctors, and appointments.
Show me the Laravel migration fields for each table
and specify the relationships.
```

#### การ Review Code จาก AI

เมื่อได้ Schema จาก AI ให้ตรวจสอบ:
- [ ] ตารางครบตาม Requirements หรือไม่
- [ ] ความสัมพันธ์ (Foreign Key) ถูกต้องหรือไม่
- [ ] Column Types เหมาะสมกับข้อมูลหรือไม่
- [ ] มี Index สำหรับคอลัมน์ที่ค้นหาบ่อยหรือไม่

---

## แบบฝึกหัด

### Exercise 1: ออกแบบ Schema

**โจทย์:** ออกแบบ Migration สำหรับระบบร้านหนังสือ โดยมีตาราง:
1. `books` - ชื่อหนังสือ, ราคา, จำนวนในสต็อก, ISBN
2. `authors` - ชื่อผู้แต่ง, ประวัติ
3. `book_author` - ตารางเชื่อม (Pivot Table)

<details>
<summary>ดูเฉลย</summary>

```php
// create_authors_table
Schema::create('authors', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('bio')->nullable();
    $table->timestamps();
});

// create_books_table
Schema::create('books', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->decimal('price', 8, 2);
    $table->integer('stock')->default(0);
    $table->string('isbn')->unique();
    $table->timestamps();
});

// create_book_author_table (Pivot)
Schema::create('book_author', function (Blueprint $table) {
    $table->id();
    $table->foreignId('book_id')->constrained()->onDelete('cascade');
    $table->foreignId('author_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
```

</details>

---

## Best Practices

| แนวปฏิบัติ | รายละเอียด |
|-----------|-----------|
| ใช้ `foreignId()` | รักษา Integrity ของข้อมูลระหว่างตาราง |
| ใช้ `timestamps()` | เก็บ created_at และ updated_at อัตโนมัติ |
| ตั้งชื่อตาราง | พหูพจน์ (Plural), snake_case เช่น `order_items` |
| ใช้ `nullable()` | สำหรับคอลัมน์ที่ไม่บังคับกรอก |
| ใช้ `default()` | กำหนดค่าเริ่มต้นเพื่อป้องกัน null |

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| วางแผนด้วย AI | ให้ AI ช่วยวิเคราะห์ Requirements ก่อนเขียนโค้ด |
| Migration | Version Control สำหรับฐานข้อมูล |
| Column Types | เลือก Type ที่เหมาะสมกับข้อมูล |
| Best Practices | foreignId, timestamps, naming convention |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-eloquent-introduction.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-relationships.md)
