# 12.1 Report Design (การออกแบบรายงาน)

> **บทนี้คุณจะได้เรียนรู้**
> - การออกแบบ Query สำหรับรายงาน
> - Aggregate Functions (SUM, COUNT, AVG)
> - Group By และ Having
> - การแสดงผลรายงานใน View

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ออกแบบ Query สำหรับรายงานสรุปได้
2. ใช้ Aggregate Functions ใน Eloquent ได้
3. แสดงผลรายงานในรูปแบบตารางและกราฟได้

---

## เนื้อหา

### 1. Query สำหรับรายงาน

```php
// รายงานยอดขายรายเดือน
$monthlySales = Order::selectRaw('
        MONTH(created_at) as month,
        YEAR(created_at) as year,
        COUNT(*) as total_orders,
        SUM(total_amount) as total_sales
    ')
    ->whereYear('created_at', now()->year)
    ->groupByRaw('YEAR(created_at), MONTH(created_at)')
    ->orderBy('month')
    ->get();

// รายงานสินค้าขายดี
$topProducts = Product::withCount('orders')
    ->orderByDesc('orders_count')
    ->take(10)
    ->get();

// รายงานสรุปตามหมวดหมู่
$categoryReport = Category::withCount('products')
    ->withSum('products', 'price')
    ->get();
```

### 2. Aggregate Functions

| Function | หน้าที่ | ตัวอย่าง |
|----------|--------|---------|
| `count()` | นับจำนวน | `Order::count()` |
| `sum('col')` | รวมค่า | `Order::sum('total_amount')` |
| `avg('col')` | ค่าเฉลี่ย | `Product::avg('price')` |
| `min('col')` | ค่าต่ำสุด | `Product::min('price')` |
| `max('col')` | ค่าสูงสุด | `Product::max('price')` |

### 3. แสดงผลรายงาน

```blade
<x-layout title="รายงานยอดขาย">
    <h1>รายงานยอดขายรายเดือน {{ now()->year }}</h1>

    <table>
        <thead>
            <tr>
                <th>เดือน</th>
                <th>จำนวนออเดอร์</th>
                <th>ยอดขายรวม</th>
            </tr>
        </thead>
        <tbody>
            @foreach($monthlySales as $sale)
                <tr>
                    <td>{{ $sale->month }}/{{ $sale->year }}</td>
                    <td>{{ number_format($sale->total_orders) }}</td>
                    <td>{{ number_format($sale->total_sales, 2) }} บาท</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td><strong>รวม</strong></td>
                <td>{{ number_format($monthlySales->sum('total_orders')) }}</td>
                <td>{{ number_format($monthlySales->sum('total_sales'), 2) }} บาท</td>
            </tr>
        </tfoot>
    </table>
</x-layout>
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Aggregate | `count()`, `sum()`, `avg()`, `min()`, `max()` |
| Group By | `groupByRaw()` สำหรับรายงานสรุป |
| withCount | นับ Relationship `withCount('orders')` |
| View | แสดงผลเป็นตาราง + สรุปรวม |

---

**Navigation:**
[⬅️ ก่อนหน้า](../11-crud-system/06-advanced-features.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](02-pdf-generation.md)
