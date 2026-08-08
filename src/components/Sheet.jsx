import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  // Render vào document.body qua Portal để tránh bị lệch vị trí khi phần tử cha
  // có transform/animation (transform tạo "containing block" mới cho position:fixed).
  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-surface shadow-glass animate-drawer-up">
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface/95 px-5 py-4 backdrop-blur-md">
          <h2 className="text-base font-bold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="focus-ring rounded-full p-1.5 text-ink-faint hover:bg-surface-soft hover:text-ink"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
