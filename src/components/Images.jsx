import { useRef, useState } from "react";
import RemoveImageButton from "./RemoveImageButton.jsx";

const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function ImageUpload({ imageUrl, onOpen, onUpload, onRemove, isMock = false }) {
  const inputRef = useRef(null);
  const [fileError, setFileError] = useState("");

  function handleFile(file) {
    if (!file) return;
    if (!supportedTypes.has(file.type)) {
      setFileError("เลือกไฟล์ JPG, PNG หรือ WEBP เท่านั้น");
      return;
    }
    setFileError("");
    onUpload(file);
  }

  return (
    <section className="rounded-2xl border border-white/8 bg-[#101827] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div><p className="text-xs font-semibold tracking-[0.17em] text-cyan-300">01 / UPLOAD</p><h3 className="mt-1 text-lg font-semibold text-white">ภาพชิ้นส่วนของคุณ</h3></div>
        <span className="rounded-lg border border-white/8 bg-white/4 px-2.5 py-1 text-xs text-slate-400">JPG · PNG · WEBP</span>
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="เลือกรูปภาพชิ้นส่วน" onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = ""; }} />
      <div className="relative">
        <button type="button" onClick={() => imageUrl ? onOpen() : inputRef.current?.click()} className="group flex min-h-72 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-cyan-300/25 bg-[#0b1322] p-5 text-center transition hover:border-cyan-300/60 hover:bg-[#0d1a2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
        {imageUrl ? (
          <img src={imageUrl} alt="ภาพชิ้นส่วนที่อัปโหลด" className="max-h-56 max-w-full rounded-lg object-contain" />
        ) : (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true"><path d="M4 16.5V6a2 2 0 0 1 2-2h5m2 0h5a2 2 0 0 1 2 2v10.5M4 16.5l4.2-4.2a2 2 0 0 1 2.8 0l1.5 1.5 2.5-2.5a2 2 0 0 1 2.8 0l2.2 2.2M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="16" cy="7" r="1.5" fill="currentColor"/></svg>
            </span>
            <strong className="mt-5 text-base font-semibold text-white">อัปโหลดรูปชิ้นส่วน</strong>
            <span className="mt-2 text-sm text-slate-500">{isMock ? "เลือกรูปเพื่อดูแอนิเมชันและผลตัวอย่างในป๊อปอัป" : "เลือกรูปแล้วดูขั้นตอนโหลดโมเดลและผลทำนายในป๊อปอัป"}</span>
          </>
        )}
        </button>
        {imageUrl && <RemoveImageButton onClick={onRemove} className="absolute right-3 top-3 z-10" />}
      </div>
      {fileError && <p role="alert" className="mt-3 text-sm text-rose-300">{fileError}</p>}
      <p className="mt-4 text-center text-xs text-slate-500">{imageUrl ? "คลิกภาพเพื่อดูผลทำนาย หรือกด × เพื่อลบรูป" : "คลิกด้านบนเพื่อเลือกรูปภาพ"}</p>
    </section>
  );
}
