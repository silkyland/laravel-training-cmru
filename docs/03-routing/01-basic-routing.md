# 3.1 Basic Routing (พื้นฐานการกำหนดเส้นทาง)

> **บทนี้คุณจะได้เรียนรู้**
> - ทำความเข้าใจแนวคิด Routing ใน Laravel
> - การรับส่งข้อมูลผ่าน URL
> - HTTP Methods ทั้งหมด (GET, POST, PUT, PATCH, DELETE)
> - การส่งค่า Parameter ผ่าน URL
> - Optional Parameters และ Default Values
> - การตั้งชื่อ Route (Named Routes)
> - Regular Expression Constraints

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. เข้าใจแนวคิดและความสำคัญของ Routing ในเว็บแอปพลิเคชัน
2. สร้างและกำหนดเส้นทาง (Route) สำหรับหน้าเว็บต่างๆ ได้
3. ใช้งาน HTTP Methods ได้อย่างเหมาะสมตามมาตรฐาน RESTful
4. ส่งและรับค่า Parameter ผ่าน URL ได้
5. ใช้งาน Named Routes เพื่อการ Maintain Code ที่ดี

---

## เนื้อหา

### 1. ทำความเข้าใจ Routing คืออะไร?

**Routing** คือกระบวนการกำหนดว่า เมื่อผู้ใช้เข้าถึง URL ใดๆ แอปพลิเคชันจะตอบสนองอย่างไร เปรียบเสมือน **"ป้ายบอกทาง"** ที่บอกให้ระบบรู้ว่าจะส่งผู้ใช้ไปที่ไหน

```
ผู้ใช้พิมพ์ URL → Laravel Router รับ Request → ส่งไปยัง Controller/Closure → ส่ง Response กลับ
```

#### โครงสร้างไฟล์ Routes ใน Laravel

```
routes/
├── web.php      ← สำหรับหน้าเว็บทั่วไป (มี Session, CSRF Protection)
├── api.php      ← สำหรับ API (Stateless, ใช้ Token Authentication)
├── console.php  ← สำหรับ Artisan Commands
└── channels.php ← สำหรับ Broadcasting Events
```

| ไฟล์ | Middleware | Prefix | ใช้งานสำหรับ |
|------|-----------|--------|-------------|
| `web.php` | `web` | - | หน้าเว็บปกติ, ฟอร์ม, Session |
| `api.php` | `api` | `/api` | RESTful API, Mobile App |

---

### 2. การสร้าง Route พื้นฐาน

#### 2.1 Route แบบง่ายที่สุด

ไฟล์ `routes/web.php`:

```php
use Illuminate\Support\Facades\Route;

// Route พื้นฐาน - เมื่อเข้า http://localhost:8000/hello
Route::get('/hello', function () {
    return 'สวัสดี Laravel!';
});
```

**อธิบาย:**
- `Route::get()` - บอกว่า Route นี้รับ HTTP GET Request
- `'/hello'` - คือ URI ที่ต้องการจับคู่
- `function () { ... }` - คือ Closure ที่จะทำงานเมื่อ Route ตรงกัน
- `return` - คือสิ่งที่จะส่งกลับไปให้ผู้ใช้ (Response)

#### 2.2 Route ที่ส่ง View

```php
// วิธีที่ 1: ใช้ Closure
Route::get('/', function () {
    return view('welcome');
});

// วิธีที่ 2: ใช้ Route::view() (สำหรับหน้าที่ไม่มี Logic)
Route::view('/about', 'about');

// วิธีที่ 3: ส่งข้อมูลไปยัง View
Route::get('/about', function () {
    return view('about', [
        'company' => 'ABC Company',
        'year' => date('Y')
    ]);
});

// หรือใช้ Route::view() พร้อมส่งข้อมูล
Route::view('/about', 'about', ['company' => 'ABC Company']);
```

---

### 3. HTTP Methods (HTTP Verbs)

Laravel รองรับ HTTP Methods ทั้งหมดตามมาตรฐาน RESTful:

