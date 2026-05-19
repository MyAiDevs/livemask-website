/**
 * ReleaseNotes — TASK-WEBSITE-CONTENT-SURFACES-001
 *
 * Renders latest release notes / version updates from the Content System.
 *
 * Rules:
 *   - Shows release_note items sorted by priority then published_at (desc)
 *   - Each note shows version badge, title, and body
 *   - app_route link_type → ignored (no App deep-link on Website)
 *   - external_url → rendered with rel="noopener noreferrer"
 *   - Admin-only fields never displayed
 */
import { Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentLink } from "@/lib/content-link";
import type { WebsiteContentItem } from "@/lib/content-types";

interface ReleaseNotesProps {
  releaseNotes: WebsiteContentItem[];
  isLoading?: boolean;
}

export function ReleaseNotes({
  releaseNotes,
  isLoading = false,
}: ReleaseNotesProps) {
  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-7 w-48 bg-foreground/10 rounded animate-pulse mb-6" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-border/50 p-4 mb-3 animate-pulse"
            >
              <div className="h-4 w-16 bg-foreground/10 rounded mb-2" />
              <div className="h-5 w-3/4 bg-foreground/10 rounded mb-2" />
              <div className="h-4 w-full bg-foreground/10 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (releaseNotes.length === 0) return null;

  return (
    <section className="py-16 px-4 border-t border-border/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Megaphone className="h-5 w-5 text-teal-500" />
          <h2 className="text-xl font-bold text-foreground">Latest Updates</h2>
        </div>
        <div className="space-y-3">
          {releaseNotes.map((note) => (
            <Card
              key={note.id}
              className="bg-card border-border hover:border-teal-500/20 transition-colors"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {note.version && (
                    <Badge
                      variant="outline"
                      className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-[10px]"
                    >
                      v{note.version}
                    </Badge>
                  )}
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {note.title}
                  </CardTitle>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {formatDate(note.published_at)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {note.body}
                </p>
                {note.link.link_type !== "none" && note.link.label && (
                  <ContentLink
                    link={note.link}
                    className="inline-block mt-2 text-xs text-teal-500 hover:text-teal-400 font-medium transition-colors"
                  >
                    {note.link.label}
                  </ContentLink>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
