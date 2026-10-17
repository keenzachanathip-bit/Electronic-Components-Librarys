import { shouldRetryImage } from "../utils/classification.js";

export default function LowConfidenceWarning({ predictions, isMock = false, className = "", actionText = "กด “เปลี่ยนรูป” เหนือภาพเพื่อวิเคราะห์อีกครั้ง" }) {
  if (!shouldRetryImage(predictions, isMock)) return null;

  return (
    <div role="alert" className={`rounded-xl border border-amber-300/35 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100 ${className}`}>
      <p className="text-base font-semibold">ยังไม่แสดงคำตอบ · ลองอัปโหลดรูปใหม่</p>
      <p className="mt-1 text-amber-100/85">คะแนนคลาสสูงสุดต่ำกว่า 70% จึงยังระบุชิ้นส่วนจากรูปนี้ไม่ได้ ลองถ่ายใหม่ตามนี้:</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-amber-100/85">
        <li>ถ่ายอุปกรณ์เพียงชิ้นเดียวให้เห็นทั้งตัวและขาชัดเจน</li>
        <li>ใช้พื้นหลังเรียบและแสงสว่างพอดี เลี่ยงเงากับแสงสะท้อน</li>
        <li>จับภาพให้นิ่งและโฟกัสจนรูปไม่เบลอ</li>
      </ul>
      <p className="mt-3 font-medium">{actionText}</p>
    </div>
  );
}
