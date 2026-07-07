/**
 * Resolve a stored image reference to a displayable URL.
 * - Full http(s) URLs are returned as-is.
 * - Otherwise the value is treated as a storage object path in the private
 *   "media" bucket and served through the public passthrough route.
 */
export function mediaUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `/api/public/media/${value}`;
}
