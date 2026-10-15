export default function RemoveImageButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="ลบรูปที่อัปโหลด"
      title="ลบรูปที่อัปโหลด"
      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#172033] text-2xl leading-none text-white shadow-lg transition hover:border-rose-300/60 hover:bg-rose-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 ${className}`}
    >
      ×
    </button>
  );
}
