export const pad = (num: string) => {
  const index = Number(num) + 1;
  return index.toString().padStart(6, '0');
};
