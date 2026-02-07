# 5.5 Collections (การจัดการชุดข้อมูล)

> **บทนี้คุณจะได้เรียนรู้**
> - Laravel Collections คืออะไร
> - Methods ที่ใช้บ่อยสำหรับจัดการข้อมูล
> - การ Chain Methods เพื่อประมวลผลข้อมูล
> - ความแตกต่างระหว่าง Collection กับ Array

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. อธิบายแนวคิดของ Laravel Collections ได้
2. ใช้ Collection Methods ที่สำคัญในการจัดการข้อมูลได้
3. Chain หลาย Methods เข้าด้วยกันเพื่อประมวลผลข้อมูลที่ซับซ้อนได้
4. เลือกใช้ Collection แทน Array Loop ได้อย่างเหมาะสม

---

## เนื้อหา

### 1. Collections คืออะไร?

**Collection** คือ Wrapper ที่ครอบ Array ให้มี Methods มากมายสำหรับจัดการข้อมูล เปรียบเสมือน **"กล่องเครื่องมือ"** ที่มีเครื่องมือพร้อมใช้แทนการเขียน Loop เอง

```php
// สร้าง Collection จาก Array
$collection = collect([1, 2, 3, 4, 5]);

// Eloquent คืน Collection อัตโนมัติ
$users = User::all(); // ได้ Eloquent Collection
```

| คุณสมบัติ | Array | Collection |
|----------|-------|-----------|
| **Methods** | จำกัด (array_map, array_filter) | มากกว่า 100 methods |
| **Chainable** | ไม่ได้ | Chain ได้ไม่จำกัด |
| **Readable** | อ่านยากเมื่อซ้อน | อ่านง่าย เป็นขั้นตอน |
| **Immutable** | แก้ไข Array เดิม | คืน Collection ใหม่ |

### 2. Methods ที่ใช้บ่อย

#### กลุ่ม: กรองข้อมูล (Filtering)

```php
$products = collect([
    ['name' => 'iPhone', 'price' => 35900],
    ['name' => 'AirPods', 'price' => 6900],
    ['name' => 'MacBook', 'price' => 45900],
    ['name' => 'iPad', 'price' => 14900],
]);

// filter - กรองตามเงื่อนไข
$expensive = $products->filter(fn ($p) => $p['price'] > 10000);

// where - กรองตาม key/value
$users = User::all();
$admins = $users->where('role', 'admin');

// first / last
$cheapest = $products->sortBy('price')->first();
$mostExpensive = $products->sortBy('price')->last();
```

#### กลุ่ม: แปลงข้อมูล (Transforming)

```php
// map - แปลงทุก item
$names = $products->map(fn ($p) => $p['name']);
// ['iPhone', 'AirPods', 'MacBook', 'iPad']

// pluck - ดึงเฉพาะ key ที่ต้องการ
$names = $products->pluck('name');
// ['iPhone', 'AirPods', 'MacBook', 'iPad']

// flatMap - map แล้ว flatten
$tags = $posts->flatMap(fn ($post) => $post->tags);
```

#### กลุ่ม: คำนวณ (Aggregation)

```php
// sum - รวมค่า
$total = $products->sum('price'); // 103600

// avg - ค่าเฉลี่ย
$avgPrice = $products->avg('price'); // 25900

// count - นับจำนวน
$count = $products->count(); // 4

// min / max
$min = $products->min('price'); // 6900
$max = $products->max('price'); // 45900
```

#### กลุ่ม: จัดเรียงและจัดกลุ่ม

```php
// sortBy / sortByDesc
$sorted = $products->sortBy('price');
$sortedDesc = $products->sortByDesc('price');

// groupBy - จัดกลุ่ม
$grouped = $users->groupBy('department');
// ['IT' => [...], 'HR' => [...], 'Finance' => [...]]

// chunk - แบ่งเป็นกลุ่มย่อย
$chunks = $products->chunk(2);
// [[iPhone, AirPods], [MacBook, iPad]]

// unique - ลบค่าซ้ำ
$unique = collect([1, 2, 2, 3, 3])->unique(); // [1, 2, 3]
```

