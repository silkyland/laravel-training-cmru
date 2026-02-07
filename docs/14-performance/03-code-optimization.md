# 14.3 Code Optimization (การเพิ่มประสิทธิภาพโค้ด)

> **บทนี้คุณจะได้เรียนรู้**
> - Laravel Optimization Commands
> - Route Caching
> - Config Caching
> - View Caching และ Autoloader Optimization

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. ใช้ Artisan Commands เพิ่มประสิทธิภาพได้
2. ตั้งค่า Caching สำหรับ Production ได้
3. ปรับปรุงโค้ดให้ทำงานเร็วขึ้นได้

---

## เนื้อหา

### 1. Laravel Optimization Commands

```bash
# Cache ทุกอย่างสำหรับ Production
php artisan optimize

# ล้าง Cache ทั้งหมด
php artisan optimize:clear

# แยกทำทีละอย่าง
php artisan config:cache    # Cache Config
php artisan route:cache     # Cache Routes
php artisan view:cache      # Cache Views
php artisan event:cache     # Cache Events
```

| Command | หน้าที่ | ใช้เมื่อ |
|---------|--------|---------|
| `config:cache` | Cache Config Files | Deploy Production |
| `route:cache` | Cache Routes | Deploy Production |
| `view:cache` | Compile Blade Views | Deploy Production |
| `optimize` | ทำทุกอย่างข้างต้น | Deploy Production |
| `optimize:clear` | ล้าง Cache ทั้งหมด | Debug / Development |

### 2. Autoloader Optimization

```bash
# Composer Autoloader Optimization
composer install --optimize-autoloader --no-dev
```

### 3. Code Best Practices

```php
// ❌ Query ใน Loop
foreach ($orders as $order) {
    $user = User::find($order->user_id);
}

// ✅ Eager Load ก่อน
$orders = Order::with('user')->get();

// ❌ ใช้ Collection Method ที่ไม่จำเป็น
$total = Product::all()->where('active', true)->sum('price');

// ✅ ใช้ Query Builder
$total = Product::where('active', true)->sum('price');

// ❌ สร้าง Object ซ้ำ
foreach ($items as $item) {
    $formatter = new NumberFormatter('th_TH', NumberFormatter::CURRENCY);
    echo $formatter->formatCurrency($item->price, 'THB');
}

// ✅ สร้าง Object ครั้งเดียว
$formatter = new NumberFormatter('th_TH', NumberFormatter::CURRENCY);
foreach ($items as $item) {
    echo $formatter->formatCurrency($item->price, 'THB');
}
```

### 4. Production Checklist

| รายการ | คำสั่ง |
|--------|-------|
| Cache Config | `php artisan config:cache` |
| Cache Routes | `php artisan route:cache` |
| Cache Views | `php artisan view:cache` |
| Optimize Autoloader | `composer install --optimize-autoloader --no-dev` |
| ปิด Debug Mode | `APP_DEBUG=false` |
| ตั้ง App Environment | `APP_ENV=production` |

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| `optimize` | Cache Config, Route, View พร้อมกัน |
| Composer | `--optimize-autoloader --no-dev` |
| Code | หลีกเลี่ยง Query ใน Loop |
| Production | ปิด Debug, Cache ทุกอย่าง |

---

**Navigation:**
[⬅️ ก่อนหน้า](02-database-optimization.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../15-deployment/01-deployment-prep.md)
