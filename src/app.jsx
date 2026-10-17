import { useCallback, useEffect, useRef, useState } from "react";
import Images from "./components/Images.jsx";
import Prediction from "./components/Prediction.jsx";
import UploadDialog from "./components/UploadDialog.jsx";
import PartDetailDialog from "./components/PartDetailDialog.jsx";
import ResistorCalculator from "./components/ResistorCalculator.jsx";
import ToolsPage from "./pages/ToolsPage.jsx";
import { catalogFromClassLabels, instruments, parts } from "./data/catalog.js";
import { createMockPredictions } from "./services/MockModelService.js";

const modelUrl = import.meta.env.VITE_TEACHABLE_MACHINE_MODEL_URL?.trim() || "";
const mockMode = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_MODEL === "true" && !modelUrl;
const pageFromHash = (hash) => ["#/tools", "#tools"].includes(hash) ? "tools" : "components";
let modelServicePromise;
const getModelService = () => modelServicePromise ||= import("./services/ModelService.js").catch((error) => {
  modelServicePromise = null;
  throw error;
});

export default function App() {
  const [page, setPage] = useState(() => pageFromHash(window.location.hash));
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState(null);
  const [modelError, setModelError] = useState(false);
  const modelLoadPromise = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [confirmedClass, setConfirmedClass] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState(false);
  const [mockClass, setMockClass] = useState(parts[0].name);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [partSearch, setPartSearch] = useState("");
  const [partCategory, setPartCategory] = useState("ทั้งหมด");
  const closeUpload = useCallback(() => setUploadOpen(false), []);
  const closePartDetail = useCallback(() => setSelectedPart(null), []);

  useEffect(() => {
    function handleHashChange() {
      setPage(pageFromHash(window.location.hash));
      setUploadOpen(false);
      setSelectedPart(null);
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.title = page === "tools" ? "เครื่องมือวัด | CircuitLib" : "CircuitLib · Electronic Components Library";
    const target = window.location.hash.slice(1);
    if (page === "tools" || target === "/components" || !target) {
      window.scrollTo(0, 0);
    } else {
      const frame = requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView());
      return () => cancelAnimationFrame(frame);
    }
  }, [page]);

  useEffect(() => {
    if (!uploadOpen || !modelUrl || model || modelLoadPromise.current) return;
    setModelLoading(true);
    setModelError(false);
    setModelProgress(null);

    const request = getModelService()
      .then(({ loadModel }) => loadModel(modelUrl, setModelProgress))
      .then(setModel)
      .catch((error) => {
        console.error("Could not load image model:", error);
        setModelError(true);
      })
      .finally(() => {
        setModelLoading(false);
        modelLoadPromise.current = null;
      });

    modelLoadPromise.current = request;
  }, [uploadOpen, model]);

  useEffect(() => {
    return () => { if (imageUrl) URL.revokeObjectURL(imageUrl); };
  }, [imageUrl]);

  useEffect(() => {
    setPredictions([]);
    setPredictionError(false);

    if (mockMode && imageUrl) {
      setPredicting(true);
      const timer = window.setTimeout(() => {
        setPredictions(createMockPredictions(mockClass));
        setPredicting(false);
      }, 1200);
      return () => window.clearTimeout(timer);
    }

    if (!model || !imageUrl) {
      setPredicting(false);
      return;
    }

    let active = true;
    const image = new Image();
    image.src = imageUrl;
    setPredicting(true);

    image.decode()
      .then(() => getModelService())
      .then(({ predictImage }) => predictImage(model, image))
      .then((result) => {
        if (!active) return;
        if (result.length === 0) setPredictionError(true);
        else setPredictions(result);
      })
      .catch((error) => {
        console.error("Image prediction failed:", error);
        if (active) setPredictionError(true);
      })
      .finally(() => { if (active) setPredicting(false); });

    return () => { active = false; };
  }, [model, imageUrl, mockClass]);

  const modelReady = Boolean(model) || mockMode;
  const catalogParts = catalogFromClassLabels(model?.getClassLabels());
  const partCategories = [...new Set(catalogParts.map((part) => part.category))];
  const activeCategory = partCategories.includes(partCategory) ? partCategory : "ทั้งหมด";
  const searchTerm = partSearch.trim().toLocaleLowerCase();
  const visibleParts = catalogParts.filter((part) =>
    (activeCategory === "ทั้งหมด" || part.category === activeCategory) &&
    [part.name, part.displayName || part.name, part.description, part.usage, part.category].some((value) => value.toLocaleLowerCase().includes(searchTerm)),
  );
  const clearPartFilters = () => {
    setPartSearch("");
    setPartCategory("ทั้งหมด");
  };
  const handleUpload = useCallback((file) => {
    setPredictions([]);
    setConfirmedClass(null);
    setPredictionError(false);
    setImageUrl(URL.createObjectURL(file));
    setUploadOpen(true);
  }, []);
  const handleRemoveImage = useCallback(() => {
    setImageUrl(null);
    setPredictions([]);
    setConfirmedClass(null);
    setPredictionError(false);
    setPredicting(false);
    setUploadOpen(false);
  }, []);
  const changeMockClass = useCallback((className) => {
    setPredictions([]);
    setConfirmedClass(null);
    setMockClass(className);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#080c17] text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(13,148,136,0.18),transparent_62%)]" />

      <header className="relative z-10 border-b border-white/7 bg-[#080c17]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
          <a href="#/components" className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.12)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true"><path d="M4 12h4l2-5 4 10 2-5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="3" cy="12" r="1.5" fill="currentColor"/><circle cx="21" cy="12" r="1.5" fill="currentColor"/></svg>
            </span>
            <span className="text-sm font-bold tracking-[0.1em] sm:text-base">CIRCUIT<span className="text-cyan-300">LIB</span></span>
          </a>
          <nav className="flex w-full items-center justify-between gap-2 text-xs font-medium text-slate-400 sm:w-auto sm:justify-start sm:gap-8 sm:text-sm" aria-label="เมนูหลัก">
            <a href="#analyze" className="transition hover:text-cyan-300">วิเคราะห์ภาพ</a>
            <a href="#parts" aria-current={page === "components" ? "page" : undefined} className={`transition hover:text-cyan-300 ${page === "components" ? "text-cyan-300" : ""}`}>ชิ้นส่วน</a>
            <a href="#/tools" aria-current={page === "tools" ? "page" : undefined} className={`transition hover:text-violet-300 ${page === "tools" ? "text-violet-300" : ""}`}>เครื่องมือวัด</a>
          </nav>
        </div>
      </header>

      <main id="top" className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        {page === "tools" ? <ToolsPage /> : <>
        <section className="grid items-center gap-10 py-16 lg:grid-cols-[1.35fr_0.65fr] lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/7 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" /> ELECTRONIC COMPONENT LIBRARY
            </div>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.16] tracking-tight text-white sm:text-5xl lg:text-6xl">
              รู้จักชิ้นส่วนอิเล็กทรอนิกส์<br /><span className="text-cyan-300">ผ่านภาพเดียว</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              อัปโหลดภาพเพื่อระบุชิ้นส่วน สำรวจรายการอุปกรณ์ และทำความรู้จักเครื่องมือวัดที่ใช้ในงานอิเล็กทรอนิกส์
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#analyze" className="inline-flex items-center gap-3 rounded-xl bg-cyan-300 px-6 py-3.5 font-semibold text-slate-950 shadow-[0_12px_38px_rgba(34,211,238,0.18)] transition hover:bg-cyan-200">
                เริ่มจากภาพของคุณ <span aria-hidden="true">↗</span>
              </a>
              <a href="#resistor-tool" className="inline-flex items-center gap-2 rounded-xl border border-amber-300/25 px-5 py-3.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-300/10">อ่านค่าสีตัวต้านทาน <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="relative hidden rounded-[28px] border border-white/10 bg-[#111a2b]/90 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.28)] lg:block">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500">LIBRARY OVERVIEW</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/7 p-5"><strong className="text-4xl font-bold text-cyan-300">{catalogParts.length}</strong><p className="mt-2 text-sm text-slate-400">ชิ้นส่วน</p></div>
              <div className="rounded-2xl border border-violet-300/15 bg-violet-300/7 p-5"><strong className="text-4xl font-bold text-violet-300">{String(instruments.length).padStart(2, "0")}</strong><p className="mt-2 text-sm text-slate-400">เครื่องมือวัด</p></div>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/7 bg-[#0b1220] px-4 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">✦</span>
              <div><p className="text-sm font-medium text-white">เรียนรู้และสำรวจ</p><p className="text-xs text-slate-500">จากภาพสู่ความเข้าใจวงจร</p></div>
            </div>
          </div>
        </section>

        <section id="analyze" className="scroll-mt-28">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">IMAGE ANALYSIS</p><h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">วิเคราะห์ชิ้นส่วนจากภาพ</h2><a href="#resistor-tool" className="mt-2 inline-flex text-sm font-medium text-amber-300 underline underline-offset-2 hover:text-amber-200">ไม่อยากอัปโหลด? อ่านค่าสีตัวต้านทาน ↗</a></div>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${modelReady && !mockMode ? "border-emerald-300/20 bg-emerald-300/8 text-emerald-300" : "border-amber-300/15 bg-amber-300/7 text-amber-200"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${modelReady && !mockMode ? "bg-emerald-300" : "bg-amber-200"}`} />
              {mockMode ? "โหมดทดลอง · ผลจำลอง" : modelReady ? "ระบบวิเคราะห์พร้อมใช้งาน" : modelLoading ? "กำลังเตรียมระบบวิเคราะห์" : "รอเชื่อมต่อระบบวิเคราะห์"}
            </span>
          </div>
          {mockMode && <p className="mb-5 rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-sm leading-6 text-amber-100/85">โหมดทดลอง: เว็บจะแสดงผลตัวอย่างที่เลือกในป๊อปอัป รูปที่อัปโหลดไม่ได้ถูกวิเคราะห์จริง</p>}
          <div className="grid gap-5 lg:grid-cols-2">
            <Images imageUrl={imageUrl} onOpen={() => setUploadOpen(true)} onUpload={handleUpload} onRemove={handleRemoveImage} isMock={mockMode} />
            <Prediction predictions={predictions} imageUrl={imageUrl} predicting={predicting} modelReady={modelReady} modelLoading={modelLoading} modelError={modelError} predictionError={predictionError} catalogParts={catalogParts} isMock={mockMode} confirmedClass={confirmedClass} onConfirmClass={setConfirmedClass} />
          </div>
        </section>

        <ResistorCalculator />

        <section id="parts" className="scroll-mt-28 pt-24">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">COMPONENT CATALOG</p><h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">ชิ้นส่วนที่มี <span className="text-cyan-300">({catalogParts.length})</span></h2></div>
            <p className="text-sm text-slate-500">{model ? "รายการคลาสจากโมเดลที่เชื่อมต่อ" : "รายการสำหรับศึกษาและจำแนกภาพ"}</p>
          </div>
          <div className="mb-4 grid gap-4 rounded-2xl border border-white/8 bg-[#101827] p-4 sm:grid-cols-[minmax(0,1fr)_minmax(200px,0.4fr)] sm:p-5">
            <div>
              <label htmlFor="part-search" className="mb-2 block text-sm font-medium text-slate-300">ค้นหาคลาสหรือหน้าที่</label>
              <input id="part-search" type="search" value={partSearch} onChange={(event) => setPartSearch(event.target.value)} placeholder="เช่น LED, Resistor, แสง" className="w-full rounded-xl border border-white/12 bg-[#0b1322] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" />
            </div>
            <div>
              <label htmlFor="part-category" className="mb-2 block text-sm font-medium text-slate-300">กรองตามประเภท</label>
              <select id="part-category" value={activeCategory} onChange={(event) => setPartCategory(event.target.value)} className="w-full rounded-xl border border-white/12 bg-[#0b1322] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300">
                <option value="ทั้งหมด">ทุกประเภท</option>
                {partCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p role="status" className="text-sm text-slate-400">แสดง {visibleParts.length} จาก {catalogParts.length} คลาส</p>
            {(partSearch || activeCategory !== "ทั้งหมด") && <button type="button" onClick={clearPartFilters} className="text-sm font-medium text-cyan-300 hover:text-cyan-200">ล้างตัวกรอง</button>}
          </div>
          {visibleParts.length > 0 ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {visibleParts.map((part, index) => (
              <article key={`${part.name}-${index}`} className="group relative rounded-2xl border border-white/8 bg-[#101827] p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-[#132033]">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 min-w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/8 px-2 text-xs font-bold text-cyan-300">{part.symbol}</span>
                  <span className="text-xs font-medium text-slate-600">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">{part.displayName || part.name}</h3>
                <p className="mt-1 text-xs font-medium text-cyan-300/80">{part.category}</p>
                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-400">{part.description}</p>
                <p className="mt-5 text-xs font-semibold text-cyan-300">ดูรายละเอียด ↗</p>
                <button type="button" onClick={() => setSelectedPart(part)} aria-label={`ดูรายละเอียด ${part.name}`} className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300" />
              </article>
            ))}
          </div> : <div className="rounded-2xl border border-dashed border-white/12 bg-[#101827] px-6 py-12 text-center">
            <p className="font-semibold text-white">ไม่พบคลาสที่ตรงกับการค้นหา</p>
            <p className="mt-2 text-sm text-slate-400">ลองใช้คำค้นอื่นหรือเลือกทุกประเภท</p>
            <button type="button" onClick={clearPartFilters} className="mt-5 rounded-lg border border-cyan-300/30 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-300/10">ล้างตัวกรอง</button>
          </div>}
        </section>

        </>}
      </main>

      {uploadOpen && (
        <UploadDialog
          imageUrl={imageUrl}
          onUpload={handleUpload}
          onRemove={handleRemoveImage}
          onClose={closeUpload}
          predictions={predictions}
          predicting={predicting}
          modelReady={modelReady}
          modelLoading={modelLoading}
          modelProgress={modelProgress}
          modelError={modelError}
          predictionError={predictionError}
          catalogParts={catalogParts}
          confirmedClass={confirmedClass}
          onConfirmClass={setConfirmedClass}
          isMock={mockMode}
          mockClass={mockClass}
          onMockClassChange={changeMockClass}
        />
      )}

      {selectedPart && <PartDetailDialog part={selectedPart} onClose={closePartDetail} />}

      <footer className="border-t border-white/7 py-7 text-center text-xs text-slate-600">CIRCUITLIB · Electronic Components Library</footer>
    </div>
  );
}
