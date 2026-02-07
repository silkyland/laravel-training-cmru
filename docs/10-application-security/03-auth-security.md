# 10.3 Auth Security (ความปลอดภัยด้าน Authentication)

> **บทนี้คุณจะได้เรียนรู้**
> - Session Security
> - Rate Limiting สำหรับ Login
> - Password Security Best Practices
> - Session Fixation Prevention

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ตั้งค่า Session ให้ปลอดภัยได้
2. ใช้ Rate Limiting ป้องกัน Brute Force ได้
3. กำหนด Password Policy ที่เหมาะสมได้

---

## เนื้อหา

### 1. Session Security

```php
// config/session.php
return [
    'lifetime' => 120,          // หมดอายุใน 120 นาที
    'expire_on_close' => false,  // หมดอายุเมื่อปิดเบราว์เซอร์
    'encrypt' => true,           // เข้ารหัส Session Data
    'http_only' => true,         // ป้องกัน JavaScript เข้าถึง Cookie
    'secure' => true,            // ส่ง Cookie ผ่าน HTTPS เท่านั้น
    'same_site' => 'lax',       // ป้องกัน CSRF
];
```

### 2. Rate Limiting สำหรับ Login

```php
// ป้องกัน Brute Force Attack
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});

// ใช้ใน Route
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:login');
```

### 3. Password Security

```php
// Validation Rules สำหรับ Password ที่แข็งแรง
use Illuminate\Validation\Rules\Password;

$request->validate([
    'password' => [
        'required',
        'confirmed',
        Password::min(8)
            ->mixedCase()      // ต้องมีตัวพิมพ์เล็กและใหญ่
            ->numbers()        // ต้องมีตัวเลข
            ->symbols()        // ต้องมีอักขระพิเศษ
            ->uncompromised(), // ตรวจสอบว่าไม่เคยรั่วไหล
    ],
]);
```

### 4. Session Fixation Prevention

```php
// หลัง Login สำเร็จ ต้อง Regenerate Session
public function login(Request $request)
{
    if (Auth::attempt($credentials)) {
        $request->session()->regenerate(); // สำคัญมาก!
        return redirect()->intended('dashboard');
    }
}

// หลัง Logout ต้อง Invalidate Session
public function logout(Request $request)
{
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
}
```

| แนวปฏิบัติ | รายละเอียด |
|-----------|-----------|
| **Regenerate Session** | หลัง Login เสมอ |
| **Invalidate Session** | หลัง Logout เสมอ |
| **HTTPS Only** | ตั้ง `secure => true` |
| **Rate Limiting** | จำกัดจำนวนครั้งที่ Login ผิด |

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Session Security | เข้ารหัส, HTTP Only, Secure Cookie |
| Rate Limiting | ป้องกัน Brute Force ด้วย `throttle` |
| Password Policy | ใช้ `Password::min(8)->mixedCase()` |
| Session Fixation | `regenerate()` หลัง Login |

---

**Navigation:**
[⬅️ ก่อนหน้า](02-xss-prevention.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](04-api-security.md)
