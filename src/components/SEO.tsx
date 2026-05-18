import { Helmet } from "react-helmet-async";
import { SITE_URL, localePath, stripLocaleFromPath } from "@/lib/locale";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  robots?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Set to true to skip hreflang (e.g. for error pages). */
  noHreflang?: boolean;
}

const SITE_NAME = "LiveMask";
const DEFAULT_OG_IMAGE = "https://livemask.com/og-image.jpg";

export function SEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  robots = "index,follow",
  publishedTime,
  modifiedTime,
  author,
  jsonLd,
  noHreflang,
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const finalOgTitle = ogTitle || title;
  const finalOgDesc = ogDescription || description;
  const finalOgImage = ogImage || DEFAULT_OG_IMAGE;
  const finalCanonical = canonical || `${SITE_URL}${window.location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={finalCanonical} />

      {/* hreflang — auto-generated from current path */}
      {!noHreflang && renderHreflangLinks(window.location.pathname)}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDesc} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalCanonical} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDesc} />
      <meta name="twitter:image" content={finalOgImage} />

      <meta name="robots" content={robots} />

      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {author && <meta name="author" content={author} />}

      {jsonLd && Array.isArray(jsonLd) ? (
        jsonLd.map((item, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(item, null, 2)}
          </script>
        ))
      ) : jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd, null, 2)}
        </script>
      ) : null}
    </Helmet>
  );
}

/**
 * Render <link> elements for hreflang alternates.
 * Generates:
 *   - x-default → zh-CN (default locale)
 *   - zh-CN
 *   - en-US
 */
function renderHreflangLinks(pathname: string) {
  const stripped = stripLocaleFromPath(pathname);
  const zhUrl = `${SITE_URL}${localePath(stripped, "zh-CN")}`;
  const enUrl = `${SITE_URL}${localePath(stripped, "en-US")}`;

  return (
    <>
      <link rel="alternate" href={zhUrl} hrefLang="x-default" />
      <link rel="alternate" href={zhUrl} hrefLang="zh-CN" />
      <link rel="alternate" href={enUrl} hrefLang="en-US" />
    </>
  );
}

export function createBlogPostingJsonLd(article: {
  title: string;
  description: string;
  cover_image_url: string;
  author_name: string;
  published_at: string;
  updated_at: string;
  canonical_url: string;
  inLanguage?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: article.cover_image_url,
    author: {
      "@type": "Person",
      name: article.author_name,
    },
    datePublished: article.published_at,
    dateModified: article.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.canonical_url,
    },
    ...(article.inLanguage ? { inLanguage: article.inLanguage } : {}),
  };
}

export function createBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export { SITE_NAME, SITE_URL };
