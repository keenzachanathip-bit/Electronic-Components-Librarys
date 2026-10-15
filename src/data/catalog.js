const baseParts = [
  { name: "Resistor", category: "ตัวต้านทาน", symbol: "R", description: "จำกัดกระแสและแบ่งแรงดัน", usage: "เลือกค่าความต้านทานตามวงจร แล้วต่ออนุกรมเพื่อจำกัดกระแส หรือจัดเป็นวงจรแบ่งแรงดัน" },
  { name: "C Ceramic", category: "ตัวเก็บประจุ", symbol: "C", description: "กรองสัญญาณและลดสัญญาณรบกวน", usage: "มักต่อคร่อมไฟเลี้ยงใกล้ขาไอซีเพื่อช่วยลดสัญญาณรบกวนความถี่สูง" },
  { name: "C Film", category: "ตัวเก็บประจุ", symbol: "CF", description: "เก็บประจุในวงจรสัญญาณ", usage: "ใช้ในวงจรกรองสัญญาณหรือวงจรจับเวลา โดยเลือกค่าความจุและพิกัดแรงดันให้เหมาะสม" },
  { name: "C Electrolytic", category: "ตัวเก็บประจุ", symbol: "CE", description: "เก็บประจุและกรองไฟเลี้ยง", usage: "ใช้กรองแรงดัน DC หรือสำรองประจุช่วงสั้น ๆ ต้องต่อขั้วบวกและลบให้ถูกต้อง" },
  { name: "Diode", category: "สารกึ่งตัวนำ", symbol: "D", description: "ให้กระแสไหลผ่านได้ทิศทางเดียว", usage: "ใช้เรียงกระแสหรือป้องกันการต่อกลับขั้ว โดยสังเกตแถบที่ระบุด้านคาโทด" },
  { name: "Transistor", category: "สารกึ่งตัวนำ", symbol: "Q", description: "ขยายสัญญาณหรือทำหน้าที่เป็นสวิตช์", usage: "ใช้สัญญาณขนาดเล็กควบคุมโหลดหรือขยายสัญญาณ ตรวจตำแหน่งขาจาก datasheet ของรุ่นนั้นก่อนต่อ" },
  { name: "LED", category: "แสงและจอแสดงผล", symbol: "LED", description: "เปล่งแสงเพื่อแสดงสถานะ", usage: "ต่อให้ถูกขั้วและใช้ตัวต้านทานจำกัดกระแสเมื่อจ่ายไฟให้ LED" },
  { name: "IR LED / Photo transistor (รวม)", category: "แสงและจอแสดงผล", symbol: "IR", description: "ส่งและรับแสงอินฟราเรด", usage: "ใช้เป็นคู่ส่ง–รับในวงจรตรวจจับวัตถุ ระยะใกล้ หรือการตัดลำแสง" },
  { name: "Switch", category: "สวิตช์และเสียง", symbol: "SW", description: "เปิดหรือปิดวงจรไฟฟ้า", usage: "ต่อในทางเดินสัญญาณหรือไฟเลี้ยงเพื่อเลือกสถานะเปิด–ปิดของวงจร" },
  { name: "Photoresistor", category: "เซนเซอร์", symbol: "LDR", description: "เปลี่ยนความต้านทานตามแสง", usage: "ใช้ร่วมกับตัวต้านทานอีกตัวเป็นวงจรแบ่งแรงดันสำหรับตรวจระดับแสง" },
  { name: "7-Segment", category: "แสงและจอแสดงผล", symbol: "7", description: "แสดงตัวเลขด้วย LED เจ็ดส่วน", usage: "ขับแต่ละส่วนผ่านตัวต้านทานจำกัดกระแส และตรวจว่ารุ่นที่ใช้เป็นขั้วร่วมบวกหรือขั้วร่วมลบ" },
  { name: "Potentiometer", category: "ตัวต้านทาน", symbol: "POT", description: "ปรับค่าความต้านทานได้", usage: "หมุนปรับแรงดันอ้างอิงหรือระดับสัญญาณ โดยใช้ขากลางเป็นขาเลื่อน" },
  { name: "Buzzer", category: "สวิตช์และเสียง", symbol: "BZ", description: "สร้างเสียงแจ้งเตือน", usage: "ใช้เป็นเสียงเตือนสถานะของวงจร โดยเลือกแรงดันและชนิด Active/Passive ให้ตรงกับการขับ" },
  { name: "Thermistor", category: "เซนเซอร์", symbol: "TH", description: "เปลี่ยนความต้านทานตามอุณหภูมิ", usage: "ใช้ในวงจรแบ่งแรงดันเพื่อตรวจอุณหภูมิ และแปลงค่าตามชนิด NTC หรือ PTC" },
];

