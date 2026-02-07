# 12.3 Excel Export (การส่งออกข้อมูลเป็น Excel)

> **บทนี้คุณจะได้เรียนรู้**
> - การติดตั้ง Laravel Excel (Maatwebsite)
> - การ Export ข้อมูลเป็น Excel
> - การจัดรูปแบบ Excel (Header, Style)
> - การ Export ข้อมูลจำนวนมาก

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ติดตั้งและใช้งาน Laravel Excel ได้
2. สร้าง Export Class สำหรับส่งออกข้อมูลได้
3. จัดรูปแบบ Excel ให้สวยงามได้

---

## เนื้อหา

### 1. ติดตั้ง Laravel Excel

```bash
composer require maatwebsite/excel
```

### 2. สร้าง Export Class

```bash
php artisan make:export ProductsExport --model=Product
```

```php
// app/Exports/ProductsExport.php
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProductsExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Product::with('category')->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'category' => $product->category->name,
                'created_at' => $product->created_at->format('d/m/Y'),
            ];
        });
    }

    public function headings(): array
    {
        return ['รหัส', 'ชื่อสินค้า', 'ราคา', 'หมวดหมู่', 'วันที่สร้าง'];
    }
}
```

### 3. ใช้งานใน Controller

```php
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductsExport;

public function export()
{
    return Excel::download(new ProductsExport, 'products.xlsx');
}
```

### 4. Export แบบมีเงื่อนไข

```php
class ProductsExport implements FromQuery, WithHeadings
{
    protected $categoryId;

    public function __construct($categoryId = null)
    {
        $this->categoryId = $categoryId;
    }

    public function query()
    {
        $query = Product::query();
        if ($this->categoryId) {
            $query->where('category_id', $this->categoryId);
        }
        return $query;
    }
}

// ใช้งาน
return Excel::download(new ProductsExport($request->category_id), 'products.xlsx');
```

| Interface | หน้าที่ |
|-----------|--------|
| `FromCollection` | Export จาก Collection |
| `FromQuery` | Export จาก Query (ประหยัด Memory) |
| `WithHeadings` | เพิ่ม Header Row |
| `WithMapping` | จัดรูปแบบข้อมูลแต่ละแถว |
| `WithStyles` | จัดรูปแบบ Excel (สี, ฟอนต์) |

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Laravel Excel | Package สำหรับ Export/Import Excel |
| FromCollection | Export จาก Collection |
| FromQuery | Export จาก Query (ข้อมูลมาก) |
| WithHeadings | เพิ่ม Header Row |

---

**Navigation:**
[⬅️ ก่อนหน้า](02-pdf-generation.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](04-realtime-reports.md)
