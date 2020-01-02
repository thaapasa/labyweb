import 'jest';
import { Direction } from './types';
import { Walls } from './Walls';

describe('Walls', () => {
  it('Converts indexes properly', () => {
    testWalls(5, 5);
    testWalls(5, 8);
    testWalls(13, 7);
    testWalls(20, 20);
  });
});

function testWalls(width: number, height: number) {
  const walls = new Walls(width, height);
  expect(walls.wallIndex(2, 1, Direction.NORTH)).toBe(
    walls.wallIndex(2, 2, Direction.SOUTH)
  );
  expect(walls.wallIndex(2, 1, Direction.EAST)).toBe(
    walls.wallIndex(3, 1, Direction.WEST)
  );
  expect(walls.wallIndex(1, 2, Direction.WEST)).toBe(
    walls.wallIndex(0, 2, Direction.EAST)
  );
  expect(walls.wallToCoords(walls.wallIndex(1, 2, Direction.EAST))).toEqual({
    coordinate: { x: 1, y: 2 },
    direction: Direction.EAST,
  });
  expect(walls.wallToCoords(walls.wallIndex(1, 2, Direction.WEST))).toEqual({
    coordinate: { x: 0, y: 2 },
    direction: Direction.EAST,
  });
  expect(walls.wallToCoords(walls.wallIndex(1, 2, Direction.NORTH))).toEqual({
    coordinate: { x: 1, y: 2 },
    direction: Direction.NORTH,
  });
  expect(walls.wallToCoords(walls.wallIndex(1, 2, Direction.SOUTH))).toEqual({
    coordinate: { x: 1, y: 1 },
    direction: Direction.NORTH,
  });
}
