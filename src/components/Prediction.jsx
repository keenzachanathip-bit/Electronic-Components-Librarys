import ConnectionGuide from "./ConnectionGuide.jsx";
import ClassificationReview from "./ClassificationReview.jsx";
import StarterCircuit from "./StarterCircuit.jsx";
import { needsClassConfirmation } from "../utils/classification.js";

export default function PredictionResult({ predictions, imageUrl, predicting, modelReady, modelLoading, modelError, predictionError, catalogParts, isMock = false, confirmedClass, onConfirmClass }) {
  const topPrediction = predictions[0];
  const predictedPart = catalogParts.find((part) => part.name === topPrediction?.className);
  const needsConfirmation = needsClassConfirmation(predictions, isMock);
  const guidePart = confirmedClass ? catalogParts.find((part) => part.name === confirmedClass) : needsConfirmation ? null : predictedPart;

  let message = isMock ? "เลือกรูปภาพเพื่อทดลองหน้าผลลัพธ์" : "เลือกรูปภาพเพื่อเริ่มวิเคราะห์ชิ้นส่วน";
  if (modelLoading) message = "กำลังเตรียมระบบวิเคราะห์ภาพ";
  else if (modelError) message = "ระบบวิเคราะห์ยังไม่พร้อมใช้งาน";
  else if (predictionError) message = "วิเคราะห์ภาพไม่สำเร็จ ลองเลือกรูปใหม่";
  else if (predicting) message = isMock ? "กำลังสร้างผลตัวอย่าง..." : "กำลังวิเคราะห์ภาพของคุณ...";
  else if (imageUrl && !modelReady) message = "แสดงภาพแล้ว ระบบทำนายยังไม่เชื่อมต่อ";

  return (
    <section className="rounded-2xl border border-white/8 bg-[#101827] p-5 sm:p-6" aria-live="polite">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div><p className="text-xs font-semibold tracking-[0.17em] text-violet-300">02 / RESULT</p><h3 className="mt-1 text-lg font-semibold text-white">{isMock ? "ผลตัวอย่าง (จำลอง)" : "ผลการวิเคราะห์"}</h3></div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-300/15 bg-violet-300/8 text-violet-300">✦</span>
      </div>

      {topPrediction ? (
        <>
          <div className="rounded-xl border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(34,211,238,0.03))] p-6">
            <p className="text-xs font-semibold tracking-[0.17em] text-cyan-300">{isMock ? "DEMO CLASS" : "MATCH FOUND"}</p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-sm text-slate-400">{isMock ? "คลาสตัวอย่างที่เลือก" : "ชิ้นส่วนที่ใกล้เคียงที่สุด"}</p><h4 className="mt-1 text-2xl font-bold text-white">{predictedPart?.displayName || topPrediction.className}</h4>{predictedPart?.displayName && predictedPart.displayName !== topPrediction.className && <p className="mt-1 text-xs text-slate-500">คลาสโมเดล: {topPrediction.className}</p>}</div>
              <strong className="text-3xl font-bold text-cyan-300" aria-label={`คะแนนคลาสจากโมเดล ${(topPrediction.probability * 100).toFixed(1)} เปอร์เซ็นต์`}>{(topPrediction.probability * 100).toFixed(1)}%</strong>
            </div>
          </div>
          <div className="mt-5"><ClassificationReview predictions={predictions} catalogParts={catalogParts} confirmedClass={confirmedClass} onConfirm={onConfirmClass} isMock={isMock} /></div>
          {guidePart && <div className="mt-5"><ConnectionGuide part={guidePart} /><div className="mt-5"><StarterCircuit part={guidePart} /></div></div>}
          <div className="mt-6"><p className="mb-4 text-sm font-semibold text-slate-300">{isMock ? "คะแนนตัวอย่างของคลาส" : "ความเป็นไปได้ทั้งหมด"}</p><div className="space-y-4">
            {predictions.map((item) => {
              const percentage = item.probability * 100;
              return (
                <div key={item.className}>
                  <div className="mb-1.5 flex justify-between gap-3 text-sm"><span className="text-slate-300">{catalogParts.find((part) => part.name === item.className)?.displayName || item.className}</span><span className="font-medium text-slate-400">{percentage.toFixed(1)}%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-700/60"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${percentage}%` }} /></div>
                </div>
              );
            })}
          </div></div>
        </>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-white/6 bg-[#0b1322] px-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/4 text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6"/><path d="m16 16 4.5 4.5M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </span>
          <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">{message}</p>
        </div>
      )}
      <p className="mt-4 text-center text-xs text-slate-500">{isMock ? "คะแนนทั้งหมดเป็นตัวอย่างจำลอง ไม่ได้คำนวณจากภาพที่อัปโหลด" : "เปอร์เซ็นต์คือคะแนนคลาสจากโมเดล ไม่ใช่ค่าความแม่นที่ทดสอบแล้ว"}</p>
    </section>
  );
}
