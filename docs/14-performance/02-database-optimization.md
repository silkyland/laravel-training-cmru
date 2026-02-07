# 14.2 Database Optimization (การเพิ่มประสิทธิภาพฐานข้อมูล)

> **บทนี้คุณจะได้เรียนรู้**
> - N+1 Query Problem และ Eager Loading
> - Database Indexing
> - Query Optimization
> - Chunking สำหรับข้อมูลจำนวนมาก

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. แก้ปัญหา N+1 Query ด้วย Eager Loading ได้
2. สร้าง Database Index เพื่อเพิ่มความเร็วได้
3. เขียน Query ที่มีประสิทธิภาพได้

---

## เนื้อหา

### 1. N+1 Query Problem

```php
// ❌ N+1 Problem - รัน 101 Queries (1 + 100)
$products = Product::all(); // Query 1
foreach ($products as $product) {
    echo $product->category->name; // Query 2-101
}

// ✅ Eager Loading - รัน 2 Queries เท่านั้น
$products = Product::with('category')->get(); // Query 1 + 2
foreach ($products as $product) {
    echo $product->category->name; // ไม่มี Query เพิ่ม
}
```

### 2. Database Indexing

```php
// Migration: เพิ่ม Index
Schema::table('products', function (Blueprint $table) {
    $table->index('category_id');           // Single Index
    $table->index(['status', 'created_at']); // Composite Index
    $table->fullText('name');               // Full-text Search
});
```

| ควร Index | ไม่ควร Index |
|----------|-------------|
| Foreign Key columns | Column ที่ไม่ค่อย Query |
| Column ที่ใช้ WHERE บ่อย | Column ที่มีค่าซ้ำมาก |
| Column ที่ใช้ ORDER BY | ตารางที่มีข้อมูลน้อย |

### 3. Query Optimization

```php
// ❌ ดึงทุก Column
$products = Product::all();

// ✅ ดึงเฉพาะ Column ที่ต้องการ
$products = Product::select('id', 'name', 'price')->get();

// ❌ ดึงทั้งหมดแล้ว Count ใน PHP
$count = Product::all()->count();

// ✅ Count ในฐานข้อมูล
$count = Product::count();

// ✅ Chunking สำหรับข้อมูลมาก
Product::chunk(200, function ($products) {
    foreach ($products as $product) {
        // ประมวลผลทีละ 200 Records
    }
});
```

### 4. ป้องกัน N+1 อัตโนมัติ

```php
// AppServiceProvider - แจ้งเตือนเมื่อเกิด N+1
use Illuminate\Database\Eloquent\Model;

public function boot()
{
    Model::preventLazyLoading(!app()->isProduction());
}
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| N+1 Problem | ใช้ `with()` Eager Loading แก้ปัญหา |
| Indexing | เพิ่ม Index ใน Column ที่ Query บ่อย |
| select() | ดึงเฉพาะ Column ที่ต้องการ |
| chunk() | ประมวลผลข้อมูลมากทีละส่วน |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-caching.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-code-optimization.md)
