/**
 * AnnouncementBand — TASK-WEBSITE-CONTENT-SURFACES-001
 *
 * Renders active announcements from the Content System as a top banner
 * on the homepage. Each announcement supports:
 *   - Title + body text
 *   - Optional CTA link (website_url or external_url)
 *   - LocalStorage-based dismiss (one-time close per announcement id)
 *
 * app_route link_type → ignored (no App deep-link on Website)
 * external_url → rendered with rel="noopener noreferrer"
 * Admin-only fields are never stored in the payload.
 */
import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ContentLink } from "@/lib/content-link";
import type { WebsiteContentItem } from "@/lib/content-types";

const DISMISSED_KEY = "livemask_announcement_dismissed";

interface AnnouncementBandProps {
  announcements: WebsiteContentItem[];
  isLoading?: boolean;
}

export function AnnouncementBand({
  announcements,
  isLoading = false,
}: AnnouncementBandProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => {
    try {
      const stored = sessionStorage.getItem(DISMISSED_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Filter out dismissed announcements
  const active = announcements.filter((a) => !dismissedIds.has(a.id));

  // Reset index if active list shrinks
  useEffect(() => {
    if (currentIndex >= active.length && active.length > 0) {
      setCurrentIndex(0);
    }
  }, [active.length, currentIndex]);

  const dismiss = useCallback((id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % active.length);
  }, [active.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + active.length) % active.length);
  }, [active.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-teal-600/10 border-b border-teal-500/10">
        <div className="max-w-6xl mx-auto px-4 py-2 animate-pulse">
          <div className="h-4 w-3/4 bg-teal-500/20 rounded" />
        </div>
      </div>
    );
  }

  // No active announcements
  if (active.length === 0) return null;

  const current = active[currentIndex];

  return (
    <div className="bg-gradient-to-r from-teal-600/10 via-teal-500/5 to-teal-600/10 border-b border-teal-500/10">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
        {/* Navigation arrows when multiple */}
        {active.length > 1 && (
          <button
            onClick={goPrev}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Content */}
        <div className="flex-1 flex items-center gap-2 text-xs min-w-0">
          <span className="font-medium text-teal-500 shrink-0">
            {current.title}
          </span>
          <span className="text-muted-foreground truncate hidden sm:inline">
            {current.body}
          </span>
          {current.link.link_type !== "none" && (
            <ContentLink
              link={current.link}
              className="shrink-0 text-teal-500 hover:text-teal-400 font-medium transition-colors"
            >
              {current.link.label || "Learn More"}
            </ContentLink>
          )}
        </div>

        {/* Navigation arrows when multiple */}
        {active.length > 1 && (
          <button
            onClick={goNext}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Dismiss */}
        {active.length > 0 && (
          <button
            onClick={() => dismiss(current.id)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
