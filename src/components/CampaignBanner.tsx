/**
 * CampaignBanner — TASK-WEBSITE-CONTENT-SURFACES-001
 *
 * Renders active campaign CTAs for pricing and download pages.
 *
 * Rules:
 *   - Shows only the highest-priority active campaign (or none)
 *   - app_route link_type → ignored (falls back to website_url or none)
 *   - external_url → rendered with rel="noopener noreferrer"
 *   - Admin-only fields never displayed
 */
import { Gift, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentLink } from "@/lib/content-link";
import type { WebsiteContentItem } from "@/lib/content-types";

interface CampaignBannerProps {
  campaigns: WebsiteContentItem[];
  isLoading?: boolean;
}

export function CampaignBanner({
  campaigns,
  isLoading = false,
}: CampaignBannerProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-600/5 to-transparent p-6 animate-pulse">
        <div className="h-5 w-48 bg-teal-500/20 rounded mb-3" />
        <div className="h-4 w-96 bg-teal-500/10 rounded mb-4" />
        <div className="h-9 w-32 bg-teal-500/20 rounded" />
      </div>
    );
  }

  // Show the highest priority active campaign, if any
  const campaign = campaigns.length > 0 ? campaigns[0] : null;
  if (!campaign) return null;

  const hasLink = campaign.link.link_type !== "none" && campaign.link.label;

  return (
    <div className="rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-600/5 via-teal-500/5 to-transparent p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-teal-500/10 p-2.5 shrink-0">
          <Gift className="h-5 w-5 text-teal-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-[10px]"
            >
              Limited Offer
            </Badge>
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {campaign.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            {campaign.body}
          </p>
          {hasLink && (
            <ContentLink
              link={campaign.link}
              className="inline-block"
            >
              <Button
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8"
              >
                {campaign.link.label}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </ContentLink>
          )}
        </div>
      </div>
    </div>
  );
}
