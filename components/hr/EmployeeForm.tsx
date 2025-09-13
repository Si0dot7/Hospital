// components/hr/EmployeeForm.tsx
"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  onSubmitNew: (fd: FormData) => void;
  onCancel?: () => void;
};

export default function EmployeeForm({ onSubmitNew, onCancel }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmitNew(fd);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1">ประเภทคำร้อง</label>
        <select
          name="type"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="หนังสือรับรอง">หนังสือรับรอง</option>
          <option value="ต่อใบอนุญาต">ต่อใบอนุญาต</option>
          <option value="แก้ไขข้อมูลบุคคล">แก้ไขข้อมูลบุคคล</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">หัวข้อคำร้อง</label>
        <Input name="title" placeholder="เช่น ขอหนังสือรับรองการทำงานภาษาไทย" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">รายละเอียดเพิ่มเติม</label>
        <textarea
          name="details"
          rows={5}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="อธิบายสิ่งที่ต้องการ เอกสารแนบ เงื่อนไข ฯลฯ"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">ชื่อผู้ยื่น</label>
          <Input name="owner" placeholder="ชื่อ-สกุล" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">แนบไฟล์ (ถ้ามี)</label>
          <input type="file" name="file" className="block w-full text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input id="consent" type="checkbox" required />
        <label htmlFor="consent" className="text-sm text-gray-700">
          ยินยอมให้ HR ตรวจสอบและประมวลผลข้อมูลตามนโยบายความเป็นส่วนตัว
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit">ส่งคำร้อง</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          ยกเลิก
        </Button>
      </div>
    </form>
  );
}
