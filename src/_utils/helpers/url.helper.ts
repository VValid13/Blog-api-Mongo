import type { Url } from '../types/url.type.js';

export function isUrl(value: string): value is Url {
  return /^https?:\/\//.test(value);
}
