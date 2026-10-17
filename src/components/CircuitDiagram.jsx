const box = (x, y, label, tone = "normal", width = 118, height = 52) => ({ x, y, label, tone, width, height });
const line = (...points) => points;

function series(labels, caption, focusIndex = 1) {
  const xPositions = labels.length === 3 ? [70, 260, 450] : [18, 180, 342, 504];
  const nodes = labels.map((label, index) => box(xPositions[index], 118, label, index === focusIndex ? "focus" : "normal"));
  return {
    caption,
    nodes,
    wires: nodes.slice(0, -1).map((node, index) => line([node.x + node.width, 144], [nodes[index + 1].x, 144])),
  };
}

function bypass(component, caption) {
  return {
    caption,
    nodes: [box(28, 22, "VCC / +DC"), box(190, 126, component, "focus"), box(434, 126, "IC / โหลด"), box(28, 260, "GND")],
    wires: [
      line([87, 74], [87, 103], [249, 103], [249, 126]),
      line([249, 103], [493, 103], [493, 126]),
      line([249, 178], [249, 236], [87, 236], [87, 260]),
      line([493, 178], [493, 236], [249, 236]),
    ],
    dots: [[249, 103], [249, 236]],
  };
}

function divider(sensor, caption) {
  return {
    caption,
    nodes: [box(42, 16, "VCC"), box(42, 91, sensor, "focus"), box(42, 193, "R ค่าคงที่"), box(42, 265, "GND"), box(418, 139, "ADC / A0")],
    wires: [
      line([101, 68], [101, 91]),
      line([101, 143], [101, 167], [418, 167]),
      line([101, 167], [101, 193]),
      line([101, 245], [101, 265]),
    ],
    dots: [[101, 167]],
    annotations: [{ x: 196, y: 154, text: "จุดอ่านแรงดัน" }],
  };
}

const diagrams = {
  Resistor: series(["VCC", "Resistor", "LED", "GND"], "ตัวต้านทานต่ออนุกรมกับ LED เพื่อจำกัดกระแส"),
  "C Ceramic": bypass("C Ceramic", "ตัวเก็บประจุเซรามิกต่อคร่อม VCC–GND ใกล้ไอซี"),
  "C Film": {
    caption: "ตัวอย่างวงจรกรอง RC: R อนุกรมกับสัญญาณ และ C Film ลงกราวด์",
    nodes: [box(20, 105, "Signal IN"), box(182, 105, "R"), box(484, 105, "Signal OUT"), box(305, 206, "C Film", "focus"), box(484, 206, "GND")],
    wires: [
      line([138, 131], [182, 131]),
      line([300, 131], [484, 131]),
      line([364, 131], [364, 206]),
      line([423, 232], [484, 232]),
    ],
    dots: [[364, 131]],
  },
  "C Electrolytic": bypass(["C Electrolytic", "+ → VCC", "− → GND"], "ตัวอย่างกรองไฟ DC: ขั้ว + ต่อ VCC และขั้ว − ต่อ GND"),
  Diode: series(["+DC", "Diode  A → K", "โหลด", "GND"], "ตัวอย่างป้องกันกลับขั้ว: แถบบนไดโอดคือด้าน K"),
  Transistor: {
    caption: "ตัวอย่าง NPN สวิตช์ฝั่งกราวด์: C รับโหลด, E ลง GND, B ผ่าน R",
    nodes: [box(300, 12, "+DC"), box(300, 86, "โหลด"), box(300, 184, ["NPN", "C / B / E"], "focus"), box(300, 265, "GND"), box(20, 184, "GPIO"), box(162, 184, "R ที่ขา B")],
    wires: [
      line([359, 64], [359, 86]),
      line([359, 138], [359, 184]),
      line([359, 236], [359, 265]),
      line([138, 210], [162, 210]),
      line([280, 210], [300, 210]),
    ],
  },
  LED: series(["VCC", "R จำกัดกระแส", "LED  A → K", "GND"], "แอโนด A ไปด้านไฟบวก คาโทด K ไปด้านกราวด์", 2),
  "IR LED / Photo transistor (รวม)": {
    caption: "ตัวส่งและตัวรับเป็นคนละกิ่ง ตัวรับตัวอย่างนี้ใช้ตัวต้านทาน pull-up",
    nodes: [box(56, 12, "VCC"), box(56, 88, "R จำกัดกระแส"), box(56, 174, "IR LED", "focus"), box(56, 265, "GND"), box(346, 12, "VCC"), box(346, 88, "R pull-up"), box(346, 192, "Photo transistor", "focus"), box(346, 265, "GND"), box(506, 143, "ADC / IN", "normal", 112)],
    wires: [
      line([115, 64], [115, 88]), line([115, 140], [115, 174]), line([115, 226], [115, 265]),
      line([405, 64], [405, 88]), line([405, 140], [405, 169], [506, 169]), line([405, 169], [405, 192]), line([405, 244], [405, 265]),
    ],
    dots: [[405, 169]],
    annotations: [{ x: 87, y: 254, text: "ตัวส่ง" }, { x: 353, y: 254, text: "ตัวรับ" }],
  },
  Phototransistor: {
    caption: "ตัวอย่างตัวรับแสง: E ลง GND, C เป็นจุดอ่านสัญญาณพร้อม R pull-up ไป VCC",
    nodes: [box(42, 16, "VCC"), box(42, 104, "R pull-up"), box(42, 206, ["Photo transistor", "C / E"], "focus", 150, 58), box(420, 151, "ADC / IN"), box(42, 270, "GND")],
    wires: [line([101, 68], [101, 104]), line([101, 156], [101, 177], [420, 177]), line([101, 177], [101, 206]), line([101, 264], [101, 270])],
    dots: [[101, 177]],
    annotations: [{ x: 210, y: 165, text: "จุดอ่านที่ C" }],
  },
  Switch: series(["+5 V", "Button NO", "โหลด", "GND"], "ตัวอย่างปุ่มกด Normally Open: กดแล้ววงจรปิด ปล่อยแล้ววงจรเปิด"),
  Photoresistor: divider("LDR", "LDR กับตัวต้านทานค่าคงที่เป็นวงจรแบ่งแรงดันเข้า ADC"),
  "7-Segment": series(["GPIO", "R จำกัดกระแส", "Segment a", "ขาร่วม → GND"], "ตัวอย่างหนึ่ง segment สำหรับจอชนิด common cathode", 2),
  Potentiometer: {
    caption: "ขานอกสองขาต่อ VCC/GND; ขากลาง (wiper) ส่งแรงดันเข้า ADC",
    nodes: [box(46, 18, "VCC"), box(46, 130, ["Potentiometer", "ขานอก 1 / 2"], "focus", 150, 62), box(46, 266, "GND"), box(430, 137, "ADC / A0")],
    wires: [line([121, 70], [121, 130]), line([121, 192], [121, 266]), line([196, 161], [430, 161])],
    annotations: [{ x: 265, y: 148, text: "ขากลาง / wiper" }],
  },
  Buzzer: series(["+DC", "Active Buzzer", "GND"], "ตัวอย่างบัซเซอร์ชนิด Active ต่อขั้ว +/− ตามพิกัด", 1),
  Thermistor: divider("Thermistor", "เทอร์มิสเตอร์กับ R ค่าคงที่เป็นวงจรแบ่งแรงดันเข้า ADC"),
};

