import * as React from 'react';
import styled from 'styled-components';
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

  const ctxAny = ctx as any;
  const bsr =
    ctxAny.webkitBackingStorePixelRatio ||
    ctxAny.mozBackingStorePixelRatio ||
    ctxAny.msBackingStorePixelRatio ||
    ctxAny.oBackingStorePixelRatio ||
    ctxAny.backingStorePixelRatio ||
    1;
  const dp = pixelRatio / bsr;
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#000000';
  for (let x = 0; x < labyrinth.width; ++x) {
    for (let y = 0; y < labyrinth.height; ++y) {
      const xx = x * 2;
      const yy = y * 2;
      if (labyrinth.hasWall(x, y, Direction.SOUTH)) {
        pixelPerfectLine(ctx, xx, yy + 1, xx + 1, yy + 1, dp);
      }
      if (labyrinth.hasWall(x, y, Direction.EAST)) {
        pixelPerfectLine(ctx, xx + 1, yy, xx + 1, yy + 1, dp);
      }
    }
  }
}

export const LabyrinthRenderer: React.FC<Size> = ({
  width,
  height,
  pixelRatio,
}) => {
  const ref = React.createRef<HTMLCanvasElement>();
  const cw = width * pixelRatio;
  const ch = height * pixelRatio;
  const lw = Math.floor(cw / 2);
  const lh = Math.floor(ch / 2);
  const labyrinth = React.useMemo(() => new Labyrinth(lw, lh), [lw, lh]);
  React.useEffect(() =>
    ref.current
      ? renderLabyrinth(ref.current, cw, ch, labyrinth, pixelRatio)
      : undefined
  );
  return <Canvas ref={ref} style={{ width, height }} width={cw} height={ch} />;
};

const Canvas = styled.canvas`
  border: none;
  padding: 0;
  margin: 0;

  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
`;
