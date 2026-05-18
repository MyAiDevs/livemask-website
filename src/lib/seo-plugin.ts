/**
 * Vite plugin to generate sitemap.xml and rss.xml at build time.
 *
 * Uses the dedicated Backend sitemap / RSS API endpoints:
 *   GET /api/v1/content/sitemap
 *   GET /api/v1/content/rss
 *
 * Falls back to build-time mock data when the Backend API is unreachable
 * (e.g. local dev without backend). Production build errors are fatal.
 *
 * Generates hreflang-aware sitemap entries for zh-CN (default) and en-US.
 * RSS defaults to zh-CN (default locale).
 */

import type { Plugin, ResolvedConfig } from "vite";
import fs from "fs";
import path from "path";

// ── Locale configuration ──────────────────────────────────────────────

const SUPPORTED_LOCALES = ["zh-CN", "en-US"] as const;
const DEFAULT_LOCALE = "zh-CN";

// ── API response types (Backend contract) ──────────────────────────

interface ApiSitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  alternates?: { hreflang: string; href: string }[];
}

interface ApiSitemapResponse {
  urls: ApiSitemapUrl[];
}

interface ApiRssItem {
  title: string;
  link: string;
  description: string;
  content_html: string;
  author: string;
  category: string[];
  pub_date: string;
  guid: string;
}

interface ApiRssResponse {
  feed: {
    title: string;
    description: string;
    link: string;
    language: string;
    items: ApiRssItem[];
  };
}

// ── Internal types for XML generation ─────────────────────────────

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

interface SitemapUrlSetEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  /** Alternate language URLs (hreflang) */
  alternates?: { hreflang: string; href: string }[];
}

interface RssItem {
  title: string;
  link: string;
  description: string;
  content_html: string;
  author: string;
  category: string[];
  pub_date: string;
  guid: string;
}

interface RssFeed {
  title: string;
  description: string;
  link: string;
  language: string;
  items: RssItem[];
}

const SITE_URL = "https://livemask.com";
const API_BASE = process.env.VITE_API_BASE_URL || "http://localhost:8000";

// ── Is this a production Vite build? ──────────────────────────────
const IS_PROD_BUILD =
  process.env.NODE_ENV === "production" ||
  process.argv.some((a) => a === "build" || a === "--mode" || a.startsWith("--mode="));

// ── API fetch helpers ─────────────────────────────────────────────

async function fetchFromApi<T>(path: string): Promise<{ ok: true; data: T } | { ok: false }> {
  try {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: false };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false };
  }
}

async function fetchSitemapData(): Promise<ApiSitemapUrl[]> {
  const result = await fetchFromApi<ApiSitemapResponse>("/api/v1/content/sitemap");
  if (result.ok && result.data.urls?.length > 0) {
    console.log(`[seo-plugin] Fetched ${result.data.urls.length} sitemap URLs from Backend API`);
    return result.data.urls;
  }
  console.log("[seo-plugin] Backend sitemap API unreachable, using mock fallback");
  return getMockSitemapUrls();
}

async function fetchRssFeed(): Promise<RssFeed> {
  const result = await fetchFromApi<ApiRssResponse>("/api/v1/content/rss");
  if (result.ok && result.data.feed?.items) {
    console.log(`[seo-plugin] Fetched ${result.data.feed.items.length} RSS items from Backend API`);
    return {
      title: result.data.feed.title,
      description: result.data.feed.description,
      link: result.data.feed.link,
      language: result.data.feed.language,
      items: result.data.feed.items,
    };
  }
  console.log("[seo-plugin] Backend RSS API unreachable, using mock fallback");
  return getMockRssFeed();
}

// ── Localized URL helpers ─────────────────────────────────────────

/**
 * Prefix a path with the given locale.
 */
