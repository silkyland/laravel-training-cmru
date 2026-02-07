# 11.2 Create (การสร้างข้อมูล)

> **บทนี้คุณจะได้เรียนรู้**
> - หน้าฟอร์มสร้างข้อมูล (create)
> - การบันทึกข้อมูล (store)
> - Validation และ Error Handling
> - การอัปโหลดรูปภาพ

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. สร้างหน้าฟอร์มสำหรับเพิ่มข้อมูลได้
2. เขียน Controller Method `create()` และ `store()` ได้
3. ใช้ Validation ตรวจสอบข้อมูลก่อนบันทึกได้

---

## เนื้อหา

### 1. Controller: create() และ store()
```php
class ProductController extends Controller
{
    public function create()
    {
        $categories = Category::all();
        return view('products.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $validated['user_id'] = auth()->id();

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'เพิ่มสินค้าเรียบร้อยแล้ว');
    }
}
```

### 2. View: create.blade.php (ตัวอย่างเต็ม)

```blade
<x-layout title="เพิ่มสินค้า">
    <h1>เพิ่มสินค้าใหม่</h1>

    <form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div>
            <label for="name">ชื่อสินค้า</label>
            <input type="text" id="name" name="name" value="{{ old('name') }}">
            @error('name') <span class="text-red-500">{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="price">ราคา</label>
            <input type="number" id="price" name="price" value="{{ old('price') }}" step="0.01">
            @error('price') <span class="text-red-500">{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="category_id">หมวดหมู่</label>
            <select id="category_id" name="category_id">
                <option value="">-- เลือกหมวดหมู่ --</option>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}" {{ old('category_id') == $category->id ? 'selected' : '' }}>
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>
            @error('category_id') <span class="text-red-500">{{ $message }}</span> @enderror
        </div>

        <div>
            <label for="image">รูปภาพ</label>
            <input type="file" id="image" name="image" accept="image/*">
            @error('image') <span class="text-red-500">{{ $message }}</span> @enderror
        </div>

        <button type="submit">บันทึก</button>
        <a href="{{ route('products.index') }}">ยกเลิก</a>
    </form>
</x-layout>
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| create() | แสดงฟอร์มเปล่า + ส่งข้อมูลที่จำเป็น |
| store() | Validate → Upload → Create → Redirect |
| Validation | ตรวจสอบก่อนบันทึก + แสดง Error |
| File Upload | `store('folder', 'public')` |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-planning.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-read.md)
