// URL fragment / path segment used for city anchors and country routes
export function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}
