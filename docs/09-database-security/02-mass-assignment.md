# 9.2 Mass Assignment Protection (การป้องกัน Mass Assignment)

> **บทนี้คุณจะได้เรียนรู้**
> - Mass Assignment คืออะไร
> - $fillable vs $guarded
> - ตัวอย่างการโจมตี Mass Assignment
> - Best Practices

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. อธิบายช่องโหว่ Mass Assignment ได้
2. ใช้ `$fillable` และ `$guarded` ป้องกันได้
3. เลือกใช้ `$fillable` หรือ `$guarded` ได้อย่างเหมาะสม

---

## เนื้อหา

### 1. Mass Assignment คืออะไร?

**Mass Assignment** คือการกำหนดค่าหลาย field พร้อมกันผ่าน Array เช่น `create()` หรือ `update()` ถ้าไม่ป้องกัน ผู้โจมตีอาจแอบส่ง field ที่ไม่ควรแก้ไขมาด้วย

```php
// ❌ อันตราย - ถ้าผู้โจมตีส่ง role=admin มาด้วย
User::create($request->all());
// อาจสร้าง User ที่มี role=admin โดยไม่ตั้งใจ!

// ✅ ปลอดภัย - ระบุเฉพาะ field ที่อนุญาต
User::create($request->only(['name', 'email', 'password']));
```

### 2. $fillable vs $guarded

```php
// วิธีที่ 1: $fillable - ระบุ field ที่อนุญาต (Whitelist)
class User extends Model
{
    protected $fillable = ['name', 'email', 'password'];
    // เฉพาะ name, email, password เท่านั้นที่ Mass Assign ได้
}

// วิธีที่ 2: $guarded - ระบุ field ที่ห้าม (Blacklist)
class User extends Model
{
    protected $guarded = ['id', 'role', 'is_admin'];
    // ทุก field ยกเว้น id, role, is_admin สามารถ Mass Assign ได้
}
```

| คุณสมบัติ | `$fillable` | `$guarded` |
|----------|------------|-----------|
| **แนวคิด** | Whitelist (อนุญาตเฉพาะที่ระบุ) | Blacklist (ห้ามเฉพาะที่ระบุ) |
| **ปลอดภัยกว่า** | ✅ ปลอดภัยกว่า | ⚠️ อาจลืม field ใหม่ |
| **เหมาะกับ** | Model ที่มี field สำคัญ | Model ที่มี field น้อย |
| **แนะนำ** | ✅ แนะนำ | ใช้ได้แต่ระวัง |

### 3. ตัวอย่างการโจมตี

```php
// สมมติ User Model ไม่มี $fillable/$guarded
// ผู้โจมตีส่ง POST Request:
// name=hacker&email=hack@test.com&password=1234&role=admin&is_admin=1

User::create($request->all());
// สร้าง User ที่เป็น Admin ทันที!
```

### 4. Best Practices

```php
// ✅ ใช้ $fillable เสมอ
protected $fillable = ['name', 'email', 'password'];

// ✅ ใช้ validated() จาก Form Request
public function store(StoreUserRequest $request)
{
    User::create($request->validated());
}

// ✅ ใช้ only() เมื่อไม่มี Form Request
User::create($request->only(['name', 'email', 'password']));
```

---

## แบบฝึกหัด

### Exercise 1: ป้องกัน Mass Assignment

**โจทย์:** กำหนด `$fillable` สำหรับ Model `Product` ที่มี field: id, name, price, description, image, user_id, is_featured

<details>
<summary>ดูเฉลย</summary>

```php
class Product extends Model
{
    // ไม่รวม id (auto), user_id (กำหนดใน Controller), is_featured (Admin เท่านั้น)
    protected $fillable = ['name', 'price', 'description', 'image'];
}
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Mass Assignment | การกำหนดค่าหลาย field พร้อมกัน อาจเป็นช่องโหว่ |
| $fillable | Whitelist - ระบุ field ที่อนุญาต (แนะนำ) |
| $guarded | Blacklist - ระบุ field ที่ห้าม |
| Best Practice | ใช้ `$fillable` + `$request->validated()` |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-sql-injection.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-encryption.md)
