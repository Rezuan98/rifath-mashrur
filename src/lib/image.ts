/**
 * True when a stored image value is something `next/image` can actually
 * render. Admin fields accept free text (a pasted path, a half-typed URL, or
 * legacy junk from before uploads existed), and next/image THROWS on a value
 * it can't parse — taking the whole page down. Callers fall back to a
 * placeholder when this returns false.
 */
export function isRenderableImage(src: string | null | undefined): src is string {
  if (!src) return false;
  const v = src.trim();
  if (!v) return false;
  return v.startsWith("https://") || v.startsWith("http://") || v.startsWith("/");
}