const partDetails = {
  Resistor: {
    identify: "มีขาสองด้าน ตัวแบบขามักมีแถบสีบอกค่า ส่วนแบบ SMD มักพิมพ์รหัสบนตัวชิ้นส่วน ไม่มีขั้วบวกหรือลบ",
    pinGuide: "ไม่มีขา GND ประจำตัวและไม่มีขั้ว ขาใดจะอยู่ฝั่ง GND ขึ้นกับตำแหน่งที่ต่อในวงจร",
    connection: "ต่ออนุกรมในทางเดินกระแส เช่น ไฟเลี้ยง → ตัวต้านทาน → LED → กราวด์ โดยเลือกค่าตามแรงดันและกระแสที่ต้องการ",
    example: "จำกัดกระแสให้ LED แสดงสถานะบนบอร์ด",
    sourceUrl: "https://learn.sparkfun.com/tutorials/resistors/all",
  },
  "C Ceramic": {
    identify: "มักเป็นแผ่นกลมขนาดเล็กหรือชิป SMD บางตัวพิมพ์รหัสค่า เช่น 104 โดยทั่วไปไม่มีขั้ว",
    pinGuide: "ชนิดเซรามิกทั่วไปไม่มีขั้วหรือขา GND ตายตัว เมื่อต่อคร่อมไฟเลี้ยงให้ขาหนึ่งไป VCC และอีกขาไป GND",
    connection: "ต่อคร่อมไฟเลี้ยง VCC กับ GND ใกล้ขาไอซี และเลือกพิกัดแรงดันสูงกว่าไฟที่ใช้",
    example: "ลดสัญญาณรบกวนบนไฟเลี้ยงไมโครคอนโทรลเลอร์",
    sourceUrl: "https://learn.sparkfun.com/tutorials/capacitors/all",
  },
  "C Film": {
    identify: "มักเป็นกล่องพลาสติกสี่เหลี่ยม มีสองขาและพิมพ์ค่าความจุกับพิกัดแรงดัน โดยทั่วไปไม่มีขั้ว",
    pinGuide: "โดยทั่วไปไม่มีขั้วหรือขา GND ตายตัว ในภาพวงจร RC ให้ขาหนึ่งอยู่ที่จุดสัญญาณหลัง R และอีกขาไป GND",
    connection: "ต่อร่วมกับตัวต้านทานเป็นวงจร RC ตามจุดสัญญาณที่ต้องการกรอง และตรวจพิกัดแรงดันก่อนใช้",
    example: "กรองความถี่บางช่วงในวงจรเสียงแรงดันต่ำ",
    sourceUrl: "https://learn.sparkfun.com/tutorials/capacitors/all",
  },
  "C Electrolytic": {
    identify: "ทรงกระบอกคล้ายกระป๋อง มีค่าความจุและพิกัดแรงดันบนตัว แถบสีมักบอกขั้วลบ",
    pinGuide: "ดูแถบที่มีเครื่องหมาย − บนตัวถัง ซึ่งโดยทั่วไปอยู่ฝั่งขาลบ; ในวงจรกรองไฟ DC ตัวอย่างนี้ขาลบไป GND และขาบวกไป VCC ห้ามกลับขั้ว",
    connection: "ใช้กับไฟ DC โดยต่อขั้วบวกไปด้านไฟบวกและขั้วลบไป GND เมื่อใช้กรองไฟเลี้ยง ห้ามกลับขั้วและต้องเลือกพิกัดแรงดันให้พอ",
    example: "ช่วยให้ไฟ DC หลังวงจรจ่ายไฟเรียบขึ้น",
    sourceUrl: "https://learn.sparkfun.com/tutorials/polarity/electrolytic-capacitors",
  },
  Diode: {
    identify: "ตัวแบบขามักมีแถบที่ปลายด้านหนึ่ง แถบนั้นบอกด้านคาโทด; แบบ SMD ให้ดูสัญลักษณ์บนตัวหรือเอกสารรุ่น",
    pinGuide: "แถบบนตัวไดโอดบอกด้านคาโทด (K) อีกด้านคือแอโนด (A) ไดโอดไม่มีขา GND ตายตัว; ในวงจรกันไฟกลับขั้วแบบนี้ K ไปทางโหลด",
    connection: "ถ้าต่ออนุกรมเพื่อกันไฟกลับขั้ว ให้หันแอโนดเข้าหาไฟบวกและคาโทดไปทางวงจรที่จะจ่ายไฟ",
    example: "ป้องกันวงจรทดลองเมื่อเสียบแหล่งจ่ายกลับขั้ว",
    sourceUrl: "https://learn.sparkfun.com/tutorials/polarity/diode-and-led-polarity",
  },
  Transistor: {
    identify: "มีอย่างน้อยสามขาและมักมีรหัสรุ่นบนตัว รูปร่างคล้ายกันอาจมีตำแหน่งขาและชนิด NPN/PNP ต่างกัน",
    pinGuide: "ในภาพตัวอย่าง NPN สวิตช์ฝั่งกราวด์ ขา E ต่อ GND แต่รูปร่างหรือด้านแบนบอกตำแหน่ง E ไม่ได้แน่เสมอ อ่านรหัสบนตัวแล้วเปิด datasheet เพื่อแยก E/B/C",
    connection: "ตัวอย่าง NPN สวิตช์ฝั่งกราวด์: E ไป GND, C ไปด้านลบของโหลด และ B รับสัญญาณผ่านตัวต้านทาน ตรวจผังขาของรุ่นจริงก่อนต่อ",
    example: "ใช้สัญญาณจากไมโครคอนโทรลเลอร์เปิดปิดโหลดขนาดเล็ก",
    sourceUrl: "https://learn.sparkfun.com/tutorials/transistors",
  },
  LED: {
    identify: "ตัวแบบขามักมีขาที่ยาวกว่าเป็นแอโนด และขอบฐานด้านแบนเป็นคาโทด; แบบ SMD ต้องดูเครื่องหมายของรุ่น",
    pinGuide: "LED แบบขาทั่วไป ขายาวมักเป็นแอโนด (+); ขาสั้นหรือด้านขอบแบนมักเป็นคาโทด (−) ซึ่งต่อไป GND ในภาพนี้ ถ้าตัดขาแล้วให้ดูด้านแบนหรือใช้มิเตอร์โหมดไดโอด",
    connection: "ต่อ LED อนุกรมกับตัวต้านทานจำกัดกระแส ให้แอโนดอยู่ด้านไฟบวกและคาโทดอยู่ด้านกราวด์",
    example: "ไฟแสดงว่าอุปกรณ์เปิดอยู่หรือมีสัญญาณเข้า",
    sourceUrl: "https://learn.adafruit.com/experimenters-guide-for-metro/electronics-primer-a888d35e-af0c-47f3-bec9-3e950b528c78",
  },
  "IR LED / Photo transistor (รวม)": {
    identify: "มักเป็นคู่ตัวส่งและตัวรับที่หน้าตาคล้าย LED สีของตัวถังใช้แยกไม่ได้เสมอไป ควรดูรหัสและผังขาของแต่ละตัว",
    pinGuide: "ตัวส่ง IR LED ต้องแยก A/K จากเครื่องหมายของรุ่น โดย K ไป GND ในภาพนี้; ตัวรับโฟโตทรานซิสเตอร์ใช้ขา E ไป GND ในวงจร pull-up ตัวอย่าง ตำแหน่งขาทั้งคู่ต้องดู datasheet",
    connection: "ต่อ IR LED ผ่านตัวต้านทานจำกัดกระแส ส่วนโฟโตทรานซิสเตอร์ต่อเป็นวงจรรับสัญญาณพร้อมตัวต้านทานดึงระดับตามผังของรุ่น",
    example: "ตรวจจับวัตถุที่ขวางลำแสงอินฟราเรด",
    sourceUrl: "https://learn.adafruit.com/ir-breakbeam-sensors?view=all",
  },
  Switch: {
    identify: "เป็นปุ่มกดหรือคันโยก มีสองขาหรือหลายขา ใช้มิเตอร์โหมดความต่อเนื่องเช็กว่าคู่ขาใดเชื่อมกันเมื่อกด",
    pinGuide: "สวิตช์กลไกทั่วไปไม่มีขา GND ประจำตัว ใช้มิเตอร์โหมดความต่อเนื่องหาคู่ขาที่ต่อถึงกันเมื่อกด; ขาใดไป GND ขึ้นกับวงจรที่เลือกใช้",
    connection: "ต่ออนุกรมในวงจรไฟแรงดันต่ำเพื่อเปิดปิด หรือใช้เป็นอินพุตดิจิทัลร่วมกับตัวต้านทาน pull-up/pull-down",
    example: "ปุ่มเริ่มหรือหยุดการทำงานของวงจร",
    sourceUrl: "https://learn.sparkfun.com/tutorials/button-and-switch-basics/all",
  },
  Photoresistor: {
    identify: "หน้าชิ้นส่วนมักมีลายทางคดเคี้ยวบนแผ่นกลมและมีสองขา ค่าความต้านทานเปลี่ยนตามแสง",
    pinGuide: "LDR ไม่มีขั้วหรือขา GND ตายตัว ภาพตัวอย่างต่อ LDR ฝั่ง VCC และตัวต้านทานค่าคงที่ฝั่ง GND แล้วอ่านจุดกลางด้วย ADC",
    connection: "ต่อร่วมกับตัวต้านทานค่าคงที่เป็นวงจรแบ่งแรงดัน แล้วอ่านแรงดันตรงกลางด้วยขา ADC",
    example: "ไฟกลางคืนที่เปิดเมื่อบริเวณรอบตัวมืดลง",
    sourceUrl: "https://learn.sparkfun.com/tutorials/photocell-hookup-guide/all",
  },
  "7-Segment": {
    identify: "หน้าตาเป็นแท่ง LED เจ็ดส่วนสำหรับตัวเลข บางรุ่นมีจุดทศนิยมและขาหลายขา ต้องดูว่าเป็น common anode หรือ common cathode",
    pinGuide: "ต้องรู้ชนิดและผังขาของรุ่นก่อน: common cathode ต่อขาร่วมไป GND ตามภาพ; common anode ต่อขาร่วมไปไฟบวก ตำแหน่งขาร่วมไม่เหมือนกันทุกแพ็กเกจ",
    connection: "ต่อขาร่วมตามชนิดของจอ และต่อแต่ละ segment ผ่านตัวต้านทานจำกัดกระแสหรือวงจรขับที่เหมาะสม ตรวจผังขาของรุ่นจริง",
    example: "แสดงเลขนับหรือค่าจากเซนเซอร์หนึ่งหลัก",
    sourceUrl: "https://learn.sparkfun.com/tutorials/bubble-display-hookup-guide/all",
  },
  Potentiometer: {
    identify: "มีปุ่มหมุนหรือสกรูปรับและสามขา ขากลางคือ wiper ที่เปลี่ยนตำแหน่งเมื่อหมุน",
    pinGuide: "ขากลางเป็น wiper ส่งแรงดันไป ADC ส่วนขานอกสองขาเป็นปลายตัวต้านทาน เลือกขานอกด้านหนึ่งต่อ GND อีกด้านต่อ VCC; สลับขานอกจะกลับทิศการหมุน",
    connection: "ต่อขานอกสองขากับ VCC และ GND แล้วอ่านแรงดันจากขากลางด้วย ADC โดยใช้ค่าแรงดันตามที่วงจรรับได้",
    example: "ปุ่มหมุนปรับระดับความสว่างที่ไมโครคอนโทรลเลอร์สั่ง LED",
    sourceUrl: "https://learn.sparkfun.com/tutorials/beginner-parts-kit-identification-guide",
  },
  Buzzer: {
    identify: "มักเป็นกระบอกหรือแผ่นกลมที่มีช่องเสียง บางรุ่นมีเครื่องหมาย +; ต้องดูว่าเป็นชนิดมีวงจรสร้างเสียงในตัวหรือชนิดต้องป้อนสัญญาณ",
    pinGuide: "ดูเครื่องหมาย +/− บนตัวถังหรือใต้ฐาน; ในภาพตัวอย่าง Active Buzzer ขา − ไป GND และขา + ไปไฟตามพิกัด หากไม่มีเครื่องหมายให้ดู datasheet ของรุ่น",
    connection: "ต่อขั้วตามเครื่องหมายและจ่ายไฟตามพิกัดของรุ่น หากเป็นชนิดต้องสร้างเสียงให้ป้อนสัญญาณความถี่ผ่านวงจรขับที่เหมาะสม",
    example: "เสียงเตือนเมื่อเซนเซอร์ตรวจพบเหตุการณ์",
    sourceUrl: "https://learn.sparkfun.com/tutorials/tinker-kit-circuit-guide/circuit-5-buzzer",
  },
  Thermistor: {
    identify: "มักเป็นเม็ดหรือแผ่นเล็กมีสองขา ต้องดูรหัสหรือ datasheet เพื่อแยกว่าเป็น NTC หรือ PTC",
    pinGuide: "เทอร์มิสเตอร์สองขาทั่วไปไม่มีขั้วหรือขา GND ตายตัว ภาพตัวอย่างต่อเทอร์มิสเตอร์ฝั่ง VCC และตัวต้านทานค่าคงที่ฝั่ง GND",
    connection: "ต่อเป็นวงจรแบ่งแรงดันกับตัวต้านทานค่าคงที่ แล้วอ่านค่าด้วย ADC และแปลงค่าตามข้อมูลของรุ่น",
    example: "ตรวจอุณหภูมิแล้วสั่งพัดลมทำงานเมื่อร้อนขึ้น",
    sourceUrl: "https://learn.adafruit.com/thermistor/using-a-thermistor",
  },
};

