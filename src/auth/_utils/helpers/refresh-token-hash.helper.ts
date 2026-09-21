import { createHash, timingSafeEqual } from 'node:crypto';

// SHA-256 et non bcrypt : bcrypt tronque toute entrée au-delà de 72 octets,
// inadapté à un JWT (150+ caractères).
export function hashRefreshToken(refreshToken: string): string {
  return createHash('sha256').update(refreshToken).digest('hex');
}

export function refreshTokenMatches(
  providedToken: string,
  storedHash: string,
): boolean {
  const provided = Buffer.from(hashRefreshToken(providedToken));
  const stored = Buffer.from(storedHash);
  return provided.length === stored.length && timingSafeEqual(provided, stored);
}