function localePath(path: string, locale: string): string {
  if (path.startsWith("/zh-CN") || path.startsWith("/en-US")) return path;
  if (path === "/" || path === "") return `/${locale}`;
  // Strip leading slash if present, then add locale
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/**
 * Build a localized sitemap entry with alternates.
 */
function buildLocalizedSitemapEntry(
  path: string,
  lastmod: string,
  changefreq: string,
  priority: number,
): SitemapUrlSetEntry[] {
  return SUPPORTED_LOCALES.map((locale) => {
    const localizedPath = localePath(path, locale);
    const alternates = SUPPORTED_LOCALES
      .filter((l) => l !== locale)
      .map((l) => ({
        hreflang: l,
        href: `${SITE_URL}${localePath(path, l)}`,
      }));

    return {
      loc: `${SITE_URL}${localizedPath}`,
      lastmod,
      changefreq,
      priority,
      alternates: [
        { hreflang: "x-default", href: `${SITE_URL}${localePath(path, DEFAULT_LOCALE)}` },
        ...alternates,
      ],
    };
  });
}

// ── Mock fallback data ────────────────────────────────────────────

function getMockSitemapUrls(): ApiSitemapUrl[] {
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  return [
    { loc: `${SITE_URL}/`, lastmod: now, changefreq: "monthly", priority: 1.0 },
    { loc: `${SITE_URL}/pricing`, lastmod: now, changefreq: "monthly", priority: 0.8 },
    { loc: `${SITE_URL}/download`, lastmod: now, changefreq: "monthly", priority: 0.7 },
    { loc: `${SITE_URL}/security`, lastmod: now, changefreq: "monthly", priority: 0.6 },
    { loc: `${SITE_URL}/faq`, lastmod: now, changefreq: "monthly", priority: 0.5 },
    { loc: `${SITE_URL}/blog`, lastmod: now, changefreq: "daily", priority: 0.9 },
    {
      loc: `${SITE_URL}/blog/what-is-vpn-and-why-you-need-it`,
      lastmod: "2026-04-15T10:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/aes-256-encryption-explained`,
      lastmod: "2026-04-12T14:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/wireguard-vs-openvpn-comparison`,
      lastmod: "2026-03-28T09:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/how-to-stay-safe-on-public-wifi`,
      lastmod: "2026-03-22T16:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/understanding-dns-leaks`,
      lastmod: "2026-03-15T07:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/vpn-for-streaming-geo-restrictions`,
      lastmod: "2026-03-10T09:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/online-privacy-tips-2026`,
      lastmod: "2026-02-25T10:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/what-is-kill-switch-vpn`,
      lastmod: "2026-02-18T08:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/history-of-vpn-technology`,
      lastmod: "2026-02-10T09:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/vpn-vs-proxy-which-is-better`,
      lastmod: "2026-02-01T10:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/data-privacy-laws-worldwide-2026`,
      lastmod: "2026-01-20T11:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/blog/how-to-choose-vpn-provider`,
      lastmod: "2026-01-10T08:00:00Z",
      changefreq: "weekly",
      priority: 0.8,
    },
  ];
}

function getMockRssFeed(): RssFeed {
  const items: ApiRssItem[] = [
    {
      title: "What Is a VPN and Why You Need One in 2026",
      link: `${SITE_URL}/blog/what-is-vpn-and-why-you-need-it`,
      description: "A VPN encrypts your internet connection and hides your IP address.",
      content_html: "",
      author: "Sarah Chen",
      category: ["privacy"],
      pub_date: "Wed, 15 Apr 2026 10:00:00 GMT",
      guid: `${SITE_URL}/blog/what-is-vpn-and-why-you-need-it`,
    },
    {
      title: "AES-256 Encryption: How It Works and Why It Matters",
      link: `${SITE_URL}/blog/aes-256-encryption-explained`,
      description: "AES-256 is the gold standard for data encryption.",
      content_html: "",
      author: "Marcus Johnson",
      category: ["security"],
      pub_date: "Fri, 10 Apr 2026 08:00:00 GMT",
      guid: `${SITE_URL}/blog/aes-256-encryption-explained`,
    },
    {
      title: "WireGuard vs OpenVPN: Which Protocol Is Right for You?",
      link: `${SITE_URL}/blog/wireguard-vs-openvpn-comparison`,
      description: "Both WireGuard and OpenVPN offer strong security.",
      content_html: "",
      author: "Sarah Chen",
      category: ["technology"],
      pub_date: "Sat, 28 Mar 2026 09:00:00 GMT",
      guid: `${SITE_URL}/blog/wireguard-vs-openvpn-comparison`,
    },
    {
      title: "How to Stay Safe on Public Wi-Fi Networks",
      link: `${SITE_URL}/blog/how-to-stay-safe-on-public-wifi`,
      description: "Public Wi-Fi is convenient but risky.",
      content_html: "",
      author: "Emily Torres",
      category: ["guides"],
      pub_date: "Fri, 20 Mar 2026 11:00:00 GMT",
      guid: `${SITE_URL}/blog/how-to-stay-safe-on-public-wifi`,
    },
    {
      title: "Understanding DNS Leaks and How to Prevent Them",
      link: `${SITE_URL}/blog/understanding-dns-leaks`,
      description: "A DNS leak can expose your browsing activity even when using a VPN.",
      content_html: "",
      author: "Marcus Johnson",
      category: ["security"],
      pub_date: "Sun, 15 Mar 2026 07:00:00 GMT",
      guid: `${SITE_URL}/blog/understanding-dns-leaks`,
    },
    {
      title: "Using a VPN to Bypass Geo-Restrictions for Streaming",
      link: `${SITE_URL}/blog/vpn-for-streaming-geo-restrictions`,
      description: "Access your favorite shows and movies from anywhere in the world.",
      content_html: "",
      author: "Sarah Chen",
      category: ["guides"],
      pub_date: "Sun, 08 Mar 2026 12:00:00 GMT",
      guid: `${SITE_URL}/blog/vpn-for-streaming-geo-restrictions`,
    },
    {
      title: "10 Essential Online Privacy Tips for 2026",
      link: `${SITE_URL}/blog/online-privacy-tips-2026`,
      description: "From using a VPN to managing cookies, these ten privacy practices will help.",
      content_html: "",
      author: "Emily Torres",
      category: ["privacy"],
      pub_date: "Wed, 25 Feb 2026 10:00:00 GMT",
      guid: `${SITE_URL}/blog/online-privacy-tips-2026`,
    },
    {
      title: "What Is a VPN Kill Switch and How Does It Work?",
      link: `${SITE_URL}/blog/what-is-kill-switch-vpn`,
      description: "A kill switch is a critical VPN feature.",
      content_html: "",
      author: "Marcus Johnson",
      category: ["security"],
      pub_date: "Wed, 18 Feb 2026 08:00:00 GMT",
      guid: `${SITE_URL}/blog/what-is-kill-switch-vpn`,
    },
    {
      title: "A Brief History of VPN Technology",
      link: `${SITE_URL}/blog/history-of-vpn-technology`,
      description: "From early corporate networks to modern consumer VPNs.",
      content_html: "",
      author: "Sarah Chen",
      category: ["technology"],
      pub_date: "Tue, 10 Feb 2026 09:00:00 GMT",
      guid: `${SITE_URL}/blog/history-of-vpn-technology`,
    },
    {
      title: "VPN vs Proxy: Which Is Better for Your Privacy?",
      link: `${SITE_URL}/blog/vpn-vs-proxy-which-is-better`,
      description: "Both VPNs and proxies can hide your IP address.",
      content_html: "",
      author: "Emily Torres",
      category: ["technology"],
      pub_date: "Sun, 01 Feb 2026 10:00:00 GMT",
      guid: `${SITE_URL}/blog/vpn-vs-proxy-which-is-better`,
    },
    {
      title: "Data Privacy Laws Worldwide: A 2026 Guide",
      link: `${SITE_URL}/blog/data-privacy-laws-worldwide-2026`,
      description: "From GDPR to CPRA and beyond, understand the major data privacy regulations.",
      content_html: "",
      author: "Marcus Johnson",
      category: ["privacy"],
      pub_date: "Tue, 20 Jan 2026 11:00:00 GMT",
      guid: `${SITE_URL}/blog/data-privacy-laws-worldwide-2026`,
    },
    {
      title: "How to Choose a VPN Provider: 7 Factors to Consider",
      link: `${SITE_URL}/blog/how-to-choose-vpn-provider`,
      description: "Not all VPNs are created equal. Learn the seven most important factors.",
      content_html: "",
      author: "Sarah Chen",
      category: ["privacy"],
      pub_date: "Sat, 10 Jan 2026 08:00:00 GMT",
      guid: `${SITE_URL}/blog/how-to-choose-vpn-provider`,
    },
  ];

  return {
    title: "LiveMask Blog",
    description: "Latest articles about VPN technology, online privacy, and security tips from LiveMask.",
    link: `${SITE_URL}/rss.xml`,
    language: "zh-CN",
    items,
  };
}

// ── XML generation ────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemapXml(entries: SitemapUrlSetEntry[]): string {
  const urlElements = entries
    .map((u) => {
      const alternates = u.alternates
        ? u.alternates
            .map(
              (alt) =>
                `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}" />`,
            )
            .join("\n")
        : "";

      return `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
${alternates ? alternates + "\n" : ""}  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlElements}
</urlset>`;
}

function generateRssXml(feed: RssFeed): string {
  const itemElements = feed.items
    .map(
      (item) => `  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${escapeXml(item.link)}</link>
    <description>${escapeXml(item.description)}</description>
    <author>${escapeXml(item.author)}</author>
    <pubDate>${new Date(item.pub_date).toUTCString()}</pubDate>
    <guid>${escapeXml(item.guid)}</guid>
  </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${escapeXml(feed.link)}</link>
    <description>${escapeXml(feed.description)}</description>
    <language>${feed.language}</language>
    <atom:link href="${escapeXml(feed.link)}" rel="self" type="application/rss+xml"/>
${itemElements}
  </channel>
</rss>`;
}

// ── Main generation ───────────────────────────────────────────────

async function generateAllXml(): Promise<{ sitemap: string; rss: string }> {
  const apiSitemapUrls = await fetchSitemapData();
  const rssFeed = await fetchRssFeed();

  // Build localized sitemap entries (each page → zh-CN + en-US with alternates)
  const sitemapEntries: SitemapUrlSetEntry[] = apiSitemapUrls.flatMap((u) => {
    // Parse the path relative to SITE_URL
    const path = u.loc.replace(SITE_URL, "") || "/";

    // Skip already-locale-prefixed URLs from the API
    if (path.startsWith("/zh-CN") || path.startsWith("/en-US")) {
      return {
        loc: u.loc,
        lastmod: u.lastmod,
        changefreq: u.changefreq,
        priority: u.priority,
      };
    }

    return buildLocalizedSitemapEntry(path, u.lastmod, u.changefreq, u.priority);
  }).flat();

  const sitemapXml = generateSitemapXml(sitemapEntries);
  const rssXml = generateRssXml(rssFeed);

  return { sitemap: sitemapXml, rss: rssXml };
}

// ── Vite plugin ───────────────────────────────────────────────────

export function seoPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: "livemask-seo-plugin",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(server) {
      server.middlewares.use("/sitemap.xml", async (_req, res) => {
        const { sitemap } = await generateAllXml();
        res.setHeader("Content-Type", "application/xml");
        res.end(sitemap);
      });
      server.middlewares.use("/rss.xml", async (_req, res) => {
        const { rss } = await generateAllXml();
        res.setHeader("Content-Type", "application/rss+xml");
        res.end(rss);
      });
    },
    async closeBundle() {
      const outDir = config.build.outDir;
      const { sitemap: sitemapXml, rss: rssXml } = await generateAllXml();

      const sitemapPath = path.resolve(outDir, "sitemap.xml");
      fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });
      fs.writeFileSync(sitemapPath, sitemapXml, "utf-8");
      console.log(`✓ Generated sitemap.xml at ${sitemapPath}`);

      const rssPath = path.resolve(outDir, "rss.xml");
      fs.writeFileSync(rssPath, rssXml, "utf-8");
      console.log(`✓ Generated rss.xml at ${rssPath}`);
    },
  };
}
