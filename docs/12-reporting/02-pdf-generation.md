# 12.2 PDF Generation (การสร้างรายงาน PDF)

> 📖 **บทนี้คุณจะได้เรียนรู้**
> - การติดตั้ง package `dompdf`
> - การเปลี่ยนหน้า HTML ให้เป็น PDF
> - การจัดการฟอนต์ภาษาไทยใน PDF

---

## 🎯 วัตถุประสงค์
เพื่อให้สามารถออกเอกสารที่เป็นทางการ เช่น ใบเสร็จ, รายงานสรุปผล หรือเกียรติบัตร ผ่านทางหน้าเว็บได้

## 📚 เนื้อหา

### 1. การติดตั้งเครื่องมือ
เรามักใช้ `barryvdh/laravel-dompdf`:
```bash
composer require barryvdh/laravel-dompdf
```

### 2. โค้ดตัวอย่างการสร้าง PDF
```php
use Barryvdh\DomPDF\Facade\Pdf;

public function exportPdf()
{
    $data = [
        'title' => 'รายงานสรุปผลการอบรม',
        'date' => date('d/m/Y'),
        'users' => User::all()
    ];
    
    $pdf = Pdf::loadView('reports.user-pdf', $data); // โหลด View มาทำ PDF
    return $pdf->download('report.pdf'); // สั่งให้ Browser ดาวน์โหลดไฟล์
}
```

#### ⚠️ ปัญหาเรื่องภาษาไทย
การแสดงผลภาษาไทยใน PDF ต้องใช้ฟอนต์ที่รองรับ (เช่น THSarabunNew) และตั้งค่า CSS:
```css
body {
    font-family: 'THSarabunNew', sans-serif;
}
```

---

### 🤖 การใช้ AI ช่วยจัด Layout รายงาน

#### Prompt ตัวอย่าง:
"Create a simple HTML/CSS template for an invoice report that works well with Laravel-dompdf. It should include a header, item table, and a total amount."

---

## 🎓 แบบฝึกหัด
**โจทย์:** ลองติดตั้ง package dompdf และลองสร้างปุ่ม Download PDF ในโปรเจกต์ของคุณ

---

**Navigation:**
[⬅️ ก่อนหน้า](01-report-design.md) | [📚 สารบัญ](../../README.md) | [➡️ ถัดไป](03-excel-export.md)
