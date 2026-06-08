// 1x1 pixel transparent placeholder (5 bytes)
export const BLUR_DATA_URL = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";

// For hero/LCP images that should have priority loading
export function heroImageProps(src: string, alt: string) {
  return {
    src,
    alt,
    placeholder: "blur" as const,
    blurDataURL: BLUR_DATA_URL,
    priority: true,
    fetchPriority: "high" as const,
  };
}

// For general product images
export function productImageProps(src: string, alt: string) {
  return {
    src,
    alt,
    placeholder: "blur" as const,
    blurDataURL: BLUR_DATA_URL,
    loading: "lazy" as const,
  };
}
