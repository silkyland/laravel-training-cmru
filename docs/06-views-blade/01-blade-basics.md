# 6.1 Blade Basics (พื้นฐาน Blade Template)

> **บทนี้คุณจะได้เรียนรู้**
> - Blade Template Engine คืออะไร
> - การแสดงข้อมูลด้วย `{{ }}` และ `{!! !!}`
> - การส่งข้อมูลจาก Controller ไปยัง View
> - Blade Directives พื้นฐาน (@if, @foreach, @for)

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. อธิบายแนวคิดของ Blade Template Engine ได้
2. แสดงข้อมูลจาก Controller บนหน้าเว็บได้อย่างปลอดภัย
3. ใช้ Blade Directives พื้นฐานในการควบคุมการแสดงผลได้
4. ส่งข้อมูลจาก Controller ไปยัง View ได้หลายวิธี

---

## เนื้อหา

### 1. Blade Template Engine คืออะไร?

**Blade** คือ Template Engine ของ Laravel ที่ช่วยให้เราเขียน HTML ผสม PHP ได้อย่างสะอาดและปลอดภัย เปรียบเสมือน **"แม่พิมพ์"** ที่ช่วยสร้างหน้าเว็บ

| คุณสมบัติ | PHP ธรรมดา | Blade |
|----------|----------|-------|
| **แสดงข้อมูล** | `<?php echo $name; ?>` | `{{ $name }}` |
| **XSS Protection** | ต้องใช้ `htmlspecialchars()` เอง | ป้องกันอัตโนมัติ |
| **Template Inheritance** | ไม่มี | `@extends`, `@section` |
| **นามสกุลไฟล์** | `.php` | `.blade.php` |

ไฟล์ Blade เก็บไว้ที่ `resources/views/` เช่น `resources/views/welcome.blade.php`

### 2. การแสดงข้อมูล

```blade
{{-- แสดงข้อมูลแบบปลอดภัย (Escaped) - ป้องกัน XSS --}}
<h1>สวัสดี {{ $name }}</h1>
<p>อีเมล: {{ $user->email }}</p>

{{-- แสดง HTML แบบไม่ Escape (ระวัง XSS!) --}}
{!! $htmlContent !!}

{{-- แสดงค่า Default ถ้าตัวแปรเป็น null --}}
<p>{{ $name ?? 'ไม่ระบุชื่อ' }}</p>

{{-- Comment ใน Blade (ไม่แสดงใน HTML) --}}
{{-- นี่คือ comment --}}
```

| Syntax | หน้าที่ | ปลอดภัย |
|--------|--------|---------|
| `{{ $var }}` | แสดงข้อมูลแบบ Escaped | ✅ ปลอดภัย |
| `{!! $var !!}` | แสดง HTML แบบไม่ Escape | ⚠️ ระวัง XSS |
| `{{-- comment --}}` | Comment (ไม่แสดงใน HTML) | ✅ |

### 3. การส่งข้อมูลจาก Controller ไปยัง View

```php
// วิธีที่ 1: ใช้ compact()
public function index()
{
    $name = 'สมชาย';
    $products = Product::all();
    return view('products.index', compact('name', 'products'));
}

// วิธีที่ 2: ใช้ Array
public function show(Product $product)
{
    return view('products.show', [
        'product' => $product,
        'relatedProducts' => Product::where('category_id', $product->category_id)->take(4)->get(),
    ]);
}

// วิธีที่ 3: ใช้ with()
public function profile()
{
    return view('user.profile')
        ->with('user', auth()->user())
        ->with('orders', auth()->user()->orders);
}
```

### 4. Blade Directives พื้นฐาน

#### เงื่อนไข (@if, @unless, @isset)

```blade
@if($user->isAdmin())
    <span class="badge">Admin</span>
@elseif($user->isModerator())
    <span class="badge">Moderator</span>
@else
    <span class="badge">User</span>
@endif

@unless($user->isBanned())
    <p>ยินดีต้อนรับ!</p>
@endunless

@isset($product)
    <p>{{ $product->name }}</p>
@endisset

@empty($products)
    <p>ไม่มีสินค้า</p>
@endempty
```

