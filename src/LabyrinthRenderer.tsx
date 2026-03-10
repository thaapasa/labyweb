import { useRef, useMemo, useEffect, type FC } from 'react';
import { Labyrinth } from './data/Labyrinth';
import { Direction, Size } from './data/types';

function pixelPerfectLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  pixelRatio: number
) {
  ctx.beginPath();
  ctx.lineWidth = pixelRatio;

  const offs = pixelRatio / 2;
  ctx.strokeStyle = '#000000';
  ctx.moveTo(x1 + offs, y1 + offs);
  ctx.lineTo(x2 + offs, y2 + offs);
  ctx.stroke();
}

function renderLabyrinth(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  labyrinth: Labyrinth,
  pixelRatio: number
) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#000000';
  for (let x = 0; x < labyrinth.width; ++x) {
    for (let y = 0; y < labyrinth.height; ++y) {
      const xx = x * 2;
      const yy = y * 2;
      if (labyrinth.hasWall(x, y, Direction.SOUTH)) {
        pixelPerfectLine(ctx, xx, yy + 1, xx + 1, yy + 1, pixelRatio);
      }
      if (labyrinth.hasWall(x, y, Direction.EAST)) {
        pixelPerfectLine(ctx, xx + 1, yy, xx + 1, yy + 1, pixelRatio);
      }
    }
  }
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
      renderLabyrinth(ref.current, cw, ch, labyrinth, pixelRatio);
    }
  }, [cw, ch, labyrinth, pixelRatio]);
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
