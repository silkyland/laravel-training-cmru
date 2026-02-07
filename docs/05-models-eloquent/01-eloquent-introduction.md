# 5.1 Introduction to Eloquent (พื้นฐาน Eloquent ORM)

> **บทนี้คุณจะได้เรียนรู้**
> - Eloquent ORM คืออะไร?
> - การสร้าง Model และ Convention ที่สำคัญ
> - พื้นฐานการดึงข้อมูล (Retrieve Data)
> - การสร้าง, อัปเดต และลบข้อมูล

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. อธิบายแนวคิดของ ORM และประโยชน์ที่ได้รับจาก Eloquent ได้
2. สร้าง Model และเข้าใจ Convention การตั้งชื่อของ Laravel ได้
3. ดึงข้อมูลจากฐานข้อมูลด้วย Eloquent Methods ต่างๆ ได้
4. สร้าง, อัปเดต และลบข้อมูลผ่าน Eloquent ได้

---

## เนื้อหา

### 1. Eloquent ORM คืออะไร?

**ORM (Object-Relational Mapper)** คือการมอง "ตาราง" ในฐานข้อมูลให้เป็น "Class" ใน PHP และ "ข้อมูล 1 แถว" ให้เป็น "Object" เปรียบเสมือน **"ล่ามแปลภาษา"** ระหว่าง PHP กับ SQL

| แนวคิด | ฐานข้อมูล | Eloquent (PHP) |
|--------|----------|---------------|
| โครงสร้าง | ตาราง (Table) | Model (Class) |
| ข้อมูล 1 แถว | Row | Object / Instance |
| คอลัมน์ | Column | Property / Attribute |
| ความสัมพันธ์ | Foreign Key + JOIN | Relationship Methods |

```php
// SQL แบบดั้งเดิม
// SELECT * FROM products WHERE price > 1000 ORDER BY name;

// Eloquent (อ่านง่ายกว่า ปลอดภัยกว่า)
$products = Product::where('price', '>', 1000)
    ->orderBy('name')
    ->get();
```

### 2. การสร้าง Model

```bash
# สร้าง Model อย่างเดียว
php artisan make:model Product

# สร้าง Model พร้อม Migration
php artisan make:model Product -m

# สร้าง Model พร้อม Migration, Factory, Seeder, Controller
php artisan make:model Product -mfsc
```

ไฟล์จะถูกสร้างที่ `app/Models/Product.php`

#### Convention การตั้งชื่อ

| Model (Singular, PascalCase) | ตาราง (Plural, snake_case) |
|-----------------------------|--------------------------|
| `Product` | `products` |
| `User` | `users` |
| `OrderItem` | `order_items` |
| `Category` | `categories` |

### 3. การดึงข้อมูล (Retrieve Data)

| Method | SQL เทียบเท่า | ตัวอย่าง |
|--------|-------------|---------|
| `all()` | `SELECT *` | `Product::all()` |
| `find($id)` | `WHERE id = ?` | `Product::find(1)` |
| `findOrFail($id)` | `WHERE id = ?` (หรือ 404) | `Product::findOrFail(1)` |
| `first()` | `LIMIT 1` | `Product::where('active', true)->first()` |
| `where()` | `WHERE` | `Product::where('price', '>', 1000)->get()` |
| `orderBy()` | `ORDER BY` | `Product::orderBy('name')->get()` |
| `take()` / `limit()` | `LIMIT` | `Product::take(10)->get()` |

```php
// ดึงข้อมูลทั้งหมด
$products = Product::all();

// ดึงข้อมูลตาม ID (คืน null ถ้าไม่พบ)
$product = Product::find(1);

// ดึงข้อมูลตาม ID (คืน 404 ถ้าไม่พบ)
$product = Product::findOrFail(1);

// การกรองข้อมูล
$expensiveItems = Product::where('price', '>', 1000)->get();

// หลายเงื่อนไข
$results = Product::where('price', '>', 1000)
    ->where('stock', '>', 0)
    ->orderBy('price', 'desc')
    ->take(10)
    ->get();
```

### 4. การสร้าง, อัปเดต และลบข้อมูล

```php
// สร้างข้อมูลใหม่
$product = new Product();
$product->name = 'iPhone 15';
$product->price = 35900;
$product->save();

// สร้างแบบ Mass Assignment (ต้องกำหนด $fillable ใน Model)
$product = Product::create([
    'name' => 'iPhone 15',
    'price' => 35900,
]);

// อัปเดตข้อมูล
$product = Product::find(1);
$product->price = 32900;
$product->save();

// ลบข้อมูล
$product = Product::find(1);
$product->delete();

// ลบโดยไม่ต้องดึงมาก่อน
Product::destroy(1);
Product::destroy([1, 2, 3]);
```

---

### การใช้ AI ช่วยเขียน Query

#### Prompt ตัวอย่าง:

```
Write an Eloquent query to get the top 5 most expensive products
that are in stock, including the category name.
```

#### ผลลัพธ์:

```php
$products = Product::with('category')
    ->where('stock', '>', 0)
    ->orderBy('price', 'desc')
    ->take(5)
    ->get();
```

#### การ Review Code จาก AI

เมื่อได้โค้ดจาก AI ให้ตรวจสอบ:
- [ ] Method ที่ใช้มีอยู่จริงใน Eloquent หรือไม่
- [ ] มีการป้องกัน SQL Injection หรือไม่ (ใช้ Eloquent แทน Raw Query)
- [ ] มีการใช้ Eager Loading เพื่อป้องกัน N+1 Problem หรือไม่

---

## แบบฝึกหัด

### Exercise 1: สร้าง Model และดึงข้อมูล

**โจทย์:** สร้าง Model ชื่อ `Student` และเขียนโค้ดเพื่อดึงข้อมูลนักเรียนที่มีอายุ (age) มากกว่า 20 ปี เรียงตามชื่อ

<details>
<summary>ดูเฉลย</summary>

```bash
php artisan make:model Student -m
```

```php
// ดึงนักเรียนอายุมากกว่า 20 เรียงตามชื่อ
$students = Student::where('age', '>', 20)
    ->orderBy('name')
    ->get();
```

</details>

### Exercise 2: CRUD Operations

**โจทย์:** เขียนโค้ด Eloquent สำหรับ:
1. สร้างสินค้าใหม่ชื่อ "Laravel Book" ราคา 590 บาท
2. อัปเดตราคาสินค้า ID 1 เป็น 490 บาท
3. ลบสินค้า ID 5

<details>
<summary>ดูเฉลย</summary>

```php
// 1. สร้างสินค้าใหม่
$product = Product::create([
    'name' => 'Laravel Book',
    'price' => 590,
]);

// 2. อัปเดตราคา
$product = Product::findOrFail(1);
$product->update(['price' => 490]);

// 3. ลบสินค้า
Product::destroy(5);
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Eloquent ORM | แปลง Table เป็น Class, Row เป็น Object |
| การสร้าง Model | `php artisan make:model` พร้อม Convention ตั้งชื่อ |
| การดึงข้อมูล | `all()`, `find()`, `where()`, `orderBy()`, `take()` |
| CRUD | `create()`, `save()`, `update()`, `delete()`, `destroy()` |

---

**Navigation:**
[⬅️ ก่อนหน้า](../04-controllers/03-ai-assisted-development.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](02-database-design.md)
