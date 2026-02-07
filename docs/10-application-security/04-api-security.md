# 10.4 API Security (ความปลอดภัยของ API)

> **บทนี้คุณจะได้เรียนรู้**
> - Laravel Sanctum สำหรับ API Authentication
> - API Rate Limiting
> - CORS Configuration
> - API Best Practices

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ใช้ Sanctum สำหรับ API Authentication ได้
2. ตั้งค่า Rate Limiting สำหรับ API ได้
3. ตั้งค่า CORS ได้
4. ออกแบบ API ที่ปลอดภัยได้

---

## เนื้อหา

### 1. Laravel Sanctum

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

```php
// สร้าง API Token
$token = $user->createToken('api-token')->plainTextToken;

// ใช้ Token ใน Request
// Header: Authorization: Bearer <token>

// ป้องกัน Route ด้วย Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());
    Route::apiResource('products', ProductController::class);
});

// ลบ Token (Logout)
$request->user()->currentAccessToken()->delete();
```

### 2. API Best Practices

| แนวปฏิบัติ | รายละเอียด |
|-----------|-----------|
| **ใช้ HTTPS** | เข้ารหัสข้อมูลระหว่างทาง |
| **Validate Input** | ตรวจสอบข้อมูลทุก Request |
| **Rate Limiting** | จำกัดจำนวน Request |
| **ไม่ส่งข้อมูลเกิน** | ใช้ API Resource เลือก field |
| **Versioning** | ใช้ `/api/v1/` สำหรับ API version |
| **Error Handling** | ส่ง Error เป็น JSON ที่สม่ำเสมอ |

### 3. API Resource

```php
// API Resource - ควบคุมข้อมูลที่ส่งออก
class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            // ไม่ส่ง password, remember_token
        ];
    }
}
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Sanctum | Token-based API Authentication |
| Rate Limiting | จำกัด Request ด้วย `RateLimiter` |
| CORS | ควบคุม Origin ที่อนุญาต |
| API Resource | ควบคุมข้อมูลที่ส่งออก |

---

**Navigation:**
[⬅️ ก่อนหน้า](03-auth-security.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../11-crud-system/01-crud-overview.md)
