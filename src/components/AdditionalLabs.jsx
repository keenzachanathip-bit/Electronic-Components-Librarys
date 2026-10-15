import { useId } from "react";
import LabBreadboard from "./LabBreadboard.jsx";

const labs = {
  Switch: {
    title: "ทดลองสวิตช์เปิด LED",
    intro: "ใช้สวิตช์กดติดปล่อยดับแบบ 2 ขา (Normally Open) ตัดต่อกระแสในวงจร LED 5 V",
    parts: ["Breadboard และสายจัมเปอร์", "สวิตช์กด 2 ขาแบบ Normally Open", "LED สีแดง 2 ขา", "ตัวต้านทาน 330 Ω", "แหล่งจ่าย DC 5 V แบบจำกัดกระแสได้"],
    paths: [["+5 V", "สวิตช์ NO", "R 330 Ω", "LED A → K", "GND"]],
    connections: [
      ["ขั้ว +5 V", "ขา 1 ของสวิตช์"],
      ["ขา 2 ของสวิตช์", "ขาแรกของ R 330 Ω"],
      ["ขาอีกด้านของ R", "แอโนด A ของ LED"],
      ["คาโทด K ของ LED", "GND"],
    ],
    steps: [
      "ปิด OUTPUT และตั้งแหล่งจ่าย 5 V ตรวจด้วยมิเตอร์โหมดความต่อเนื่องว่าสวิตช์เปิดวงจรเมื่อไม่กด และต่อถึงกันเมื่อกด",
      "เสียบสวิตช์โดยให้ขาทั้งสองอยู่คนละแถวที่ไม่เชื่อมถึงกันบน breadboard",
      "ต่อสายตามตาราง โดยให้ตัวต้านทาน 330 Ω อนุกรมกับ LED และดูขั้ว A/K ของ LED",
      "ตรวจการต่อทั้งหมด แล้วเปิด OUTPUT จากนั้นกดและปล่อยสวิตช์",
    ],
    checks: ["ไม่กด: LED ดับ · กด: LED ติด", "ถ้า LED ติดตลอด ให้ปิดไฟแล้วตรวจว่าขาสวิตช์ไม่ได้อยู่ในแถวที่เชื่อมถึงกัน", "ถ้ากดแล้วไม่ติด ให้ตรวจขั้ว LED และวัดแรงดัน 5 V ที่รางไฟ"],
    note: "ใช้กับสวิตช์ 2 ขาแบบ Normally Open เท่านั้น สวิตช์ 4 ขามีคู่ขาที่เชื่อมถึงกันภายใน ต้องตรวจคู่ขาก่อนต่อ",
    sourceUrl: "https://learn.sparkfun.com/tutorials/button-and-switch-basics/all",
  },
  Diode: {
    title: "ทดลองทิศทางกระแสของไดโอด",
    intro: "ใช้ไดโอด 1N4007 ต่ออนุกรมกับ LED เพื่อดูความต่างระหว่างการต่อถูกทิศและกลับทิศ",
    parts: ["Breadboard และสายจัมเปอร์", "ไดโอด 1N4007 แบบมีแถบระบุ K", "LED สีแดง 2 ขา", "ตัวต้านทาน 330 Ω", "แหล่งจ่าย DC 5 V แบบจำกัดกระแสได้"],
    paths: [["+5 V", "1N4007 A → K", "R 330 Ω", "LED A → K", "GND"]],
    connections: [
      ["ขั้ว +5 V", "แอโนด A ของ 1N4007 (ด้านไม่มีแถบ)"],
      ["คาโทด K ของ 1N4007 (ด้านมีแถบ)", "ขาแรกของ R 330 Ω"],
      ["ขาอีกด้านของ R", "แอโนด A ของ LED"],
      ["คาโทด K ของ LED", "GND"],
    ],
    steps: [
      "ปิด OUTPUT และตั้งแหล่งจ่าย 5 V ระบุด้านแถบบนตัว 1N4007 ซึ่งเป็นคาโทด K",
      "เสียบไดโอดโดยให้สองขาอยู่คนละแถวที่ไม่เชื่อมถึงกัน แล้วต่อ A ไป +5 V และ K ไปทางตัวต้านทาน",
      "ต่อ R 330 Ω และ LED อนุกรมต่อไปจนถึง GND ตามตาราง ตรวจขั้วของ LED ด้วย",
      "เปิด OUTPUT สังเกต LED แล้วปิด OUTPUT ก่อนสลับทิศไดโอด 1N4007 เพื่อเปรียบเทียบผล",
    ],
    checks: ["ไดโอดหัน A → K ไปทาง LED: LED ควรติด", "กลับทิศไดโอด: LED ควรดับ", "หากทั้งสองทิศดับ ให้ตรวจขั้ว LED, ค่า R และรางไฟ; ปิดไฟก่อนย้ายชิ้นส่วนทุกครั้ง"],
    note: "แรงดันที่ LED ได้จะต่ำกว่า 5 V เพราะไดโอดมีแรงดันตกคร่อม การทดลองนี้ใช้ไฟ DC แรงดันต่ำเท่านั้น",
    sourceUrl: "https://learn.sparkfun.com/tutorials/diodes/diode-applications",
  },
  Transistor: {
    title: "ทดลองทรานซิสเตอร์ NPN เป็นสวิตช์",
    intro: "ใช้ 2N3904 เปิด LED เมื่อกดสวิตช์: ขา B รับสัญญาณผ่านตัวต้านทาน, ขา C รับโหลด และขา E ลง GND",
    parts: ["Breadboard และสายจัมเปอร์", "ทรานซิสเตอร์ NPN 2N3904", "สวิตช์กด 2 ขาแบบ Normally Open", "LED สีแดง 2 ขา", "R 330 Ω, R 4.7 kΩ และ R 100 kΩ", "แหล่งจ่าย DC 5 V แบบจำกัดกระแสได้"],
    paths: [
      ["+5 V", "R 330 Ω", "LED A → K", "C · 2N3904", "E → GND"],
      ["+5 V", "สวิตช์ NO", "R 4.7 kΩ", "B · 2N3904"],
      ["B · 2N3904", "R 100 kΩ", "GND"],
    ],
    connections: [
      ["+5 V → R 330 Ω", "แอโนด A ของ LED"],
      ["คาโทด K ของ LED", "ขา C ของ 2N3904"],
      ["ขา E ของ 2N3904", "GND"],
      ["+5 V → สวิตช์ NO → R 4.7 kΩ", "ขา B ของ 2N3904"],
      ["ขา B ของ 2N3904 → R 100 kΩ", "GND (ช่วยดึงขา B ลงเมื่อปล่อยสวิตช์)"],
    ],
    steps: [
      "ปิด OUTPUT ตั้งไฟ 5 V แล้วอ่านรหัสบนทรานซิสเตอร์ ยืนยันว่าเป็น NPN 2N3904 และหาขา E/B/C จาก datasheet ของผู้ผลิต",
      "เสียบขา E, B, C ลงคนละแถวที่ไม่เชื่อมถึงกัน ต่อ E ไป GND และ C ไปคาโทด K ของ LED",
      "ต่อ +5 V → R 330 Ω → แอโนด A ของ LED; ห้ามต่อ LED เข้ากับ 5 V โดยไม่มีตัวต้านทาน",
      "ต่อ +5 V → สวิตช์ NO → R 4.7 kΩ → B และต่อ R 100 kΩ จาก B ลง GND",
      "ตรวจผังขาและสายอีกครั้งก่อนเปิด OUTPUT แล้วลองกดและปล่อยสวิตช์",
    ],
    checks: ["ปล่อยสวิตช์: LED ดับ · กดสวิตช์: LED ติด", "ถ้า LED ไม่ติด ให้ปิดไฟแล้วตรวจว่าขา E/B/C ตรงกับ datasheet, LED ไม่กลับขั้ว และมี R ที่ขา B", "ถ้า LED ติดตลอด ให้ตรวจว่าสวิตช์เป็นชนิด NO และ R 100 kΩ ต่อจาก B ถึง GND จริง"],
    note: "ผังขาขึ้นกับผู้ผลิตและแพ็กเกจ สำหรับ onsemi 2N3904 datasheet ระบุขา 1=E, 2=B, 3=C ให้นับตามภาพใน datasheet; อย่าเดาจากด้านแบนอย่างเดียว",
    sourceUrl: "https://learn.sparkfun.com/tutorials/transistors",
    datasheetUrl: "https://www.onsemi.com/download/data-sheet/pdf/2n3904-d.pdf",
  },
};