```php
Route::get($uri, $callback);      // ดึงข้อมูล (Read)
Route::post($uri, $callback);     // สร้างข้อมูลใหม่ (Create)
Route::put($uri, $callback);      // อัปเดตข้อมูลทั้งหมด (Full Update)
Route::patch($uri, $callback);    // อัปเดตข้อมูลบางส่วน (Partial Update)
Route::delete($uri, $callback);   // ลบข้อมูล (Delete)
Route::options($uri, $callback);  // สำหรับ CORS Preflight
```

#### การเลือกใช้ HTTP Method ที่เหมาะสม

| Method | วัตถุประสงค์ | ตัวอย่างการใช้งาน | Idempotent |
|--------|------------|-----------------|------------|
| GET | ดึงข้อมูล | แสดงรายการสินค้า | ✅ ใช่ |
| POST | สร้างข้อมูลใหม่ | สมัครสมาชิก, สั่งซื้อ | ❌ ไม่ |
| PUT | แก้ไขข้อมูลทั้งหมด | อัปเดตโปรไฟล์ทั้งหมด | ✅ ใช่ |
| PATCH | แก้ไขข้อมูลบางส่วน | เปลี่ยนรหัสผ่าน | ✅ ใช่ |
| DELETE | ลบข้อมูล | ลบบัญชี, ยกเลิกออร์เดอร์ | ✅ ใช่ |

> 💡 **Idempotent** หมายถึง การเรียกซ้ำหลายครั้งจะได้ผลลัพธ์เหมือนกัน

#### 3.1 ตัวอย่าง CRUD Routes สำหรับ Product

```php
// แสดงรายการสินค้าทั้งหมด
Route::get('/products', function () {
    return 'แสดงสินค้าทั้งหมด';
});

// แสดงฟอร์มเพิ่มสินค้า
Route::get('/products/create', function () {
    return view('products.create');
});

// บันทึกสินค้าใหม่
Route::post('/products', function () {
    // Logic สำหรับบันทึกสินค้า
    return 'สินค้าถูกบันทึกแล้ว';
});

// แสดงสินค้าตาม ID
Route::get('/products/{id}', function ($id) {
    return "แสดงสินค้า ID: $id";
});

// แสดงฟอร์มแก้ไขสินค้า
Route::get('/products/{id}/edit', function ($id) {
    return "แสดงฟอร์มแก้ไขสินค้า ID: $id";
});

// อัปเดตสินค้า
Route::put('/products/{id}', function ($id) {
    return "อัปเดตสินค้า ID: $id";
});

// ลบสินค้า
Route::delete('/products/{id}', function ($id) {
    return "ลบสินค้า ID: $id";
});
```

#### 3.2 Route ที่รับหลาย HTTP Methods

```php
// รับเฉพาะ GET และ POST
Route::match(['get', 'post'], '/form', function () {
    return 'รับได้ทั้ง GET และ POST';
});

// รับ HTTP Methods ทุกประเภท
Route::any('/universal', function () {
    return 'รับได้ทุก HTTP Method';
});
```

> ⚠️ **คำเตือน:** หลีกเลี่ยงการใช้ `Route::any()` ในระบบ Production เพราะอาจทำให้เกิดช่องโหว่ด้านความปลอดภัย

---

### 4. Route Parameters (การส่งค่าผ่าน URL)

#### 4.1 Required Parameters (พารามิเตอร์ที่จำเป็น)

```php
// Parameter เดียว
Route::get('/user/{id}', function ($id) {
    return "รหัสผู้ใช้: $id";
});
// URL: /user/42 → "รหัสผู้ใช้: 42"

// หลาย Parameters
Route::get('/posts/{post}/comments/{comment}', function ($postId, $commentId) {
    return "โพสต์: $postId, คอมเมนต์: $commentId";
});
// URL: /posts/5/comments/12 → "โพสต์: 5, คอมเมนต์: 12"
```

#### 4.2 Optional Parameters (พารามิเตอร์ที่ไม่บังคับ)

```php
// ใช้ ? หลังชื่อ Parameter และกำหนดค่า Default
Route::get('/user/{name?}', function ($name = 'Guest') {
    return "สวัสดีคุณ $name";
});
// URL: /user → "สวัสดีคุณ Guest"
// URL: /user/John → "สวัสดีคุณ John"

// หลาย Optional Parameters
Route::get('/search/{category?}/{keyword?}', function ($category = 'all', $keyword = '') {
    return "หมวด: $category, คำค้น: $keyword";
});
```

