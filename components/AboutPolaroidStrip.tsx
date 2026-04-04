"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

/** Filenames under public/images/ — captions = basename, lowercase. */
const POLAROID_FILES = [
  "Hosting a session at Ghana Digital and Innovation Week.jpg",
  "Interacting with participants of Cursor Hackathon KNUST.jpg",
  "Me at Flat6Labs & Ghana Venture Capital Trust Fund bootcamp supported by World Bank's IFC.jpeg",
  "On the touchline on a Black Stars game for Citi Sports.jpg",
  "Some dance moves wouldn't kill us!.jpg",
] as const;

/** Alternating subtle tilt (about ±4–5°). */
const ROTATIONS = [-4, 3, -3, 4, 5] as const;

/** Stable tilt per file. */
const ROTATION_BY_FILE: Record<string, number> = Object.fromEntries(
  POLAROID_FILES.map((f, i) => [f, ROTATIONS[i] ?? 0])
);

/** Center card reads on top; outer pairs sit lower (matches reference stacking). */
const BASE_Z_BY_INDEX = [8, 12, 16, 12, 8] as const;

/**
 * Row centered on 50%; ~17% between centers ≈ ~25% of card width overlap (tight fan).
 */
const DEFAULT_POSITIONS: Record<string, { x: number; y: number }> =
  Object.fromEntries(
    POLAROID_FILES.map((f, i) => [
      f,
      {
        x: [16, 33, 50, 67, 84][i] ?? 50,
        y: [5, 2, 8, 3, 7][i] ?? 4,
      },
    ])
  );

function publicImageSrc(filename: string): string {
  return `/images/${encodeURIComponent(filename)}`;
}

function captionFromFilename(filename: string): string {
  return filename
    .replace(/\.(jpe?g|jpeg|png|webp|gif)$/i, "")
    .toLowerCase();
}

type DragSession = {
  id: string;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
};

export default function AboutPolaroidStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >(() => ({ ...DEFAULT_POSITIONS }));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragRef = useRef<DragSession | null>(null);

  const clampToContainer = useCallback((x: number, y: number) => {
    return {
      x: Math.min(92, Math.max(8, x)),
      y: Math.min(88, Math.max(0, y)),
    };
  }, []);

  const handlePointerDown = useCallback(
    (filename: string, e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      const container = containerRef.current;
      if (!container) return;
      const p = positions[filename];
      if (!p) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        id: filename,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: p.x,
        startY: p.y,
      };
      setDraggingId(filename);
    },
    [positions]
  );

  const handlePointerMove = useCallback(
    (filename: string, e: React.PointerEvent<HTMLDivElement>) => {
      const session = dragRef.current;
      if (!session || session.id !== filename) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dxPct = ((e.clientX - session.startClientX) / rect.width) * 100;
      const dyPct = ((e.clientY - session.startClientY) / rect.height) * 100;
      const next = clampToContainer(
        session.startX + dxPct,
        session.startY + dyPct
      );
      setPositions((prev) => ({ ...prev, [filename]: next }));
    },
    [clampToContainer]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }
      dragRef.current = null;
      setDraggingId(null);
    },
    []
  );

  return (
    <div className="-mx-2 mb-12 overflow-x-auto overflow-y-visible pb-8 pt-2 md:mx-0 md:mb-16 md:overflow-visible md:pb-12 md:pt-4">
      <div
        ref={containerRef}
        className="relative mx-auto min-h-[260px] w-full max-w-4xl sm:min-h-[280px] md:min-h-[300px]"
        aria-label="Photo collage. Drag photos to move them."
      >
        {POLAROID_FILES.map((filename, i) => {
          const src = publicImageSrc(filename);
          const caption = captionFromFilename(filename);
          const rotate = ROTATION_BY_FILE[filename] ?? 0;
          const pos = positions[filename] ?? DEFAULT_POSITIONS[filename];
          const isDragging = draggingId === filename;
          const z = isDragging ? 50 : BASE_Z_BY_INDEX[i] ?? 10;

          return (
            <div
              key={filename}
              className="absolute w-[min(42vw,11.5rem)] cursor-grab select-none active:cursor-grabbing sm:w-[min(38vw,13rem)] md:w-52 lg:w-56"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                zIndex: z,
                transform: `translate(-50%, 0) rotate(${rotate}deg)`,
                transformOrigin: "center bottom",
                touchAction: "none",
              }}
              onPointerDown={(e) => handlePointerDown(filename, e)}
              onPointerMove={(e) => handlePointerMove(filename, e)}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              aria-grabbed={isDragging}
            >
              <div
                className={`origin-bottom border border-neutral-200/90 bg-white p-2 pb-2 shadow-[0_10px_40px_-6px_rgba(0,0,0,0.18)] transition-shadow duration-200 md:p-2.5 md:pb-2.5 hover:shadow-[0_14px_44px_-4px_rgba(0,0,0,0.22)] ${
                  isDragging ? "opacity-90" : ""
                }`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 pointer-events-none">
                  <Image
                    src={src}
                    alt={caption}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 42vw, 14rem"
                    priority={i < 2}
                    draggable={false}
                  />
                </div>
                <p className="pointer-events-none mt-2.5 px-1 text-center font-mono text-[0.62rem] leading-snug tracking-tight text-neutral-600 sm:text-[0.68rem] md:mt-3 md:text-[0.72rem]">
                  {caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
