import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ConnectionGuide from "./ConnectionGuide.jsx";
import RemoveImageButton from "./RemoveImageButton.jsx";
import ClassificationReview from "./ClassificationReview.jsx";
import StarterCircuit from "./StarterCircuit.jsx";
import LowConfidenceWarning from "./LowConfidenceWarning.jsx";
import { needsClassConfirmation, shouldRetryImage } from "../utils/classification.js";

const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function UploadDialog({ imageUrl, onUpload, onRemove, onClose, predictions, predicting, modelReady, modelLoading, modelProgress, modelError, predictionError, catalogParts, confirmedClass, onConfirmClass, isMock, mockClass, onMockClassChange }) {
  const inputRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [fileError, setFileError] = useState("");
  const [animationDone, setAnimationDone] = useState(false);
  const topPrediction = predictions[0];
  const retryImage = shouldRetryImage(predictions, isMock);
  const predictedPart = catalogParts.find((part) => part.name === topPrediction?.className);
  const needsConfirmation = needsClassConfirmation(predictions, isMock);
  const guidePart = confirmedClass ? catalogParts.find((part) => part.name === confirmedClass) : needsConfirmation ? null : predictedPart;
  const displayPart = confirmedClass ? guidePart : predictedPart;
  const showLoading = !animationDone || modelLoading || predicting || (modelReady && !topPrediction && !predictionError);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    setAnimationDone(false);
    const timer = window.setTimeout(() => setAnimationDone(true), 900);
    return () => window.clearTimeout(timer);
  }, [imageUrl]);

  function handleFile(file) {
    if (!file) return;
    if (!supportedTypes.has(file.type)) {
      setFileError("เลือกไฟล์ JPG, PNG หรือ WEBP เท่านั้น");
      return;
    }
    setFileError("");
    onUpload(file);
  }

  let status = isMock ? "กำลังเตรียมผลตัวอย่าง" : "กำลังรอผลวิเคราะห์";
  if (modelLoading) status = modelProgress === 100 ? "ดาวน์โหลดโมเดลแล้ว กำลังเตรียมข้อมูลคลาส" : "กำลังดาวน์โหลดโมเดลสำหรับวิเคราะห์ภาพ";
  else if (modelError) status = "โหลดโมเดลไม่สำเร็จ ลองปิดแล้วเปิดป๊อปอัปอีกครั้ง";
  else if (predictionError) status = "วิเคราะห์ภาพไม่สำเร็จ ลองเลือกรูปใหม่";
  else if (isMock && predicting) status = "กำลังสร้างผลตัวอย่างจากคลาสที่เลือก";
  else if (predicting) status = "กำลังวิเคราะห์รูปที่อัปโหลด";
  else if (!animationDone) status = isMock ? "กำลังเตรียมหน้าผลตัวอย่าง" : "กำลังเตรียมรูปภาพเพื่อวิเคราะห์";
  else if (isMock && topPrediction) status = "ผลตัวอย่างพร้อมแล้ว";
  else if (topPrediction) status = "วิเคราะห์ภาพเสร็จแล้ว";
  else if (!modelReady) status = "ยังไม่ได้เชื่อมต่อโมเดล จึงยังระบุคลาสจากรูปไม่ได้";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="upload-dialog-title" className="flex h-[100dvh] w-full max-w-[1440px] flex-col overflow-hidden border border-white/10 bg-[#0b1220] shadow-[0_35px_120px_rgba(0,0,0,0.6)] sm:h-[94dvh] sm:rounded-3xl">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/8 px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">IMAGE ANALYSIS</p>
            <h2 id="upload-dialog-title" className="mt-1 text-xl font-bold text-white sm:text-2xl">{isMock ? "ทดลองหน้าผลลัพธ์จากรูป" : "ผลวิเคราะห์ชิ้นส่วนจากรูป"}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="ปิดหน้าต่างอัปโหลด" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300">×</button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {isMock && <div className="mb-5 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 sm:p-5">
            <div>
              <p className="text-sm font-bold text-amber-200">โหมดทดลอง · ผลจำลอง</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">เลือกรายการที่จะให้แสดง รูปนี้ไม่ได้ถูกโมเดลวิเคราะห์จริง</p>
            </div>
            <div className="w-full sm:w-64">
              <label htmlFor="mock-class-select" className="mb-1 block text-xs font-medium text-amber-100/80">เลือกคลาสตัวอย่าง</label>
              <select id="mock-class-select" value={mockClass} onChange={(event) => onMockClassChange(event.target.value)} className="w-full rounded-lg border border-amber-300/20 bg-[#0b1322] px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300">
                {catalogParts.map((part) => <option key={part.name} value={part.name}>{part.displayName || part.name}</option>)}
              </select>
            </div>
          </div>}
          {showLoading ? (
            <section className="flex min-h-full flex-col items-center justify-center rounded-2xl border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_60%)] px-6 py-16 text-center" role="status" aria-live="polite">
              <div className="relative h-40 w-40 sm:h-48 sm:w-48">
                <div className="absolute -inset-3 rounded-[2rem] border-2 border-transparent border-r-cyan-300/40 border-t-cyan-300 motion-safe:animate-spin" />
                <div className="relative h-full w-full overflow-hidden rounded-3xl border border-cyan-300/30 bg-[#101827] p-2 shadow-[0_0_55px_rgba(34,211,238,0.15)]">
                  <img src={imageUrl} alt="" className="h-full w-full rounded-2xl object-contain opacity-70" />
                  <span className="analysis-scan-line absolute inset-x-2 h-0.5 bg-cyan-300 shadow-[0_0_18px_#67e8f9]" />
                </div>
                <RemoveImageButton onClick={onRemove} className="absolute -right-5 -top-5 z-10" />
              </div>
              <h3 className="mt-10 text-xl font-bold text-white sm:text-2xl">{isMock ? "กำลังสร้างผลตัวอย่าง" : modelReady || modelLoading ? "กำลังตรวจสอบรูปภาพ" : "กำลังเปิดรูปภาพ"}</h3>
              <p className="mt-2 text-sm text-slate-400">{status}</p>
              <div role="progressbar" aria-label={isMock ? "กำลังสร้างผลตัวอย่าง" : modelLoading ? "ความคืบหน้าการโหลดโมเดล" : "กำลังวิเคราะห์รูป"} aria-valuemin={modelLoading && modelProgress !== null ? 0 : undefined} aria-valuemax={modelLoading && modelProgress !== null ? 100 : undefined} aria-valuenow={modelLoading && modelProgress !== null ? modelProgress : undefined} className="mt-8 h-2.5 w-full max-w-sm overflow-hidden rounded-full bg-slate-700/70">
                <div className={`h-full rounded-full bg-cyan-300 transition-all duration-300 ${modelLoading && modelProgress !== null ? "" : "analysis-progress-indeterminate w-1/3"}`} style={modelLoading && modelProgress !== null ? { width: `${modelProgress}%` } : undefined} />
              </div>
              {modelLoading && modelProgress !== null && <p className="mt-3 text-sm font-semibold text-cyan-300">โหลดโมเดล {modelProgress}%</p>}
            </section>
          ) : (
          <div className="flex flex-col gap-5">
            <section className="rounded-2xl border border-white/8 bg-[#101827] p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-xs font-semibold tracking-[0.17em] text-cyan-300">01 / IMAGE</p><h3 className="mt-1 text-lg font-semibold text-white">รูปที่อัปโหลด</h3></div>
                <button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">เปลี่ยนรูป</button>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-label="เลือกรูปภาพชิ้นส่วน"
                onChange={(event) => {
                  handleFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <div
                className="relative flex min-h-[220px] items-center justify-center rounded-xl border border-white/8 bg-[#080e19] p-4 sm:min-h-[300px] lg:min-h-[360px]"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleFile(event.dataTransfer.files?.[0]);
                }}
              >
                <RemoveImageButton onClick={onRemove} className="absolute right-3 top-3 z-10" />
                {imageUrl ? (
                  <img src={imageUrl} alt="รูปชิ้นส่วนที่อัปโหลด" className="max-h-[34vh] max-w-full rounded-lg object-contain sm:max-h-[42vh]" />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/8 text-4xl text-cyan-300">＋</div>
                    <p className="mt-5 font-semibold text-white">เลือกหรือวางภาพตรงนี้</p>
                    <p className="mt-2 text-sm text-slate-500">รองรับ JPG, PNG และ WEBP</p>
                  </div>
                )}
              </div>
              {fileError && <p role="alert" className="mt-3 text-sm text-rose-300">{fileError}</p>}
              <p className="mt-3 text-xs text-slate-500">{isMock ? "รูปนี้ใช้แสดงตัวอย่างหน้าผลลัพธ์เท่านั้น" : "รูปนี้จะแสดงในเบราว์เซอร์และใช้วิเคราะห์เมื่อโมเดลพร้อม"}</p>
            </section>

            <section className="rounded-2xl border border-white/8 bg-[#101827] p-5 sm:p-6" aria-live="polite">
              <p className="text-xs font-semibold tracking-[0.17em] text-violet-300">02 / CLASS RESULT</p>
              <h3 className="mt-1 text-lg font-semibold text-white">{isMock ? "คลาสตัวอย่าง" : retryImage ? "ยังไม่ระบุชิ้นส่วน" : "ชิ้นส่วนที่พบ"}</h3>
              {topPrediction ? (
                retryImage ? <LowConfidenceWarning predictions={predictions} isMock={isMock} className="mt-6" /> : <div className="mt-6 space-y-5">
                  <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/7 p-5">
                    <p className="text-xs font-semibold tracking-wide text-cyan-300">{confirmedClass ? "ผลที่โมเดลเสนอ" : "CLASS"}</p>
                    <h4 className="mt-2 break-words text-2xl font-bold text-white sm:text-3xl">{predictedPart?.displayName || topPrediction.className}</h4>
                    {predictedPart?.displayName && predictedPart.displayName !== topPrediction.className && <p className="mt-1 text-xs text-slate-500">คลาสโมเดล: {topPrediction.className}</p>}
                    <p className="mt-3 text-sm text-slate-400">{isMock ? "คะแนนสมมติ" : "คะแนนคลาสนี้จากโมเดล"} <strong className="text-cyan-300">{(topPrediction.probability * 100).toFixed(1)}%</strong></p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-[#0b1322] p-5">
                    <p className="text-xs font-semibold tracking-wide text-slate-500">หน้าที่โดยย่อ · {displayPart?.displayName || displayPart?.name || topPrediction.className}{needsConfirmation && !confirmedClass ? " (ผลเบื้องต้น)" : ""}</p>
                    <p className="mt-2 text-base leading-7 text-slate-200">{displayPart?.description || "ยังไม่มีข้อมูลหน้าที่ของคลาสนี้ในคลังชิ้นส่วน"}</p>
                  </div>
                  <ClassificationReview predictions={predictions} catalogParts={catalogParts} confirmedClass={confirmedClass} onConfirm={onConfirmClass} isMock={isMock} idPrefix="upload" />
                  {guidePart && <><ConnectionGuide part={guidePart} showDiagram /><StarterCircuit part={guidePart} /></>}
                  <p className="text-xs leading-5 text-slate-500">{isMock ? "ผลนี้มาจากคลาสที่เลือกเพื่อทดลองหน้าจอ ไม่ได้ทำนายจากรูปที่อัปโหลด" : "ผลลัพธ์เป็นการทำนายจากโมเดลภาพ ควรตรวจสอบกับชิ้นส่วนจริงก่อนนำไปใช้งาน"}</p>
                </div>
              ) : (
                <div className="mt-6 flex min-h-64 items-center justify-center rounded-xl border border-white/7 bg-[#0b1322] p-6 text-center text-sm leading-7 text-slate-400">{status}</div>
              )}
            </section>
          </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