export const parts = baseParts.map((part) => ({ ...part, ...partDetails[part.name], diagramId: part.name }));

const phototransistorPart = {
  name: "Phototransistor",
  category: "เซนเซอร์",
  symbol: "PT",
  description: "ตรวจจับแสงและเปลี่ยนเป็นกระแสไฟฟ้า",
  usage: "ใช้ร่วมกับตัวต้านทานดึงระดับเพื่ออ่านสัญญาณแสงด้วยขา ADC หรืออินพุตดิจิทัล",
  identify: "มีขาคล้าย LED แต่เป็นตัวรับแสง ตำแหน่งขา C/E และชนิดของแสงที่ตรวจจับได้ต้องดูจากรหัสรุ่น",
  pinGuide: "ในวงจร pull-up ตัวอย่าง ขา E ไป GND และขา C เป็นจุดสัญญาณที่ต่อ R ไป VCC; ตำแหน่ง C/E บนตัวจริงต่างกันตามรุ่น ต้องดู datasheet",
  connection: "ตัวอย่างวงจรรับแสง: ต่อ E ลง GND, ต่อ C เข้าขา ADC และต่อ R pull-up จากจุด C/ADC ไป VCC ตรวจผังขาและพิกัดของรุ่นจริงก่อนต่อ",
  example: "ตรวจจับลำแสงหรือแสงสะท้อนจากวัตถุ",
  sourceUrl: "https://learn.sparkfun.com/tutorials/qrd1114-optical-detector-hookup-guide/example-circuit",
  diagramId: "Phototransistor",
};

