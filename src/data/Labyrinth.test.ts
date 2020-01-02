import 'jest';
import { Labyrinth } from './Labyrinth';

describe('labyrinth', () => {
  it('Creates labyrinth', () => {
    const a = new Labyrinth(5, 5);
    expect(a).toBeDefined();
  });
});
