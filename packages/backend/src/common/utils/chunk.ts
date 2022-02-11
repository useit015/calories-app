export function chunk<T = any>(arr: T[], size: number) {
  return arr.reduce<T[][]>(
    (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
    [],
  );
}
