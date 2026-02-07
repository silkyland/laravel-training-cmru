# 9.4 Access Control (การควบคุมการเข้าถึงฐานข้อมูล)

> **บทนี้คุณจะได้เรียนรู้**
> - หลักการ Least Privilege
> - การตั้งค่า Database User Permissions
> - Environment Configuration (.env)
> - การแยก Database Credentials ตาม Environment

---

## วัตถุประสงค์การเรียนรู้

เมื่อจบบทเรียนนี้ ผู้เรียนจะสามารถ:
1. อธิบายหลักการ Least Privilege ได้
2. ตั้งค่า Database User ที่มีสิทธิ์จำกัดได้
3. จัดการ Environment Configuration อย่างปลอดภัยได้
4. แยก Credentials ตาม Environment ได้

---

## เนื้อหา

### 1. หลักการ Least Privilege

ให้สิทธิ์เฉพาะที่จำเป็นเท่านั้น ไม่ใช้ root/admin สำหรับแอปพลิเคชัน

```sql
-- ❌ อันตราย - ใช้ root
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';

-- ✅ ปลอดภัย - สร้าง User เฉพาะแอป
CREATE USER 'laravel_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON myapp.* TO 'laravel_app'@'localhost';
FLUSH PRIVILEGES;
```

| สิทธิ์ | ใช้เมื่อ |
|--------|---------|
| `SELECT, INSERT, UPDATE, DELETE` | แอปพลิเคชันทั่วไป |
| `CREATE, ALTER, DROP` | Migration เท่านั้น |
| `ALL PRIVILEGES` | ไม่ควรใช้ใน Production |

### 2. Environment Configuration

```bash
# .env - ห้าม Commit ไปยัง Git!
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=laravel_app
DB_PASSWORD=strong_password_here
```

```gitignore
# .gitignore - ต้องมี!
.env
.env.backup
.env.production
```

### 3. การแยก Credentials ตาม Environment

| Environment | Database | User | สิทธิ์ |
|------------|---------|------|--------|
| **Local** | myapp_dev | dev_user | ALL |
| **Staging** | myapp_staging | staging_user | SELECT, INSERT, UPDATE, DELETE |
| **Production** | myapp_prod | prod_user | SELECT, INSERT, UPDATE, DELETE |

### 4. Best Practices

| แนวปฏิบัติ | รายละเอียด |
|-----------|-----------|
| **ไม่ใช้ root** | สร้าง User เฉพาะแอป |
| **ไม่ Commit .env** | ใส่ใน .gitignore |
| **เปลี่ยน Password บ่อย** | โดยเฉพาะ Production |
| **ใช้ SSL Connection** | เข้ารหัสการเชื่อมต่อฐานข้อมูล |
| **Backup สม่ำเสมอ** | ตั้ง Automated Backup |

---

## แบบฝึกหัด

### Exercise 1: ตั้งค่า Database User

**โจทย์:** เขียนคำสั่ง SQL สร้าง Database User สำหรับ Production ที่มีสิทธิ์จำกัด

<details>
<summary>ดูเฉลย</summary>

```sql
CREATE DATABASE myapp_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'myapp_prod'@'localhost' IDENTIFIED BY 'SecureP@ssw0rd!';
GRANT SELECT, INSERT, UPDATE, DELETE ON myapp_prod.* TO 'myapp_prod'@'localhost';
FLUSH PRIVILEGES;
```

</details>

---

## สรุป

| หัวข้อ | สิ่งที่ได้เรียนรู้ |
|--------|-------------------|
| Least Privilege | ให้สิทธิ์เฉพาะที่จำเป็น |
| .env | เก็บ Credentials ห้าม Commit |
| Database User | สร้าง User เฉพาะแอป ไม่ใช้ root |
| Environment | แยก Credentials ตาม Local/Staging/Production |

---

**Navigation:**
[⬅️ ก่อนหน้า](03-encryption.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](../10-application-security/01-csrf-protection.md)
