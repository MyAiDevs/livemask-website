/**
 * Locale infrastructure — TASK-WEBSITE-I18N-001
 *
 * Central locale configuration, translation labels, helper utilities,
 * React context, and hooks.
 */
import { createContext, useContext, type ReactNode } from "react";

// ── Types ────────────────────────────────────────────────────────────────

export type Locale = "zh-CN" | "en-US";

// ── Constants ────────────────────────────────────────────────────────────

export const DEFAULT_LOCALE: Locale = "zh-CN";
export const SUPPORTED_LOCALES: Locale[] = ["zh-CN", "en-US"];
export const SITE_URL = "https://livemask.com";

// ── Locale display labels ────────────────────────────────────────────────

export const LOCALE_LABELS: Record<Locale, string> = {
  "zh-CN": "中文",
  "en-US": "English",
};

// ── Navigation labels ────────────────────────────────────────────────────

export const NAV_LABELS: Record<string, Record<Locale, string>> = {
  home:              { "zh-CN": "首页",        "en-US": "Home" },
  pricing:           { "zh-CN": "定价",        "en-US": "Pricing" },
  download:          { "zh-CN": "下载",        "en-US": "Download" },
  security:          { "zh-CN": "安全",        "en-US": "Security" },
  blog:              { "zh-CN": "博客",        "en-US": "Blog" },
  faq:               { "zh-CN": "常见问题",    "en-US": "FAQ" },
  account:           { "zh-CN": "账户",        "en-US": "Account" },
  login:             { "zh-CN": "登录",        "en-US": "Login" },
  logout:            { "zh-CN": "退出",        "en-US": "Logout" },
  "get-started":     { "zh-CN": "开始使用",    "en-US": "Get Started" },
  "view-plans":      { "zh-CN": "查看方案",    "en-US": "View Plans" },
  "get-started-free":{ "zh-CN": "免费开始",    "en-US": "Get Started Free" },
  "all-articles":    { "zh-CN": "所有文章",    "en-US": "All Articles" },
  "back-to-blog":    { "zh-CN": "返回博客",    "en-US": "Back to Blog" },
  "search":          { "zh-CN": "搜索文章...",  "en-US": "Search articles..." },
  "no-articles":     { "zh-CN": "没有找到文章", "en-US": "No articles found." },
  "clear-filters":   { "zh-CN": "清除筛选",    "en-US": "Clear all filters" },
  privacy:           { "zh-CN": "隐私",        "en-US": "Privacy" },
  security_label:    { "zh-CN": "安全",        "en-US": "Security" },
  technology:        { "zh-CN": "技术",        "en-US": "Technology" },
  guides:            { "zh-CN": "指南",        "en-US": "Guides" },
  product:           { "zh-CN": "产品",        "en-US": "Product" },
  legal:             { "zh-CN": "法律",        "en-US": "Legal" },
  "privacy-policy":  { "zh-CN": "隐私政策",    "en-US": "Privacy Policy" },
  "terms-of-service":{ "zh-CN": "服务条款",    "en-US": "Terms of Service" },
  contact:           { "zh-CN": "联系我们",    "en-US": "Contact" },
  "previous":        { "zh-CN": "上一页",      "en-US": "Previous" },
  next:              { "zh-CN": "下一页",       "en-US": "Next" },
  "referral-hint":   { "zh-CN": "你正在通过邀请链接注册", "en-US": "You are registering through an invitation link" },
};

// ── SEO labels (crawler-visible) ─────────────────────────────────────────