#### 4.3 Regular Expression Constraints (การกำหนดรูปแบบ Parameter)

```php
// ต้องเป็นตัวเลขเท่านั้น
Route::get('/user/{id}', function ($id) {
    return "User ID: $id";
})->where('id', '[0-9]+');

// ต้องเป็นตัวอักษรเท่านั้น
Route::get('/user/{name}', function ($name) {
    return "Username: $name";
})->where('name', '[A-Za-z]+');

// หลายเงื่อนไขพร้อมกัน
Route::get('/user/{id}/{name}', function ($id, $name) {
    return "ID: $id, Name: $name";
})->where([
    'id' => '[0-9]+',
    'name' => '[a-z]+'
]);

// ใช้ Helper Methods (Laravel 8+)
Route::get('/user/{id}', function ($id) {
    //...
})->whereNumber('id');  // เทียบเท่า where('id', '[0-9]+')

Route::get('/user/{name}', function ($name) {
    //...
})->whereAlpha('name'); // เฉพาะตัวอักษร

Route::get('/user/{slug}', function ($slug) {
    //...
})->whereAlphaNumeric('slug'); // ตัวอักษรและตัวเลข

Route::get('/post/{slug}', function ($slug) {
    //...
})->whereIn('slug', ['about', 'contact', 'faq']); // เฉพาะค่าที่กำหนด
```

#### 4.4 Global Constraints (กำหนดรูปแบบทั่วทั้งแอป)

สร้างใน `app/Providers/RouteServiceProvider.php`:

```php
public function boot()
{
    // กำหนดให้ {id} ทุกที่ในแอปต้องเป็นตัวเลข
    Route::pattern('id', '[0-9]+');
    
    // กำหนดให้ {slug} ต้องเป็น alphanumeric + dash
    Route::pattern('slug', '[a-z0-9-]+');
    
    parent::boot();
}
```

---

### 5. Named Routes (การตั้งชื่อ Route)

การตั้งชื่อ Route ช่วยให้การอ้างอิงและ Maintain ง่ายขึ้น เมื่อ URL เปลี่ยน เราแค่เปลี่ยนที่เดียว

#### 5.1 การตั้งชื่อ Route

```php
// ตั้งชื่อ Route ด้วย ->name()
Route::get('/user/profile', function () {
    return view('profile');
})->name('profile');

// ตั้งชื่อ Route พร้อม Parameter
Route::get('/user/{id}/profile', function ($id) {
    return "Profile of user $id";
})->name('user.profile');

// ตั้งชื่อแบบ Chain
Route::get('/posts/{post}/edit', function ($post) {
    //...
})->name('posts.edit')->middleware('auth');
```

#### 5.2 การใช้งาน Named Routes

```php
// สร้าง URL จากชื่อ Route
$url = route('profile');
// ผลลัพธ์: http://localhost:8000/user/profile

// ส่ง Parameter ไปด้วย
$url = route('user.profile', ['id' => 1]);
// ผลลัพธ์: http://localhost:8000/user/1/profile

// ใช้ใน Redirect
return redirect()->route('profile');
return redirect()->route('user.profile', ['id' => 1]);

// ใช้ใน Blade Template
<a href="{{ route('profile') }}">โปรไฟล์</a>
<a href="{{ route('user.profile', ['id' => $user->id]) }}">ดูโปรไฟล์</a>

// ตรวจสอบว่าอยู่ที่ Route นี้หรือไม่
@if(request()->routeIs('profile'))
    <span>คุณอยู่ที่หน้าโปรไฟล์</span>
@endif
```

#### 5.3 ประโยชน์ของ Named Routes

```php
// ❌ ไม่ควรทำ - ถ้า URL เปลี่ยน ต้องแก้ทุกที่
<a href="/user/profile">โปรไฟล์</a>
<a href="/user/profile">ไปโปรไฟล์</a>
return redirect('/user/profile');

// ✅ ควรทำ - ถ้า URL เปลี่ยน แก้ที่เดียวใน routes/web.php
<a href="{{ route('profile') }}">โปรไฟล์</a>
<a href="{{ route('profile') }}">ไปโปรไฟล์</a>
return redirect()->route('profile');
```

