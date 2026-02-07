# 7.2 Validation (การตรวจสอบข้อมูล)

> **บทนี้คุณจะได้เรียนรู้**
> - Validation Rules ที่ใช้บ่อย
> - Form Request Validation
> - Custom Validation Rules
> - การแสดง Error Messages ภาษาไทย

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ใช้ Validation Rules ตรวจสอบข้อมูลจากฟอร์มได้
2. สร้าง Form Request สำหรับ Validation ที่ซับซ้อนได้
3. สร้าง Custom Validation Rules ได้
4. แสดง Error Messages เป็นภาษาไทยได้

---

## เนื้อหา

### 1. Validation พื้นฐาน

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:8|confirmed',
        'age' => 'required|integer|between:18,60',
        'avatar' => 'nullable|image|max:2048',
    ]);

    // $validated มีเฉพาะข้อมูลที่ผ่าน Validation
    User::create($validated);
}
```

### 2. Validation Rules ที่ใช้บ่อย

| Rule | หน้าที่ | ตัวอย่าง |
|------|--------|---------|
| `required` | ต้องกรอก | `'name' => 'required'` |
| `string` | ต้องเป็นข้อความ | `'name' => 'string'` |
| `integer` | ต้องเป็นจำนวนเต็ม | `'age' => 'integer'` |
| `numeric` | ต้องเป็นตัวเลข | `'price' => 'numeric'` |
| `email` | ต้องเป็นอีเมล | `'email' => 'email'` |
| `min:n` | ค่าต่ำสุด | `'password' => 'min:8'` |
| `max:n` | ค่าสูงสุด | `'name' => 'max:255'` |
| `between:a,b` | อยู่ในช่วง | `'age' => 'between:18,60'` |
| `unique:table,col` | ไม่ซ้ำในตาราง | `'email' => 'unique:users,email'` |
| `exists:table,col` | ต้องมีในตาราง | `'role_id' => 'exists:roles,id'` |
| `confirmed` | ต้องมี field _confirmation | `'password' => 'confirmed'` |
| `image` | ต้องเป็นรูปภาพ | `'avatar' => 'image'` |
| `mimes:jpg,png` | ต้องเป็นไฟล์ประเภทที่ระบุ | `'file' => 'mimes:pdf,doc'` |
| `nullable` | อนุญาตให้เป็น null | `'phone' => 'nullable'` |
| `date` | ต้องเป็นวันที่ | `'birthday' => 'date'` |
| `in:a,b,c` | ต้องเป็นค่าที่กำหนด | `'status' => 'in:active,inactive'` |

### 3. Form Request Validation

สำหรับ Validation ที่ซับซ้อน ควรแยกออกเป็น Form Request:

```bash
php artisan make:request StoreProductRequest
```

```php
// app/Http/Requests/StoreProductRequest.php
class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // หรือตรวจสอบสิทธิ์
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'กรุณากรอกชื่อสินค้า',
            'name.max' => 'ชื่อสินค้าต้องไม่เกิน 255 ตัวอักษร',
            'price.required' => 'กรุณากรอกราคา',
            'price.numeric' => 'ราคาต้องเป็นตัวเลข',
            'price.min' => 'ราคาต้องไม่ต่ำกว่า 0',
        ];
    }
}
```

```php
// ใช้ใน Controller
public function store(StoreProductRequest $request)
{
    // ข้อมูลผ่าน Validation แล้ว
    Product::create($request->validated());
    return redirect()->route('products.index')->with('success', 'เพิ่มสินค้าแล้ว');
}
```

### 4. การแสดง Errors ใน Blade

```blade
{{-- แสดง Error ทั้งหมด --}}
@if($errors->any())
    <div class="bg-red-100 p-4 rounded">
        <ul>
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

{{-- แสดง Error แต่ละ field --}}
<input type="text" name="name" value="{{ old('name') }}"
       class="@error('name') border-red-500 @enderror">
@error('name')
    <p class="text-red-500 text-sm">{{ $message }}</p>
@enderror
```

---

### การใช้ AI ช่วยพัฒนา

#### Prompt ตัวอย่าง:

```
สร้าง Form Request สำหรับระบบลงทะเบียนนักศึกษาที่มี:
- ชื่อ-นามสกุล (ต้องกรอก, ไม่เกิน 255)
- รหัสนักศึกษา (ต้องกรอก, ไม่ซ้ำ, format: 65XXXXXX)
- อีเมล (ต้องกรอก, ไม่ซ้ำ, ต้องเป็น @cmru.ac.th)
- Error Messages เป็นภาษาไทย
```

---

## แบบฝึกหัด

### Exercise 1: สร้าง Form Request

**โจทย์:** สร้าง `UpdateProfileRequest` สำหรับแก้ไขโปรไฟล์ที่มี:
1. ชื่อ (ต้องกรอก, ไม่เกิน 255)
2. อีเมล (ต้องกรอก, ไม่ซ้ำ ยกเว้นของตัวเอง)
3. เบอร์โทร (ไม่บังคับ, format: 0XXXXXXXXX)

<details>
<summary>ดูเฉลย</summary>

```php
class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $this->user()->id,
            'phone' => 'nullable|regex:/^0[0-9]{9}$/',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'กรุณากรอกชื่อ',
            'email.unique' => 'อีเมลนี้ถูกใช้แล้ว',
            'phone.regex' => 'เบอร์โทรต้องเป็นรูปแบบ 0XXXXXXXXX',
        ];
    }
}
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Validation พื้นฐาน | `$request->validate()` พร้อม Rules |
| Rules ที่ใช้บ่อย | required, string, email, unique, min, max |
| Form Request | แยก Validation ออกเป็น Class |
| Error Messages | `messages()` สำหรับข้อความภาษาไทย |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-form-handling.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../08-authentication/01-auth-introduction.md)
