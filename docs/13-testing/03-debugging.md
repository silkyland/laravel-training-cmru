# 13.3 Debugging (การดีบัก)

> **บทนี้คุณจะได้เรียนรู้**
> - เครื่องมือ Debugging ใน Laravel
> - dd(), dump(), Log
> - Laravel Debugbar
> - Error Handling

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ใช้เครื่องมือ Debugging ใน Laravel ได้
2. อ่านและเข้าใจ Error Message ได้
3. ใช้ Logging บันทึกข้อมูลสำหรับ Debug ได้

---

## เนื้อหา

### 1. เครื่องมือ Debug พื้นฐาน

```php
// dd() - Dump and Die (หยุดทำงาน)
dd($variable);
dd($request->all());

// dump() - Dump แต่ไม่หยุด
dump($variable);

// logger() - บันทึกลง Log File
logger('ข้อความ debug', ['data' => $variable]);

// Log Facade
use Illuminate\Support\Facades\Log;
Log::info('สร้างสินค้าใหม่', ['product_id' => $product->id]);
Log::error('เกิดข้อผิดพลาด', ['error' => $e->getMessage()]);
```

| เครื่องมือ | หยุดทำงาน | บันทึกไฟล์ | ใช้เมื่อ |
|-----------|----------|-----------|---------|
| `dd()` | ✅ | ❌ | Debug ระหว่างพัฒนา |
| `dump()` | ❌ | ❌ | ดูค่าโดยไม่หยุด |
| `Log::info()` | ❌ | ✅ | บันทึกใน Production |
| `logger()` | ❌ | ✅ | บันทึกแบบย่อ |

### 2. Laravel Debugbar

```bash
composer require barryvdh/laravel-debugbar --dev
```

แสดงข้อมูลที่ด้านล่างหน้าเว็บ:
- **Queries** - SQL ที่รัน + เวลา
- **Models** - Model ที่โหลด
- **Views** - View ที่ Render
- **Route** - Route ที่ Match
- **Session** - ข้อมูล Session

### 3. Error Handling

```php
// Try-Catch
try {
    $product = Product::findOrFail($id);
} catch (ModelNotFoundException $e) {
    return redirect()->route('products.index')
        ->with('error', 'ไม่พบสินค้า');
}

// Custom Error Page
// resources/views/errors/404.blade.php
// resources/views/errors/500.blade.php
```

### 4. Debug Query

```php
// ดู SQL Query ที่ Eloquent สร้าง
$query = Product::where('price', '>', 100)->toSql();
dd($query); // "select * from `products` where `price` > ?"

// ดู Query พร้อม Bindings
$query = Product::where('price', '>', 100)->toRawSql();
dd($query); // "select * from `products` where `price` > 100"
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| dd()/dump() | Debug ระหว่างพัฒนา |
| Log | บันทึกข้อมูลลงไฟล์ |
| Debugbar | แสดง Query, Model, Route |
| toSql() | ดู SQL ที่ Eloquent สร้าง |

---

**Navigation:**
[⬅️ ก่อนหน้า](02-writing-tests.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../14-performance/01-caching.md)