---

### 6. Route Groups (การจัดกลุ่ม Route)

เมื่อมี Routes หลายตัวที่มีลักษณะคล้ายกัน สามารถจัดกลุ่มเพื่อลด Code ซ้ำซ้อน:

```php
// จัดกลุ่มด้วย Prefix
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return 'Admin Dashboard';
    }); // URL: /admin/dashboard
    
    Route::get('/users', function () {
        return 'Admin Users';
    }); // URL: /admin/users
});

// จัดกลุ่มด้วย Name Prefix
Route::name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        //...
    })->name('dashboard'); // ชื่อ: admin.dashboard
});

// รวมหลายอย่างเข้าด้วยกัน
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::get('/dashboard', function () {
            //...
        })->name('dashboard');
        // URL: /admin/dashboard
        // ชื่อ: admin.dashboard
        // Middleware: auth, admin
    });
```

---

### 7. Redirect Routes และ View Routes

```php
// Redirect Route - เปลี่ยนเส้นทางอัตโนมัติ
Route::redirect('/old-page', '/new-page');  // 302 Temporary
Route::redirect('/old-page', '/new-page', 301);  // 301 Permanent

// Permanent Redirect
Route::permanentRedirect('/old-page', '/new-page');  // 301

// View Route - แสดง View โดยไม่ต้องมี Logic
Route::view('/welcome', 'welcome');
Route::view('/about', 'pages.about', ['company' => 'ABC Inc.']);
```

---

### 8. แสดงรายการ Routes ทั้งหมด

ใช้คำสั่ง Artisan เพื่อดู Routes ที่มีในระบบ:

```bash
# แสดง Routes ทั้งหมด
php artisan route:list

# แสดงเฉพาะ Routes ที่ขึ้นต้นด้วย 'api'
php artisan route:list --path=api

# แสดงในรูปแบบ JSON
php artisan route:list --json

# แสดงเฉพาะ Route ที่มีชื่อ
php artisan route:list --name=user

# แสดง Routes พร้อม Middleware
php artisan route:list -v
```

---

### การใช้ AI ช่วยสร้าง Route

#### Prompt ตัวอย่างที่ 1: สร้าง Route พื้นฐาน
**Prompt:**
> "Create a Laravel route that accepts a 'category' and a 'slug' parameter and returns them as a string."

**ผลลัพธ์:**
```php
Route::get('/shop/{category}/{slug}', function ($category, $slug) {
    return "Category: $category, Product: $slug";
});
```

#### Prompt ตัวอย่างที่ 2: สร้าง CRUD Routes
**Prompt:**
> "Create complete CRUD routes for a 'Post' model in Laravel with named routes and proper HTTP methods."

**ผลลัพธ์:**
```php
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
```

#### Prompt ตัวอย่างที่ 3: สร้าง Route พร้อม Validation
**Prompt:**
> "Create a Laravel route for user profile that only accepts numeric ID and returns 404 if ID format is wrong."

**ผลลัพธ์:**
```php
Route::get('/user/{id}', function ($id) {
    // หา user หรือ return 404
    $user = User::findOrFail($id);
    return view('user.profile', compact('user'));
})->where('id', '[0-9]+')->name('user.profile');
```

---

## ตัวอย่างโค้ดฉบับเต็ม

สร้างไฟล์ `routes/web.php` สำหรับระบบ E-commerce อย่างง่าย:

