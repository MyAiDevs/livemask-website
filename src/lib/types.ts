// Auth Types — matching auth-rbac.md contract

export type ClientType = "app" | "website" | "admin";

export type UserStatus = "active" | "disabled" | "suspended";

export type SubscriptionStatus = "none" | "active" | "expired" | "paused";

export interface User {
  user_id: string;
  email: string;
  display_name?: string;
  roles: string[];
  permissions: string[];
  subscription_status: SubscriptionStatus;
  created_at: string;
}

export interface AdminMeResponse extends User {
  admin_namespaces: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  client_type: ClientType;
  mfa_code?: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface RegisterRequest {
  request_id: string;
  email: string;
  password: string;
  display_name?: string;
  referral_code?: string;
  client_type: ClientType;
}

export interface RegisterResponse {
  user_id: string;
  email_verification_required: boolean;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface RefreshRequest {
  refresh_token?: string;
  client_type: ClientType;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

// Error codes from contract
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  REFRESH_REVOKED: "AUTH_REFRESH_REVOKED",
  EMAIL_NOT_VERIFIED: "AUTH_EMAIL_NOT_VERIFIED",
  MFA_REQUIRED: "AUTH_MFA_REQUIRED",
  FORBIDDEN: "AUTH_FORBIDDEN",
  ROUTE_NAMESPACE_DENIED: "AUTH_ROUTE_NAMESPACE_DENIED",
  RATE_LIMITED: "AUTH_RATE_LIMITED",
  WEAK_PASSWORD: "AUTH_WEAK_PASSWORD",
  DUPLICATE_EMAIL: "AUTH_DUPLICATE_EMAIL",
} as const;

// Permission strings from contract
export const PERMISSIONS = {
  CONFIG_READ: "config:read",
  CONFIG_WRITE: "config:write",
  USER_READ: "user:read",
  USER_WRITE: "user:write",
  PAYMENT_READ: "payment:read",
  PAYMENT_WRITE: "payment:write",
  AUDIT_READ: "audit:read",
  ROLE_MANAGE: "role:manage",
  SPONSOR_SELF_READ: "sponsor:self_read",
  SPONSOR_SELF_WRITE: "sponsor:self_write",
  AMBASSADOR_SELF_READ: "ambassador:self_read",
  AMBASSADOR_SELF_WRITE: "ambassador:self_write",
} as const;

// --- Node Types (public-facing only, per TASK-WEBSITE-NODE-001) ---

export interface NodePublic {
  id: string;
  node_name: string;
  status: string;
  load_score: number;
  cpu_usage?: number;
  memory_usage?: number;
  active_connections?: number;
  degraded: boolean;
  degraded_reason?: string;
  last_heartbeat_at?: string;
}

export interface NodeListResponse {
  nodes: NodePublic[];
}

export interface RecommendedNodeResponse {
  nodes: NodePublic[];
}

// --- Billing / Device Types (TASK-WEBSITE-BILLING-001/002) ---
// Aligned with livemask-backend internal/billing/types.go JSON tags.

export interface Plan {
  plan_id: string;
  name: string;
  price_cents: number;        // int64 from Backend, number in JS
  currency: string;            // "USD"
  billing_period: string;      // "monthly" | "yearly"
  device_limit: number;
  node_access: string;          // "basic" | "all"
  features: string[];
}

export interface SubscriptionView {
  subscription_id?: string;    // omitted for free-plan fallback
  plan_id: string;
  status: string;              // "active" | "canceled" | "expired" | "trialing" | "paused"
  current_period_start?: string; // RFC3339; omitted for free fallback
  current_period_end?: string;   // RFC3339; omitted for free fallback
  renew_at?: string;             // RFC3339; only on DefaultSubscription
  cancel_at_period_end: boolean;
  device_limit: number;
  device_used: number;
}

export interface BillingHistoryItem {
  invoice_id: string;
  plan_id: string;
  amount_cents: number;
  currency: string;
  status: string;              // "paid" | "pending" | "failed" | "refunded"
  paid_at?: string;            // RFC3339; omitted if nil
  created_at: string;          // always present
}

export interface DeviceView {
  device_id: string;
  device_name: string;
  platform: string;
  app_version?: string;        // omitted when empty
  trusted: boolean;
  last_active_at?: string;     // RFC3339; omitted if nil
  created_at: string;
}

export interface DevicesResponse {
  devices: DeviceView[];
  device_limit: number;
  device_used: number;
}

// Roles from contract
export const ROLES = {
  USER: "user",
  SUBSCRIBER: "subscriber",
  SPONSOR_AMBASSADOR: "sponsor_ambassador",
  PROMOTION_AMBASSADOR: "promotion_ambassador",
  SUPPORT_AGENT: "support_agent",
  OPS_OPERATOR: "ops_operator",
  FINANCE_OPERATOR: "finance_operator",
  AUDITOR: "auditor",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;
