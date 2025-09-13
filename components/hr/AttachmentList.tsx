// components/hr/AttachmentList.tsx
"use client";
import { useMemo, useState } from "react";
import Modal from "@/components/common/page";
import type { Attachment } from "@/lib/types";

type Props = {
  attachments?: Attachment[];
};

function isImage(mime?: string, name?: string) {
  const n = (name || "").toLowerCase();
  return (mime || "").startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(n);
}

function isPdf(mime?: string, name?: string) {
  const n = (name || "").toLowerCase();
  return (mime === "application/pdf") || /\.pdf$/.test(n);
}

export default function AttachmentList({ attachments = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Attachment | null>(null);

  const items = useMemo(() => attachments, [attachments]);

  function openPreview(a: Attachment) {
    setCurrent(a);
    setOpen(true);
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">ไฟล์แนบ ({items.length})</div>
      {items.length === 0 && <div className="text-xs text-gray-500">ไม่มีไฟล์แนบ</div>}
      <ul className="space-y-1">
        {items.map(a => (
          <li key={a.id}>
            <button
              className="w-full text-left px-3 py-2 rounded-xl border hover:bg-gray-50 text-sm flex items-center justify-between"
              onClick={() => openPreview(a)}
              title="คลิกเพื่อพรีวิว"
            >
              <span className="truncate">{a.name}</span>
              <span className="text-xs text-gray-500">{a.mime?.split("/")[1]?.toUpperCase() || ""}</span>
            </button>
          </li>
        ))}
      </ul>

      <Modal open={open} onClose={() => setOpen(false)} title={current?.name}>
        <div className="p-4">
          {!current ? (
            <div className="text-sm text-gray-500">ไม่พบไฟล์</div>
          ) : isImage(current.mime, current.name) ? (
            <div className="max-h-[75vh] overflow-auto">
              {/* รูปภาพ */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.url} alt={current.name} className="max-w-full h-auto mx-auto rounded-lg" />
            </div>
          ) : isPdf(current.mime, current.name) ? (
            <div className="h-[75vh]">
              {/* PDF preview */}
              <iframe
                src={current.url}
                className="w-full h-full"
                title={current.name}
              />
            </div>
          ) : (
            <div className="text-sm">
              ไม่รองรับพรีวิวไฟล์นี้
              <div className="mt-2">
                <a
                  href={current.url}
                  download
                  className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium
                             bg-blue-600 text-white hover:bg-blue-700"
                >
                  ดาวน์โหลดไฟล์
                </a>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
