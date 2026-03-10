import { Coordinate, coordinateTo, Direction } from './types';
import { shuffle } from './utils';
import { Walls } from './Walls';

export class Labyrinth {
  readonly width: number;
  readonly height: number;
  readonly walls: Walls;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.walls = new Walls(width, height);
    this.createLabyrinth();
  }

  hasWall = (x: number, y: number, dir: Direction) =>
    this.walls.hasWall(x, y, dir);

  private createLabyrinth() {
    const numRooms = this.width * this.height;
    const parent = new Int32Array(numRooms).fill(-1);
    const rank = new Uint8Array(numRooms);

    const numWalls = numRooms * 2;

    const inRange = (c: Coordinate) =>
      c.x >= 0 && c.x < this.width && c.y >= 0 && c.y < this.height;

    const roomId = (c: Coordinate) => c.y * this.width + c.x;

    const find = (x: number): number => {
      let root = x;
      while (parent[root] !== -1) {
        root = parent[root];
      }
      // Path compression
      while (parent[x] !== -1) {
        const next = parent[x];
        parent[x] = root;
        x = next;
      }
      return root;
    };

    const punctureWall = (i: number) => {
      const { coordinate: r1, direction: dir } = this.walls.wallToCoords(i);
      const r2 = coordinateTo(r1, dir);

      if (inRange(r1) && inRange(r2)) {
        const root1 = find(roomId(r1));
        const root2 = find(roomId(r2));
        if (root1 !== root2) {
          this.walls.clearWallId(i);
          // Union by rank
          if (rank[root1] < rank[root2]) {
            parent[root1] = root2;
          } else if (rank[root1] > rank[root2]) {
            parent[root2] = root1;
          } else {
            parent[root2] = root1;
            rank[root1]++;
          }
        }
      }
    };

    const wallOrder = new Uint32Array(numWalls);
    for (let i = 0; i < numWalls; i++) {
      wallOrder[i] = i;
    }
    shuffle(wallOrder);
    wallOrder.forEach(punctureWall);
  }
}
