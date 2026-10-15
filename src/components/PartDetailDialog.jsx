import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import CircuitDiagram from "./CircuitDiagram.jsx";
import StarterCircuit from "./StarterCircuit.jsx";

export default function PartDetailDialog({ part, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;

      const focusable = [...dialogRef.current.querySelectorAll("button, a[href]")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  const sections = [
    { title: "วิธีสังเกต", content: part.identify },
    { title: "ขั้วและจุดต่อ GND", content: part.pinGuide },
    { title: "วิธีต่อวงจร", content: part.connection },
    { title: "ตัวอย่างการใช้งาน", content: part.example },
  ];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 backdrop-blur-sm sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="part-dialog-title" className="flex max-h-[100dvh] w-full max-w-4xl flex-col overflow-hidden border border-white/10 bg-[#0b1220] shadow-[0_35px_120px_rgba(0,0,0,0.6)] sm:max-h-[90dvh] sm:rounded-3xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/8 p-5 sm:p-7">
          <div className="flex items-center gap-4">
            <span className="flex h-14 min-w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-2 text-sm font-bold text-cyan-300">{part.symbol}</span>
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-cyan-300">{part.category}</p>
              <h2 id="part-dialog-title" className="mt-1 break-words text-2xl font-bold text-white sm:text-3xl">{part.displayName || part.name}</h2>
            </div>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="ปิดรายละเอียดชิ้นส่วน" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300">×</button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300">หน้าที่</p>
            <p className="mt-2 text-base leading-7 text-slate-200">{part.description}</p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {sections.map((section, index) => (
              <section key={section.title} className="rounded-2xl border border-white/8 bg-[#101827] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-300/10 text-xs font-bold text-violet-300">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-semibold text-white">{section.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{section.content || "ยังไม่มีรายละเอียดสำหรับคลาสนี้"}</p>
              </section>
            ))}
          </div>

          {part.diagramId && <div className="mt-5"><CircuitDiagram part={part} /></div>}
          <div className="mt-5"><StarterCircuit part={part} /></div>
          {part.diagramId === "Resistor" && <a href="#resistor-tool" onClick={onClose} className="mt-5 inline-flex rounded-lg border border-amber-300/25 px-4 py-2.5 text-sm font-semibold text-amber-200 hover:bg-amber-300/10">เปิดเครื่องมืออ่านค่าสี ↗</a>}

          {part.identify && <p className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100/80">ตัวอย่างนี้ใช้กับวงจรแรงดันต่ำ ตรวจขั้ว ผังขา และพิกัดจากเอกสารของชิ้นส่วนรุ่นจริงก่อนต่อวงจร</p>}
          {part.sourceUrl && <a href={part.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-sm font-medium text-cyan-300 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-300">อ่านคู่มือเพิ่มเติม ↗</a>}
        </div>
      </div>
    </div>,
    document.body,
  );
}
