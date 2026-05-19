/**
 * Content types for the unified Website Content System — TASK-WEBSITE-CONTENT-SURFACES-001
 *
 * API: GET /api/v1/content/website
 * Supports: announcement, campaign, website_banner, release_note
 */

export type LinkType = "none" | "website_url" | "external_url" | "app_route";

export type WebsiteContentType =
  | "announcement"
  | "campaign"
  | "website_banner"
  | "release_note"
  | "help_article";

export interface WebsiteContentLink {
  link_type: LinkType;
  url?: string;
  label?: string;
}

/** A single content item returned by GET /api/v1/content/website */
export interface WebsiteContentItem {
  id: string;
  content_type: WebsiteContentType;
  title: string;
  body: string;
  image_url?: string;
  link: WebsiteContentLink;
  published_at: string;
  expires_at: string;
  priority: number;
  locale: string;
  /** Version / tag shown in release notes (release_note only) */
  version?: string;
}

export interface WebsiteContentResponse {
  items: WebsiteContentItem[];
}

export interface WebsiteContentFilter {
  types?: WebsiteContentType[];
  limit?: number;
}
