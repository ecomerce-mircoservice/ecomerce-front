import { imgAddress } from "@/lib/config/main";

/**
 * Get the full image URL by prepending the configured image address
 * @param imageUrl - The relative image URL from the backend
 * @returns The full image URL or placeholder
 */
export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return "/placeholder.svg";
  }

  // If it's already a full URL or a local placeholder, return as is
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("/")
  ) {
    return imageUrl;
  }

  // Prepend the image address
  return `${imgAddress}${imageUrl}`;
}
