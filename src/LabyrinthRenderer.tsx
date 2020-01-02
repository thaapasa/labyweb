import * as React from 'react';
import styled from 'styled-components';
import { Size } from './data/types';

function renderLabyrinth(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(10, 10, width - 20, height - 20);
}

export const LabyrinthRenderer: React.FC<Size> = ({
  width,
  height,
  pixelRatio,
}) => {
  const ref = React.createRef<HTMLCanvasElement>();
  const cw = width * pixelRatio;
  const ch = height * pixelRatio;
  React.useEffect(() =>
    ref.current ? renderLabyrinth(ref.current, cw, ch) : undefined
  );
  return <Canvas ref={ref} style={{ width, height }} width={cw} height={ch} />;
};

const Canvas = styled.canvas`
  border: none;
  padding: 0;
  margin: 0;
`;
