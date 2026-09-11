/**
 * Parse JWT_EXPIRATION string to seconds number.
 * Supports: "86400" (seconds), "24h" (hours), "3600" (seconds), "1h" (hours)
 */
export function parseExpirationToSeconds(value: string): number {
  // If it's a pure number, treat as seconds
  if (/^\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  // Parse duration strings like "24h", "1h", "30m"
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 86400; // Default 24h
  }
  const num = parseInt(match[1], 10);
  switch (match[2]) {
    case 's': return num;
    case 'm': return num * 60;
    case 'h': return num * 3600;
    case 'd': return num * 86400;
    default: return 86400;
  }
}
