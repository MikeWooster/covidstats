export const nullToZero = (v: number | null): number => {
  if (v === null) {
    return 0;
  }
  return v;
};
