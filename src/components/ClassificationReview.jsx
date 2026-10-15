import { useEffect, useState } from "react";
import { needsClassConfirmation } from "../utils/classification.js";

export default function ClassificationReview({ predictions, catalogParts, confirmedClass, onConfirm, isMock = false, idPrefix = "result" }) {
  const [candidate, setCandidate] = useState(predictions[0]?.className || "");
  const topClass = predictions[0]?.className;
  const needsConfirmation = needsClassConfirmation(predictions, isMock);

  useEffect(() => setCandidate(topClass || ""), [topClass]);

  if (!topClass || isMock) return null;

  const topThree = predictions.slice(0, 3);
  const labelFor = (name) => catalogParts.find((part) => part.name === name)?.displayName || name;
  return (
    <div className={`rounded-xl border p-4 ${needsConfirmation && !confirmedClass ? "border-amber-300/30 bg-amber-300/7" : "border-white/10 bg-[#0b1322]"}`}>
      <p className={`text-sm font-semibold ${needsConfirmation && !confirmedClass ? "text-amber-200" : "text-slate-200"}`}>
        {confirmedClass ? `ยืนยันแล้ว: ${labelFor(confirmedClass)}` : needsConfirmation ? "ตรวจสอบชนิดอุปกรณ์ก่อนต่อวงจร" : "ถ้าผลไม่ตรง เลือกชนิดอุปกรณ์เอง"}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-400">
        {needsConfirmation && !confirmedClass ? "คะแนนอันดับหนึ่งต่ำกว่า 75% หรือห่างอันดับสองไม่ถึง 15 จุด วิธีต่อวงจรจะปรากฏหลังคุณยืนยันชนิดอุปกรณ์" : "คะแนนของโมเดลไม่รับรองว่าระบุชิ้นส่วนถูก ตรวจตัวอุปกรณ์จริงก่อนต่อไฟ"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="ตัวเลือกที่โมเดลทำนาย">
        {topThree.map((item) => <button key={item.className} type="button" onClick={() => setCandidate(item.className)} aria-pressed={candidate === item.className} className={`rounded-lg border px-3 py-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-cyan-300 ${candidate === item.className ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-200" : "border-white/10 text-slate-300 hover:border-cyan-300/30"}`}>{labelFor(item.className)} · {(item.probability * 100).toFixed(1)}%</button>)}
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`${idPrefix}-class-select`}>เลือกคลาสทั้งหมด</label>
        <select id={`${idPrefix}-class-select`} value={candidate} onChange={(event) => setCandidate(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[#101827] px-3 py-2.5 text-sm text-white focus:border-cyan-300 focus:outline-none">
          {catalogParts.map((part) => <option key={part.name} value={part.name}>{part.displayName || part.name}</option>)}
        </select>
        <button type="button" onClick={() => onConfirm(candidate)} disabled={!candidate} className="rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-50">ยืนยันชนิดอุปกรณ์</button>
      </div>
    </div>
  );
}
