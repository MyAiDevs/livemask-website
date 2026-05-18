import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ArrowRight, Server, Globe, Lock, Zap, ChevronRight, Star, Download, CheckCircle, Smartphone, Monitor, Terminal } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AnnouncementBand } from "@/components/AnnouncementBand";
import { CampaignBanner } from "@/components/CampaignBanner";
import { ReleaseNotes } from "@/components/ReleaseNotes";
import { useAnnouncements, useCampaigns, useReleaseNotes } from "@/hooks/useContent";
import { SEO, SITE_URL } from "@/components/SEO";
import { useLocale, LOCALE_LABELS } from "@/lib/locale";
import { useParams } from "react-router-dom";

function useLocaleFromRoute() {
  const { locale: localeParam } = useParams<{ locale?: string }>();
  const localeCtx = useLocale();
  return localeParam || localeCtx.locale;
}

export function HomePage() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();
  const { data: releaseNotes, isLoading: releaseNotesLoading } = useReleaseNotes();
  const { t, lp, locale } = useLocale();

  return (
    <div className="min-h-screen bg-background">
      {/* Announcement Band (above nav) */}
      <AnnouncementBand announcements={announcements} isLoading={announcementsLoading} />

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to={lp("/")} className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-bold text-foreground">LiveMask</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link to={lp("/pricing")} className="text-muted-foreground hover:text-foreground transition-colors">{t("pricing")}</Link>
            <Link to={lp("/download")} className="text-muted-foreground hover:text-foreground transition-colors">{t("download")}</Link>
            <Link to={lp("/security")} className="text-muted-foreground hover:text-foreground transition-colors">{t("security")}</Link>
            <Link to={lp("/blog")} className="text-muted-foreground hover:text-foreground transition-colors">{t("blog")}</Link>
            <Link to={lp("/faq")} className="text-muted-foreground hover:text-foreground transition-colors">{t("faq")}</Link>
            {isAuthenticated ? (
              <>
                <Link to={lp("/account")} className="text-muted-foreground hover:text-foreground transition-colors">{t("account")}</Link>
                <button
                  onClick={() => { logout(); navigate(lp("/")); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link to={lp("/login")} className="text-muted-foreground hover:text-foreground transition-colors">{t("login")}</Link>
                <Link to={lp("/register")}>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8">
                    {t("get-started")}
                  </Button>
                </Link>
              </>
            )}
            {/* Locale switcher */}
            <Link
              to={locale === "zh-CN" ? lp("/").replace("/zh-CN", "/en-US") : lp("/").replace("/en-US", "/zh-CN")}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border/30 rounded px-2 py-0.5"
            >
              {locale === "zh-CN" ? "English" : "中文"}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/20 mb-6">
            {locale === "zh-CN" ? "全球超过 10,000 用户的信赖之选" : "Trusted by 10,000+ users worldwide"}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            {locale === "zh-CN" ? (
              <>以 <span className="text-teal-400">隐私</span> 和 <span className="text-teal-400">自由</span> 之名畅游互联网</>
            ) : (
              <>Browse the Internet with
              <span className="text-teal-400"> Privacy</span> and{" "}
              <span className="text-teal-400"> Freedom</span></>
            )}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {locale === "zh-CN"
              ? "LiveMask 提供企业级 VPN 保护，超快速度，军事级加密，严格执行无日志政策。"
              : "LiveMask provides enterprise-grade VPN protection with blazing-fast speeds, military-grade encryption, and a strict no-logs policy."}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to={lp("/register")}>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-6 text-sm">
                {locale === "zh-CN" ? "免费使用 LiveMask" : "Get LiveMask Free"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to={lp("/pricing")}>
              <Button variant="outline" className="h-11 px-6 text-sm">
                {t("view-plans")}
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> {locale === "zh-CN" ? "30 天无理由退款" : "30-day money-back"}</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> {locale === "zh-CN" ? "无日志记录" : "No logs"}</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> {locale === "zh-CN" ? "7×24 小时支持" : "24/7 support"}</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">{locale === "zh-CN" ? "为什么选择 LiveMask？" : "Why LiveMask?"}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {locale === "zh-CN" ? "我们结合尖端技术与对隐私的不懈追求。" : "We combine cutting-edge technology with a relentless focus on privacy."}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: locale === "zh-CN" ? "军事级加密" : "Military-Grade Encryption",
                description: locale === "zh-CN" ? "AES-256 加密保护您的数据免受窥探。" : "AES-256 encryption protects your data from prying eyes.",
                color: "text-teal-500",
                bg: "bg-teal-500/10",
              },
              {
                icon: Globe,
                title: locale === "zh-CN" ? "全球服务器网络" : "Global Server Network",
                description: locale === "zh-CN" ? "连接遍布30个国家50多台服务器，享受无限制访问。" : "Connect to 50+ servers across 30 countries for unrestricted access.",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                icon: Zap,
                title: locale === "zh-CN" ? "极速连接" : "Blazing-Fast Speeds",
                description: locale === "zh-CN" ? "优化路由和 WireGuard 协议，实现最佳性能。" : "Optimized routing and WireGuard protocol for maximum performance.",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                icon: Shield,
                title: locale === "zh-CN" ? "严格无日志政策" : "Strict No-Logs Policy",
                description: locale === "zh-CN" ? "我们从不跟踪、记录或分享您的浏览活动。" : "We never track, log, or share your browsing activity.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Server,
                title: locale === "zh-CN" ? "多设备支持" : "Multi-Device Support",
                description: locale === "zh-CN" ? "一个订阅可保护最多5台设备。" : "Protect up to 5 devices with a single subscription.",
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                icon: Star,
                title: locale === "zh-CN" ? "7×24 客户支持" : "24/7 Customer Support",
                description: locale === "zh-CN" ? "我们的团队随时为您提供帮助。" : "Our team is always ready to help you.",
                color: "text-rose-500",
                bg: "bg-rose-500/10",
              },
            ].map((feature, i) => (
              <Card key={i} className="bg-card border-border hover:border-teal-500/20 transition-colors">
                <CardContent className="p-6">
                  <div className={`rounded-lg ${feature.bg} p-3 w-fit mb-4`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {locale === "zh-CN" ? "准备好掌控您的隐私了吗？" : "Ready to Take Control of Your Privacy?"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {locale === "zh-CN" ? "加入数千满意用户的行列。免费开始，无需信用卡。" : "Join thousands of satisfied users. Get started for free, no credit card required."}
          </p>
          <Link to={lp("/register")}>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white h-12 px-8 text-sm">
              {t("get-started-free")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Release Notes / Latest Updates */}
      <ReleaseNotes releaseNotes={releaseNotes} isLoading={releaseNotesLoading} />

      {/* Footer */}
      <Footer locale={locale} lp={lp} t={t} />
    </div>
  );
}

export function PricingPage() {
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { t, lp, locale } = useLocale();

  return (
    <MarketingPageLayout title="Pricing">
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {locale === "zh-CN" ? "简单透明的定价方案" : "Simple, Transparent Pricing"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "zh-CN" ? "选择适合您的方案，所有方案均享30天无理由退款保证。" : "Choose the plan that fits your needs. All plans include a 30-day money-back guarantee."}
          </p>
        </div>

        {/* Campaign Banner */}
        {campaigns.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <CampaignBanner campaigns={campaigns} isLoading={campaignsLoading} />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              name: locale === "zh-CN" ? "免费" : "Free", price: "$0", period: "/mo",
              desc: locale === "zh-CN" ? "基础 VPN 保护" : "Basic VPN protection",
              features: locale === "zh-CN"
                ? ["1 台设备", "3 个服务器位置", "基础速度", "社区支持"]
                : ["1 device", "3 server locations", "Basic speed", "Community support"],
              cta: t("get-started"), popular: false,
            },
            {
              name: locale === "zh-CN" ? "高级" : "Premium", price: "$9.99", period: "/mo",
              desc: locale === "zh-CN" ? "完整 VPN 体验" : "Full VPN experience",
              features: locale === "zh-CN"
                ? ["5 台设备", "全部 50+ 服务器", "最大速度", "WireGuard 协议", "7×24 支持"]
                : ["5 devices", "All 50+ servers", "Max speed", "WireGuard protocol", "24/7 support"],
              cta: locale === "zh-CN" ? "立即订阅" : "Subscribe Now", popular: true,
            },
            {
              name: locale === "zh-CN" ? "企业" : "Enterprise", price: "$49.99", period: "/mo",
              desc: locale === "zh-CN" ? "适用于团队和企业" : "For teams & businesses",
              features: locale === "zh-CN"
                ? ["无限设备", "专属服务器", "SLA 保障", "管理控制台", "优先支持"]
                : ["Unlimited devices", "Dedicated servers", "SLA guarantee", "Admin console", "Priority support"],
              cta: locale === "zh-CN" ? "联系销售" : "Contact Sales", popular: false,
            },
          ].map((plan, i) => (
            <Card key={i} className={`bg-card border-border ${plan.popular ? "ring-1 ring-teal-500/30 relative" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-teal-600 text-white text-xs">
                    {locale === "zh-CN" ? "最受欢迎" : "Most Popular"}
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.desc}</p>
                <p className="text-3xl font-bold text-foreground mb-6">
                  {plan.price}<span className="text-sm text-muted-foreground font-normal">{plan.period}</span>
                </p>
                <div className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link to={lp("/register")}>
                  <Button
                    className={`w-full text-xs h-9 ${plan.popular ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MarketingPageLayout>
  );
}

export function DownloadPage() {
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { t, lp, locale } = useLocale();

  return (
    <MarketingPageLayout title="Download">
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">

          {/* Campaign Banner */}
          {campaigns.length > 0 && (
            <div className="mb-8 text-left">
              <CampaignBanner campaigns={campaigns} isLoading={campaignsLoading} />
            </div>
          )}

          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-teal-500/10 p-4">
              <Download className="h-10 w-10 text-teal-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {locale === "zh-CN" ? "下载 LiveMask" : "Download LiveMask"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {locale === "zh-CN" ? "支持所有主流平台。" : "Available on all major platforms."}
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "iOS", desc: locale === "zh-CN" ? "iPhone & iPad" : "iPhone & iPad", icon: Smartphone },
              { name: "Android", desc: locale === "zh-CN" ? "手机和平板" : "Phones & Tablets", icon: Smartphone },
              { name: "macOS", desc: locale === "zh-CN" ? "MacBook & iMac" : "MacBooks & iMacs", icon: Monitor },
              { name: "Windows", desc: "PC & Laptops", icon: Monitor },
              { name: "Linux", desc: "Ubuntu, Debian, Fedora", icon: Terminal },
              { name: "Browser", desc: locale === "zh-CN" ? "Chrome & Firefox" : "Chrome & Firefox", icon: Globe },
            ].map((platform, i) => (
              <Card key={i} className="bg-card border-border hover:border-teal-500/30 cursor-pointer transition-colors">
                <CardContent className="p-4 text-center">
                  <platform.icon className="h-8 w-8 text-teal-500 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-foreground">{platform.name}</h3>
                  <p className="text-xs text-muted-foreground">{platform.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}

export function SecurityPage() {
  const { t, locale } = useLocale();

  return (
    <MarketingPageLayout title="Security">
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-teal-500/10 p-4">
                <Lock className="h-10 w-10 text-teal-500" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">
              {locale === "zh-CN" ? "安全与隐私" : "Security & Privacy"}
            </h1>
            <p className="text-muted-foreground">
              {locale === "zh-CN" ? "您的隐私是我们的首要任务。" : "Your privacy is our top priority."}
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                title: "AES-256 Encryption",
                desc: locale === "zh-CN" ? "军事级加密保护您的所有数据流量。" : "Military-grade encryption protects all your data traffic."
              },
              {
                title: locale === "zh-CN" ? "无日志政策" : "No-Logs Policy",
                desc: locale === "zh-CN" ? "我们不收集、存储或分享您的浏览数据。" : "We do not collect, store, or share your browsing data."
              },
              {
                title: locale === "zh-CN" ? "断网开关" : "Kill Switch",
                desc: locale === "zh-CN" ? "VPN 断开时自动阻止所有流量。" : "Automatically blocks all traffic if the VPN connection drops."
              },
              {
                title: "DNS Leak Protection",
                desc: locale === "zh-CN" ? "所有 DNS 查询都通过加密隧道传输。" : "All DNS queries are routed through our encrypted tunnel."
              },
              {
                title: "WireGuard Protocol",
                desc: locale === "zh-CN" ? "现代、快速、安全的 VPN 协议。" : "Modern, fast, and secure VPN protocol."
              },
              {
                title: locale === "zh-CN" ? "纯内存服务器" : "RAM-Only Servers",
                desc: locale === "zh-CN" ? "所有服务器运行在内存中，确保数据不留存。" : "All servers run on RAM, ensuring no data persistence."
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-border/50">
                <Shield className="h-5 w-5 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}

export function FAQPage() {
  const { t, lp, locale } = useLocale();

  const faqs = locale === "zh-CN" ? [
    { q: "什么是 LiveMask？", a: "LiveMask 是一款高级 VPN 服务，保护您的在线隐私和安全。" },
    { q: "我的数据会被记录吗？", a: "不会。我们严格执行无日志政策，绝不跟踪或存储您的在线活动。" },
    { q: "我可以使用多少台设备？", a: "免费方案：1 台设备。高级方案：最多 5 台设备。企业方案：无限设备。" },
    { q: "有退款保证吗？", a: "有！所有方案均享 30 天无理由退款保证。" },
    { q: "支持哪些协议？", a: "我们支持 WireGuard 和 OpenVPN 协议。" },
    { q: "LiveMask 可以用于流媒体吗？", a: "可以。我们的高级方案支持主流流媒体平台。" },
  ] : [
    { q: "What is LiveMask?", a: "LiveMask is a premium VPN service that protects your online privacy and security." },
    { q: "Is my data logged?", a: "No. We have a strict no-logs policy. We never track or store your online activity." },
    { q: "How many devices can I use?", a: "Free plan: 1 device. Premium: up to 5 devices. Enterprise: unlimited." },
    { q: "Is there a money-back guarantee?", a: "Yes! All plans come with a 30-day money-back guarantee." },
    { q: "Which protocols do you support?", a: "We support WireGuard and OpenVPN protocols." },
    { q: "Can I use LiveMask for streaming?", a: "Yes, our Premium plan works with major streaming platforms." },
  ];

  return (
    <MarketingPageLayout title="FAQ">
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              {locale === "zh-CN" ? "常见问题" : "Frequently Asked Questions"}
            </h1>
            <p className="text-muted-foreground">
              {locale === "zh-CN" ? "关于 LiveMask 的常见问题。" : "Everything you need to know about LiveMask."}
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-lg border border-border/50 p-4">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}

// ── Shared components ─────────────────────────────────────────────────────

function MarketingPageLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();
  const { t, lp, locale } = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBand announcements={announcements} isLoading={announcementsLoading} />
      <nav className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to={lp("/")} className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-bold text-foreground">LiveMask</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link to={lp("/")} className="text-muted-foreground hover:text-foreground transition-colors">{t("home")}</Link>
            <Link to={lp("/pricing")} className={`transition-colors ${title === "Pricing" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t("pricing")}</Link>
            <Link to={lp("/download")} className={`transition-colors ${title === "Download" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t("download")}</Link>
            <Link to={lp("/security")} className={`transition-colors ${title === "Security" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t("security")}</Link>
            <Link to={lp("/blog")} className="text-muted-foreground hover:text-foreground transition-colors">{t("blog")}</Link>
            <Link to={lp("/faq")} className={`transition-colors ${title === "FAQ" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t("faq")}</Link>
            {/* Locale switcher */}
            <Link
              to={locale === "zh-CN" ? lp("/").replace("/zh-CN", "/en-US") : lp("/").replace("/en-US", "/zh-CN")}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border/30 rounded px-2 py-0.5"
            >
              {locale === "zh-CN" ? "English" : "中文"}
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}

function Footer({ locale, lp, t }: { locale: string; lp: (p: string) => string; t: (k: string) => string }) {
  return (
    <footer className="border-t border-border/50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
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
              <Link to={lp("/pricing")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("pricing")}</Link>
              <Link to={lp("/download")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("download")}</Link>
              <Link to={lp("/security")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("security")}</Link>
              <Link to={lp("/faq")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("faq")}</Link>
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
          {/* Legal & Contact */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3">{t("legal")}</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("privacy-policy")}</a>
              <a href="#" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("terms-of-service")}</a>
              <a href="#" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">{t("contact")}</a>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-border/30 text-center text-[11px] text-muted-foreground">
          <span>LiveMask &copy; {new Date().getFullYear()}. {locale === "zh-CN" ? "保留所有权利。" : "All rights reserved."}</span>
        </div>
      </div>
    </footer>
  );
}
