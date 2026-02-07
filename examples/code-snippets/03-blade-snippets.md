# Code Snippets: Blade Templates

> โค้ดตัวอย่างที่ใช้บ่อยสำหรับ Blade Templates

---

## 1. Layout Component

```blade
{{-- resources/views/components/layout.blade.php --}}
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? config('app.name') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 min-h-screen">
    {{-- Navbar --}}
    <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <a href="/" class="text-xl font-bold text-blue-600">{{ config('app.name') }}</a>
            <div class="flex items-center gap-4">
                @auth
                    <span class="text-gray-600">{{ auth()->user()->name }}</span>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button class="text-red-500 hover:underline">ออกจากระบบ</button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="text-blue-500 hover:underline">เข้าสู่ระบบ</a>
                @endauth
            </div>
        </div>
    </nav>

    {{-- Flash Messages --}}
    <div class="max-w-7xl mx-auto px-4 mt-4">
        @if(session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {{ session('success') }}
            </div>
        @endif
        @if(session('error'))
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {{ session('error') }}
            </div>
        @endif
    </div>

    {{-- Content --}}
    <main class="max-w-7xl mx-auto px-4 py-6">
        {{ $slot }}
    </main>
</body>
</html>
```

---

## 2. หน้า Index (รายการข้อมูล)

```blade
{{-- resources/views/products/index.blade.php --}}
<x-layout title="รายการสินค้า">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">สินค้าทั้งหมด</h1>
        <a href="{{ route('products.create') }}"
           class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + เพิ่มสินค้า
        </a>
    </div>

    {{-- ค้นหา + กรอง --}}
    <form action="{{ route('products.index') }}" method="GET" class="flex gap-3 mb-6">
        <input type="text" name="search" value="{{ request('search') }}"
               placeholder="ค้นหาสินค้า..." class="border rounded px-3 py-2 flex-1">
        <select name="category_id" class="border rounded px-3 py-2">
            <option value="">ทุกหมวดหมู่</option>
            @foreach($categories as $cat)
                <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>
                    {{ $cat->name }}
                </option>
            @endforeach
        </select>
        <button type="submit" class="bg-gray-500 text-white px-4 py-2 rounded">ค้นหา</button>
    </form>

    {{-- ตาราง --}}
    <div class="bg-white rounded shadow overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-3 text-left">#</th>
                    <th class="px-4 py-3 text-left">ชื่อสินค้า</th>
                    <th class="px-4 py-3 text-right">ราคา</th>
                    <th class="px-4 py-3 text-left">หมวดหมู่</th>
                    <th class="px-4 py-3 text-center">จัดการ</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                @forelse($products as $product)
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3">
                            {{ $loop->iteration + ($products->currentPage() - 1) * $products->perPage() }}
                        </td>
                        <td class="px-4 py-3">{{ $product->name }}</td>
                        <td class="px-4 py-3 text-right">{{ number_format($product->price, 2) }}</td>
                        <td class="px-4 py-3">{{ $product->category->name }}</td>
                        <td class="px-4 py-3 text-center">
                            <a href="{{ route('products.show', $product) }}" class="text-blue-500 hover:underline">ดู</a>
                            <a href="{{ route('products.edit', $product) }}" class="text-yellow-500 hover:underline ml-2">แก้ไข</a>
                            <form action="{{ route('products.destroy', $product) }}" method="POST" class="inline"
                                  onsubmit="return confirm('ต้องการลบสินค้านี้?')">
                                @csrf @method('DELETE')
                                <button class="text-red-500 hover:underline ml-2">ลบ</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-4 py-8 text-center text-gray-500">ไม่พบข้อมูล</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- Pagination --}}
    <div class="mt-4">
        {{ $products->withQueryString()->links() }}
    </div>
</x-layout>
```

---

## 3. หน้า Create/Edit Form

