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

  // 0xFFFFFFFF = white (ABGR on little-endian)
  pixels.fill(0xffffffff);

  // 0xFF000000 = opaque black (ABGR on little-endian)
  const black = 0xff000000;

  const setPixel = (x: number, y: number) => {
    pixels[y * width + x] = black;
  };

  for (let x = 0; x < labyrinth.width; ++x) {
    for (let y = 0; y < labyrinth.height; ++y) {
      const xx = x * 2;
      const yy = y * 2;
      if (labyrinth.hasWall(x, y, Direction.SOUTH)) {
        setPixel(xx, yy + 1);
        setPixel(xx + 1, yy + 1);
      }
      if (labyrinth.hasWall(x, y, Direction.EAST)) {
        setPixel(xx + 1, yy);
        setPixel(xx + 1, yy + 1);
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
  const lw = Math.floor(cw / 2);
  const lh = Math.floor(ch / 2);
  const labyrinth = useMemo(() => new Labyrinth(lw, lh), [lw, lh]);
  useEffect(() => {
    if (ref.current) {
      renderLabyrinth(ref.current, cw, ch, labyrinth);
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
