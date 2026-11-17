const specialWords = [
  'MAHENDRA SINGH DHONI', 'MS DHONI', 'MAHENDRA', 'DHONI', 'MSD', 'MAHI', 'THALA', 'CAPTAIN', 'WICKET KEEPER', 'WK',
  'FINISHER', 'CSK', 'RPS', 'SURESH RAINA', 'RAINA', 'JADEJA', 'ASHWIN', 'CHENNAI', 'RANCHI', 'SEVEN',
];

/** Returns why the input is "Thala for a reason", or null if even we can't find one. */
export function thalaReason(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  const upper = value.toUpperCase();

  const word = specialWords.find((w) => new RegExp(`(^|[^A-Z])${w}([^A-Z]|$)`).test(upper));
  if (word) return `“${word.toLowerCase()}” leads straight back to No. 7.`;

  const digits = (value.match(/\d/g) ?? []).map(Number);
  const isNumber = /^\d+$/.test(value);

  if (isNumber) {
    const n = Number(value);
    if (n !== 0 && n % 7 === 0) return `${value} = 7 × ${n / 7}.`;
  }
  if (digits.length > 1) {
    const sum = digits.reduce((a, b) => a + b, 0);
    if (sum === 7) return `${digits.join(' + ')} = 7.`;
    const product = digits.reduce((a, b) => a * b, 1);
    if (product === 7) return `${digits.join(' × ')} = 7.`;
    if (digits.length === 2 && Math.abs(digits[0] - digits[1]) === 7) return `${Math.max(...digits)} − ${Math.min(...digits)} = 7.`;
  }
  if (value.replace(/\s/g, '').length === 7) return `${value.replace(/\s/g, '').length} characters. You know what that means.`;
  const words = value.split(/\s+/).length;
  if (words === 7) return 'Seven words. Coincidence? No.';
  if (digits.includes(7)) return 'There’s a 7 hiding in there.';
  return null;
}
