export function convertToBytes(sizeStr: string) {
  const units: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  const regex = /^(\d+(\.\d+)?)\s*(B|KB|MB|GB|TB)$/i;
  const match = sizeStr.match(regex);

  if (!match) {
    throw new Error('Invalid size format');
  }

  const size = parseFloat(match[1]);
  const unit = match[3].toUpperCase();

  if (!units[unit]) {
    throw new Error('Invalid unit');
  }

  return size * units[unit];
}
