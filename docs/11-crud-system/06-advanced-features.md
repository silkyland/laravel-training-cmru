# 11.6 Advanced Features (ฟีเจอร์เพิ่มเติม)

> **บทนี้คุณจะได้เรียนรู้**
> - Export ข้อมูลเป็น CSV/Excel
> - Import ข้อมูลจากไฟล์
> - Bulk Actions (ลบหลายรายการ)
> - Activity Log

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. Export ข้อมูลเป็น CSV ได้
2. สร้าง Bulk Actions สำหรับจัดการหลายรายการพร้อมกันได้
3. บันทึก Activity Log ได้

---

## เนื้อหา

### 1. Export เป็น CSV

```php
public function export()
{
    $products = Product::all();

    $headers = [
        'Content-Type' => 'text/csv',
        'Content-Disposition' => 'attachment; filename="products.csv"',
    ];

    $callback = function () use ($products) {
        $file = fopen('php://output', 'w');
        // Header
        fputcsv($file, ['ID', 'ชื่อ', 'ราคา', 'หมวดหมู่']);
        // Data
        foreach ($products as $product) {
            fputcsv($file, [
                $product->id,
                $product->name,
                $product->price,
                $product->category->name,
            ]);
        }
        fclose($file);
    };

    return response()->stream($callback, 200, $headers);
}
```

### 2. Bulk Delete

```php
// Controller
public function bulkDelete(Request $request)
{
    $request->validate(['ids' => 'required|array']);
    Product::whereIn('id', $request->ids)->delete();
    return redirect()->back()->with('success', 'ลบข้อมูลที่เลือกแล้ว');
}
```

```blade
{{-- View: Checkbox สำหรับเลือกหลายรายการ --}}
<form action="{{ route('products.bulk-delete') }}" method="POST">
    @csrf
    @method('DELETE')
    @foreach($products as $product)
        <tr>
            <td><input type="checkbox" name="ids[]" value="{{ $product->id }}"></td>
            <td>{{ $product->name }}</td>
        </tr>
    @endforeach
    <button type="submit" onclick="return confirm('ลบรายการที่เลือก?')">
        ลบที่เลือก
    </button>
</form>
```

### 3. Activity Log

```php
// บันทึก Log ใน Controller
use Illuminate\Support\Facades\Log;

public function store(Request $request)
{
    $product = Product::create($validated);

    Log::info('สร้างสินค้าใหม่', [
        'product_id' => $product->id,
        'user_id' => auth()->id(),
        'name' => $product->name,
    ]);

    return redirect()->route('products.index');
}
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Export CSV | `response()->stream()` สร้างไฟล์ CSV |
| Bulk Actions | `whereIn('id', $ids)` จัดการหลายรายการ |
| Activity Log | `Log::info()` บันทึกกิจกรรม |

---

**Navigation:**
[⬅️ ก่อนหน้า](05-delete.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../12-reporting/01-query-reports.md)
