export function swap<T>(a: T[], i: number, j: number): T[] {
  const s = a[i];
  a[i] = a[j];
  a[j] = s;
  return a;
}

export function randomInt(maxExclusive: number): number {
  return Math.min(Math.floor(Math.random() * maxExclusive), maxExclusive - 1);
}

export function shuffle<T>(l: T[]): T[] {
  // Fisher-Yates shuffle
  const size = l.length;
  for (let i = size - 1; i >= 0; i--) {
    swap(l, i, randomInt(i + 1));
  }
  return l;
}

