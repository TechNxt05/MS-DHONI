/** Small, dependency-free input guards for the public write endpoints. */

export function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  // Collapse whitespace and strip control characters.
  const text = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
  if (!text || text.length > max) return null;
  return text;
}

export function cleanNumber(value: unknown, min: number, max: number): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
