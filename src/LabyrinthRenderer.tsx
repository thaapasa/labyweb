import { useRef, useMemo, useEffect, useState, type FC } from 'react';
import { Labyrinth } from './data/Labyrinth';
import { Direction } from './data/types';

function renderLabyrinth(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  labyrinth: Labyrinth
) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  const imageData = ctx.createImageData(width, height);
  const pixels = new Uint32Array(imageData.data.buffer);

  pixels.fill(0xffffffff);

  const black = 0xff000000;

  const setPixel = (x: number, y: number) => {
    pixels[y * width + x] = black;
  };

  const lw = labyrinth.width;
  const lh = labyrinth.height;

  // Top border (row 0)
  for (let px = 0; px <= 2 * lw; px++) setPixel(px, 0);
  // Left border (column 0)
  for (let py = 1; py <= 2 * lh; py++) setPixel(0, py);

  for (let x = 0; x < lw; ++x) {
    for (let y = 0; y < lh; ++y) {
      // Corner — always black (a spanning tree cannot have a 4-cell cycle)
      setPixel(2 * x + 2, 2 * y + 2);
      // Wall below on screen = NORTH wall (toward y+1 in labyrinth)
      if (labyrinth.hasWall(x, y, Direction.NORTH)) {
        setPixel(2 * x + 1, 2 * y + 2);
      }
      // Wall right on screen = EAST wall
      if (labyrinth.hasWall(x, y, Direction.EAST)) {
        setPixel(2 * x + 2, 2 * y + 1);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Uses ResizeObserver with devicePixelContentBox to get true physical
 * pixel dimensions. Falls back to contentBoxSize × devicePixelRatio.
 */
function useDevicePixelSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dpr = window.devicePixelRatio || 1;
    console.log(`Display info: devicePixelRatio=${dpr}, screen=${screen.width}×${screen.height}`);

    let usingDevicePixelBox = false;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        let w: number;
        let h: number;
        if (entry.devicePixelContentBoxSize?.length) {
          w = entry.devicePixelContentBoxSize[0].inlineSize;
          h = entry.devicePixelContentBoxSize[0].blockSize;
          if (!usingDevicePixelBox) {
            const cssW = entry.contentBoxSize[0].inlineSize;
            const cssH = entry.contentBoxSize[0].blockSize;
            console.log(
              `Resolution: ${w}×${h} device pixels (CSS: ${cssW}×${cssH}, ` +
                `effective DPR: ${(w / cssW).toFixed(3)}) via devicePixelContentBox`
            );
            usingDevicePixelBox = true;
          }
        } else {
          w = Math.round(entry.contentBoxSize[0].inlineSize * dpr);
          h = Math.round(entry.contentBoxSize[0].blockSize * dpr);
          console.log(
            `Resolution: ${w}×${h} (fallback: CSS × devicePixelRatio=${dpr})`
          );
        }
        setSize({ width: w, height: h });
      }
    });

    try {
      observer.observe(el, { box: 'device-pixel-content-box' });
    } catch {
      console.log('devicePixelContentBox not supported, using content-box fallback');
      observer.observe(el, { box: 'content-box' });
    }

    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export const LabyrinthRenderer: FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { width: cw, height: ch } = useDevicePixelSize(ref);
  const lw = Math.floor((cw - 1) / 2);
  const lh = Math.floor((ch - 1) / 2);

  const labyrinth = useMemo(() => {
    if (lw <= 0 || lh <= 0) return null;
    const t0 = performance.now();
    const l = new Labyrinth(lw, lh);
    console.log(
      `Labyrinth generation: ${(performance.now() - t0).toFixed(1)}ms (${lw}×${lh})`
    );
    return l;
  }, [lw, lh]);

  useEffect(() => {
    const canvas = ref.current;
    if (canvas && labyrinth && cw > 0 && ch > 0) {
      canvas.width = cw;
      canvas.height = ch;
      const t0 = performance.now();
      renderLabyrinth(canvas, cw, ch, labyrinth);
      console.log(
        `Labyrinth render: ${(performance.now() - t0).toFixed(1)}ms (${cw}×${ch})`
      );
    }
  }, [cw, ch, labyrinth]);

  return (
    <>
      <canvas className="labyrinth-canvas" ref={ref} />
      <div className="size-display">{cw} × {ch}</div>
    </>
  );
};
