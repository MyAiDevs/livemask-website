/**
 * Release metadata types — TASK-WEBSITE-DOWNLOADS-001
 *
 * Types for Backend App release metadata consumed by the public downloads page.
 * Aligned with APP_RELEASE_DISTRIBUTION_CONTRACT.md.
 */
export type Platform = "android" | "ios" | "macos" | "windows" | "linux";

export interface AppReleaseArtifact {
  artifact_id: string;
  platform: Platform;
  arch: string;
  artifact_type: string;
  /** Backend-issued download URL or proxy path — never a raw storage key. */
  download_url: string;
  size_bytes: number;
  sha256: string;
}

export interface AppReleaseInfo {
  release_id: string;
  version: string;
  build_number: string;
  channel: string;
  title: string;
  /** Localized release notes summary from the Backend. */
  release_notes: string;
  /** Link to the Content System release_note for full changelog. */
  release_notes_url?: string | null;
  published_at: string;
  /** Per-platform artifact for this release. */
  artifacts: AppReleaseArtifact[];
}

/** Response from GET /api/v1/app/releases/latest */
export interface LatestReleasesResponse {
  releases: AppReleaseInfo[];
}

/** Query params for latest releases */
export interface LatestReleasesParams {
  locale?: string;
  platforms?: Platform[];
}
