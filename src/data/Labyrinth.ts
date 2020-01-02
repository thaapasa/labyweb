import { Coordinate, coordinateTo} from './types';
import { Walls } from './Walls';
import { shuffle } from './utils';

export class Labyrinth {
  readonly width: number;
  readonly height: number;
  readonly walls: Walls;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.walls = new Walls(width, height);
  }

  private createLabyrinth() {
    const numRooms = this.width * this.height;
    const rooms = new Array<number>(numRooms).fill(-1);
    
    // A bit too much, but so what
    const numWalls = numRooms * 2;
    
    const inRange = (c: Coordinate) => 
      c.x >= 0 && c.x < this.width && c.y >= 0 && c.y < this.height;
    
    const wallId = (c: Coordinate) => c.y * this.width + c.x
  
    const findRoot = (c: number): number => rooms[c] === -1 ? c : findRoot(rooms[c])

    const shortenPath = (c: number, parent: number): void => {
      let cur = c
      while (rooms[cur] !== -1) {
        const old = cur
        rooms[cur] = parent
        cur = rooms[old]
      }
    }

    // Punctures the i'th wall, if the rooms are not already connected
    const punctureWall = (i: number) => {
      const { coordinate: r1, direction: dir } = this.walls.wallToCoords(i)
      const r2 = coordinateTo(r1, dir)

      if (inRange(r1) && inRange(r2)) {
        // Find rooms that the wall connects
        const r1i = wallId(r1)
        const r2i = wallId(r2)
        // Find roots of each room tree
        const r1Parent = findRoot(r1i)
        const r2Parent = findRoot(r2i)
        // If rooms are in different trees, then break the wall & connect room trees
        if (r1Parent !== r2Parent) {
          this.walls.clearWallId(i)
          rooms[r2Parent] = r1Parent
        }
        // Shorten root paths (moves all room tree leafs on search path directly under the root)
        shortenPath(r1i, r1Parent)
        shortenPath(r2i, r1Parent)
      }
    }

    const wallOrder = new Array<number>(numWalls).map((_, i) => i);
    shuffle(wallOrder);
    wallOrder.forEach(punctureWall);
  }

}
