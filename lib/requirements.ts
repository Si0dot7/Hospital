export type DocRequirement = {
  key: string;                 // รหัสเอกสาร
  label: string;               // ชื่อเอกสารที่ HR เข้าใจ
  accept: string[];            // นามสกุลไฟล์ที่ยอมรับ เช่น ['pdf', 'jpg','jpeg','png']
  maxSizeMB?: number;          // ขนาดสูงสุด
  // (ออปชัน) คำสั่งตรวจเนื้อหาคร่าว ๆ ถ้าในอนาคตจะทำ OCR/NLP
  contentHint?: string;        // เช่น "ต้องมีเลขบัตรประชาชน 13 หลัก"
};

export const REQUIRED_BY_TYPE: Record<string, DocRequirement[]> = {
  "หนังสือรับรอง": [
    { key: "national_id", label: "สำเนาบัตรประชาชน", accept: ["pdf","jpg","jpeg","png"], maxSizeMB: 10, contentHint: "ควรเห็นเลขบัตร 13 หลัก" },
    { key: "request_form", label: "แบบฟอร์มคำร้องลงนาม", accept: ["pdf"], maxSizeMB: 10 },
  ],
  "ต่อใบอนุญาต": [
    { key: "license_copy", label: "สำเนาใบอนุญาตเดิม", accept: ["pdf","jpg","jpeg","png"], maxSizeMB: 10 },
    { key: "payment_slip", label: "หลักฐานชำระค่าธรรมเนียม", accept: ["pdf","jpg","jpeg","png"], maxSizeMB: 10 },
  ],
  "แก้ไขข้อมูลบุคคล": [
    { key: "evidence", label: "หลักฐานประกอบการแก้ไข (เอกสารทางราชการ)", accept: ["pdf","jpg","jpeg","png"], maxSizeMB: 10 },
  ],
};
