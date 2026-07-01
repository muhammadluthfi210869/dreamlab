const BLOG_IMAGE_DIR = "/assets/images/blog";
const ROOT_IMAGE_DIR = "/assets/images";

export function resolveArticleImageSrc(featuredImage?: string | null): string {
  if (!featuredImage) {
    return `${ROOT_IMAGE_DIR}/placeholder.jpg`;
  }

  if (/^https?:\/\//i.test(featuredImage) || featuredImage.startsWith("/")) {
    return featuredImage;
  }

  return `${BLOG_IMAGE_DIR}/${featuredImage}`;
}

export function resolveSiteImageUrl(imageSrc?: string | null): string {
  const resolvedSrc = resolveArticleImageSrc(imageSrc);
  if (/^https?:\/\//i.test(resolvedSrc)) {
    return resolvedSrc;
  }

  return `https://dreamlab.id${resolvedSrc}`;
}
