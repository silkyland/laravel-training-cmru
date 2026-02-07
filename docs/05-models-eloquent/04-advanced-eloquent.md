# 5.4 Advanced Eloquent (เทคนิค Eloquent ขั้นสูง)

> **บทนี้คุณจะได้เรียนรู้**
> - Query Scopes สำหรับ Reusable Queries
> - Accessors และ Mutators
> - Soft Deletes
> - Observers และ Events

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. สร้าง Query Scopes เพื่อ Reuse เงื่อนไขการค้นหาได้
2. ใช้ Accessors และ Mutators แปลงข้อมูลอัตโนมัติได้
3. ใช้ Soft Deletes สำหรับการลบข้อมูลแบบปลอดภัยได้
4. ใช้ Observers จัดการ Events ของ Model ได้

---

## เนื้อหา

### 1. Query Scopes

**Query Scopes** ช่วยให้เราสร้างเงื่อนไขการค้นหาที่ใช้ซ้ำได้ เปรียบเสมือน **"ฟิลเตอร์สำเร็จรูป"** ที่เรียกใช้ได้ทุกที่

#### Local Scopes

```php
// app/Models/Product.php
class Product extends Model
{
    // Scope สำหรับสินค้าที่ยังมีในสต็อก
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    // Scope สำหรับสินค้าราคาถูก
    public function scopeCheap($query, $maxPrice = 500)
    {
        return $query->where('price', '<=', $maxPrice);
    }

    // Scope สำหรับสินค้าที่เปิดขาย
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
```

```php
// การใช้งาน - เรียกแบบ Chain ได้
$products = Product::inStock()->active()->get();
$cheapProducts = Product::cheap(300)->inStock()->get();

// เทียบกับการไม่ใช้ Scope (ต้องเขียนซ้ำทุกที่)
$products = Product::where('stock', '>', 0)
    ->where('is_active', true)
    ->get();
```

| ข้อดีของ Scopes | รายละเอียด |
|----------------|-----------|
| **Reusable** | เขียนครั้งเดียว ใช้ได้ทุกที่ |
| **Readable** | `Product::inStock()` อ่านง่ายกว่า `where('stock', '>', 0)` |
| **Chainable** | ต่อกันได้หลาย Scopes |
| **Testable** | ทดสอบแยกแต่ละ Scope ได้ |

### 2. Accessors และ Mutators

**Accessors** แปลงข้อมูลเมื่อ **อ่าน** จาก Model, **Mutators** แปลงข้อมูลเมื่อ **เขียน** ลง Model

```php
// app/Models/User.php
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model
{
    // Accessor: แปลงชื่อให้ขึ้นต้นด้วยตัวใหญ่เสมอ
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => ucfirst($value),
        );
    }

    // Mutator: เข้ารหัส password อัตโนมัติเมื่อบันทึก
    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => bcrypt($value),
        );
    }

    // ทั้ง Accessor + Mutator
    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => strtolower($value),
            set: fn ($value) => strtolower($value),
        );
    }
}
```

```php
// การใช้งาน
$user = User::find(1);
echo $user->name;  // "somchai" → "Somchai" (Accessor ทำงาน)

$user->password = '1234';  // เก็บเป็น bcrypt hash (Mutator ทำงาน)
$user->save();
```

### 3. Soft Deletes

**Soft Deletes** คือการลบข้อมูลแบบไม่ลบจริง เพียงแค่เพิ่มค่า `deleted_at` เปรียบเสมือน **"ย้ายไปถังขยะ"** แทนการลบถาวร

```php
// Migration: เพิ่ม softDeletes
Schema::table('products', function (Blueprint $table) {
    $table->softDeletes(); // เพิ่มคอลัมน์ deleted_at
});
```

```php
// app/Models/Product.php
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
}
```

```php
// การใช้งาน
$product = Product::find(1);
$product->delete();          // Soft Delete (ยังอยู่ในฐานข้อมูล)

Product::all();              // ไม่รวมที่ถูก Soft Delete
Product::withTrashed()->get();    // รวมที่ถูก Soft Delete
Product::onlyTrashed()->get();    // เฉพาะที่ถูก Soft Delete

$product->restore();         // กู้คืนข้อมูล
$product->forceDelete();     // ลบถาวร (ลบจริง)
```

