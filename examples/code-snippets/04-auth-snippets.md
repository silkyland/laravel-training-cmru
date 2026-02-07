# Code Snippets: Authentication & Authorization

> โค้ดตัวอย่างที่ใช้บ่อยสำหรับ Auth และ Authorization

---

## 1. Middleware ตรวจสอบ Role

```php
// app/Http/Middleware/CheckRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        if (!auth()->check() || !in_array(auth()->user()->role, $roles)) {
            abort(403, 'ไม่มีสิทธิ์เข้าถึง');
        }

        return $next($request);
    }
}

// ใช้งานใน Route
Route::middleware('role:admin')->group(function () {
    Route::resource('users', UserController::class);
});

Route::middleware('role:admin,editor')->group(function () {
    Route::resource('products', ProductController::class);
});
```

---

## 2. User Model Helpers

```php
// app/Models/User.php
class User extends Authenticatable
{
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isEditor(): bool
    {
        return $this->role === 'editor';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }
}
```

---

## 3. Gate & Policy

```php
// app/Providers/AppServiceProvider.php
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::define('manage-products', function (User $user) {
        return $user->hasAnyRole(['admin', 'editor']);
    });

    Gate::define('delete-product', function (User $user, Product $product) {
        return $user->isAdmin() || $user->id === $product->user_id;
    });
}

// ใช้ใน Controller
public function destroy(Product $product)
{
    Gate::authorize('delete-product', $product);
    $product->delete();
    return redirect()->route('products.index');
}

// ใช้ใน Blade
@can('delete-product', $product)
    <button>ลบ</button>
@endcan
```

---

## 4. Login / Logout

```php
// Login
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials, $request->boolean('remember'))) {
        $request->session()->regenerate();
        return redirect()->intended('dashboard');
    }

    return back()->withErrors([
        'email' => 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    ])->onlyInput('email');
}

// Logout
public function logout(Request $request)
{
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
}
```