const modelNameAliases = {
  "c electrolyte": "C Electrolytic",
  ldr: "Photoresistor",
  "7segment": "7-Segment",
  phototransistor: "Phototransistor",
};

export function catalogFromClassLabels(classLabels) {
  if (!Array.isArray(classLabels) || classLabels.length === 0) return parts;

  const normalizeName = (value) => value.toLowerCase().replace(/\(รวม\)/g, "").replace(/[\s_-]+/g, " ").trim();

  return classLabels.map((rawLabel, index) => {
    const name = String(rawLabel).trim() || `Class ${index + 1}`;
    const canonicalName = modelNameAliases[normalizeName(name)] || name;
    const knownPart = [...parts, phototransistorPart].find((part) => normalizeName(part.name) === normalizeName(canonicalName));
    return knownPart
      ? { ...knownPart, name, displayName: knownPart.name }
      : { name, displayName: name, category: "อื่น ๆ", symbol: name.slice(0, 3).toUpperCase(), description: "คลาสจากโมเดลภาพที่เชื่อมต่อ", usage: "ยังไม่มีรายละเอียดของชิ้นส่วนนี้ในคลังข้อมูล" };
  });
}

export const instruments = [
  {
    id: "multimeter",
    name: "Multimeter",
    category: "เครื่องมือวัดพื้นฐาน",
    description: "วัดแรงดัน กระแส และความต้านทาน รวมถึงตรวจความต่อเนื่องของวงจร",
    tags: ["Voltage", "Current", "Resistance"],
    photo: "/images/tools/multimeter.jpg",
    photoSource: "https://commons.wikimedia.org/wiki/File:Digital_Multimeter.jpg",
    photoAuthor: "oomlout",
    photoLicense: "CC BY-SA 2.0",
    photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    steps: [
      "เสียบสายดำที่ COM และสายแดงที่ช่อง VΩ สำหรับวัดแรงดันหรือความต้านทาน",
      "เลือกโหมดให้ตรงกับค่าที่จะวัด แล้วแตะโพรบสองจุดของวงจร",
      "หากวัดความต้านทานหรือเช็กความต่อเนื่อง ให้ปิดไฟวงจรและคายประจุก่อน",
    ],
    guideUrl: "https://www.fluke.com/en/learn/blog/maintenance-monitoring/how-to-use-a-multimeter-guide",
  },
  {
    id: "power-supply",
    name: "Power Supply",
    category: "แหล่งจ่ายไฟ",
    description: "จ่ายไฟให้วงจร โดยปรับแรงดันและจำกัดกระแสให้เหมาะกับการทดลอง",
    tags: ["DC output", "Voltage control"],
    photo: "/images/tools/power-supply.jpg",
    photoSource: "https://commons.wikimedia.org/wiki/File:Bench_power_supply.jpg",
    photoAuthor: "Derrick Parker",
    photoLicense: "CC0 1.0",
    photoLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    steps: [
      "ปิด OUTPUT ก่อนต่อขั้วบวกและลบเข้ากับวงจร",
      "ตั้งแรงดันและขีดจำกัดกระแสตามพิกัดของอุปกรณ์ที่จะทดสอบ",
      "เปิด OUTPUT แล้วดูค่าแรงดันและกระแสจริง ปิด OUTPUT ก่อนถอดสาย",
    ],
    guideUrl: "https://www.keysight.com/us/en/assets/9018-01079/user-manuals/9018-01079.pdf",
  },
  {
    id: "oscilloscope",
    name: "Oscilloscope",
    category: "ดูรูปคลื่น",
    description: "แสดงสัญญาณไฟฟ้าตามเวลา เพื่อดูรูปคลื่น ความถี่ และระดับแรงดัน",
    tags: ["Waveform", "Frequency"],
    photo: "/images/tools/oscilloscope.jpg",
    photoSource: "https://commons.wikimedia.org/wiki/File:Digital_Oscilloscope.jpg",
    photoAuthor: "Mikasa2025",
    photoLicense: "CC BY 4.0",
    photoLicenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    steps: [
      "ต่อโพรบเข้าช่องสัญญาณ และหนีบกราวด์กับจุดอ้างอิงของวงจรแรงดันต่ำ",
      "แตะปลายโพรบที่จุดวัด แล้วใช้ Auto Set หรือปรับ Volts/Div และ Time/Div",
      "ปรับ Trigger ให้รูปคลื่นนิ่งก่อนอ่านคาบ ความถี่ หรือระดับแรงดัน",
    ],
    guideUrl: "https://www.tek.com/ru/documents/primer/setting-and-using-oscilloscope",
  },
  {
    id: "function-generator",
    name: "Function Generator",
    category: "สร้างสัญญาณทดสอบ",
    description: "สร้างคลื่นไซน์ สี่เหลี่ยม หรือสามเหลี่ยมเพื่อทดสอบการทำงานของวงจร",
    tags: ["Sine", "Square", "Triangle"],
    photo: "/images/tools/function-generator.jpg",
    photoSource: "https://commons.wikimedia.org/wiki/File:Function_Generator_FG100.jpg",
    photoAuthor: "Anselm Schüler",
    photoLicense: "CC BY-SA 4.0",
    photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    steps: [
      "ปิด OUTPUT แล้วเลือกชนิดคลื่นที่ต้องการ เช่น sine หรือ square",
      "ตั้งความถี่ แอมพลิจูด และ DC offset ให้อยู่ในช่วงที่วงจรรับได้",
      "ต่อเอาต์พุตเข้าจุดทดสอบ เปิด OUTPUT แล้วตรวจรูปคลื่นด้วยออสซิลโลสโคป",
    ],
    guideUrl: "https://www.keysight.com/hk/en/assets/9018-02203/quick-start-guides/9018-02203.pdf",
  },
];
