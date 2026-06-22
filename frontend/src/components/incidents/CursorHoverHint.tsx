// CursorHoverHint.tsx - Portal tooltip pinned to the real mouse viewport coordinates.
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type CursorHoverHintData = {
  x: number;
  y: number;
  title: string;
};

type CursorHoverHintProps = {
  hint: CursorHoverHintData | null;
};

const GAP = 8;
const EDGE_PADDING = 8;
const TOOLTIP_WIDTH = 224;
const TOOLTIP_HEIGHT = 58;

export function CursorHoverHint({ hint }: CursorHoverHintProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hint) return null;

  const opensLeft = hint.x + TOOLTIP_WIDTH + GAP > window.innerWidth - EDGE_PADDING;
  const opensAbove = hint.y + TOOLTIP_HEIGHT / 2 > window.innerHeight - EDGE_PADDING;
  const opensBelow = hint.y - TOOLTIP_HEIGHT / 2 < EDGE_PADDING;
  const translateX = opensLeft ? `calc(-100% - ${GAP}px)` : `${GAP}px`;
  const translateY = opensAbove ? `calc(-100% + ${GAP}px)` : opensBelow ? `${GAP}px` : "-50%";

  return createPortal(
    <div
      className="pointer-events-none fixed z-[9999] w-56 rounded-md border border-brand-200 bg-white/95 px-3 py-2 text-sm font-semibold text-ink shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur"
      style={{
        left: hint.x,
        top: hint.y,
        transform: `translate(${translateX}, ${translateY})`,
      }}
    >
      Xem nhóm sự cố
      <span className="mt-0.5 block truncate text-xs font-medium text-neutral-500">{hint.title}</span>
    </div>,
    document.body,
  );
}
