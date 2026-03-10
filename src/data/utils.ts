export function randomInt(maxExclusive: number): number {
  return Math.min(Math.floor(Math.random() * maxExclusive), maxExclusive - 1);
}

type Swappable = { [index: number]: number; length: number };

export function shuffle<T extends Swappable>(l: T): T {
  // Fisher-Yates shuffle
  const size = l.length;
  for (let i = size - 1; i >= 0; i--) {
    const j = randomInt(i + 1);
    const s = l[i];
    l[i] = l[j];
    l[j] = s;
  }
  return l;
}
