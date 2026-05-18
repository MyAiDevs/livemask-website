/**
 * Content API Client — TASK-WEBSITE-CONTENT-SURFACES-001
 *
 * Fetches unified content from GET /api/v1/content/website.
 * Uses publicFetch (no auth needed) for public content surfaces.
 *
 * Content types supported:
 *   - announcement    → announcement band on homepage
 *   - campaign        → CTA banner on pricing/download pages
 *   - website_banner  → hero banner on homepage
 *   - release_note    → latest updates / release notes section
 *
 * Filtering rules:
 *   - Default display window: 1 month from now
 *   - Expired items are excluded
 *   - Items with status draft/archived are excluded
 *   - app_route link_type is not used on Website (fallback to website route or ignore)
 *   - Admin-only fields are never exposed
 */
import type {
  WebsiteContentItem,
  WebsiteContentResponse,
  WebsiteContentFilter,
} from "./content-types";
import { publicFetch } from "./http-client";

const MOCK_MODE =
  import.meta.env.VITE_API_MOCK_MODE !== "false" &&
  import.meta.env.VITE_API_MOCK_MODE !== "0";

const DEFAULT_WINDOW_DAYS = 30; // 1 month default display window

class ContentApiClient {
  private mockMode = MOCK_MODE;

  isMockMode(): boolean {
    return this.mockMode;
  }

  /**
   * Fetch all website content items.
   * Public endpoint — no auth required.
   */
  async getContent(
    filter?: WebsiteContentFilter & { locale?: string },
  ): Promise<WebsiteContentItem[]> {
    const qs = filter?.locale ? `?locale=${encodeURIComponent(filter.locale)}` : "";
    const raw = this.mockMode
      ? await this.mockGetContent()
      : await publicFetch<WebsiteContentResponse>(
          `/api/v1/content/website${qs}`,
          { headers: { Accept: "application/json" } },
        );

    let items = raw.items ?? [];

    // Always filter out expired items
    items = this.filterExpired(items);

    // Filter by content_type if specified
    if (filter?.types && filter.types.length > 0) {
      items = items.filter((item) => filter.types!.includes(item.content_type));
    }

    // Sort by priority (descending) then published_at (descending)
    items.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    // Limit if specified
    if (filter?.limit && filter.limit > 0) {
      items = items.slice(0, filter.limit);
    }

    return items;
  }

  /**
   * Get content items for a specific type.
   */
  async getContentByType(
    contentType: WebsiteContentItem["content_type"],
    limit?: number,
    locale?: string,
  ): Promise<WebsiteContentItem[]> {
    return this.getContent({ types: [contentType], limit, locale });
  }

  /**
   * Get active announcements (for the homepage announcement band).
   */
  async getAnnouncements(limit = 3, locale?: string): Promise<WebsiteContentItem[]> {
    return this.getContentByType("announcement", limit, locale);
  }

  /**
   * Get active banners (for the homepage hero section).
   */
  async getBanners(limit = 3, locale?: string): Promise<WebsiteContentItem[]> {
    return this.getContentByType("website_banner", limit, locale);
  }

  /**
   * Get active campaigns (for pricing / download page CTAs).
   */
  async getCampaigns(limit = 2, locale?: string): Promise<WebsiteContentItem[]> {
    return this.getContentByType("campaign", limit, locale);
  }

  /**
   * Get latest release notes (for latest updates section).
   */
  async getReleaseNotes(limit = 5, locale?: string): Promise<WebsiteContentItem[]> {
    return this.getContentByType("release_note", limit, locale);
  }

  // ── Filtering helpers ──────────────────────────────────────────────

  /**
   * Remove expired items.
   * An item is expired if expires_at is in the past.
   * Items without expires_at are shown for the default window (30 days).
   */
  private filterExpired(items: WebsiteContentItem[]): WebsiteContentItem[] {
    const now = new Date();
    const defaultWindow = new Date(
      now.getTime() - DEFAULT_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    );

    return items.filter((item) => {
      // Check explicit expiry
      if (item.expires_at && new Date(item.expires_at) < now) {
        return false;
      }
      // Check that published_at falls within the default window
      // (items older than 1 month without explicit expiry are excluded)
      if (new Date(item.published_at) < defaultWindow && !item.expires_at) {
        return false;
      }
      return true;
    });
  }

  // ── Mock Data ──────────────────────────────────────────────────────

