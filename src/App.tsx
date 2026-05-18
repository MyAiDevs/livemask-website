import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { HomePage, PricingPage, DownloadPage, SecurityPage, FAQPage } from "@/pages/WebsitePage";
import {
  BlogListPage,
  BlogArticlePage,
  BlogCategoryPage,
  BlogTagPage,
} from "@/pages/blog";
import { LoginPage, RegisterPage, ForgotPasswordPage, VerifyEmailPage, AuthCallbackPage } from "@/pages/auth/AuthPages";
import { AccountPage, MarketplacePage, PointsPage, SupportPage } from "@/pages/account/AccountPages";
import { DevicesPage } from "@/pages/account/DevicesPage";
import { NodesPage } from "@/pages/nodes/NodesPage";
import {
  BillingOverviewPage,
  PlansPage,
  BillingHistoryPage,
  CheckoutPage,
} from "@/pages/billing/BillingPages";
import {
  LocaleProvider,
  DEFAULT_LOCALE,
  extractLocaleFromPath,
  SUPPORTED_LOCALES,
} from "@/lib/locale";
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

// ── Locale redirect component ────────────────────────────────────────────
// Non-prefixed paths → redirect to default locale

function LocaleRedirect({ to }: { to?: string }) {
  return <Navigate to={`/${DEFAULT_LOCALE}${to || ""}`} replace />;
}

// ── Locale wrapper ───────────────────────────────────────────────────────
// Extracts locale from URL path, provides LocaleProvider, and updates
// <html lang> attribute for Chrome/Google Search Console.

function LocaleLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const locale = extractLocaleFromPath(location.pathname);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.setAttribute("data-locale", locale);
  }, [locale]);

  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}

// ── Route helpers ────────────────────────────────────────────────────────

/** Render a marketing page route for every supported locale. */
function LocaleRoute({
  path,
  element,
}: {
  path: string;
  element: ReactNode;
}) {
  const paths = SUPPORTED_LOCALES.map((l) => `/${l}${path}`);

  // Auth callback and account paths should not redirect
  const isAuthOrAccount =
    path.startsWith("/auth/") ||
    path.startsWith("/account") ||
    path.startsWith("/nodes") ||
    path.startsWith("/billing") ||
    path.startsWith("/market") ||
    path.startsWith("/points") ||
    path.startsWith("/support");

  if (isAuthOrAccount) {
    return <Route path={`/:locale${path}`} element={element} />;
  }

  return (
    <>
      {paths.map((p) => (
        <Route key={p} path={p} element={element} />
      ))}
    </>
  );
}

// ── App Routes ───────────────────────────────────────────────────────────

const AppRoutes = () => (
  <Routes>
    {/* ── Locale prefixed routes ──────────────────────────────────── */}

    {/* Public Website */}
    <Route path="/:locale" element={<HomePage />} />
    <Route path="/:locale/pricing" element={<PricingPage />} />
    <Route path="/:locale/download" element={<DownloadPage />} />
    <Route path="/:locale/security" element={<SecurityPage />} />
    <Route path="/:locale/faq" element={<FAQPage />} />

    {/* Blog */}
    <Route path="/:locale/blog" element={<BlogListPage />} />
    <Route path="/:locale/blog/category/:category" element={<BlogCategoryPage />} />
    <Route path="/:locale/blog/tag/:tag" element={<BlogTagPage />} />
    <Route path="/:locale/blog/:slug" element={<BlogArticlePage />} />

    {/* Auth — no locale redirect, always show */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/:locale/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/:locale/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/:locale/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/:locale/verify-email" element={<VerifyEmailPage />} />
    <Route path="/auth/callback" element={<AuthCallbackPage />} />
    <Route path="/:locale/auth/callback" element={<AuthCallbackPage />} />

    {/* User Portals */}
    <Route path="/account" element={<AccountPage />} />
    <Route path="/:locale/account" element={<AccountPage />} />
    <Route path="/account/devices" element={<DevicesPage />} />
    <Route path="/:locale/account/devices" element={<DevicesPage />} />
    <Route path="/account/*" element={<AccountPage />} />
    <Route path="/:locale/account/*" element={<AccountPage />} />
    <Route path="/nodes" element={<NodesPage />} />
    <Route path="/:locale/nodes" element={<NodesPage />} />
    <Route path="/nodes/*" element={<NodesPage />} />
    <Route path="/:locale/nodes/*" element={<NodesPage />} />
    <Route path="/billing" element={<BillingOverviewPage />} />
    <Route path="/:locale/billing" element={<BillingOverviewPage />} />
    <Route path="/billing/plans" element={<PlansPage />} />
    <Route path="/:locale/billing/plans" element={<PlansPage />} />
    <Route path="/billing/history" element={<BillingHistoryPage />} />
    <Route path="/:locale/billing/history" element={<BillingHistoryPage />} />
    <Route path="/billing/checkout" element={<CheckoutPage />} />
    <Route path="/:locale/billing/checkout" element={<CheckoutPage />} />
    <Route path="/billing/*" element={<Navigate to="/billing" replace />} />
    <Route path="/market" element={<MarketplacePage />} />
    <Route path="/:locale/market" element={<MarketplacePage />} />
    <Route path="/market/*" element={<MarketplacePage />} />
    <Route path="/:locale/market/*" element={<MarketplacePage />} />
    <Route path="/points" element={<PointsPage />} />
    <Route path="/:locale/points" element={<PointsPage />} />
    <Route path="/points/*" element={<PointsPage />} />
    <Route path="/:locale/points/*" element={<PointsPage />} />
    <Route path="/support" element={<SupportPage />} />
    <Route path="/:locale/support" element={<SupportPage />} />
    <Route path="/support/*" element={<SupportPage />} />
    <Route path="/:locale/support/*" element={<SupportPage />} />

    {/* ── Non-prefixed redirects → default locale ─────────────────── */}
    <Route path="/" element={<LocaleRedirect />} />
    <Route path="/pricing" element={<LocaleRedirect to="/pricing" />} />
    <Route path="/download" element={<LocaleRedirect to="/download" />} />
    <Route path="/security" element={<LocaleRedirect to="/security" />} />
    <Route path="/faq" element={<LocaleRedirect to="/faq" />} />
    <Route path="/blog" element={<LocaleRedirect to="/blog" />} />
    <Route path="/blog/category/:category" element={<LocaleRedirect />} />
    <Route path="/blog/tag/:tag" element={<LocaleRedirect />} />
    <Route path="/blog/:slug" element={<LocaleRedirect />} />
  </Routes>
);

// ── App root ─────────────────────────────────────────────────────────────

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <BrowserRouter>
        <LocaleLayout>
          <AppRoutes />
        </LocaleLayout>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
export { AppRoutes };
