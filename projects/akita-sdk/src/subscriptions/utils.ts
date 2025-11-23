export function hexColorToBytes(hexColor: string): Uint8Array {
  const hex = hexColor.replace('#', '');
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return new Uint8Array([r, g, b]);
}

export function bytesToHexColor(bytes: Uint8Array): string {
  return '#' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}