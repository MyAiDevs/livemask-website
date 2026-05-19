/**
 * Content link resolver — TASK-WEBSITE-CONTENT-SURFACES-001
 *
 * Handles link_type rendering rules:
 *   - none           → renders plain content, no link
 *   - website_url    → uses react-router <Link> for internal navigation
 *   - external_url   → uses <a> with rel="noopener noreferrer"
 *   - app_route      → NOT used on Website; falls back to website_url if available, otherwise ignored
 */
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { WebsiteContentLink } from "./content-types";

/** Resolve a content link into { href, external, target } or null */
export function resolveContentLink(
  link: WebsiteContentLink,
): { href: string; external: boolean; target?: string } | null {
  switch (link.link_type) {
    case "none":
      return null;
    case "website_url":
      if (!link.url) return null;
      return { href: link.url, external: false };
    case "external_url":
      if (!link.url) return null;
      return { href: link.url, external: true, target: "_blank" };
    case "app_route": {
      // Website must NOT jump to app internal routes.
      // Fallback to the provided url (which should be a website route) or ignore.
      if (link.url) {
        return { href: link.url, external: false }; // treat as website_url fallback
      }
      return null;
    }
    default:
      return null;
  }
}

/** Render a content link as a React element */
export function ContentLink({
  link,
  children,
  className,
}: {
  link: WebsiteContentLink;
  children: ReactNode;
  className?: string;
}) {
  const resolved = resolveContentLink(link);
  if (!resolved) {
    return <span className={className}>{children}</span>;
  }

  if (resolved.external) {
    return (
      <a
        href={resolved.href}
        target={resolved.target}
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={resolved.href} className={className}>
      {children}
    </Link>
  );
}
