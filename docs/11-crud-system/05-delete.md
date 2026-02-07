# 11.5 Delete (การลบข้อมูล)

> **บทนี้คุณจะได้เรียนรู้**
> - การลบข้อมูลด้วย destroy()
> - Confirmation Dialog ก่อนลบ
> - Soft Deletes
> - การลบไฟล์ที่เกี่ยวข้อง

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. สร้างปุ่มลบพร้อม Confirmation ได้
2. เขียน Controller Method `destroy()` ได้
3. ลบไฟล์ที่เกี่ยวข้องพร้อมกับข้อมูลได้

---

## เนื้อหา

### 1. Controller: destroy()

```php
public function destroy(Product $product)
{
    // ลบรูปภาพ (ถ้ามี)
    if ($product->image) {
        Storage::disk('public')->delete($product->image);
    }

    $product->delete();

    return redirect()->route('products.index')
        ->with('success', 'ลบสินค้าเรียบร้อยแล้ว');
}
```

### 2. ปุ่มลบใน View

```blade
{{-- ปุ่มลบพร้อม Confirmation --}}
<form action="{{ route('products.destroy', $product) }}" method="POST"
      onsubmit="return confirm('คุณต้องการลบสินค้านี้หรือไม่?')">
    @csrf
    @method('DELETE')
    <button type="submit" class="text-red-500">ลบ</button>
</form>
```

### 3. Soft Deletes (ลบแบบไม่ถาวร)

```php
// Migration: เพิ่ม softDeletes
Schema::table('products', function (Blueprint $table) {
    $table->softDeletes(); // เพิ่ม column deleted_at
});

// Model: ใช้ SoftDeletes Trait
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
}

// การใช้งาน
$product->delete();          // Soft Delete (ตั้ง deleted_at)
$product->restore();         // กู้คืน
$product->forceDelete();     // ลบถาวร

// Query
Product::withTrashed()->get();    // รวมที่ลบแล้ว
Product::onlyTrashed()->get();    // เฉพาะที่ลบแล้ว
```

| วิธีลบ | ผลลัพธ์ |
|--------|--------|
| `delete()` | Soft Delete (ตั้ง deleted_at) |
| `forceDelete()` | ลบถาวรจากฐานข้อมูล |
| `restore()` | กู้คืนข้อมูลที่ Soft Delete |

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| destroy() | ลบข้อมูล + ไฟล์ที่เกี่ยวข้อง |
| @method('DELETE') | Spoof HTTP DELETE Method |
| Confirmation | `onsubmit="return confirm()"` |
| Soft Deletes | ลบแบบไม่ถาวร กู้คืนได้ |

---

**Navigation:**
[⬅️ ก่อนหน้า](04-update.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](06-advanced-features.md)
