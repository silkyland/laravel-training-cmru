# 12.4 Dashboard และ Charts (แดชบอร์ดและกราฟ)

> **บทนี้คุณจะได้เรียนรู้**
> - การสร้าง Dashboard สรุปข้อมูล
> - การใช้ Chart.js แสดงกราฟ
> - การส่งข้อมูลจาก Controller ไปยัง Chart
> - การกรองข้อมูลตามช่วงเวลา

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. สร้าง Dashboard แสดงข้อมูลสรุปได้
2. ใช้ Chart.js แสดงกราฟใน Laravel ได้
3. กรองข้อมูลรายงานตามช่วงเวลาได้

---

## เนื้อหา

### 1. Dashboard Controller

```php
class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_revenue' => Order::sum('total_amount'),
            'new_users' => User::whereMonth('created_at', now()->month)->count(),
        ];

        // ข้อมูลสำหรับกราฟ
        $monthlySales = Order::selectRaw('MONTH(created_at) as month, SUM(total_amount) as total')
            ->whereYear('created_at', now()->year)
            ->groupByRaw('MONTH(created_at)')
            ->pluck('total', 'month');

        return view('dashboard', compact('stats', 'monthlySales'));
    }
}
```

### 2. แสดงกราฟด้วย Chart.js

```blade
<x-layout title="Dashboard">
    {{-- สรุปตัวเลข --}}
    <div class="grid grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded shadow">
            <h3>สินค้าทั้งหมด</h3>
            <p class="text-2xl font-bold">{{ number_format($stats['total_products']) }}</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
            <h3>ออเดอร์ทั้งหมด</h3>
            <p class="text-2xl font-bold">{{ number_format($stats['total_orders']) }}</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
            <h3>รายได้รวม</h3>
            <p class="text-2xl font-bold">{{ number_format($stats['total_revenue'], 2) }} บาท</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
            <h3>ผู้ใช้ใหม่เดือนนี้</h3>
            <p class="text-2xl font-bold">{{ number_format($stats['new_users']) }}</p>
        </div>
    </div>

    {{-- กราฟ --}}
    <canvas id="salesChart" width="400" height="200"></canvas>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const ctx = document.getElementById('salesChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: @js(array_map(fn($m) => "เดือน $m", range(1, 12))),
                datasets: [{
                    label: 'ยอดขาย (บาท)',
                    data: @js(collect(range(1, 12))->map(fn($m) => $monthlySales[$m] ?? 0)->values()),
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                }]
            }
        });
    </script>
</x-layout>
```

### 3. กรองตามช่วงเวลา

```php
public function index(Request $request)
{
    $startDate = $request->start_date ?? now()->startOfMonth();
    $endDate = $request->end_date ?? now()->endOfMonth();

    $orders = Order::whereBetween('created_at', [$startDate, $endDate])->get();

    return view('dashboard', compact('orders', 'startDate', 'endDate'));
}
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Dashboard | แสดงข้อมูลสรุปด้วย Stats Cards |
| Chart.js | สร้างกราฟ Bar, Line, Pie |
| @js() | ส่งข้อมูล PHP ไป JavaScript อย่างปลอดภัย |
| Date Filter | กรองข้อมูลตามช่วงเวลา |

---

**Navigation:**
[⬅️ ก่อนหน้า](03-excel-export.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../13-testing/01-testing-introduction.md)
