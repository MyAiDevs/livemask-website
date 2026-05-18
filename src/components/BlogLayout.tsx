import { Link, useLocation } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { useLocale } from "@/lib/locale";

interface BlogLayoutProps {
  children: ReactNode;
  showBack?: boolean;
  backTo?: string;
}

export function BlogLayout({ children, showBack, backTo }: BlogLayoutProps) {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const { t, lp, locale } = useLocale();

  const isActive = (p: string) => {
    const localePath = lp(p);
    return path === localePath || path.startsWith(localePath + "/")
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/95 backdrop-blur fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to={lp("/")} className="flex items-center gap-2 shrink-0">
            <Shield className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-bold text-foreground">LiveMask</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to={lp("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              {t("home")}
            </Link>
            <Link to={lp("/pricing")} className="text-muted-foreground hover:text-foreground transition-colors">
              {t("pricing")}
            </Link>
            <Link to={lp("/download")} className="text-muted-foreground hover:text-foreground transition-colors">
              {t("download")}
            </Link>
            <Link to={lp("/blog")} className={`transition-colors ${isActive("/blog")}`}>
              {t("blog")}
            </Link>
            {isAuthenticated ? (
              <>
                <Link to={lp("/account")} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("account")}
                </Link>
                <button
                  onClick={() => { logout(); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link to={lp("/login")} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("login")}
                </Link>
                <Link to={lp("/register")}>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8">
                    {t("get-started")}
                  </Button>
                </Link>
              </>
            )}
            <Link
              to={locale === "zh-CN" ? lp("/").replace("/zh-CN", "/en-US") : lp("/").replace("/en-US", "/zh-CN")}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border/30 rounded px-2 py-0.5"
            >
              {locale === "zh-CN" ? "English" : "中文"}
            </Link>
          </div>
          {/* Mobile nav toggle - simple inline links */}
          <div className="flex md:hidden items-center gap-3 text-sm">
            <Link to={lp("/blog")} className={`transition-colors ${isActive("/blog")}`}>
              {t("blog")}
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); }}
                className="text-muted-foreground hover:text-foreground transition-colors text-xs"
              >
                {t("logout")}
              </button>
            ) : (
              <Link to={lp("/login")} className="text-muted-foreground hover:text-foreground transition-colors text-xs">
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-14">
        {showBack && (
          <div className="max-w-4xl mx-auto px-4 pt-6">
            <Link
              to={backTo ? lp(backTo) : lp("/blog")}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("back-to-blog")}
            </Link>
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-4 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to={lp("/")} className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-teal-500" />
                <span className="text-sm font-bold text-foreground">LiveMask</span>
              </Link>
              <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[200px]">
                {locale === "zh-CN"
                  ? "企业级VPN保护，超快速度，严格无日志政策。"
                  : "Enterprise-grade VPN protection with blazing-fast speeds and a strict no-logs policy."}
              </p>
            </div>
            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3">{t("product")}</h4>
              <div className="flex flex-col gap-2">
                <Link to={lp("/")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("home")}</Link>
                <Link to={lp("/pricing")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("pricing")}</Link>
              </div>
            </div>
            {/* Blog */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3">{t("blog")}</h4>
              <div className="flex flex-col gap-2">
                <Link to={lp("/blog")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("all-articles")}</Link>
                <Link to={lp("/blog/category/privacy")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("privacy")}</Link>
                <Link to={lp("/blog/category/security")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("security")}</Link>
                <Link to={lp("/blog/category/technology")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("technology")}</Link>
                <Link to={lp("/blog/category/guides")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("guides")}</Link>
              </div>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3">{t("legal")}</h4>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("privacy-policy")}</a>
                <a href="#" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("terms-of-service")}</a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-border/30 text-center text-[11px] text-muted-foreground">
            <span>LiveMask &copy; {new Date().getFullYear()}. {locale === "zh-CN" ? "保留所有权利。" : "All rights reserved."}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
