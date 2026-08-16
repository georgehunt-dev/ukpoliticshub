import type { MetadataRoute } from "next";

/**
 * Staging must never be indexed. A second copy of this site in Google would
 * compete with the real one for its own search results, which for a site whose
 * whole growth plan is search would be an expensive mistake.
 *
 * Belt and braces: the proxy also sets X-Robots-Tag on every staging response,
 * because a crawler that reaches a page without reading robots.txt still sees
 * the header.
 */
/**
 * Evaluated per request, not baked at build. Otherwise a build that ran
 * without the staging vars would ship an "Allow: /" robots.txt to staging and
 * the check here would be silently useless — which is exactly what happened
 * the first time this was tested.
 */
export const dynamic = "force-dynamic";

const isStaging = () => Boolean(process.env.STAGING_USER && process.env.STAGING_PASSWORD);

export default function robots(): MetadataRoute.Robots {
  if (isStaging()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://ukpoliticshub.com/sitemap.xml",
  };
}
