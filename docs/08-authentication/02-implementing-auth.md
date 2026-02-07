# 8.2 Implementing Authentication (การสร้างระบบยืนยันตัวตน)

> **บทนี้คุณจะได้เรียนรู้**
> - การ Login/Logout แบบ Manual
> - การป้องกัน Route ด้วย Middleware
> - Remember Me และ Password Reset
> - การปรับแต่งหน้า Auth

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. สร้างระบบ Login/Logout แบบ Manual ได้
2. ป้องกัน Route ด้วย `auth` Middleware ได้
3. ใช้ Remember Me และ Password Reset ได้
4. ปรับแต่ง Redirect หลัง Login/Logout ได้

---

## เนื้อหา

### 1. การ Login แบบ Manual

```php
use Illuminate\Support\Facades\Auth;

public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    // พยายาม Login
    if (Auth::attempt($credentials, $request->boolean('remember'))) {
        $request->session()->regenerate(); // ป้องกัน Session Fixation
        return redirect()->intended('dashboard');
    }

    return back()->withErrors([
        'email' => 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    ])->onlyInput('email');
}
```

### 2. การ Logout

```php
public function logout(Request $request)
{
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
}
```

### 3. ป้องกัน Route ด้วย Middleware

```php
// ป้องกันทีละ Route
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth');

// ป้องกันทั้งกลุ่ม
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'edit']);
    Route::resource('products', ProductController::class);
});

// ป้องกันใน Controller
public function __construct()
{
    $this->middleware('auth');
    $this->middleware('auth')->except(['index', 'show']);
}
```

| Middleware | หน้าที่ |
|-----------|--------|
| `auth` | ต้อง Login ก่อน |
| `guest` | ต้องไม่ได้ Login (สำหรับหน้า Login/Register) |
| `verified` | ต้องยืนยันอีเมลแล้ว |
| `password.confirm` | ต้องยืนยันรหัสผ่านอีกครั้ง |

### 4. การปรับแต่ง Redirect

```php
// app/Providers/RouteServiceProvider.php
public const HOME = '/dashboard';

// หรือปรับแต่งตาม Role
// ใน LoginController หรือ Middleware
protected function authenticated(Request $request, $user)
{
    if ($user->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('user.dashboard');
}
```

---

### การใช้ AI ช่วยพัฒนา

#### Prompt ตัวอย่าง:

```
สร้างระบบ Login ใน Laravel ที่:
- ตรวจสอบ Email + Password
- มี Remember Me
- Redirect ตาม Role (admin → /admin, user → /dashboard)
- แสดง Error เป็นภาษาไทย
```

---

## แบบฝึกหัด

### Exercise 1: สร้างระบบ Login

**โจทย์:** สร้างระบบ Login/Logout แบบ Manual พร้อม:
1. หน้า Login Form
2. ตรวจสอบ Credentials
3. Redirect ไป Dashboard หลัง Login
4. ปุ่ม Logout

<details>
<summary>ดูเฉลย</summary>

```php
// routes/web.php
Route::get('/login', [AuthController::class, 'showLogin'])->middleware('guest')->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('auth')->name('dashboard');
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Login | `Auth::attempt()` + Session Regenerate |
| Logout | `Auth::logout()` + Session Invalidate |
| Middleware | `auth`, `guest`, `verified` |
| Redirect | `redirect()->intended()`, ปรับแต่งตาม Role |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-auth-introduction.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-authorization.md)
