import { Link, useLocation } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface BlogLayoutProps {
  children: ReactNode;
  showBack?: boolean;
  backTo?: string;
}

export function BlogLayout({ children, showBack, backTo }: BlogLayoutProps) {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (p: string) =>
    path === p || path.startsWith(p + "/")
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/95 backdrop-blur fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Shield className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-bold text-foreground">LiveMask</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/download" className="text-muted-foreground hover:text-foreground transition-colors">
              Download
            </Link>
            <Link to="/blog" className={`transition-colors ${isActive("/blog")}`}>
              Blog
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/account" className="text-muted-foreground hover:text-foreground transition-colors">
                  Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
          {/* Mobile nav toggle - simple inline links */}
          <div className="flex md:hidden items-center gap-3 text-sm">
            <Link to="/blog" className={`transition-colors ${isActive("/blog")}`}>
              Blog
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                }}
                className="text-muted-foreground hover:text-foreground transition-colors text-xs"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors text-xs">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-14">
        {showBack && (
          <div className="max-w-4xl mx-auto px-4 pt-6">
            <Link
              to={backTo || "/blog"}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Blog
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
              <Link to="/" className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-teal-500" />
                <span className="text-sm font-bold text-foreground">LiveMask</span>
              </Link>
              <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[200px]">
                Enterprise-grade VPN protection with blazing-fast speeds and a strict no-logs policy.
              </p>
            </div>
            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3">Product</h4>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                <Link to="/pricing" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              </div>
            </div>
            {/* Blog */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3">Blog</h4>
              <div className="flex flex-col gap-2">
                <Link to="/blog" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">All Articles</Link>
                <Link to="/blog/category/privacy" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                <Link to="/blog/category/security" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Security</Link>
                <Link to="/blog/category/technology" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Technology</Link>
                <Link to="/blog/category/guides" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Guides</Link>
              </div>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3">Legal</h4>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-border/30 text-center text-[11px] text-muted-foreground">
            <span>LiveMask &copy; {new Date().getFullYear()}. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
