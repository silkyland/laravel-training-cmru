# 11.4 Update (การแก้ไขข้อมูล)

> **บทนี้คุณจะได้เรียนรู้**
> - หน้าฟอร์มแก้ไขข้อมูล (edit)
> - การอัปเดตข้อมูล (update)
> - การจัดการรูปภาพเดิม/ใหม่
> - @method('PUT') สำหรับ HTTP Method Spoofing

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. สร้างหน้าฟอร์มแก้ไขข้อมูลพร้อมค่าเดิมได้
2. เขียน Controller Method `edit()` และ `update()` ได้
3. จัดการการอัปเดตรูปภาพ (ลบเก่า + อัปโหลดใหม่) ได้

---

## เนื้อหา

### 1. Controller: edit() และ update()

```php
public function edit(Product $product)
{
    $categories = Category::all();
    return view('products.edit', compact('product', 'categories'));
}

public function update(Request $request, Product $product)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'category_id' => 'required|exists:categories,id',
        'image' => 'nullable|image|max:2048',
    ]);

    // จัดการรูปภาพ
    if ($request->hasFile('image')) {
        // ลบรูปเก่า
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $validated['image'] = $request->file('image')->store('products', 'public');
    }

    $product->update($validated);

    return redirect()->route('products.index')
        ->with('success', 'อัปเดตสินค้าเรียบร้อยแล้ว');
}
```

### 2. View: edit.blade.php

```blade
<x-layout title="แก้ไขสินค้า">
    <h1>แก้ไข: {{ $product->name }}</h1>

    <form action="{{ route('products.update', $product) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div>
            <label for="name">ชื่อสินค้า</label>
            <input type="text" id="name" name="name" value="{{ old('name', $product->name) }}">
            @error('name') <span class="text-red-500">{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="price">ราคา</label>
            <input type="number" id="price" name="price" value="{{ old('price', $product->price) }}" step="0.01">
        </div>

        <div>
            <label for="category_id">หมวดหมู่</label>
            <select id="category_id" name="category_id">
                @foreach($categories as $category)
                    <option value="{{ $category->id }}"
                        {{ old('category_id', $product->category_id) == $category->id ? 'selected' : '' }}>
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>
        </div>

        @if($product->image)
            <div>
                <label>รูปปัจจุบัน</label>
                <img src="{{ Storage::url($product->image) }}" width="100">
            </div>
        @endif

        <div>
            <label for="image">เปลี่ยนรูปภาพ</label>
            <input type="file" id="image" name="image" accept="image/*">
        </div>

        <button type="submit">อัปเดต</button>
        <a href="{{ route('products.index') }}">ยกเลิก</a>
    </form>
</x-layout>
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| edit() | แสดงฟอร์มพร้อมค่าเดิม |
| update() | Validate → จัดการรูป → Update → Redirect |
| @method('PUT') | Spoof HTTP Method สำหรับ Update |
| old() | `old('field', $model->field)` แสดงค่าเดิม |

---

**Navigation:**
[⬅️ ก่อนหน้า](03-read.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](05-delete.md)
