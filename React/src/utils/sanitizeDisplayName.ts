/**
 * Sanitizes a display name by removing special characters and normalizing unicode
 * @param raw - The raw display name string
 * @returns The sanitized display name
 */
const sanitizeDisplayName = (raw?: string | null): string =>
  (raw ?? '')
    .normalize('NFKC')
    .replaceAll(/[^\p{L}\p{N} .'-]+/gu, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();

export default sanitizeDisplayName;