export const SEO_LABELS: Record<string, Record<Locale, string>> = {
  "site-name":        { "zh-CN": "LiveMask - 安全上网，自由访问", "en-US": "LiveMask - Secure VPN for Privacy & Freedom" },
  "site-description": { "zh-CN": "LiveMask 提供企业级VPN保护，采用军事级加密和严格的无日志政策，保护您的在线隐私，让您自由访问全球互联网。", "en-US": "LiveMask provides enterprise-grade VPN protection with blazing-fast speeds, military-grade encryption, and a strict no-logs policy." },
  "pricing-title":    { "zh-CN": "定价方案 — 透明实惠", "en-US": "Simple, Transparent Pricing" },
  "pricing-desc":     { "zh-CN": "选择适合您的方案，所有方案均享30天无理由退款保证。", "en-US": "Choose the plan that fits your needs. All plans include a 30-day money-back guarantee." },
  "download-title":   { "zh-CN": "下载 LiveMask", "en-US": "Download LiveMask" },
  "download-desc":    { "zh-CN": "支持所有主流平台。", "en-US": "Available on all major platforms." },
  "security-title":   { "zh-CN": "安全与隐私", "en-US": "Security & Privacy" },
  "security-desc":    { "zh-CN": "您的隐私是我们的首要任务。", "en-US": "Your privacy is our top priority." },
  "faq-title":        { "zh-CN": "常见问题", "en-US": "Frequently Asked Questions" },
  "faq-desc":         { "zh-CN": "关于 LiveMask 的常见问题。", "en-US": "Everything you need to know about LiveMask." },
  "blog-title":       { "zh-CN": "LiveMask 博客", "en-US": "LiveMask Blog" },
  "blog-desc":        { "zh-CN": "来自 LiveMask 团队的 VPN 技术、在线隐私、安全技巧和指南文章。", "en-US": "Discover articles about VPN technology, online privacy, security tips, and guides from the LiveMask team." },
};

// ── Path utilities ───────────────────────────────────────────────────────

const LOCALE_PATTERNS = SUPPORTED_LOCALES.map((l) => `/${l}`);

export function hasLocalePrefix(path: string): boolean {
  return LOCALE_PATTERNS.some((p) => path === p || path.startsWith(p + "/"));
}

export function localePath(path: string, locale: Locale): string {
  if (hasLocalePrefix(path)) return path;
  if (path === "/" || path === "") return `/${locale}`;
  return `/${locale}${path}`;
}

export function extractLocaleFromPath(pathname: string): Locale {
  for (const l of SUPPORTED_LOCALES) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) return l;
  }
  return DEFAULT_LOCALE;
}

export function stripLocaleFromPath(pathname: string): string {
  for (const l of SUPPORTED_LOCALES) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

export function getAlternateHreflang(
  path: string,
  locale: Locale,
): { hreflang: string; href: string }[] {
  const stripped = stripLocaleFromPath(path);
  return SUPPORTED_LOCALES.filter((l) => l !== locale).map((l) => ({
    hreflang: l,
    href: `${SITE_URL}${localePath(stripped, l)}`,
  }));
}

export function buildAlternatesForUrl(
  canonicalPath: string,
  currentLocale: Locale,
  localizedUrls: Partial<Record<Locale, string>>,
): { hreflang: string; href: string }[] {
  const defaultHrefLang = getAlternateHreflang(canonicalPath, currentLocale);
  const overrides = SUPPORTED_LOCALES.filter((l) => l !== currentLocale)
    .map((l) => {
      const href = localizedUrls[l];
      if (!href) return null;
      return { hreflang: l, href };
    })
    .filter(Boolean) as { hreflang: string; href: string }[];

  return overrides.length > 0 ? overrides : defaultHrefLang;
}

// ── React Context ────────────────────────────────────────────────────────

export interface LocaleContextValue {
  locale: Locale;
  t: (key: string) => string;
  lp: (path: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value: LocaleContextValue = {
    locale,
    t: (key: string) => {
      const entry = NAV_LABELS[key] ?? SEO_LABELS[key];
      if (!entry) return key;
      return entry[locale] ?? key;
    },
    lp: (path: string) => localePath(path, locale),
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      t: (key: string) => NAV_LABELS[key]?.[DEFAULT_LOCALE] ?? key,
      lp: (path: string) => localePath(path, DEFAULT_LOCALE),
    };
  }
  return ctx;
}
