export interface Size {
  width: number;
  height: number;
  pixelRatio: number;
}

export const Size0: Size = {
  width: 0,
  height: 0,
  pixelRatio: 1,
};

export enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export interface Coordinate {
  x: number;
  y: number;
}

export function coordinateTo(from: Coordinate, to: Direction): Coordinate {
  switch (to) {
    case Direction.NORTH:
      return { x: from.x, y: from.y + 1 };
    case Direction.SOUTH:
      return { x: from.x, y: from.y - 1 };
    case Direction.EAST:
      return { x: from.x + 1, y: from.y };
    case Direction.WEST:
      return { x: from.x - 1, y: from.y };
    default:
      return from;
  }
}
