# 9.3 Encryption (การเข้ารหัสข้อมูล)

> **บทนี้คุณจะได้เรียนรู้**
> - Hashing vs Encryption
> - การเข้ารหัส Password ด้วย bcrypt
> - การเข้ารหัสข้อมูลด้วย Crypt Facade
> - Encrypted Casting

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. อธิบายความแตกต่างระหว่าง Hashing กับ Encryption ได้
2. ใช้ bcrypt เข้ารหัส Password ได้
3. ใช้ Crypt Facade เข้ารหัส/ถอดรหัสข้อมูลได้
4. ใช้ Encrypted Casting เข้ารหัสข้อมูลอัตโนมัติได้

---

## เนื้อหา

### 1. Hashing vs Encryption

| คุณสมบัติ | Hashing | Encryption |
|----------|---------|-----------|
| **ย้อนกลับได้** | ไม่ได้ (One-way) | ได้ (Two-way) |
| **ใช้สำหรับ** | Password | ข้อมูลที่ต้องอ่านกลับ |
| **ตัวอย่าง** | bcrypt, argon2 | AES-256-CBC |
| **ใน Laravel** | `Hash::make()` | `Crypt::encrypt()` |

### 2. Password Hashing

```php
use Illuminate\Support\Facades\Hash;

// เข้ารหัส Password
$hashed = Hash::make('password123');
// ผลลัพธ์: $2y$12$xxxxx... (ย้อนกลับไม่ได้)

// ตรวจสอบ Password
if (Hash::check('password123', $hashed)) {
    // Password ถูกต้อง
}

// ใน Model (Mutator อัตโนมัติ)
// Laravel 11+ จะ hash password อัตโนมัติ
protected function casts(): array
{
    return [
        'password' => 'hashed',
    ];
}
```

### 3. Data Encryption

```php
use Illuminate\Support\Facades\Crypt;

// เข้ารหัส
$encrypted = Crypt::encryptString('เลขบัตรประชาชน: 1234567890123');

// ถอดรหัส
$decrypted = Crypt::decryptString($encrypted);
// ผลลัพธ์: "เลขบัตรประชาชน: 1234567890123"
```

### 4. Encrypted Casting

```php
// app/Models/Patient.php
class Patient extends Model
{
    protected function casts(): array
    {
        return [
            'id_card' => 'encrypted',
            'medical_record' => 'encrypted',
        ];
    }
}

// การใช้งาน - เข้ารหัส/ถอดรหัสอัตโนมัติ
$patient = Patient::create([
    'name' => 'สมชาย',
    'id_card' => '1234567890123', // เก็บเป็น encrypted ในฐานข้อมูล
]);

echo $patient->id_card; // แสดง: 1234567890123 (ถอดรหัสอัตโนมัติ)
```

---

### การใช้ AI ช่วยพัฒนา

#### Prompt ตัวอย่าง:

```
ตรวจสอบว่า Model นี้เก็บข้อมูลส่วนบุคคลอย่างปลอดภัยหรือไม่
แนะนำ field ที่ควรเข้ารหัส:
[วาง Model Code]
```

---

## แบบฝึกหัด

### Exercise 1: เข้ารหัสข้อมูลส่วนบุคคล

**โจทย์:** สร้าง Model `Employee` ที่เข้ารหัส field: เลขบัตรประชาชน, เลขบัญชีธนาคาร

<details>
<summary>ดูเฉลย</summary>

```php
class Employee extends Model
{
    protected $fillable = ['name', 'id_card', 'bank_account', 'department'];

    protected function casts(): array
    {
        return [
            'id_card' => 'encrypted',
            'bank_account' => 'encrypted',
        ];
    }
}
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Hashing | One-way, ใช้กับ Password (`Hash::make()`) |
| Encryption | Two-way, ใช้กับข้อมูลที่ต้องอ่านกลับ (`Crypt::encrypt()`) |
| Encrypted Cast | เข้ารหัส/ถอดรหัสอัตโนมัติใน Model |
| APP_KEY | กุญแจสำคัญ ห้ามเปิดเผย |

---

**Navigation:**
[⬅️ ก่อนหน้า](02-mass-assignment.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](04-access-control.md)
