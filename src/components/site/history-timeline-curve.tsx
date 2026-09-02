"use client";

import { useLayoutEffect, useRef, useState } from "react";

type TimelineItem = { left: string; right: string };

const FIRST_ROW_SIZE = 2;
const OTHER_ROW_SIZE = 4;

function chunkRows(items: TimelineItem[]): TimelineItem[][] {
  if (items.length === 0) return [];
  const rows: TimelineItem[][] = [items.slice(0, FIRST_ROW_SIZE)];
  for (let i = FIRST_ROW_SIZE; i < items.length; i += OTHER_ROW_SIZE) {
    rows.push(items.slice(i, i + OTHER_ROW_SIZE));
  }
  return rows;
}

type Point = { x: number; y: number };

/** Corner radius and edge inset used for the snake path, derived from the container width. */
function getGeometry(containerWidth: number) {
  const radius = Math.max(24, Math.min(64, containerWidth * 0.05));
  const inset = Math.max(radius + 16, containerWidth * 0.035);
  return { radius, inset };
}

/**
 * Builds a single snake-like path: from the start point, drop vertically to
 * each row's y position, then run horizontally edge-to-edge across the
 * container (alternating direction every row), connecting every segment with
 * a large quarter-circle corner instead of a sharp turn.
 */
function buildSnakePath(
  anchor: Point,
  rowYs: number[],
  containerWidth: number,
): string {
  if (rowYs.length === 0) return "";

  const { radius, inset } = getGeometry(containerWidth);

  let d = `M ${anchor.x} ${anchor.y}`;
  let x = anchor.x;
  let y = anchor.y;

  rowYs.forEach((centerY, row) => {
    const goingRight = row % 2 === 0;
    const entrySweep = goingRight ? 0 : 1;
    const exitSweep = 1 - entrySweep;
    const edgeX = goingRight ? containerWidth - inset : inset;
    const r = Math.min(radius, Math.max(8, (centerY - y) / 2));

    // vertical drop into the row
    d += ` L ${x} ${centerY - r}`;
    // curve from vertical into horizontal
    const cornerX = x + (goingRight ? r : -r);
    d += ` A ${r} ${r} 0 0 ${entrySweep} ${cornerX} ${centerY}`;

    // long horizontal run, edge to edge
    const hEndX = edgeX - (goingRight ? r : -r);
    d += ` L ${hEndX} ${centerY}`;

    const isLast = row === rowYs.length - 1;
    if (!isLast) {
      // curve from horizontal back into the next vertical drop
      d += ` A ${r} ${r} 0 0 ${exitSweep} ${edgeX} ${centerY + r}`;
      x = edgeX;
      y = centerY + r;
    }
  });

  return d;
}

export function HistoryTimelineCurve({ items }: { items: TimelineItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef(new Map<number, HTMLDivElement>());
  const [pathD, setPathD] = useState("");

  const rows = chunkRows(items);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const recalc = () => {
      const containerRect = container.getBoundingClientRect();
      const anchorEl = anchorRef.current;
      if (!anchorEl) return;

      const toPoint = (el: HTMLElement): Point => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      };

      // The anchor sits centered under the "History" heading; the line
      // drops from there and runs right, so it stays short instead of
      // trailing across the full width.
      const anchor = toPoint(anchorEl);

      // One y-position per row, taken from that row's first dot (all dots
      // within a row share the same y since they sit in the same grid row).
      const rowYs: number[] = [];
      let rowStartIndex = 0;
      for (const row of rows) {
        const el = dotRefs.current.get(rowStartIndex);
        if (el) rowYs.push(toPoint(el).y);
        rowStartIndex += row.length;
      }

      setPathD(buildSnakePath(anchor, rowYs, containerRect.width));
    };

    recalc();

    const ro = new ResizeObserver(recalc);
    ro.observe(container);

    document.fonts?.ready.then(recalc);

    return () => ro.disconnect();
  }, [items]);

  if (rows.length === 0) return null;

  let globalIndex = 0;

  return (
    <div ref={containerRef} className="relative flex flex-col gap-16 pt-10">
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <path
          d={pathD}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        ref={anchorRef}
        aria-hidden
        className="absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-primary"
      />

      {rows.map((row, r) => {
        const reversed = r % 2 === 1;
        const visualRow = reversed ? [...row].reverse() : row;
        const rowStartIndex = globalIndex;
        globalIndex += row.length;

        return (
          <div
            key={r}
            className={`relative grid ${
              r === 0 ? "ml-auto w-1/2 grid-cols-2" : "grid-cols-4"
            }`}
          >
            {visualRow.map((item, visualIdx) => {
              // Map the visually-reordered item back to its original
              // chronological index within the full items array.
              const dataIdx = reversed ? row.length - 1 - visualIdx : visualIdx;
              const itemIndex = rowStartIndex + dataIdx;

              return (
                <div
                  key={itemIndex}
                  className="relative flex flex-col items-center px-6"
                >
                  <div
                    ref={(el) => {
                      if (el) dotRefs.current.set(itemIndex, el);
                      else dotRefs.current.delete(itemIndex);
                      return undefined;
                    }}
                    className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white ring-[4px] ring-primary/20 shadow-sm"
                  >
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div className="mt-4 text-3xl font-black text-primary text-center drop-shadow-sm">
                    {item.left}
                  </div>
                  <div className="mt-2 max-w-[240px] text-center text-sm font-medium leading-relaxed text-muted-foreground">
                    {item.right}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
