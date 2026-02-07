# 8.4 Multi-Auth (ระบบหลาย Role)

> **บทนี้คุณจะได้เรียนรู้**
> - การออกแบบระบบ Roles
> - Middleware สำหรับตรวจสอบ Role
> - การแยก Dashboard ตาม Role
> - Role-based Navigation

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ออกแบบระบบ Roles ในฐานข้อมูลได้
2. สร้าง Middleware ตรวจสอบ Role ได้
3. แยก Dashboard และเมนูตาม Role ได้
4. จัดการสิทธิ์แบบหลาย Role ได้

---

## เนื้อหา

### 1. การออกแบบระบบ Roles

#### วิธีที่ 1: เก็บ Role ใน Column

```php
// Migration: เพิ่ม role ใน users table
Schema::table('users', function (Blueprint $table) {
    $table->enum('role', ['admin', 'teacher', 'student'])->default('student');
});
```

#### วิธีที่ 2: แยกตาราง Roles (Many to Many)

```php
// create_roles_table
Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();
    $table->timestamps();
});

// create_role_user_table (Pivot)
Schema::create('role_user', function (Blueprint $table) {
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('role_id')->constrained()->onDelete('cascade');
    $table->primary(['user_id', 'role_id']);
});
```

| วิธี | ข้อดี | ข้อเสีย |
|------|------|--------|
| **Column** | ง่าย, เร็ว | ผู้ใช้มีได้แค่ 1 Role |
| **Many to Many** | ยืดหยุ่น, หลาย Roles | ซับซ้อนกว่า |

### 2. Middleware ตรวจสอบ Role

```php
// app/Http/Middleware/CheckRole.php
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
```

```php
// ลงทะเบียนใน bootstrap/app.php (Laravel 11+)
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

```php
// ใช้งาน
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::resource('/admin/users', AdminUserController::class);
});

Route::middleware(['auth', 'role:admin,teacher'])->group(function () {
    Route::resource('/courses', CourseController::class);
});
```

### 3. Helper Methods ใน User Model

```php
// app/Models/User.php
class User extends Authenticatable
{
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
}
```

### 4. Role-based Navigation

```blade
<nav>
    <a href="{{ route('home') }}">หน้าแรก</a>

    @auth
        @if(auth()->user()->isAdmin())
            <a href="{{ route('admin.dashboard') }}">Admin Dashboard</a>
            <a href="{{ route('admin.users.index') }}">จัดการผู้ใช้</a>
        @endif

        @if(auth()->user()->isTeacher())
            <a href="{{ route('teacher.courses') }}">รายวิชา</a>
            <a href="{{ route('teacher.grades') }}">ให้คะแนน</a>
        @endif

        @if(auth()->user()->isStudent())
            <a href="{{ route('student.courses') }}">วิชาเรียน</a>
            <a href="{{ route('student.grades') }}">ผลการเรียน</a>
        @endif
    @endauth
</nav>
```

---

### การใช้ AI ช่วยพัฒนา

#### Prompt ตัวอย่าง:

```
ออกแบบระบบ Multi-Auth สำหรับมหาวิทยาลัยที่มี 3 Roles:
- Admin: จัดการทุกอย่าง
- Teacher: จัดการรายวิชา, ให้คะแนน
- Student: ดูรายวิชา, ดูผลการเรียน
รวม Migration, Model, Middleware, Routes
```

---

## แบบฝึกหัด

### Exercise 1: สร้างระบบ Multi-Auth

**โจทย์:** สร้าง Middleware `role` และ Routes สำหรับ 3 Roles: admin, teacher, student

<details>
<summary>ดูเฉลย</summary>

```php
// routes/web.php
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::resource('/users', AdminUserController::class);
});

Route::middleware(['auth', 'role:teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/dashboard', [TeacherController::class, 'dashboard'])->name('dashboard');
    Route::resource('/courses', TeacherCourseController::class);
});

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
    Route::get('/grades', [StudentController::class, 'grades'])->name('grades');
});
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Roles Design | Column vs Many-to-Many |
| Middleware | สร้าง `CheckRole` Middleware |
| Helper Methods | `isAdmin()`, `hasRole()` ใน User Model |
| Navigation | แยกเมนูตาม Role ด้วย `@if` |

---

**Navigation:**
[⬅️ ก่อนหน้า](03-authorization.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../09-database-security/01-sql-injection.md)
