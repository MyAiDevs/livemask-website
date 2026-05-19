/**
 * API Client — TASK-WEBSITE-AUTH-HTTP-CLIENT-001
 *
 * Backward-compatible re-export from the dedicated auth-api.ts module.
 *
 * Business API files must not call fetch() directly.
 * Use publicFetch (from http-client.ts) for public endpoints.
 * Use authFetch (from http-client.ts) or authClient for protected endpoints.
 * Only auth-api.ts and http-client.ts may call raw fetch().
 */

export { authClient, getErrorMessage } from "./auth-api";
