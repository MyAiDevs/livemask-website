import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { BlogLayout } from "@/components/BlogLayout";
import { ArticleCard } from "@/components/ArticleCard";
import { SEO, SITE_URL } from "@/components/SEO";
import { blogClient } from "@/lib/blog-api";
import type { ArticleSummary, BlogCategory, BlogTag } from "@/lib/blog-types";
import { useLocale } from "@/lib/locale";

const MOCK_MODE = blogClient.isMockMode();
const isDev = import.meta.env.DEV;

export function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const { locale, t } = useLocale();

  const activeCategory = searchParams.get("category") || "";
  const activeTag = searchParams.get("tag") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 9;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        locale,
        page,
        limit,
      };
      if (activeCategory) params.category = activeCategory;
      if (activeTag) params.tag = activeTag;
      if (searchQuery) params.q = searchQuery;

      const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
        blogClient.getArticles(params),
        blogClient.getCategories(),
        blogClient.getTags(),
      ]);
      setArticles(articlesRes.items);
      setTotal(articlesRes.total);
      setCategories(categoriesRes.categories);
      setTags(tagsRes.tags);
    } catch (err) {
      console.error("Failed to fetch blog data:", err);
    } finally {
      setLoading(false);
    }
  }, [locale, page, activeCategory, activeTag, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / limit);
  const featuredArticle = articles.find((a) => a.featured);
  const regularArticles = articles.filter((a) => a.slug !== featuredArticle?.slug);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeCategory) params.set("category", activeCategory);
    if (activeTag) params.set("tag", activeTag);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery("");
  };

  const hasFilters = activeCategory || activeTag || searchQuery;

  const title = activeCategory
    ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`
    : activeTag
      ? `#${activeTag}`
      : (locale === "zh-CN" ? "博客" : "Blog");

  const description = locale === "zh-CN"
    ? "发现来自 LiveMask 团队的VPN技术、在线隐私、安全技巧和指南文章。"
    : "Discover articles about VPN technology, online privacy, security tips, and guides from the LiveMask team.";

  return (
    <BlogLayout>
      <SEO
        title={title}
        description={description}
        canonical={
          hasFilters
            ? `${SITE_URL}/blog${window.location.search}`
            : `${SITE_URL}/blog`
        }
        robots="index,follow"
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {activeCategory ? (
              <>
                {locale === "zh-CN" ? "分类：" : "Articles in "}
                <span className="text-teal-400">
                  {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                </span>
              </>
            ) : activeTag ? (
              <>
                {locale === "zh-CN" ? "标签：" : "Articles tagged "}
                <span className="text-teal-400">#{activeTag}</span>
              </>
            ) : (
              locale === "zh-CN" ? "LiveMask 博客" : "LiveMask Blog"
            )}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search")}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:border-teal-500/50"
            />
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Link
            to={window.location.pathname.replace(/\/blog.*/, "/blog")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !activeCategory
                ? "bg-teal-600 text-white"
                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {locale === "zh-CN" ? "全部" : "All"}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={window.location.pathname.replace(/\/blog.*/, `/blog/category/${cat.slug}`)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-teal-600 text-white"
                  : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {locale === "zh-CN" ? getChineseCategory(cat.name) : cat.name}
            </Link>
          ))}
        </div>

        {/* Tag Chips */}
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-8">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                to={window.location.pathname.replace(/\/blog.*/, `/blog/tag/${tag.slug}`)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  activeTag === tag.slug
                    ? "bg-teal-600/20 text-teal-400 border border-teal-500/30"
                    : "bg-card border border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
                }`}
              >
                #{tag.name}
                <span className="ml-1 opacity-60">({tag.article_count})</span>
              </Link>
            ))}
          </div>
        )}

        {hasFilters && (
          <div className="text-center mb-6">
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            >
              {t("clear-filters")}
            </button>
          </div>
        )}

        {/* Mock mode badge */}
        {MOCK_MODE && isDev && (
          <div className="text-center mb-6">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Mock Data Mode
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20" data-skeleton>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && (
          <>
            {/* Featured Article */}
            {featuredArticle && !hasFilters && (
              <div className="mb-8">
                <ArticleCard article={featuredArticle} featured />
              </div>
            )}

            {/* Article Grid */}
            {regularArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : !loading ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-sm">
                  {t("no-articles")}
                </p>
              </div>
            ) : null}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Link
                  to={`${window.location.pathname}?page=${page - 1}${activeCategory ? `&category=${activeCategory}` : ""}${activeTag ? `&tag=${activeTag}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    page <= 1
                      ? "text-muted-foreground/40 pointer-events-none"
                      : "text-muted-foreground hover:text-foreground bg-card border border-border/50"
                  }`}
                  aria-disabled={page <= 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  {t("previous")}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {locale === "zh-CN" ? `第 ${page} 页，共 ${totalPages} 页` : `Page ${page} of ${totalPages}`}
                </span>
                <Link
                  to={`${window.location.pathname}?page=${page + 1}${activeCategory ? `&category=${activeCategory}` : ""}${activeTag ? `&tag=${activeTag}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    page >= totalPages
                      ? "text-muted-foreground/40 pointer-events-none"
                      : "text-muted-foreground hover:text-foreground bg-card border border-border/50"
                  }`}
                  aria-disabled={page >= totalPages}
                >
                  {t("next")}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </BlogLayout>
  );
}

function getChineseCategory(englishName: string): string {
  const map: Record<string, string> = {
    "Privacy": "隐私",
    "Security": "安全",
    "Technology": "技术",
    "Guides": "指南",
  };
  return map[englishName] || englishName;
}
