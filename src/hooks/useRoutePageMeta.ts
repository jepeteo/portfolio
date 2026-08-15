import { useEnhancedSEO } from "../utils/enhancedSEO"
import {
  absoluteUrl,
  buildRouteJsonLd,
  OG_IMAGE,
  routeMeta,
} from "../config/routeMeta.js"

export const useRoutePageMeta = (path: string) => {
  const meta = routeMeta[path]
  const canonical = absoluteUrl(meta?.canonicalPath ?? path)
  const ogImage = meta?.ogImage ?? OG_IMAGE

  useEnhancedSEO({
    title: meta?.title,
    description: meta?.description,
    canonical,
    ogUrl: canonical,
    ogType: meta?.ogType ?? "website",
    ogDescription: meta?.description,
    ogImage,
    twitterDescription: meta?.description,
    twitterImage: ogImage,
    structuredData: buildRouteJsonLd(path),
  })

  return meta
}
