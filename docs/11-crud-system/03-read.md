# 11.3 Read Operation (การแสดงรายการข้อมูล)

> 📖 **บทนี้คุณจะได้เรียนรู้**
> - การดึงข้อมูลแบบแบ่งหน้า (Pagination)
> - การแสดงผลข้อมูลในรูปแบบตาราง
> - ระบบค้นหาและกรองข้อมูลเบื้องต้น

---

## 🎯 วัตถุประสงค์
เพื่อให้สามารถนำข้อมูลที่เก็บไว้ในฐานข้อมูลมาแสดงผลให้ผู้ใช้ดูได้อย่างเป็นระเบียบและค้นหาได้ง่าย

## 📚 เนื้อหา

### 1. การดึงข้อมูลใน Controller
เรามักไม่ดึงข้อมูลทั้งหมดมาแสดงในครั้งเดียวถ้ามีข้อมูลหลักพันแถว ควรใช้ `paginate()`:

```php
public function index(Request $request)
{
    $query = Student::query();

    // ระบบค้นหา
    if ($request->has('search')) {
        $query->where('name', 'like', '%' . $request->search . '%');
    }

    $students = $query->paginate(10); // แสดงหน้าละ 10 รายการ
    
    return view('students.index', compact('students'));
}
```

### 2. การแสดงผลใน Blade
```html
<table>
    <thead>
        <tr><th>ชื่อ</th><th>การจัดการ</th></tr>
    </thead>
    <tbody>
        @foreach($students as $student)
        <tr>
            <td>{{ $student->name }}</td>
            <td><a href="{{ route('students.edit', $student->id) }}">แก้ไข</a></td>
        </tr>
        @endforeach
    </tbody>
</table>

<!-- แสดงปุ่มเปลี่ยนหน้า (Pagination Links) -->
{{ $students->links() }}
```

---

### 🤖 การใช้ AI ช่วยเขียน Logic การกรอง

#### Prompt ตัวอย่าง:
"In Laravel, how do I create a search filter that can filter students by both 'name' and 'student_id' simultaneously?"

---

**Navigation:**
[⬅️ ก่อนหน้า](02-create.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](04-update.md)