  private async mockGetContent(): Promise<WebsiteContentResponse> {
    await new Promise((r) => setTimeout(r, 400));

    const now = new Date();
    const futureDate = (daysFromNow: number) =>
      new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000).toISOString();
    const pastDate = (daysAgo: number) =>
      new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    return {
      items: [
        // ── Announcements ─────────────────────────────────────────
        {
          id: "ann_001",
          content_type: "announcement",
          title: "🎉 Summer Sale — 40% Off Premium",
          body: "Limited time offer. Get 40% off all Premium plans. Offer ends June 15.",
          link: {
            link_type: "website_url",
            url: "/pricing",
            label: "Claim Offer →",
          },
          published_at: pastDate(2),
          expires_at: futureDate(27),
          priority: 100,
          locale: "en-US",
        },
        {
          id: "ann_002",
          content_type: "announcement",
          title: "New Servers in Tokyo & Sydney",
          body: "We've added new high-speed servers in Japan and Australia for better APAC coverage.",
          link: {
            link_type: "none",
          },
          published_at: pastDate(5),
          expires_at: futureDate(25),
          priority: 50,
          locale: "en-US",
        },
        {
          id: "ann_003",
          content_type: "announcement",
          title: "iOS App v2.5 is Live",
          body: "Our latest iOS update brings WireGuard support and improved connection stability.",
          link: {
            link_type: "external_url",
            url: "https://apps.apple.com/app/livemask-vpn",
            label: "Download on App Store",
          },
          published_at: pastDate(10),
          expires_at: futureDate(20),
          priority: 75,
          locale: "en-US",
        },

        // ── Website Banners ────────────────────────────────────────
        {
          id: "bnr_001",
          content_type: "website_banner",
          title: "Browse Freely. Stay Protected.",
          body: "Enterprise-grade VPN with military encryption, ultra-fast speeds, and zero logging.",
          image_url: "",
          link: {
            link_type: "website_url",
            url: "/register",
            label: "Get Started Free",
          },
          published_at: pastDate(1),
          expires_at: futureDate(29),
          priority: 100,
          locale: "en-US",
        },
        {
          id: "bnr_002",
          content_type: "website_banner",
          title: "Privacy-First VPN for Everyone",
          body: "Join 10,000+ users who trust LiveMask for their online privacy.",
          link: {
            link_type: "website_url",
            url: "/pricing",
            label: "See Plans",
          },
          published_at: pastDate(3),
          expires_at: futureDate(27),
          priority: 80,
          locale: "en-US",
        },

        // ── Campaigns ──────────────────────────────────────────────
        {
          id: "cmp_001",
          content_type: "campaign",
          title: "Limited Time: 40% Off Premium",
          body: "Use code SUMMER40 at checkout. Annual plans only. Expires June 30.",
          image_url: "",
          link: {
            link_type: "website_url",
            url: "/pricing",
            label: "Get the Deal",
          },
          published_at: pastDate(2),
          expires_at: futureDate(28),
          priority: 100,
          locale: "en-US",
        },
        {
          id: "cmp_002",
          content_type: "campaign",
          title: "Refer a Friend — Earn 1 Month Free",
          body: "Share your referral link. For every friend who subscribes, you both get one month free.",
          link: {
            link_type: "external_url",
            url: "https://livemask.com/referral",
            label: "Learn More",
          },
          published_at: pastDate(7),
          expires_at: futureDate(23),
          priority: 60,
          locale: "en-US",
        },

        // ── Release Notes ──────────────────────────────────────────
        {
          id: "rls_001",
          content_type: "release_note",
          title: "v2.5.0 — WireGuard Support & Performance Boost",
          body: "Added WireGuard protocol support, improved connection stability by 35%, reduced latency on APAC servers.",
          version: "2.5.0",
          link: {
            link_type: "none",
          },
          published_at: pastDate(3),
          expires_at: futureDate(27),
          priority: 100,
          locale: "en-US",
        },
        {
          id: "rls_002",
          content_type: "release_note",
          title: "v2.4.2 — Security Patch",
          body: "Fixed DNS leak issue on Android. Enhanced certificate pinning validation.",
          version: "2.4.2",
          link: {
            link_type: "none",
          },
          published_at: pastDate(14),
          expires_at: futureDate(16),
          priority: 80,
          locale: "en-US",
        },
        {
          id: "rls_003",
          content_type: "release_note",
          title: "v2.4.0 — New UI & Multi-Device Dashboard",
          body: "Completely redesigned user interface. New device management dashboard. Performance improvements across all platforms.",
          version: "2.4.0",
          link: {
            link_type: "none",
          },
          published_at: pastDate(30),
          expires_at: futureDate(0),
          priority: 70,
          locale: "en-US",
        },

        // ── Expired item (should not appear) ───────────────────────
        {
          id: "ann_expired",
          content_type: "announcement",
          title: "Expired Announcement",
          body: "This announcement has expired and should not be displayed.",
          link: { link_type: "none" },
          published_at: pastDate(60),
          expires_at: pastDate(1),
          priority: 0,
          locale: "en-US",
        },
      ],
    };
  }
}

export const contentClient = new ContentApiClient();
