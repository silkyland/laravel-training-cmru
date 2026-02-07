# 5.1 Introduction to Eloquent (พื้นฐาน Eloquent ORM)

> 📖 **บทนี้คุณจะได้เรียนรู้**
> - Eloquent ORM คืออะไร?
> - การสร้าง Model
> - พื้นฐานการดึงข้อมูล (Retrieve Data)

---

## 🎯 วัตถุประสงค์
เพื่อให้สามารถจัดการฐานข้อมูลได้โดยไม่ต้องเขียน SQL แต่ใช้ภาษา PHP ที่อ่านง่ายกว่าแทน

## 📚 เนื้อหา

### 1. Eloquent ORM คืออะไร?
ORM (Object-Relational Mapper) คือการมอง "ตาราง" ในฐานข้อมูลให้เป็น "Class" ใน PHP และ "ข้อมูล 1 แถว" ให้เป็น "Object"

### 2. การสร้าง Model
ใช้คำสั่ง Artisan:
```bash
php artisan make:model Product
```
ไฟล์จะถูกสร้างที่ `app/Models/Product.php`

### 3. การใช้งานพื้นฐาน

#### 💡 ดึงข้อมูลทั้งหมด
```php
$products = Product::all(); // SELECT * FROM products
```

#### 💡 ดึงข้อมูลตาม ID
```php
$product = Product::find(1); // SELECT * FROM products WHERE id = 1
```

#### 💡 การกรองข้อมูล
```php
$expensiveItems = Product::where('price', '>', 1000)->get();
```

---

### 🤖 การใช้ AI ช่วยเขียน Query

#### Prompt ตัวอย่าง:
"Write an Eloquent query to get the top 5 most expensive products that are in stock."

#### ผลลัพธ์:
```php
$products = Product::where('stock', '>', 0)
    ->orderBy('price', 'desc')
    ->take(5)
    ->get();
```

---

## 🎓 แบบฝึกหัด
**โจทย์:** จงสร้าง Model ชื่อ `Student` และเขียนโค้ดเพื่อดึงข้อมูลนักเรียนที่มีอายุ (age) มากกว่า 20 ปี

---

**Navigation:**
[⬅️ ก่อนหน้า](../04-controllers/03-ai-assisted-development.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](02-database-design.md)
