/**
 * Releases API Client — TASK-WEBSITE-DOWNLOADS-001
 *
 * Fetches latest stable App release metadata for the public downloads page.
 * Uses publicFetch (no auth needed).
 *
 * Aligned with APP_RELEASE_DISTRIBUTION_CONTRACT.md Section 14:
 * - Public downloads page shows latest stable release per platform
 * - Download links use Backend public download endpoint
 * - Website must not hardcode release artifact URLs
 * - No signed URL query/storage key exposed
 */
import type {
  AppReleaseInfo,
  AppReleaseArtifact,
  LatestReleasesResponse,
  Platform,
} from "./releases-types";
import { publicFetch } from "./http-client";

const MOCK_MODE =
  import.meta.env.VITE_API_MOCK_MODE !== "false" &&
  import.meta.env.VITE_API_MOCK_MODE !== "0";

class ReleasesApiClient {
  private mockMode = MOCK_MODE;

  isMockMode(): boolean {
    return this.mockMode;
  }

  /**
   * Fetch the latest stable releases, one per platform.
   *
   * GET /api/v1/app/releases/latest
   */
  async getLatestReleases(
    locale?: string,
    platforms?: Platform[],
  ): Promise<AppReleaseInfo[]> {
    if (this.mockMode) {
      return this.mockGetLatestReleases(locale, platforms);
    }

    const qs = new URLSearchParams();
    if (locale) qs.set("locale", locale);
    if (platforms && platforms.length > 0) {
      qs.set("platforms", platforms.join(","));
    }
    const query = qs.toString();

    const res = await publicFetch<LatestReleasesResponse>(
      `/api/v1/app/releases/latest${query ? `?${query}` : ""}`,
      { headers: { Accept: "application/json" } },
    );

    return res.releases ?? [];
  }

  // ── Mock Data ──────────────────────────────────────────────────────

  private async mockGetLatestReleases(
    _locale?: string,
    platforms?: Platform[],
  ): Promise<AppReleaseInfo[]> {
    await new Promise((r) => setTimeout(r, 300));

    const allReleases: AppReleaseInfo[] = [
      {
        release_id: "rel_android_001",
        version: "2.5.0",
        build_number: "20500",
        channel: "stable",
        title: "LiveMask 2.5.0 for Android",
        release_notes:
          "Added WireGuard protocol support, improved connection stability by 35%, reduced latency on APAC servers.",
        release_notes_url: null,
        published_at: "2026-05-10T10:00:00Z",
        artifacts: [
          {
            artifact_id: "art_android_001",
            platform: "android",
            arch: "arm64",
            artifact_type: "apk",
            download_url:
              "/api/v1/app/releases/artifacts/art_android_001/download",
            size_bytes: 45_678_912,
            sha256:
              "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
          },
        ],
      },
      {
        release_id: "rel_ios_001",
        version: "2.5.0",
        build_number: "20500",
        channel: "stable",
        title: "LiveMask 2.5.0 for iOS",
        release_notes:
          "Added WireGuard protocol support, improved connection stability, new UI for device management.",
        release_notes_url: null,
        published_at: "2026-05-09T10:00:00Z",
        artifacts: [
          {
            artifact_id: "art_ios_001",
            platform: "ios",
            arch: "arm64",
            artifact_type: "ipa",
            download_url: "https://apps.apple.com/app/livemask-vpn/id123456789",
            size_bytes: 32_123_456,
            sha256:
              "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
          },
        ],
      },
      {
        release_id: "rel_macos_001",
        version: "2.5.0",
        build_number: "20500",
        channel: "stable",
        title: "LiveMask 2.5.0 for macOS",
        release_notes:
          "Added WireGuard protocol support, improved connection stability, new device management dashboard.",
        release_notes_url: null,
        published_at: "2026-05-10T10:00:00Z",
        artifacts: [
          {
            artifact_id: "art_macos_001",
            platform: "macos",
            arch: "universal",
            artifact_type: "dmg",
            download_url:
              "/api/v1/app/releases/artifacts/art_macos_001/download",
            size_bytes: 125_829_120,
            sha256:
              "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
          },
        ],
      },
      {
        release_id: "rel_windows_001",
        version: "2.5.0",
        build_number: "20500",
        channel: "stable",
        title: "LiveMask 2.5.0 for Windows",
        release_notes:
          "Added WireGuard protocol support, improved connection stability, new UI for settings.",
        release_notes_url: null,
        published_at: "2026-05-10T10:00:00Z",
        artifacts: [
          {
            artifact_id: "art_windows_001",
            platform: "windows",
            arch: "x64",
            artifact_type: "exe",
            download_url:
              "/api/v1/app/releases/artifacts/art_windows_001/download",
            size_bytes: 98_234_123,
            sha256:
              "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
          },
        ],
      },
      {
        release_id: "rel_linux_001",
        version: "2.5.0",
        build_number: "20500",
        channel: "stable",
        title: "LiveMask 2.5.0 for Linux",
        release_notes:
          "Added WireGuard protocol support, improved connection stability, AppImage and deb packages.",
        release_notes_url: null,
        published_at: "2026-05-10T10:00:00Z",
        artifacts: [
          {
            artifact_id: "art_linux_001",
            platform: "linux",
            arch: "x64",
            artifact_type: "AppImage",
            download_url:
              "/api/v1/app/releases/artifacts/art_linux_001/download",
            size_bytes: 87_654_321,
            sha256:
              "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
          },
        ],
      },
    ];

    if (platforms && platforms.length > 0) {
      return allReleases.filter((r) =>
        r.artifacts.some((a) => platforms.includes(a.platform)),
      );
    }

    return allReleases;
  }
}

export const releasesClient = new ReleasesApiClient();
