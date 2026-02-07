# 6.4 Blade Directives (คำสั่งพิเศษใน Blade)

> **บทนี้คุณจะได้เรียนรู้**
> - Authentication Directives (@auth, @guest)
> - Authorization Directives (@can, @cannot)
> - Form Directives (@csrf, @method, @error)
> - Custom Directives

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ใช้ Authentication Directives ควบคุมการแสดงผลตามสถานะ Login ได้
2. ใช้ Authorization Directives ตรวจสอบสิทธิ์ผู้ใช้ได้
3. ใช้ Form Directives สร้างฟอร์มที่ปลอดภัยได้
4. สร้าง Custom Directives ได้

---

## เนื้อหา

### 1. Authentication Directives

```blade
@auth
    <p>สวัสดี {{ auth()->user()->name }}</p>
    <a href="{{ route('logout') }}">ออกจากระบบ</a>
@endauth

@guest
    <a href="{{ route('login') }}">เข้าสู่ระบบ</a>
    <a href="{{ route('register') }}">สมัครสมาชิก</a>
@endguest
```

| Directive | แสดงเมื่อ |
|-----------|---------|
| `@auth` | ผู้ใช้ Login แล้ว |
| `@guest` | ผู้ใช้ยังไม่ได้ Login |
| `@auth('admin')` | Login ด้วย Guard ชื่อ admin |

### 2. Authorization Directives

```blade
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">แก้ไข</a>
@endcan

@cannot('delete', $post)
    <p class="text-muted">คุณไม่มีสิทธิ์ลบโพสต์นี้</p>
@endcannot

@canany(['update', 'delete'], $post)
    <div class="admin-actions">
        @can('update', $post)
            <button>แก้ไข</button>
        @endcan
        @can('delete', $post)
            <button>ลบ</button>
        @endcan
    </div>
@endcanany
```

### 3. Form Directives

```blade
<form action="{{ route('products.store') }}" method="POST">
    @csrf {{-- ป้องกัน CSRF Attack (จำเป็นทุกฟอร์ม POST) --}}

    <input type="text" name="name" value="{{ old('name') }}">

    @error('name')
        <span class="text-red-500">{{ $message }}</span>
    @enderror

    <button type="submit">บันทึก</button>
</form>

{{-- สำหรับ PUT/PATCH/DELETE --}}
<form action="{{ route('products.update', $product) }}" method="POST">
    @csrf
    @method('PUT') {{-- Spoof HTTP Method --}}

    <input type="text" name="name" value="{{ old('name', $product->name) }}">
    <button type="submit">อัปเดต</button>
</form>
```

| Directive | หน้าที่ |
|-----------|--------|
| `@csrf` | สร้าง CSRF Token (จำเป็นทุกฟอร์ม) |
| `@method('PUT')` | Spoof HTTP Method สำหรับ PUT/PATCH/DELETE |
| `@error('field')` | แสดง Validation Error ของ field นั้น |
| `old('field')` | ดึงค่าเดิมที่กรอกไว้ก่อน Validation Error |

### 4. Directives อื่นๆ ที่มีประโยชน์

```blade
{{-- แสดง Environment --}}
@env('local')
    <div class="debug-bar">Debug Mode</div>
@endenv

@production
    <script src="/analytics.js"></script>
@endproduction

{{-- แสดงครั้งเดียว (ไม่ซ้ำใน loop) --}}
@foreach($products as $product)
    @once
        <style>.product { border: 1px solid #ccc; }</style>
    @endonce
    <div class="product">{{ $product->name }}</div>
@endforeach

{{-- Class Conditional --}}
<div @class([
    'p-4',
    'bg-green-100' => $product->inStock(),
    'bg-red-100' => !$product->inStock(),
])>
    {{ $product->name }}
</div>
```

### 5. Custom Directives

```php
// ใน AppServiceProvider::boot()
use Illuminate\Support\Facades\Blade;

Blade::directive('money', function ($amount) {
    return "<?php echo number_format($amount, 2) . ' บาท'; ?>";
});

Blade::directive('datetime', function ($expression) {
    return "<?php echo ($expression)->format('d/m/Y H:i'); ?>";
});
```

```blade
{{-- การใช้งาน --}}
<p>ราคา: @money($product->price)</p>
<p>วันที่: @datetime($order->created_at)</p>
```

---

### การใช้ AI ช่วยพัฒนา

#### Prompt ตัวอย่าง:

```
สร้าง Blade form สำหรับแก้ไขข้อมูลสินค้าที่มี:
- ชื่อ, ราคา, รายละเอียด, หมวดหมู่ (dropdown)
- แสดง Validation Errors
- ใช้ old() สำหรับค่าเดิม
- ใช้ @method('PUT')
```

#### การ Review Code จาก AI

เมื่อได้โค้ดจาก AI ให้ตรวจสอบ:
- [ ] มี `@csrf` ในทุกฟอร์มหรือไม่
- [ ] ใช้ `@method()` สำหรับ PUT/PATCH/DELETE หรือไม่
- [ ] มี `@error` สำหรับทุก field หรือไม่
- [ ] ใช้ `old()` เพื่อเก็บค่าเดิมหรือไม่

---

## แบบฝึกหัด

### Exercise 1: สร้างฟอร์มพร้อม Validation

**โจทย์:** สร้างฟอร์มสำหรับเพิ่มนักศึกษาที่มี field: ชื่อ, อีเมล, คณะ (dropdown) พร้อม Validation Error แสดงผล

<details>
<summary>ดูเฉลย</summary>

```blade
<form action="{{ route('students.store') }}" method="POST">
    @csrf

    <div>
        <label>ชื่อ</label>
        <input type="text" name="name" value="{{ old('name') }}">
        @error('name')
            <span class="text-red-500">{{ $message }}</span>
        @enderror
    </div>

    <div>
        <label>อีเมล</label>
        <input type="email" name="email" value="{{ old('email') }}">
        @error('email')
            <span class="text-red-500">{{ $message }}</span>
        @enderror
    </div>

    <div>
        <label>คณะ</label>
        <select name="faculty">
            <option value="">-- เลือกคณะ --</option>
            @foreach($faculties as $faculty)
                <option value="{{ $faculty->id }}"
                    {{ old('faculty') == $faculty->id ? 'selected' : '' }}>
                    {{ $faculty->name }}
                </option>
            @endforeach
        </select>
        @error('faculty')
            <span class="text-red-500">{{ $message }}</span>
        @enderror
    </div>

    <button type="submit">บันทึก</button>
</form>
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Authentication | `@auth`, `@guest` ตรวจสอบสถานะ Login |
| Authorization | `@can`, `@cannot` ตรวจสอบสิทธิ์ |
| Form | `@csrf`, `@method`, `@error`, `old()` |
| Custom Directives | สร้าง Directive ใหม่ด้วย `Blade::directive()` |

---

**Navigation:**
[⬅️ ก่อนหน้า](03-layouts.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](05-frontend-assets.md)
