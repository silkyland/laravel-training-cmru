# 16.1 Project Assignment (โจทย์โปรเจกต์)

> 📖 **เป้าหมาย**
> - สร้างระบบ "Mini Personal Data Store" (ระบบเก็บข้อมูลส่วนบุคคลขนาดเล็ก)
> - ฝึกการใช้ CRUD, Validation, Security และ Report

---

## 🎯 รายละเอียดของโปรเจกต์

ให้ผู้เข้าอบรมสร้างระบบที่สามารถจัดการข้อมูลอะไรก็ได้ 1 อย่าง (เช่น รายชื่อบุคลากร, ทรัพย์สิน, ตารางนัดหมาย, หรือรายการหนังสือ) โดยมีรายละเอียดดังนี้:

### 1. Database Schema
- อย่างน้อย 1-2 ตารางที่เชื่อมโยงกัน (Relationships)
- มีข้อมูลที่สำคัญ (Sensitive Data) เช่น หมายเลขบัตรประชาชน หรือ เบอร์โทรศัพท์ เพื่อฝึกการทำ Encryption

### 2. Features Required
- **Authentication**: ระบบ Login/Logout (ใช้อุปกรณ์ช่วยสร้างอย่าง Laravel Breeze)
- **CRUD Operations**:
  - เพิ่มข้อมูลพร้อมการตรวจสอบ (Validation)
  - แสดงผลข้อมูลแบบรายการพร้อมระบบค้นหา (Search)
  - แก้ไขข้อมูล
  - ลบข้อมูลแบบปลอดภัย (Soft Deletes)
- **Reporting**: ดาวน์โหลดข้อมูลที่เลือกเป็น PDF หรือ Excel
- **Advanced**: ใช้ AI ช่วยเขียน Unit Test อย่างน้อย 1 เคส

---

## 🤖 การใช้ AI เป็นครูผู้ช่วย

ให้ผู้เข้าอบรมลองใช้ Prompt ดังนี้เพื่อเริ่มต้น:

```text
"I want to build a Laravel application for managing employee assets. 
Can you design a database schema for 'assets' and 'categories' tables 
and show me the migration code?"
```

---

## 📋 เกณฑ์การให้คะแนน (Self-Assessment)

- [ ] ระบบลันได้จริง (Workable)
- [ ] มีการป้องกัน SQL Injection และ XSS
- [ ] โค้ดอ่านง่าย (Clean Code) และมี Comment
- [ ] มีเอกสารประกอบเล็กน้อยว่าใช้ AI ช่วยตรงไหนบ้าง

---

**Navigation:**
[⬅️ ก่อนหน้า](../15-deployment/03-best-practices.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](02-ai-prompting.md)
