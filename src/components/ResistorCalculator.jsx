import { useState } from "react";
import { bandColors, decodeBands, formatOhms } from "../utils/resistor.js";

const digitColors = Object.keys(bandColors).filter((color) => bandColors[color].digit !== undefined);
const firstDigitColors = digitColors.filter((color) => color !== "black");
const multiplierColors = Object.keys(bandColors).filter((color) => bandColors[color].multiplier !== undefined);
const toleranceColors = Object.keys(bandColors).filter((color) => bandColors[color].tolerance !== undefined);

function ColorSelect({ id, label, value, options, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-300">{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-white/15 bg-[#0b1322] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300">
        {options.map((color) => <option key={color} value={color}>{bandColors[color].label}</option>)}
      </select>
    </div>
  );
}

function BandPreview({ bands }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-[#0b1322] px-4 py-4" aria-label={`สีที่เลือก: ${bands.map((color) => bandColors[color].label).join(" ")}`}>
      <span className="h-2 w-8 rounded-full bg-slate-500" aria-hidden="true" />
      <div className="flex h-14 min-w-0 flex-1 items-stretch justify-center gap-2 rounded-xl border border-[#e2c69e] bg-[#dfc69c] px-5 py-1.5 shadow-inner" aria-hidden="true">
        {bands.map((color, index) => <span key={index} className="w-4 rounded-sm border border-black/25" style={{ backgroundColor: bandColors[color].hex }} />)}
      </div>
      <span className="h-2 w-8 rounded-full bg-slate-500" aria-hidden="true" />
    </div>
  );
}

export default function ResistorCalculator() {
  const [bandCount, setBandCount] = useState(4);
  const [bands, setBands] = useState(["orange", "orange", "brown", "gold"]);
  const decoded = decodeBands(bands);

  const setCount = (count) => {
    setBandCount(count);
    setBands(count === 4 ? ["orange", "orange", "brown", "gold"] : ["orange", "orange", "black", "black", "brown"]);
  };
  const setBand = (index, color) => setBands((current) => current.map((item, position) => position === index ? color : item));

  return (
    <section id="resistor-tool" className="scroll-mt-28 pt-24" aria-labelledby="resistor-tool-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-amber-300">RESISTOR TOOLS</p>
      <h2 id="resistor-tool-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">รู้ค่าตัวต้านทานโดยไม่ต้องอัปโหลดรูป</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">เลือกสีแถบบนตัวต้านทานเพื่ออ่านค่าโอห์มและค่าคลาดเคลื่อน</p>
      <div className="mt-6 max-w-3xl">
        <div className="rounded-2xl border border-white/8 bg-[#101827] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">อ่านค่าสีตัวต้านทาน</h3>
            <div className="inline-flex rounded-lg border border-white/10 bg-[#0b1322] p-1" aria-label="จำนวนแถบสี">
              {[4, 5].map((count) => <button key={count} type="button" onClick={() => setCount(count)} aria-pressed={bandCount === count} className={`rounded-md px-3 py-1.5 text-sm font-medium ${bandCount === count ? "bg-cyan-300 text-slate-950" : "text-slate-300 hover:text-white"}`}>{count} แถบ</button>)}
            </div>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">อ่านจากด้านที่แถบอยู่ชิดกันไปหาแถบค่าคลาดเคลื่อน ซึ่งมักแยกห่างและอยู่ท้ายสุด</p>
          <div className="mt-5"><BandPreview bands={bands} /></div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {bands.map((color, index) => {
              const digitCount = bandCount - 2;
              const options = index === 0 ? firstDigitColors : index < digitCount ? digitColors : index === digitCount ? multiplierColors : toleranceColors;
              const label = index < digitCount ? `แถบ ${index + 1} · หลักที่ ${index + 1}` : index === digitCount ? `แถบ ${index + 1} · ตัวคูณ` : `แถบ ${index + 1} · คลาดเคลื่อน`;
              return <ColorSelect key={`${bandCount}-${index}`} id={`resistor-band-${index}`} label={label} value={color} options={options} onChange={(next) => setBand(index, next)} />;
            })}
          </div>
          <div className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/8 p-4" role="status" aria-live="polite">
            <p className="text-xs font-semibold tracking-wider text-cyan-300">ค่าตัวต้านทาน</p>
            <p className="mt-1 text-3xl font-bold text-white">{decoded ? formatOhms(decoded.ohms) : "ตรวจสีที่เลือก"}</p>
            {decoded && <p className="mt-1 text-sm text-slate-300">คลาดเคลื่อน ±{decoded.tolerance}% · ประมาณ {formatOhms(decoded.ohms * (1 - decoded.tolerance / 100))} ถึง {formatOhms(decoded.ohms * (1 + decoded.tolerance / 100))}</p>}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">ใช้กับตัวต้านทานแบบแถบสี 4 หรือ 5 แถบ หากสีซีดหรือแถบไม่ชัด ให้ปิดไฟวงจรแล้ววัดด้วยมัลติมิเตอร์</p>
        </div>

      </div>
      <p className="mt-4 text-xs text-slate-500">หลักการอ้างอิง: <a href="https://learn.sparkfun.com/tutorials/resistors/decoding-resistor-markings" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">รหัสสีตัวต้านทาน</a></p>
    </section>
  );
}
