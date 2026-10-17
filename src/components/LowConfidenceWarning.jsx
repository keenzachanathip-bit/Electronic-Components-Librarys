import { shouldRetryImage } from "../utils/classification.js";

export default function LowConfidenceWarning({ predictions, isMock = false, className = "" }) {
  if (!shouldRetryImage(predictions, isMock)) return null;

  return (
    <div role="alert" className={`rounded-xl border border-amber-300/35 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100 ${className}`}>
      <p className="font-semibold">ผลยังไม่ชัดเจน · ลองส่งรูปใหม่</p>
      <p className="mt-1 text-amber-100/85">คะแนนคลาสสูงสุดไม่เกิน 70% ลองอัปโหลดรูปที่คมชัดและเห็นอุปกรณ์เต็มชิ้น แล้วตรวจผลอีกครั้ง</p>
    </div>
  );
}
