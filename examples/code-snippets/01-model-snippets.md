# Code Snippets: Model & Eloquent

> โค้ดตัวอย่างที่ใช้บ่อยสำหรับ Model และ Eloquent ORM

---

## 1. Model พื้นฐาน

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'price', 'description', 'image',
        'category_id', 'user_id', 'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }

    // Accessor
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 2) . ' บาท';
    }
}
```

---

## 2. Migration

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->decimal('price', 10, 2);
    $table->text('description')->nullable();
    $table->string('image')->nullable();
    $table->foreignId('category_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
    $table->softDeletes();

    $table->index('category_id');
    $table->index(['is_active', 'created_at']);
});
```

---

## 3. Query ที่ใช้บ่อย

```php
// ดึงข้อมูลพร้อม Relationship
$products = Product::with('category', 'user')->get();

// ค้นหา + กรอง + Pagination
$products = Product::with('category')
    ->active()
    ->search($request->search)
    ->when($request->category_id, fn($q, $id) => $q->where('category_id', $id))
    ->latest()
    ->paginate(10);

// Aggregate
$stats = [
    'total' => Product::count(),
    'active' => Product::active()->count(),
    'avg_price' => Product::avg('price'),
    'max_price' => Product::max('price'),
];

// Group By
$byCategory = Product::selectRaw('category_id, COUNT(*) as total, AVG(price) as avg_price')
    ->groupBy('category_id')
    ->get();
```

---

## 4. Factory & Seeder

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
            'is_active' => fake()->boolean(80),
        ];
    }
}

// database/seeders/ProductSeeder.php
class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::factory()->count(50)->create();
    }
}
```
