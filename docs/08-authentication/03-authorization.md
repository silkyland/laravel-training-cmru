# 8.3 Authorization (การจัดการสิทธิ์)

> **บทนี้คุณจะได้เรียนรู้**
> - Gates สำหรับตรวจสอบสิทธิ์แบบง่าย
> - Policies สำหรับตรวจสอบสิทธิ์ระดับ Model
> - การใช้ @can ใน Blade
> - Roles และ Permissions

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. สร้าง Gates สำหรับตรวจสอบสิทธิ์ได้
2. สร้าง Policies สำหรับควบคุมการเข้าถึง Model ได้
3. ใช้ `@can` / `@cannot` ใน Blade ได้
4. ออกแบบระบบ Roles และ Permissions ได้

---

## เนื้อหา

### 1. Gates

**Gates** คือ Closures ที่ตรวจสอบว่าผู้ใช้มีสิทธิ์ทำบางอย่างหรือไม่:

```php
// app/Providers/AuthServiceProvider.php
use Illuminate\Support\Facades\Gate;

public function boot()
{
    Gate::define('manage-users', function ($user) {
        return $user->role === 'admin';
    });

    Gate::define('update-post', function ($user, $post) {
        return $user->id === $post->user_id;
    });
}
```

```php
// ใช้ใน Controller
if (Gate::allows('manage-users')) {
    // มีสิทธิ์
}

if (Gate::denies('update-post', $post)) {
    abort(403);
}

// หรือใช้ authorize()
$this->authorize('update-post', $post);
```

### 2. Policies

**Policies** คือ Class ที่จัดกลุ่ม Authorization Logic ตาม Model:

```bash
php artisan make:policy PostPolicy --model=Post
```

```php
// app/Policies/PostPolicy.php
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->role === 'admin';
    }

    public function create(User $user): bool
    {
        return $user->role !== 'banned';
    }
}
```

```php
// ใช้ใน Controller
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post);
    // อัปเดตโพสต์...
}
```

### 3. ใช้ใน Blade

```blade
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">แก้ไข</a>
@endcan

@cannot('delete', $post)
    <p>คุณไม่มีสิทธิ์ลบโพสต์นี้</p>
@endcannot
```

| วิธีใช้ | ตัวอย่าง |
|---------|---------|
| **Gate** | `Gate::allows('manage-users')` |
| **Controller** | `$this->authorize('update', $post)` |
| **Blade** | `@can('update', $post)` |
| **Middleware** | `->middleware('can:update,post')` |

---

### การใช้ AI ช่วยพัฒนา

#### Prompt ตัวอย่าง:

```
สร้าง Policy สำหรับ Article Model ที่:
- เฉพาะเจ้าของบทความเท่านั้นที่แก้ไข/ลบได้
- Admin แก้ไข/ลบได้ทุกบทความ
- ผู้ใช้ที่ถูก Ban ไม่สามารถสร้างบทความได้
```

---

## แบบฝึกหัด

### Exercise 1: สร้าง Policy

**โจทย์:** สร้าง `ProductPolicy` ที่:
1. ทุกคนดูสินค้าได้
2. เฉพาะ Admin สร้าง/แก้ไข/ลบสินค้าได้

<details>
<summary>ดูเฉลย</summary>

```php
class ProductPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Product $product): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->role === 'admin';
    }
}
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Gates | Closures สำหรับตรวจสอบสิทธิ์แบบง่าย |
| Policies | Class จัดกลุ่ม Authorization ตาม Model |
| Blade | `@can`, `@cannot`, `@canany` |
| Controller | `$this->authorize()` |

---

**Navigation:**
[⬅️ ก่อนหน้า](02-implementing-auth.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](04-multi-auth.md)
