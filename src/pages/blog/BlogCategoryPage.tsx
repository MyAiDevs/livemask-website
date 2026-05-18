import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { BlogLayout } from "@/components/BlogLayout";
import { ArticleCard } from "@/components/ArticleCard";
import { SEO, SITE_URL } from "@/components/SEO";
import { blogClient } from "@/lib/blog-api";
import type { ArticleSummary } from "@/lib/blog-types";
import { useLocale, localePath } from "@/lib/locale";

const MOCK_MODE = blogClient.isMockMode();
const isDev = import.meta.env.DEV;

export function BlogCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { locale } = useLocale();
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    blogClient
      .getArticles({ locale, category, limit: 50 })
      .then((res) => setArticles(res.items))
      .catch((err) => console.error("Failed to fetch category articles:", err))
      .finally(() => setLoading(false));
  }, [category, locale]);

  const categoryName = category
    ? category.charAt(0).toUpperCase() + category.replace(/-/g, " ").slice(1)
    : "Unknown";

  return (
    <BlogLayout showBack>
      <SEO
        title={locale === "zh-CN" ? `${categoryName} 文章` : `${categoryName} Articles`}
        description={
          locale === "zh-CN"
            ? `浏览${categoryName}分类中的所有文章。了解${categoryName.toLowerCase()}的技巧、指南和最佳实践。`
            : `Browse all articles in the ${categoryName} category. Learn about ${categoryName.toLowerCase()} tips, guides, and best practices.`
        }
        canonical={`${SITE_URL}${localePath(`/blog/category/${category}`, locale)}`}
        robots="index,follow"
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {locale === "zh-CN" ? "分类：" : "Category: "}
            <span className="text-teal-400">{categoryName}</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {locale === "zh-CN"
              ? `浏览${categoryName}分类中的所有文章。`
              : `Browse all articles in the ${categoryName.toLowerCase()} category.`}
          </p>
        </div>

        {MOCK_MODE && isDev && (
          <div className="text-center mb-6">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Mock Data Mode
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20" data-skeleton>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">
              {locale === "zh-CN" ? "该分类中没有文章。" : "No articles found in this category."}
            </p>
            <Link
              to={localePath("/blog", locale)}
              className="inline-block mt-4 text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              {locale === "zh-CN" ? "查看所有文章" : "View all articles"}
            </Link>
          </div>
        )}
      </div>
    </BlogLayout>
  );
}