function PathDiagram({ paths, title }) {
  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-[#080e19] p-4" role="img" aria-label={`${title}: ${paths.map((path) => path.join(" ไป ")).join("; ")}`}>
      {paths.map((path, pathIndex) => <div key={pathIndex} className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-2 py-1" aria-hidden="true">
          {path.map((node, index) => <div key={`${pathIndex}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span className="font-bold text-cyan-300">→</span>}
            <span className={`rounded-lg border px-3 py-2.5 text-xs font-semibold sm:text-sm ${node.includes("GND") ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-200" : node.includes("+5 V") ? "border-rose-300/35 bg-rose-300/10 text-rose-200" : "border-cyan-300/20 bg-[#13243a] text-slate-100"}`}>{node}</span>
          </div>)}
        </div>
      </div>)}
    </div>
  );
}

export default function AdditionalLabs({ part }) {
  const titleId = useId();
  const lab = labs[part?.diagramId];
  if (!lab) return null;

  return (
    <section className="rounded-2xl border border-amber-300/20 bg-[#111a2b] p-5 sm:p-6" aria-labelledby={titleId}>
      <p className="text-xs font-semibold tracking-[0.17em] text-amber-300">BEGINNER LAB · 5 V DC</p>
      <h5 id={titleId} className="mt-2 text-lg font-bold text-white">{lab.title}</h5>
      <p className="mt-2 text-sm leading-6 text-slate-300">{lab.intro}</p>
      <div className="mt-5"><PathDiagram paths={lab.paths} title={lab.title} /></div>
      <div className="mt-4"><LabBreadboard type={part.diagramId} /></div>
      <p className="mt-2 text-xs leading-5 text-slate-400">ตำแหน่งรูเป็นตัวอย่างบน breadboard แบบ A–J; ตรวจแถวที่เชื่อมกันจริงและระยะขาของชิ้นส่วนก่อนเสียบ โดยเฉพาะผังขา E/B/C ของทรานซิสเตอร์</p>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div><h6 className="text-sm font-semibold text-white">อุปกรณ์ที่ต้องใช้</h6><ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-300">{lab.parts.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><h6 className="text-sm font-semibold text-white">ต่อทีละขั้น</h6><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">{lab.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
      </div>
      <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[420px] text-left text-sm"><caption className="px-4 py-3 text-left font-semibold text-white">ตารางจุดต่อสาย</caption><thead className="bg-white/5 text-xs text-slate-400"><tr><th scope="col" className="px-4 py-2">จาก</th><th scope="col" className="px-4 py-2">ไป</th></tr></thead><tbody className="divide-y divide-white/8">{lab.connections.map(([from, to]) => <tr key={`${from}-${to}`}><td className="px-4 py-2.5 text-slate-200">{from}</td><td className="px-4 py-2.5 text-slate-300">{to}</td></tr>)}</tbody></table>
      </div>
      <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4"><h6 className="text-sm font-semibold text-emerald-300">ผลที่ควรเห็นและวิธีตรวจ</h6><ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-200">{lab.checks.map((check) => <li key={check}>{check}</li>)}</ul></div>
      <p className="mt-4 rounded-lg border border-amber-300/15 bg-amber-300/5 p-3 text-xs leading-6 text-amber-100/85">{lab.note}</p>
      <div className="mt-4 flex flex-wrap gap-4 text-xs"><a href={lab.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-2">อ่านหลักการวงจร ↗</a>{lab.datasheetUrl && <a href={lab.datasheetUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-2">ดู datasheet 2N3904 ↗</a>}</div>
    </section>
  );
}