#### วนลูป (@foreach, @for, @forelse)

```blade
{{-- foreach --}}
@foreach($products as $product)
    <div class="product">
        <h3>{{ $product->name }}</h3>
        <p>ราคา: {{ number_format($product->price) }} บาท</p>
    </div>
@endforeach

{{-- forelse - มี empty สำหรับกรณีไม่มีข้อมูล --}}
@forelse($products as $product)
    <p>{{ $product->name }}</p>
@empty
    <p>ไม่พบสินค้า</p>
@endforelse

{{-- $loop variable --}}
@foreach($items as $item)
    @if($loop->first) <strong> @endif
    {{ $item->name }}
    @if($loop->first) </strong> @endif
    @unless($loop->last), @endunless
@endforeach
```

#### ตัวแปร `$loop`

| Property | รายละเอียด |
|----------|-----------|
| `$loop->index` | Index เริ่มจาก 0 |
| `$loop->iteration` | ลำดับเริ่มจาก 1 |
| `$loop->first` | เป็น item แรกหรือไม่ |
| `$loop->last` | เป็น item สุดท้ายหรือไม่ |
| `$loop->count` | จำนวน item ทั้งหมด |
| `$loop->remaining` | จำนวน item ที่เหลือ |

---

### การใช้ AI ช่วยพัฒนา

#### Prompt ตัวอย่าง:

```
สร้าง Blade template สำหรับแสดงรายการสินค้า
- แสดงเป็น Card Grid (3 คอลัมน์)
- แต่ละ Card มีรูป, ชื่อ, ราคา, ปุ่มเพิ่มลงตะกร้า
- ถ้าไม่มีสินค้าให้แสดงข้อความ "ไม่พบสินค้า"
- ใช้ TailwindCSS
```

#### การ Review Code จาก AI

เมื่อได้โค้ดจาก AI ให้ตรวจสอบ:
- [ ] ใช้ `{{ }}` แทน `{!! !!}` สำหรับข้อมูลจากผู้ใช้หรือไม่
- [ ] มี `@forelse` พร้อม `@empty` สำหรับกรณีไม่มีข้อมูลหรือไม่
- [ ] ตัวแปรที่ใช้ตรงกับที่ส่งมาจาก Controller หรือไม่

---

## แบบฝึกหัด

### Exercise 1: สร้างหน้าแสดงรายการ

**โจทย์:** สร้าง Blade template `resources/views/students/index.blade.php` ที่:
1. แสดงชื่อหน้า "รายชื่อนักศึกษา"
2. วนลูปแสดงรายชื่อนักศึกษาเป็นตาราง (ลำดับ, ชื่อ, อีเมล)
3. ถ้าไม่มีนักศึกษาให้แสดง "ไม่พบข้อมูลนักศึกษา"

<details>
<summary>ดูเฉลย</summary>

```blade
<h1>รายชื่อนักศึกษา</h1>

<table>
    <thead>
        <tr>
            <th>ลำดับ</th>
            <th>ชื่อ</th>
            <th>อีเมล</th>
        </tr>
    </thead>
    <tbody>
        @forelse($students as $student)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $student->name }}</td>
                <td>{{ $student->email }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="3">ไม่พบข้อมูลนักศึกษา</td>
            </tr>
        @endforelse
    </tbody>
</table>
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Blade Engine | Template Engine ที่ปลอดภัยและอ่านง่าย |
| การแสดงข้อมูล | `{{ }}` (escaped), `{!! !!}` (raw HTML) |
| ส่งข้อมูล | `compact()`, Array, `with()` |
| Directives | `@if`, `@foreach`, `@forelse`, `$loop` |

---

**Navigation:**
[⬅️ ก่อนหน้า](../05-models-eloquent/05-collections.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](02-components.md)
