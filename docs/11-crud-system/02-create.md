# 11.2 Create Operation (การเพิ่มข้อมูล)

> 📖 **บทนี้คุณจะได้เรียนรู้**
> - การสร้างฟอร์มรับข้อมูล (Blade Input)
> - การรับค่าจาก Request
> - การบันทึกข้อมูลแบบปลอดภัยลงฐานข้อมูล

---

## 🎯 วัตถุประสงค์
เพื่อให้สามารถสร้างระบบลงทะเบียนหรือเพิ่มข้อมูลเข้าระบบได้อย่างถูกต้องและปลอดภัย

## 📚 เนื้อหา

### 1. การสร้างฟอร์ม (The View)
ในไฟล์ `resources/views/students/create.blade.php`:
```html
<form action="{{ route('students.store') }}" method="POST">
    @csrf <!-- สิ่งสำคัญ: ป้องกัน CSRF Attack -->
    <input type="text" name="name" placeholder="ชื่อ-นามสกุล">
    <button type="submit">บันทึก</button>
</form>
```

### 2. การจัดการใน Controller
ในไฟล์ `StudentController.php`:
```php
public function store(Request $request)
{
    // 1. ตรวจสอบข้อมูล (Validation)
    $validated = $request->validate([
        'name' => 'required|max:255',
    ]);

    // 2. บันทึกข้อมูล
    Student::create($validated);

    // 3. กลับไปยังหน้าแรกพร้อมข้อความแจ้งเตือน
    return redirect()->route('students.index')->with('success', 'เพิ่มข้อมูลสำเร็จ!');
}
```

#### 🔒 ความปลอดภัยที่ควรทราบ: Mass Assignment
อย่าลืมตั้งค่า `$fillable` ใน Model เสมอ:
```php
class Student extends Model {
    protected $fillable = ['name'];
}
```

---

### 🤖 การใช้ AI ช่วยสร้างฟอร์ม

#### Prompt ตัวอย่าง:
"Create a Laravel Blade form using Tailwind CSS for adding a new product with fields: name, description, price, and category (dropdown)."

---

**Navigation:**
[⬅️ ก่อนหน้า](01-planning.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-read.md)
