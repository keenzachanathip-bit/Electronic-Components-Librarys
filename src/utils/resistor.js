export const bandColors = {
  black: { label: "ดำ", hex: "#171717", digit: 0, multiplier: 1 },
  brown: { label: "น้ำตาล", hex: "#854d0e", digit: 1, multiplier: 10, tolerance: 1 },
  red: { label: "แดง", hex: "#dc2626", digit: 2, multiplier: 100, tolerance: 2 },
  orange: { label: "ส้ม", hex: "#f97316", digit: 3, multiplier: 1000 },
  yellow: { label: "เหลือง", hex: "#eab308", digit: 4, multiplier: 10000 },
  green: { label: "เขียว", hex: "#16a34a", digit: 5, multiplier: 100000, tolerance: 0.5 },
  blue: { label: "น้ำเงิน", hex: "#2563eb", digit: 6, multiplier: 1000000, tolerance: 0.25 },
  violet: { label: "ม่วง", hex: "#7c3aed", digit: 7, multiplier: 10000000, tolerance: 0.1 },
  gray: { label: "เทา", hex: "#6b7280", digit: 8, multiplier: 100000000, tolerance: 0.05 },
  white: { label: "ขาว", hex: "#f8fafc", digit: 9, multiplier: 1000000000 },
  gold: { label: "ทอง", hex: "#d4af37", multiplier: 0.1, tolerance: 5 },
  silver: { label: "เงิน", hex: "#c0c0c0", multiplier: 0.01, tolerance: 10 },
};

export function decodeBands(bands) {
  if (![4, 5].includes(bands.length)) return null;
  const digitCount = bands.length - 2;
  const digits = bands.slice(0, digitCount).map((color) => bandColors[color]?.digit);
  const multiplier = bandColors[bands[digitCount]]?.multiplier;
  const tolerance = bandColors[bands[digitCount + 1]]?.tolerance;
  if (digits.some((digit) => digit === undefined) || digits[0] === 0 || multiplier === undefined || tolerance === undefined) return null;
  const significant = digits.reduce((value, digit) => value * 10 + digit, 0);
  return { ohms: significant * multiplier, tolerance };
}

export function formatOhms(value) {
  if (!Number.isFinite(value)) return "—";
  const unit = value >= 1e9 ? [1e9, "GΩ"] : value >= 1e6 ? [1e6, "MΩ"] : value >= 1e3 ? [1e3, "kΩ"] : [1, "Ω"];
  return `${Number((value / unit[0]).toPrecision(4)).toLocaleString("en-US")} ${unit[1]}`;
}

