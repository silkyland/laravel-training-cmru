# 4.2 Controller Best Practices (แนวปฏิบัติที่ดีสำหรับ Controller)

> **บทนี้คุณจะได้เรียนรู้**
> - หลัก Single Responsibility ใน Controller
> - การใช้ Form Request แยก Validation
> - การใช้ API Resource จัดรูปแบบ Response
> - Invokable Controller และ Service Pattern

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. เขียน Controller ที่สั้นกระชับตามหลัก Single Responsibility ได้
2. แยก Validation ออกไปเป็น Form Request ได้
3. ใช้ API Resource จัดรูปแบบ JSON Response ได้

---

## เนื้อหา

### 1. หลัก Single Responsibility

Controller ควรทำหน้าที่เดียว คือ **รับ Request → ส่งต่อ → ตอบ Response**

```php
// ❌ Controller ที่ทำหลายอย่างเกินไป
public function store(Request $request)
{
    $request->validate([...]);           // Validation
    $image = $request->file('image');    // File handling
    $path = $image->store('products');   // Storage
    $product = new Product();            // Business logic
    $product->name = $request->name;
    $product->save();
    Mail::to($admin)->send(new NewProduct($product)); // Notification
    return redirect()->route('products.index');
}

// ✅ Controller ที่สั้นกระชับ
public function store(StoreProductRequest $request)
{
    Product::create($request->validated());
    return redirect()->route('products.index')->with('success', 'สร้างเรียบร้อย');
}
```

### 2. Form Request

```bash
php artisan make:request StoreProductRequest
```

```php
// app/Http/Requests/StoreProductRequest.php
class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // หรือตรวจสอบสิทธิ์
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'กรุณากรอกชื่อสินค้า',
            'price.required' => 'กรุณากรอกราคา',
            'price.numeric' => 'ราคาต้องเป็นตัวเลข',
        ];
    }
}
```

### 3. API Resource

```bash
php artisan make:resource ProductResource
```

```php
// app/Http/Resources/ProductResource.php
class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'formatted_price' => number_format($this->price, 2) . ' บาท',
            'category' => new CategoryResource($this->whenLoaded('category')),
            'created_at' => $this->created_at->format('d/m/Y'),
        ];
    }
}

// ใช้ใน Controller
public function index()
{
    $products = Product::with('category')->paginate(10);
    return ProductResource::collection($products);
}

public function show(Product $product)
{
    return new ProductResource($product->load('category'));
}
```

### 4. Invokable Controller (Single Action)

```bash
php artisan make:controller ExportProductController --invokable
```

```php
// Controller ที่มี Method เดียว
class ExportProductController extends Controller
{
    public function __invoke()
    {
        $products = Product::all();
        return Excel::download(new ProductsExport($products), 'products.xlsx');
    }
}

// Route
Route::get('/products/export', ExportProductController::class)->name('products.export');
```

### 5. เปรียบเทียบแนวปฏิบัติ

| หัวข้อ | ❌ ไม่ดี | ✅ ดี |
|--------|---------|------|
| **Validation** | `$request->validate([...])` ใน Controller | ใช้ Form Request |
| **Response** | `return response()->json([...])` | ใช้ API Resource |
| **Logic** | เขียน Business Logic ใน Controller | แยกไป Service/Action |
| **Single Action** | เพิ่ม Method ใน Controller ใหญ่ | ใช้ Invokable Controller |
| **Naming** | `ProductController@doExport` | `ExportProductController` |

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Single Responsibility | Controller ทำแค่ รับ → ส่งต่อ → ตอบ |
| Form Request | แยก Validation + Authorization ออกจาก Controller |
| API Resource | จัดรูปแบบ JSON Response อย่างเป็นระบบ |
| Invokable Controller | Controller ที่มี Action เดียว |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-controller-basics.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-ai-assisted-development.md)
