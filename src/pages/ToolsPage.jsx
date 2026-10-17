import { instruments } from "../data/catalog.js";

export default function ToolsPage() {
  return (
    <>
      <section className="py-14 sm:py-20">
        <p className="text-xs font-semibold tracking-[0.2em] text-violet-300">MEASUREMENT TOOLS</p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">เครื่องมือวัดและวิธีใช้งาน</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">ทำความรู้จักเครื่องมือวัด 4 ชนิดจากภาพถ่ายจริง พร้อมหน้าที่และขั้นตอนใช้งานเบื้องต้น โดยไม่ต้องอัปโหลดรูป</p>
        <a href="#/components" className="mt-7 inline-flex rounded-xl border border-cyan-300/25 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/10">← กลับไปหน้าชิ้นส่วน</a>
      </section>

      <section id="tools" aria-label="รายการเครื่องมือวัด">
        <div className="grid gap-5 md:grid-cols-2">
          {instruments.map((instrument) => (
            <article key={instrument.id} className="overflow-hidden rounded-2xl border border-white/8 bg-[#101827]">
              <div className="relative h-64 overflow-hidden border-b border-white/7 bg-[#dce3e9]">
                <img src={instrument.photo} alt={`ภาพถ่าย ${instrument.name}`} loading="lazy" className="h-full w-full object-contain" />
                <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-medium text-white">ภาพถ่ายจริง</span>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold tracking-[0.15em] text-violet-300">{instrument.category}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{instrument.name}</h2>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{instrument.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">{instrument.tags.map((tag) => <span key={tag} className="rounded-md border border-white/8 bg-white/4 px-2.5 py-1 text-xs text-slate-400">{tag}</span>)}</div>
                <div className="mt-6 border-t border-white/8 pt-5">
                  <h3 className="text-sm font-semibold text-white">วิธีใช้งานเบื้องต้น</h3>
                  <ol className="mt-3 space-y-3">
                    {instrument.steps.map((step, index) => (
                      <li key={step} className="flex gap-3 text-sm leading-6 text-slate-400"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-300/10 text-xs font-bold text-violet-300">{index + 1}</span><span>{step}</span></li>
                    ))}
                  </ol>
                  <a href={instrument.guideUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs font-medium text-violet-300 hover:text-violet-200">อ่านคู่มือพื้นฐาน ↗</a>
                </div>
                <p className="mt-5 border-t border-white/8 pt-4 text-xs leading-5 text-slate-500">ภาพ: <a href={instrument.photoSource} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">{instrument.photoAuthor}</a> · <a href={instrument.photoLicenseUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">{instrument.photoLicense}</a> · ภาพย่อจาก Wikimedia Commons</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/5 px-5 py-4 text-sm leading-6 text-amber-100/80">คำแนะนำนี้สำหรับการทดลองกับวงจรแรงดันต่ำ ควรอ่านคู่มือของเครื่องรุ่นที่ใช้งานก่อนต่อเข้ากับวงจรจริง</p>
      </section>
    </>
  );
}
