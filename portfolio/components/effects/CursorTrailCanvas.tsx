"use client";

import { useEffect, useRef } from "react";
import { cursorTrail } from "@/lib/cursor-trail";

interface Props {
  color?: string;
  className?: string;
}

export function CursorTrailCanvas({ color, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const { renderTrailCursor, cleanUp } = cursorTrail({ ref: canvasRef, color });
    renderTrailCursor();
    return cleanUp;
  }, [color]);

  return <canvas ref={canvasRef} className={className} />;
}