### 3. Method Chaining

ข้อดีของ Collection คือสามารถ Chain หลาย Methods ต่อกันได้:

```php
// ตัวอย่าง: หา 3 สินค้าที่แพงที่สุดที่ยังมีในสต็อก แสดงเฉพาะชื่อและราคา
$result = Product::all()
    ->where('stock', '>', 0)
    ->sortByDesc('price')
    ->take(3)
    ->map(fn ($p) => [
        'name' => $p->name,
        'price' => number_format($p->price) . ' บาท',
    ])
    ->values();
```

```php
// ตัวอย่าง: สรุปยอดขายตามหมวดหมู่
$summary = Order::with('items.product.category')->get()
    ->flatMap(fn ($order) => $order->items)
    ->groupBy(fn ($item) => $item->product->category->name)
    ->map(fn ($items) => [
        'total_items' => $items->count(),
        'total_revenue' => $items->sum(fn ($i) => $i->price * $i->quantity),
    ]);
```

### 4. Collection vs Loop

```php
// ❌ ใช้ Loop แบบดั้งเดิม (อ่านยาก)
$result = [];
foreach ($users as $user) {
    if ($user->age > 20) {
        $result[] = $user->name;
    }
}
sort($result);
$result = array_slice($result, 0, 5);

// ✅ ใช้ Collection (อ่านง่าย เป็นขั้นตอน)
$result = $users
    ->where('age', '>', 20)
    ->pluck('name')
    ->sort()
    ->take(5);
```

---

### การใช้ AI ช่วยพัฒนา

#### Prompt ตัวอย่าง:

```
แปลง PHP loop นี้ให้ใช้ Laravel Collection methods แทน:
$total = 0;
foreach ($orders as $order) {
    if ($order->status == 'completed') {
        $total += $order->total_price;
    }
}
```

#### ผลลัพธ์:

```php
$total = $orders
    ->where('status', 'completed')
    ->sum('total_price');
```

#### การ Review Code จาก AI

เมื่อได้โค้ดจาก AI ให้ตรวจสอบ:
- [ ] Collection Methods ที่ใช้มีอยู่จริงใน Laravel หรือไม่
- [ ] ผลลัพธ์ตรงกับ Loop เดิมหรือไม่
- [ ] Performance เหมาะสมหรือไม่ (ข้อมูลมากควรใช้ Query แทน Collection)

---

## แบบฝึกหัด

### Exercise 1: แปลง Loop เป็น Collection

**โจทย์:** แปลงโค้ดต่อไปนี้ให้ใช้ Collection Methods:

```php
$products = Product::all();
$names = [];
foreach ($products as $product) {
    if ($product->price > 1000 && $product->stock > 0) {
        $names[] = strtoupper($product->name);
    }
}
sort($names);
```

<details>
<summary>ดูเฉลย</summary>

```php
$names = Product::all()
    ->where('price', '>', 1000)
    ->where('stock', '>', 0)
    ->pluck('name')
    ->map(fn ($name) => strtoupper($name))
    ->sort()
    ->values();
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Collections | Wrapper ที่มี 100+ methods สำหรับจัดการข้อมูล |
| Filtering | `filter()`, `where()`, `first()`, `last()` |
| Transforming | `map()`, `pluck()`, `flatMap()` |
| Aggregation | `sum()`, `avg()`, `count()`, `min()`, `max()` |
| Chaining | ต่อหลาย Methods เข้าด้วยกันเพื่ออ่านง่าย |

---

## อ่านเพิ่มเติม

- [Laravel Collections](https://laravel.com/docs/collections)
- [Available Collection Methods](https://laravel.com/docs/collections#available-methods)

---

**Navigation:**
[⬅️ ก่อนหน้า](04-advanced-eloquent.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../06-views-blade/01-blade-basics.md)
