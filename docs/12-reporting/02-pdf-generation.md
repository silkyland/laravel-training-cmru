# 12.2 PDF Generation (การสร้างรายงาน PDF)

> **บทนี้คุณจะได้เรียนรู้**
> - การติดตั้งและใช้งาน DomPDF
> - การสร้าง PDF จาก Blade Template
> - การจัดรูปแบบ PDF (ภาษาไทย, ตาราง)
> - การดาวน์โหลดและแสดง PDF

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ติดตั้งและใช้งาน DomPDF ใน Laravel ได้
2. สร้าง PDF จาก Blade Template ได้
3. จัดรูปแบบ PDF ให้รองรับภาษาไทยได้

---

## เนื้อหา

### 1. ติดตั้ง DomPDF
```bash
composer require barryvdh/laravel-dompdf
```

### 2. โค้ดตัวอย่างการสร้าง PDF
```php
use Barryvdh\DomPDF\Facade\Pdf;

public function exportPdf()
{
    $products = Product::with('category')->get();

    $pdf = Pdf::loadView('reports.products-pdf', [
        'products' => $products,
        'title' => 'รายงานสินค้า',
        'date' => now()->format('d/m/Y'),
    ]);

    // ดาวน์โหลด
    return $pdf->download('products-report.pdf');

    // หรือแสดงในเบราว์เซอร์
    // return $pdf->stream('products-report.pdf');
}
```

### 3. Blade Template สำหรับ PDF

```blade
{{-- resources/views/reports/products-pdf.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'THSarabunNew', sans-serif; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
        .text-right { text-align: right; }
        .header { text-align: center; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ $title }}</h2>
        <p>วันที่พิมพ์: {{ $date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>ชื่อสินค้า</th>
                <th>หมวดหมู่</th>
                <th class="text-right">ราคา</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $product)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->category->name }}</td>
                    <td class="text-right">{{ number_format($product->price, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
```

### 4. ตั้งค่า PDF

```php
$pdf = Pdf::loadView('reports.products-pdf', $data)
    ->setPaper('a4', 'landscape')  // กระดาษ A4 แนวนอน
    ->setOptions(['defaultFont' => 'THSarabunNew']);
```

| Option | ค่า | หน้าที่ |
|--------|-----|--------|
| `setPaper()` | 'a4', 'letter' | ขนาดกระดาษ |
| orientation | 'portrait', 'landscape' | แนวตั้ง/แนวนอน |
| `defaultFont` | 'THSarabunNew' | ฟอนต์ภาษาไทย |

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| DomPDF | Package สำหรับสร้าง PDF |
| loadView | สร้าง PDF จาก Blade Template |
| download/stream | ดาวน์โหลดหรือแสดงในเบราว์เซอร์ |
| ภาษาไทย | ใช้ฟอนต์ THSarabunNew |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-report-design.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-excel-export.md)
