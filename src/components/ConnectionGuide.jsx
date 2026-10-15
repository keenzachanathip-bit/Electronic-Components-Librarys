import CircuitDiagram from "./CircuitDiagram.jsx";

export default function ConnectionGuide({ part, showDiagram = false }) {
  return (
    <div className="rounded-xl border border-cyan-300/15 bg-[#0b1322] p-5">
      <h5 className="text-sm font-semibold text-cyan-300">วิธีต่อวงจรเบื้องต้น · {part?.displayName || part?.name || "ชิ้นส่วน"}</h5>
      <p className="mt-2 text-sm leading-7 text-slate-200">
        {part?.connection || "ยังไม่มีข้อมูลวิธีต่อวงจรสำหรับคลาสนี้"}
      </p>
      {part?.pinGuide && (
        <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/5 p-4">
          <h6 className="text-sm font-semibold text-emerald-300">ดูขั้วและจุดต่อ GND ยังไง</h6>
          <p className="mt-2 text-sm leading-6 text-slate-200">{part.pinGuide}</p>
        </div>
      )}
      {showDiagram && part?.diagramId && <div className="mt-4"><CircuitDiagram part={part} /></div>}
      {part?.connection && (
        <p className="mt-3 text-xs leading-5 text-slate-500">
          ตรวจขั้ว พิกัด และผังขาของชิ้นส่วนรุ่นจริงก่อนต่อวงจร
          {part.sourceUrl && <> · <a href={part.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">อ่านข้อมูลเพิ่มเติม ↗</a></>}
        </p>
      )}
    </div>
  );
}
