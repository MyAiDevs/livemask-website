/**
 * Content System React Query hooks — TASK-WEBSITE-CONTENT-SURFACES-001
 *
 * Provides useQuery hooks for fetching website content items.
 * All hooks use publicFetch (no auth required).
 */
import { useQuery } from "@tanstack/react-query";
import { contentClient } from "@/lib/content-api";
import type { WebsiteContentItem } from "@/lib/content-types";
import { useLocale } from "@/lib/locale";

/** Fetch all active website content items */
export function useContent() {
  const { locale } = useLocale();
  return useQuery({
    queryKey: ["website-content", locale],
    queryFn: () => contentClient.getContent({ locale }),
    staleTime: 5 * 60_000, // 5 min
    refetchOnWindowFocus: false,
  });
}

/** Fetch active announcements */
export function useAnnouncements() {
  const { data, ...rest } = useContent();
  const announcements = (data ?? []).filter(
    (item) => item.content_type === "announcement",
  );
  return { data: announcements, ...rest };
}

/** Fetch active website banners */
export function useBanners() {
  const { data, ...rest } = useContent();
  const banners = (data ?? []).filter(
    (item) => item.content_type === "website_banner",
  );
  return { data: banners, ...rest };
}

/** Fetch active campaigns */
export function useCampaigns() {
  const { data, ...rest } = useContent();
  const campaigns = (data ?? []).filter(
    (item) => item.content_type === "campaign",
  );
  return { data: campaigns, ...rest };
}

/** Fetch latest release notes */
export function useReleaseNotes() {
  const { data, ...rest } = useContent();
  const notes = (data ?? []).filter(
    (item) => item.content_type === "release_note",
  );
  return { data: notes, ...rest };
}

/** Fetch help articles */
export function useHelpArticles() {
  const { data, ...rest } = useContent();
  const articles = (data ?? []).filter(
    (item) => item.content_type === "help_article",
  );
  return { data: articles, ...rest };
}

export type { WebsiteContentItem };
