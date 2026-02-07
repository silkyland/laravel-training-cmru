# 11.3 Read (การอ่านข้อมูล)

> **บทนี้คุณจะได้เรียนรู้**
> - หน้ารายการข้อมูล (index) พร้อม Pagination
> - หน้าแสดงรายละเอียด (show)
> - การค้นหาและกรองข้อมูล

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. สร้างหน้ารายการข้อมูลพร้อม Pagination ได้
2. สร้างหน้าแสดงรายละเอียดข้อมูลได้
3. เพิ่มระบบค้นหาและกรองข้อมูลได้

---

## เนื้อหา

### 1. Controller: index() และ show()

```php
public function index(Request $request)
{
    $products = Product::with('category')
        ->when($request->search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })
        ->when($request->category, function ($query, $category) {
            $query->where('category_id', $category);
        })
        ->latest()
        ->paginate(10);

    $categories = Category::all();

    return view('products.index', compact('products', 'categories'));
}

public function show(Product $product)
{
    $product->load('category', 'user');
    return view('products.show', compact('product'));
}
```

### 2. View: index.blade.php

```blade
<x-layout title="รายการสินค้า">
    <h1>สินค้าทั้งหมด</h1>

    {{-- ค้นหา --}}
    <form action="{{ route('products.index') }}" method="GET">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="ค้นหาสินค้า...">
        <select name="category">
            <option value="">ทุกหมวดหมู่</option>
            @foreach($categories as $cat)
                <option value="{{ $cat->id }}" {{ request('category') == $cat->id ? 'selected' : '' }}>
                    {{ $cat->name }}
                </option>
            @endforeach
        </select>
        <button type="submit">ค้นหา</button>
    </form>

    {{-- ตาราง --}}
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>ชื่อ</th>
                <th>ราคา</th>
                <th>หมวดหมู่</th>
                <th>จัดการ</th>
            </tr>
        </thead>
        <tbody>
            @forelse($products as $product)
                <tr>
                    <td>{{ $loop->iteration + ($products->currentPage() - 1) * $products->perPage() }}</td>
                    <td>{{ $product->name }}</td>
                    <td>{{ number_format($product->price, 2) }}</td>
                    <td>{{ $product->category->name }}</td>
                    <td>
                        <a href="{{ route('products.show', $product) }}">ดู</a>
                        <a href="{{ route('products.edit', $product) }}">แก้ไข</a>
                    </td>
                </tr>
            @empty
                <tr><td colspan="5">ไม่พบข้อมูล</td></tr>
            @endforelse
        </tbody>
    </table>

    {{ $products->withQueryString()->links() }}
</x-layout>
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| index() | แสดงรายการ + Pagination + ค้นหา |
| show() | แสดงรายละเอียด + Eager Loading |
| Pagination | `paginate()` + `->links()` |
| Search | `when()` สำหรับ Conditional Query |

---

**Navigation:**
[⬅️ ก่อนหน้า](02-create.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](04-update.md)
