export default function InstrumentGraphic({ kind }) {
  if (kind === "multimeter") {
    return (
      <svg viewBox="0 0 320 176" role="img" aria-label="ภาพประกอบ Multimeter" className="h-full w-full">
        <defs><linearGradient id="meter" x2="1" y2="1"><stop stopColor="#facc15"/><stop offset="1" stopColor="#eab308"/></linearGradient></defs>
        <path d="M85 142 C63 120 52 152 36 149" fill="none" stroke="#fb7185" strokeWidth="4"/>
        <path d="M235 142 C257 120 268 152 284 149" fill="none" stroke="#6b7280" strokeWidth="4"/>
        <rect x="104" y="10" width="112" height="156" rx="24" fill="#111827"/>
        <rect x="111" y="17" width="98" height="142" rx="19" fill="url(#meter)"/>
        <rect x="123" y="38" width="74" height="42" rx="6" fill="#152d38"/>
        <text x="188" y="67" textAnchor="end" fill="#a7f3d0" fontSize="22" fontFamily="monospace">12.48</text>
        <circle cx="160" cy="113" r="22" fill="#1f2937" stroke="#475569" strokeWidth="3"/>
        <circle cx="160" cy="113" r="12" fill="#334155"/>
        <path d="M160 112 L169 99" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="138" cy="147" r="4" fill="#ef4444"/><circle cx="182" cy="147" r="4" fill="#111827"/>
      </svg>
    );
  }

  if (kind === "power-supply") {
    return (
      <svg viewBox="0 0 320 176" role="img" aria-label="ภาพประกอบ Power Supply" className="h-full w-full">
        <defs><linearGradient id="supply" x2="1" y2="1"><stop stopColor="#344256"/><stop offset="1" stopColor="#161e2e"/></linearGradient></defs>
        <rect x="35" y="39" width="250" height="103" rx="15" fill="#0c1422" stroke="#556780" strokeWidth="3"/>
        <rect x="43" y="47" width="234" height="87" rx="10" fill="url(#supply)"/>
        <rect x="62" y="61" width="122" height="48" rx="5" fill="#0a1d24" stroke="#3c5f64"/>
        <text x="169" y="91" textAnchor="end" fill="#5eead4" fontSize="27" fontFamily="monospace">05.00</text>
        <text x="170" y="103" textAnchor="end" fill="#5eead4" fontSize="8" fontFamily="monospace">VOLTS</text>
        <circle cx="221" cy="78" r="15" fill="#1e293b" stroke="#9ca3af" strokeWidth="3"/>
        <circle cx="221" cy="78" r="5" fill="#475569"/>
        <circle cx="218" cy="115" r="7" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2"/>
        <circle cx="246" cy="115" r="7" fill="#111827" stroke="#64748b" strokeWidth="2"/>
        <path d="M58 143 v8 M262 143 v8" stroke="#64748b" strokeWidth="9" strokeLinecap="round"/>
      </svg>
    );
  }

  if (kind === "oscilloscope") {
    return (
      <svg viewBox="0 0 320 176" role="img" aria-label="ภาพประกอบ Oscilloscope" className="h-full w-full">
        <rect x="32" y="28" width="256" height="124" rx="15" fill="#151e2f" stroke="#54657e" strokeWidth="3"/>
        <rect x="44" y="40" width="176" height="98" rx="6" fill="#071824" stroke="#3b5264"/>
        <path d="M44 73 H220 M44 105 H220 M88 40 V138 M132 40 V138 M176 40 V138" stroke="#1c3b47" strokeWidth="1"/>
        <path d="M48 92 C62 92 64 60 78 60 S94 122 108 122 S124 60 138 60 S154 122 168 122 S184 60 198 60 S210 92 217 92" fill="none" stroke="#3ef1cb" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="249" cy="65" r="12" fill="#334155" stroke="#94a3b8" strokeWidth="2"/>
        <circle cx="249" cy="101" r="12" fill="#334155" stroke="#94a3b8" strokeWidth="2"/>
        <circle cx="249" cy="131" r="5" fill="#f59e0b"/>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 176" role="img" aria-label="ภาพประกอบ Function Generator" className="h-full w-full">
      <rect x="30" y="37" width="260" height="110" rx="15" fill="#171b2e" stroke="#5b6080" strokeWidth="3"/>
      <rect x="43" y="49" width="151" height="65" rx="7" fill="#10152e" stroke="#47487f"/>
      <path d="M51 82 C65 82 66 59 81 59 S97 105 112 105 S128 59 143 59 S160 105 175 105 S185 82 189 82" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
      <text x="51" y="132" fill="#c4b5fd" fontSize="10" fontFamily="monospace">1.000 kHz</text>
      <circle cx="237" cy="79" r="24" fill="#2a2c46" stroke="#a78bfa" strokeWidth="2"/>
      <circle cx="237" cy="79" r="10" fill="#57557c"/>
      <path d="M237 78 L249 63" stroke="#ddd6fe" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="236" cy="128" r="8" fill="#111827" stroke="#a78bfa" strokeWidth="3"/>
    </svg>
  );
}
