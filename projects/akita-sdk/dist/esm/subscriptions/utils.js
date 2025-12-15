export function hexColorToBytes(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return new Uint8Array([r, g, b]);
}
export function bytesToHexColor(bytes) {
    return '#' + Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
}
export function validateHexColor(hexColor) {
    const normalized = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
    if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
        throw new Error('Invalid hex color. Must be in the format RRGGBB (6 hexadecimal digits, with or without a leading #).');
    }
}
//# sourceMappingURL=utils.js.map