```php
<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - E-commerce Example
|--------------------------------------------------------------------------
*/

// หน้าแรก
Route::get('/', function () {
    return view('home');
})->name('home');

// หน้าเกี่ยวกับเรา
Route::view('/about', 'pages.about')->name('about');

// หน้าติดต่อ
Route::get('/contact', function () {
    return view('pages.contact');
})->name('contact');

Route::post('/contact', function () {
    // Logic สำหรับส่งข้อความ
    return redirect()->route('contact')->with('success', 'ส่งข้อความเรียบร้อย');
})->name('contact.send');

// สินค้า
Route::prefix('products')->name('products.')->group(function () {
    // แสดงสินค้าทั้งหมด
    Route::get('/', function () {
        return view('products.index');
    })->name('index');
    
    // แสดงสินค้าตามหมวดหมู่
    Route::get('/category/{category}', function ($category) {
        return view('products.category', compact('category'));
    })->name('category')->whereAlpha('category');
    
    // แสดงรายละเอียดสินค้า
    Route::get('/{id}', function ($id) {
        return view('products.show', compact('id'));
    })->name('show')->whereNumber('id');
});

// ผู้ใช้ (ต้อง Login)
Route::middleware('auth')->prefix('user')->name('user.')->group(function () {
    Route::get('/profile', function () {
        return view('user.profile');
    })->name('profile');
    
    Route::get('/orders', function () {
        return view('user.orders');
    })->name('orders');
    
    Route::get('/orders/{id}', function ($id) {
        return view('user.order-detail', compact('id'));
    })->name('orders.show')->whereNumber('id');
});

// ตะกร้าสินค้า
Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', function () {
        return view('cart.index');
    })->name('index');
    
    Route::post('/add/{productId}', function ($productId) {
        return back()->with('success', 'เพิ่มสินค้าในตะกร้าแล้ว');
    })->name('add')->whereNumber('productId');
    
    Route::delete('/remove/{productId}', function ($productId) {
        return back()->with('success', 'ลบสินค้าออกจากตะกร้าแล้ว');
    })->name('remove')->whereNumber('productId');
});

// Redirect Routes
Route::redirect('/shop', '/products');
Route::permanentRedirect('/old-about', '/about');
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| **Route พื้นฐาน** | `Route::get()`, `Route::post()`, Closure |
| **HTTP Methods** | GET, POST, PUT, PATCH, DELETE และการเลือกใช้ |
| **Parameters** | Required `{param}`, Optional `{param?}` |
| **Constraints** | `where()`, `whereNumber()`, `whereAlpha()` |
| **Named Routes** | `->name()`, `route()` helper |
| **Route Groups** | `prefix()`, `name()`, `middleware()` |
| **Utilities** | `Route::redirect()`, `Route::view()` |

---

## แบบฝึกหัด

### แบบฝึกหัดที่ 1: Route พื้นฐาน
**โจทย์:** จงสร้าง Route ต่อไปนี้ใน `routes/web.php`:
1. `/contact` - แสดงคำว่า "Contact Page"
2. `/greet/{name}` - แสดงคำว่า "สวัสดีคุณ [name]"
3. `/greet/{name?}` - ถ้าไม่ระบุชื่อให้แสดง "สวัสดีท่านผู้มาเยือน"

<details>
<summary>💡 ดูเฉลย</summary>

```php
Route::get('/contact', function () {
    return 'Contact Page';
});

Route::get('/greet/{name}', function ($name) {
    return "สวัสดีคุณ $name";
});

Route::get('/greeting/{name?}', function ($name = 'ท่านผู้มาเยือน') {
    return "สวัสดี$name";
});
```
</details>

### แบบฝึกหัดที่ 2: Parameter Constraints
**โจทย์:** สร้าง Route `/product/{id}` ที่:
1. รับเฉพาะ ID ที่เป็นตัวเลข
2. ตั้งชื่อ Route ว่า `product.show`

<details>
<summary>💡 ดูเฉลย</summary>

```php
Route::get('/product/{id}', function ($id) {
    return "Product ID: $id";
})->whereNumber('id')->name('product.show');
```
</details>

### แบบฝึกหัดที่ 3: Route Groups
**โจทย์:** สร้างกลุ่ม Routes สำหรับ Admin โดย:
1. ทุก URL ขึ้นต้นด้วย `/admin`
2. ทุกชื่อ Route ขึ้นต้นด้วย `admin.`
3. มี Routes: dashboard, users, settings

<details>
<summary>💡 ดูเฉลย</summary>

```php
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return 'Admin Dashboard';
    })->name('dashboard');
    
    Route::get('/users', function () {
        return 'Admin Users';
    })->name('users');
    
    Route::get('/settings', function () {
        return 'Admin Settings';
    })->name('settings');
});
```
</details>

---

## อ่านเพิ่มเติม

- [Laravel Official Documentation - Routing](https://laravel.com/docs/routing)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Methods Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

---

**Navigation:**
[⬅️ ก่อนหน้า](../02-laravel-fundamentals/03-first-project.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](02-advanced-routing.md)