export default function CircuitDiagram({ part }) {
  const diagram = diagrams[part?.diagramId];
  if (!diagram) return null;

  return (
    <figure className="rounded-xl border border-cyan-300/15 bg-[#09111e] p-4 sm:p-5">
      <figcaption className="mb-3 text-sm font-semibold text-cyan-300">ภาพวงจรตัวอย่าง · {part.displayName || part.name}</figcaption>
      <div className="overflow-x-auto rounded-lg border border-white/8 bg-[#0d1929] p-2">
        <svg viewBox="0 0 640 320" role="img" aria-label={`แผนภาพการต่อวงจรเบื้องต้นของ ${part.name}: ${diagram.caption}`} className="h-auto min-w-[460px] w-full">
          {diagram.wires.map((points, index) => <polyline key={`wire-${index}`} points={points.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />)}
          {diagram.dots?.map(([x, y], index) => <circle key={`dot-${index}`} cx={x} cy={y} r="5" fill="#67e8f9" />)}
          {diagram.nodes.map((node, index) => {
            const labels = Array.isArray(node.label) ? node.label : [node.label];
            const isGround = labels.length === 1 && (labels[0] === "GND" || labels[0] === "ขาร่วม → GND");
            return <g key={`node-${index}`}>
              <rect x={node.x} y={node.y} width={node.width} height={node.height} rx="11" fill={isGround ? "#12342e" : node.tone === "focus" ? "#164154" : "#18263a"} stroke={isGround ? "#6ee7b7" : node.tone === "focus" ? "#67e8f9" : "#475569"} strokeWidth="2" />
              {labels.map((label, lineIndex) => <text key={label} x={node.x + node.width / 2} y={node.y + node.height / 2 + (lineIndex - (labels.length - 1) / 2) * 17 + 5} fill={isGround ? "#a7f3d0" : "#e2e8f0"} textAnchor="middle" fontSize="13" fontWeight="600" fontFamily="Inter, system-ui, sans-serif">{label}</text>)}
            </g>;
          })}
          {diagram.annotations?.map(({ x, y, text }, index) => <text key={`note-${index}`} x={x} y={y} fill="#94a3b8" fontSize="12" fontFamily="Inter, system-ui, sans-serif">{text}</text>)}
        </svg>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">{diagram.caption}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500"><span className="font-semibold text-emerald-300">กรอบสีเขียว = จุด GND ในวงจรตัวอย่าง</span> · ภาพนี้ไม่ใช่ผังขาของรุ่นจริง ตรวจขั้ว ค่า และพิกัดก่อนต่อวงจร</p>
    </figure>
  );
}
