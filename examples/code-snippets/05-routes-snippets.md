# Code Snippets: Routes

> โค้ดตัวอย่างที่ใช้บ่อยสำหรับ Routes

---

## 1. Web Routes พื้นฐาน

```php
// routes/web.php
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;

// หน้าแรก
Route::get('/', fn() => view('welcome'));

// Dashboard (ต้อง Login)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // CRUD Resource
    Route::resource('products', ProductController::class);
    Route::resource('categories', CategoryController::class);

    // Routes เพิ่มเติม
    Route::get('/products/export/csv', [ProductController::class, 'export'])->name('products.export');
    Route::delete('/products/bulk-delete', [ProductController::class, 'bulkDelete'])->name('products.bulk-delete');
});

// Admin Only
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', Admin\UserController::class);
    Route::get('/reports', [Admin\ReportController::class, 'index'])->name('reports');
});
```

---

## 2. API Routes

```php
// routes/api.php
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;

// Public
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected (ต้องมี Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('products', ProductController::class);
});

// API Versioning
Route::prefix('v1')->name('v1.')->group(function () {
    Route::apiResource('products', Api\V1\ProductController::class);
});
```

---

## 3. Route Tips

```php
// Route Model Binding
Route::get('/products/{product}', [ProductController::class, 'show']);
// $product จะถูก resolve อัตโนมัติจาก ID

// Explicit Binding (ใช้ slug แทน id)
// AppServiceProvider
Route::bind('product', fn($value) => Product::where('slug', $value)->firstOrFail());

// Rate Limiting
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Fallback Route
Route::fallback(fn() => response()->view('errors.404', [], 404));
```
