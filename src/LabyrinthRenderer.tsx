import { useRef, useMemo, useEffect, type FC } from 'react';
import { Labyrinth } from './data/Labyrinth';
import { Direction, Size } from './data/types';

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

export const LabyrinthRenderer: FC<Size> = ({
  width,
  height,
  pixelRatio,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const cw = width * pixelRatio;
  const ch = height * pixelRatio;
  const lw = Math.floor((cw - 1) / 2);
  const lh = Math.floor((ch - 1) / 2);
  const labyrinth = useMemo(() => {
    const t0 = performance.now();
    const l = new Labyrinth(lw, lh);
    console.log(`Labyrinth generation: ${(performance.now() - t0).toFixed(1)}ms (${lw}×${lh})`);
    return l;
  }, [lw, lh]);
  useEffect(() => {
    if (ref.current) {
      const t0 = performance.now();
      renderLabyrinth(ref.current, cw, ch, labyrinth);
      console.log(`Labyrinth render: ${(performance.now() - t0).toFixed(1)}ms (${cw}×${ch})`);
    }
  }, [cw, ch, labyrinth]);
  return (
    <canvas
      className="labyrinth-canvas"
      ref={ref}
      style={{ width, height }}
      width={cw}
      height={ch}
    />
  );
};
