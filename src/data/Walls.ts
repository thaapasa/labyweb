import { Coordinate, Direction } from './types';

export class Walls {
  readonly width: number;
  readonly height: number;
  private walls: boolean[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    const numWalls = width * height * 2;
    this.walls = new Array<boolean>(numWalls).fill(true);
  }

  hasWall = (x: number, y: number, dir: Direction): boolean => {
    switch (dir) {
      case Direction.NORTH:
        if (x < 0 || x >= this.width || y < 0 || y >= this.height - 1) {
          return true;
        }
        break;
      case Direction.SOUTH:
        if (x < 0 || x >= this.width || y < 1 || y >= this.height) {
          return true;
        }
        break;
      case Direction.EAST:
        if (x < 0 || x >= this.width - 1 || y < 0 || y >= this.height) {
          return true;
        }
        break;
      case Direction.WEST:
        if (x < 1 || x >= this.width || y < 0 || y >= this.height) {
          return true;
        }
        break;
    }
    return this.walls[this.wallIndex(x, y, dir)];
  };

  setWall = (x: number, y: number, dir: Direction) => {
    this.walls[this.wallIndex(x, y, dir)] = true;
  };

  clearWall = (x: number, y: number, dir: Direction) => {
    this.walls[this.wallIndex(x, y, dir)] = false;
  };

  clearWallId = (id: number) => {
    this.walls[id] = false;
  };

  wallIndex = (x: number, y: number, dir: Direction): number => {
    const index = (x + y * this.width) * 2;
    switch (dir) {
      case Direction.NORTH:
        return index;
      case Direction.EAST:
        return index + 1;
      case Direction.SOUTH:
        return this.wallIndex(x, y - 1, Direction.NORTH);
      case Direction.WEST:
        return this.wallIndex(x - 1, y, Direction.EAST);
    }
  };

  indexToCoordinate = (index: number): Coordinate => {
    const y = Math.floor(index / this.width);
    return {
      x: index - y * this.width,
      y,
    };
  };

  wallToCoords = (
    wallId: number
  ): { coordinate: Coordinate; direction: Direction } => ({
    coordinate: this.indexToCoordinate(Math.floor(wallId / 2)),
    direction: wallId % 2 === 0 ? Direction.NORTH : Direction.EAST,
  });
}