| คำสั่ง | หน้าที่ |
|--------|--------|
| `delete()` | Soft Delete (เพิ่ม deleted_at) |
| `restore()` | กู้คืนข้อมูล (ลบ deleted_at) |
| `forceDelete()` | ลบถาวรจากฐานข้อมูล |
| `withTrashed()` | ดึงข้อมูลรวมที่ถูก Soft Delete |
| `onlyTrashed()` | ดึงเฉพาะที่ถูก Soft Delete |
| `trashed()` | ตรวจสอบว่าถูก Soft Delete หรือไม่ |

### 4. Observers

**Observers** ช่วยจัดการ Events ที่เกิดขึ้นกับ Model เช่น ก่อนสร้าง, หลังอัปเดต, ก่อนลบ

```bash
php artisan make:observer ProductObserver --model=Product
```

```php
// app/Observers/ProductObserver.php
class ProductObserver
{
    public function creating(Product $product)
    {
        // ทำงานก่อนสร้างข้อมูลใหม่
        $product->slug = Str::slug($product->name);
    }

    public function updated(Product $product)
    {
        // ทำงานหลังอัปเดตข้อมูล
        Cache::forget("product_{$product->id}");
    }

    public function deleted(Product $product)
    {
        // ทำงานหลังลบข้อมูล
        Log::info("Product deleted: {$product->name}");
    }
}
```

```php
// ลงทะเบียนใน AppServiceProvider
use App\Models\Product;
use App\Observers\ProductObserver;

public function boot()
{
    Product::observe(ProductObserver::class);
}
```

#### Events ที่ใช้ได้

| Event | ทำงานเมื่อ |
|-------|----------|
| `creating` / `created` | ก่อน/หลังสร้างข้อมูลใหม่ |
| `updating` / `updated` | ก่อน/หลังอัปเดตข้อมูล |
| `saving` / `saved` | ก่อน/หลังบันทึก (ทั้งสร้างและอัปเดต) |
| `deleting` / `deleted` | ก่อน/หลังลบข้อมูล |
| `restoring` / `restored` | ก่อน/หลังกู้คืน Soft Delete |

---

### การใช้ AI ช่วยพัฒนา

#### Prompt ตัวอย่าง:

```
สร้าง Eloquent Model สำหรับ Product ที่มี:
- Query Scopes: inStock, priceRange, popular
- Accessor: formatted_price (แสดงราคาพร้อมสัญลักษณ์ ฿)
- Soft Deletes
- Observer สำหรับสร้าง slug อัตโนมัติ
```

#### การ Review Code จาก AI

เมื่อได้โค้ดจาก AI ให้ตรวจสอบ:
- [ ] Scope ใช้ `scope` prefix ถูกต้องหรือไม่
- [ ] Accessor/Mutator ใช้ syntax ของ Laravel เวอร์ชันปัจจุบันหรือไม่
- [ ] Observer ลงทะเบียนใน ServiceProvider แล้วหรือไม่
- [ ] Soft Deletes มี `use SoftDeletes` trait และ Migration ครบหรือไม่

---

## แบบฝึกหัด

### Exercise 1: สร้าง Query Scopes

**โจทย์:** สร้าง Model `Article` ที่มี Scopes:
1. `published()` - บทความที่เผยแพร่แล้ว (published_at ไม่เป็น null)
2. `recent()` - เรียงตามวันที่ใหม่สุด
3. `byAuthor($userId)` - กรองตามผู้เขียน

<details>
<summary>ดูเฉลย</summary>

```php
class Article extends Model
{
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    public function scopeByAuthor($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}

// การใช้งาน
$articles = Article::published()->recent()->byAuthor(1)->get();
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Query Scopes | สร้างเงื่อนไขค้นหาที่ Reusable ด้วย `scope` prefix |
| Accessors/Mutators | แปลงข้อมูลอัตโนมัติเมื่ออ่าน/เขียน |
| Soft Deletes | ลบแบบปลอดภัย ด้วย `SoftDeletes` trait |
| Observers | จัดการ Events ของ Model เช่น creating, updated, deleted |

---

**Navigation:**
[⬅️ ก่อนหน้า](03-relationships.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](05-collections.md)
