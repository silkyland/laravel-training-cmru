# Code Snippets: Controller

> โค้ดตัวอย่างที่ใช้บ่อยสำหรับ Controller

---

## 1. Resource Controller (CRUD เต็ม)

```php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category')
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->category_id, fn($q, $id) => $q->where('category_id', $id))
            ->latest()
            ->paginate(10);

        $categories = Category::all();

        return view('products.index', compact('products', 'categories'));
    }

    public function create()
    {
        $categories = Category::all();
        return view('products.create', compact('categories'));
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $data['user_id'] = auth()->id();
        Product::create($data);

        return redirect()->route('products.index')
            ->with('success', 'เพิ่มสินค้าเรียบร้อยแล้ว');
    }

    public function show(Product $product)
    {
        $product->load('category', 'user');
        return view('products.show', compact('product'));
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        return view('products.edit', compact('product', 'categories'));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return redirect()->route('products.index')
            ->with('success', 'อัปเดตสินค้าเรียบร้อยแล้ว');
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'ลบสินค้าเรียบร้อยแล้ว');
    }
}
```

---

## 2. Form Request

```php
// app/Http/Requests/StoreProductRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,png,webp|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'กรุณากรอกชื่อสินค้า',
            'price.required' => 'กรุณากรอกราคา',
            'price.numeric' => 'ราคาต้องเป็นตัวเลข',
            'category_id.required' => 'กรุณาเลือกหมวดหมู่',
            'category_id.exists' => 'หมวดหมู่ไม่ถูกต้อง',
            'image.image' => 'ไฟล์ต้องเป็นรูปภาพ',
            'image.max' => 'รูปภาพต้องไม่เกิน 2MB',
        ];
    }
}
```

---

## 3. API Controller

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category')
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->paginate($request->per_page ?? 15);

        return ProductResource::collection($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'สร้างสินค้าเรียบร้อย',
            'data' => new ProductResource($product),
        ], 201);
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load('category'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'category_id' => 'sometimes|exists:categories,id',
        ]);

        $product->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'อัปเดตสินค้าเรียบร้อย',
            'data' => new ProductResource($product),
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'ลบสินค้าเรียบร้อย',
        ]);
    }
}
```

---

## 4. API Resource

```php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'formatted_price' => number_format($this->price, 2) . ' บาท',
            'description' => $this->description,
            'image_url' => $this->image ? asset('storage/' . $this->image) : null,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'created_at' => $this->created_at->format('d/m/Y H:i'),
        ];
    }
}
```
