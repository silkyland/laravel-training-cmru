# 15.3 Best Practices (แนวปฏิบัติที่ดี)

> **บทนี้คุณจะได้เรียนรู้**
> - Laravel Coding Standards
> - Project Structure Best Practices
> - Security Best Practices
> - Maintenance และ Monitoring

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. เขียนโค้ด Laravel ตาม Best Practices ได้
2. จัดโครงสร้างโปรเจกต์ที่ดูแลง่ายได้
3. วางแผน Maintenance และ Monitoring ได้

---

## เนื้อหา

### 1. Coding Standards

| หัวข้อ | แนวปฏิบัติ |
|--------|-----------|
| **Naming** | Model: PascalCase, table: snake_case_plural |
| **Controller** | ใช้ Resource Controller, Single Responsibility |
| **Validation** | ใช้ Form Request แทน validate() ใน Controller |
| **Query** | ใช้ Eloquent, หลีกเลี่ยง Raw Query |
| **View** | ใช้ Component, แยก Layout |

### 2. Project Structure

```php
// ✅ ใช้ Form Request
class StoreProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ];
    }
}

// ✅ Controller สั้นกระชับ
public function store(StoreProductRequest $request)
{
    Product::create($request->validated());
    return redirect()->route('products.index')->with('success', 'สร้างเรียบร้อย');
}
```

### 3. Security Checklist

| รายการ | วิธีป้องกัน |
|--------|-----------|
| SQL Injection | ใช้ Eloquent / Query Builder |
| XSS | ใช้ `{{ }}` ใน Blade |
| CSRF | ใช้ `@csrf` ในทุกฟอร์ม |
| Mass Assignment | กำหนด `$fillable` |
| Authentication | ใช้ `auth` Middleware |
| Authorization | ใช้ Gates / Policies |
| Password | Hash ด้วย `bcrypt` |
| .env | ไม่ Commit ไปยัง Git |

### 4. Maintenance

```bash
# Backup Database
mysqldump -u user -p database > backup_$(date +%Y%m%d).sql

# Monitor Logs
tail -f storage/logs/laravel.log

# Clear Old Logs
php artisan log:clear

# Health Check
php artisan about
```

| งาน | ความถี่ |
|-----|--------|
| Backup Database | ทุกวัน |
| ตรวจสอบ Logs | ทุกวัน |
| Update Dependencies | ทุกเดือน |
| Security Audit | ทุก 3 เดือน |
| ทดสอบ Backup Restore | ทุก 3 เดือน |

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Coding Standards | ตั้งชื่อถูกต้อง, ใช้ Form Request |
| Security | ป้องกัน SQL Injection, XSS, CSRF |
| Maintenance | Backup, Monitor Logs, Update |
| Structure | แยก Logic ออกจาก Controller |

---

**Navigation:**
[⬅️ ก่อนหน้า](02-version-control.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../16-workshop/01-project-assignment.md)
