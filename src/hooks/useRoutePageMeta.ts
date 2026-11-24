import { useEnhancedSEO } from "../utils/enhancedSEO"
import {
  absoluteUrl,
  buildRouteJsonLd,
  OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  routeMeta,
} from "../config/routeMeta.js"

export const useRoutePageMeta = (path: string) => {
  const meta = routeMeta[path]
  const canonical = absoluteUrl(meta?.canonicalPath ?? path)
  const ogImage = meta?.ogImage ?? OG_IMAGE
  const ogImageWidth =
    meta?.ogImageWidth ?? (ogImage === OG_IMAGE ? OG_IMAGE_WIDTH : undefined)
  const ogImageHeight =
    meta?.ogImageHeight ?? (ogImage === OG_IMAGE ? OG_IMAGE_HEIGHT : undefined)

  useEnhancedSEO({
    title: meta?.title,
    description: meta?.description,
    canonical,
    ogUrl: canonical,
    ogType: meta?.ogType ?? "website",
    ogDescription: meta?.description,
    ogImage,
    ogImageWidth,
    ogImageHeight,
    twitterDescription: meta?.description,
    twitterImage: ogImage,
    structuredData: buildRouteJsonLd(path),
  })

  return meta
}