```blade
{{-- resources/views/products/create.blade.php --}}
<x-layout title="เพิ่มสินค้า">
    <h1 class="text-2xl font-bold mb-6">เพิ่มสินค้าใหม่</h1>

    <form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data"
          class="bg-white rounded shadow p-6 max-w-2xl">
        @csrf

        <div class="mb-4">
            <label for="name" class="block font-medium mb-1">ชื่อสินค้า <span class="text-red-500">*</span></label>
            <input type="text" id="name" name="name" value="{{ old('name') }}"
                   class="w-full border rounded px-3 py-2 @error('name') border-red-500 @enderror">
            @error('name') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
        </div>

        <div class="mb-4">
            <label for="price" class="block font-medium mb-1">ราคา <span class="text-red-500">*</span></label>
            <input type="number" id="price" name="price" value="{{ old('price') }}" step="0.01"
                   class="w-full border rounded px-3 py-2 @error('price') border-red-500 @enderror">
            @error('price') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
        </div>

        <div class="mb-4">
            <label for="category_id" class="block font-medium mb-1">หมวดหมู่ <span class="text-red-500">*</span></label>
            <select id="category_id" name="category_id"
                    class="w-full border rounded px-3 py-2 @error('category_id') border-red-500 @enderror">
                <option value="">-- เลือกหมวดหมู่ --</option>
                @foreach($categories as $cat)
                    <option value="{{ $cat->id }}" {{ old('category_id') == $cat->id ? 'selected' : '' }}>
                        {{ $cat->name }}
                    </option>
                @endforeach
            </select>
            @error('category_id') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
        </div>

        <div class="mb-4">
            <label for="description" class="block font-medium mb-1">รายละเอียด</label>
            <textarea id="description" name="description" rows="4"
                      class="w-full border rounded px-3 py-2">{{ old('description') }}</textarea>
        </div>

        <div class="mb-6">
            <label for="image" class="block font-medium mb-1">รูปภาพ</label>
            <input type="file" id="image" name="image" accept="image/*"
                   class="w-full border rounded px-3 py-2">
            @error('image') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
        </div>

        <div class="flex gap-3">
            <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                บันทึก
            </button>
            <a href="{{ route('products.index') }}" class="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">
                ยกเลิก
            </a>
        </div>
    </form>
</x-layout>
```

---

## 4. หน้า Show (รายละเอียด)

```blade
{{-- resources/views/products/show.blade.php --}}
<x-layout title="{{ $product->name }}">
    <div class="bg-white rounded shadow p-6 max-w-2xl">
        <h1 class="text-2xl font-bold mb-4">{{ $product->name }}</h1>

        @if($product->image)
            <img src="{{ Storage::url($product->image) }}" alt="{{ $product->name }}"
                 class="w-64 h-64 object-cover rounded mb-4">
        @endif

        <table class="w-full">
            <tr class="border-b">
                <td class="py-2 font-medium w-1/3">ราคา</td>
                <td class="py-2">{{ number_format($product->price, 2) }} บาท</td>
            </tr>
            <tr class="border-b">
                <td class="py-2 font-medium">หมวดหมู่</td>
                <td class="py-2">{{ $product->category->name }}</td>
            </tr>
            <tr class="border-b">
                <td class="py-2 font-medium">ผู้สร้าง</td>
                <td class="py-2">{{ $product->user->name }}</td>
            </tr>
            <tr class="border-b">
                <td class="py-2 font-medium">รายละเอียด</td>
                <td class="py-2">{{ $product->description ?? '-' }}</td>
            </tr>
            <tr>
                <td class="py-2 font-medium">วันที่สร้าง</td>
                <td class="py-2">{{ $product->created_at->format('d/m/Y H:i') }}</td>
            </tr>
        </table>

        <div class="flex gap-3 mt-6">
            <a href="{{ route('products.edit', $product) }}"
               class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">แก้ไข</a>
            <a href="{{ route('products.index') }}"
               class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">กลับ</a>
        </div>
    </div>
</x-layout>
```
