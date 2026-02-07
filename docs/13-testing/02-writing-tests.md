# 13.2 Writing Tests (การเขียน Test)

> **บทนี้คุณจะได้เรียนรู้**
> - การสร้าง Feature Test
> - การทดสอบ CRUD Operations
> - การใช้ Factory และ Assertion
> - Database Testing

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. สร้าง Feature Test สำหรับ CRUD ได้
2. ใช้ Factory สร้างข้อมูลทดสอบได้
3. ใช้ Assertion ตรวจสอบผลลัพธ์ได้

---

## เนื้อหา

### 1. สร้าง Test

```bash
php artisan make:test ProductTest          # Feature Test
php artisan make:test ProductTest --unit   # Unit Test
```

### 2. Feature Test ตัวอย่าง

```php
// tests/Feature/ProductTest.php
use App\Models\Product;
use App\Models\User;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_products_list()
    {
        Product::factory()->count(5)->create();

        $response = $this->get('/products');

        $response->assertStatus(200);
        $response->assertViewHas('products');
    }

    public function test_user_can_create_product()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/products', [
            'name' => 'สินค้าทดสอบ',
            'price' => 100.00,
            'category_id' => 1,
        ]);

        $response->assertRedirect('/products');
        $this->assertDatabaseHas('products', ['name' => 'สินค้าทดสอบ']);
    }

    public function test_user_can_update_product()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($user)->put("/products/{$product->id}", [
            'name' => 'ชื่อใหม่',
            'price' => 200.00,
        ]);

        $response->assertRedirect('/products');
        $this->assertDatabaseHas('products', ['name' => 'ชื่อใหม่']);
    }

    public function test_user_can_delete_product()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($user)->delete("/products/{$product->id}");

        $response->assertRedirect('/products');
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
```

### 3. Assertion ที่ใช้บ่อย

| Assertion | ตรวจสอบอะไร |
|-----------|-----------|
| `assertStatus(200)` | HTTP Status Code |
| `assertRedirect('/url')` | Redirect ไปหน้าที่ถูกต้อง |
| `assertViewHas('key')` | View มีข้อมูลที่ส่งไป |
| `assertDatabaseHas('table', [...])` | มีข้อมูลในฐานข้อมูล |
| `assertDatabaseMissing('table', [...])` | ไม่มีข้อมูลในฐานข้อมูล |
| `assertSee('text')` | หน้าเว็บมีข้อความ |
| `assertAuthenticated()` | ผู้ใช้ Login อยู่ |

### 4. Factory

```php
// database/factories/ProductFactory.php
class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'price' => fake()->randomFloat(2, 10, 10000),
            'description' => fake()->paragraph(),
            'category_id' => Category::factory(),
            'user_id' => User::factory(),
        ];
    }
}
```

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Feature Test | ทดสอบ HTTP Request ทั้ง Flow |
| Factory | สร้างข้อมูลทดสอบอัตโนมัติ |
| Assertion | ตรวจสอบผลลัพธ์ที่คาดหวัง |
| RefreshDatabase | รีเซ็ตฐานข้อมูลทุกครั้ง |

---

**Navigation:**
[⬅️ ก่อนหน้า](01-testing-introduction.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-debugging.md)
