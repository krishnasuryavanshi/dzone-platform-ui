export const capitalize = (str: string) => {
  if (!str) {
    return '';
  }
  return str
    .toLowerCase()
    .replace(/(?:^|\s|[-_])\S/g, (match) => match.toUpperCase())
    .replace(/[-_]/g, ' ');
};
