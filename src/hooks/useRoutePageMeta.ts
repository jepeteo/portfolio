import { useEnhancedSEO } from "../utils/enhancedSEO"
import { absoluteUrl, buildRouteJsonLd, routeMeta } from "../config/routeMeta.js"

export const useRoutePageMeta = (path: string) => {
  const meta = routeMeta[path]
  const canonical = absoluteUrl(meta?.canonicalPath ?? path)

  useEnhancedSEO({
    title: meta?.title,
    description: meta?.description,
    canonical,
    ogUrl: canonical,
    ogType: meta?.ogType ?? "website",
    structuredData: buildRouteJsonLd(path),
  })

  return meta
}
