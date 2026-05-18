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

export function BlogTagPage() {
  const { tag } = useParams<{ tag: string }>();
  const { locale } = useLocale();
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tag) return;
    setLoading(true);
    blogClient
      .getArticles({ locale, tag, limit: 50 })
      .then((res) => setArticles(res.items))
      .catch((err) => console.error("Failed to fetch tag articles:", err))
      .finally(() => setLoading(false));
  }, [tag, locale]);

  const tagName = tag ? decodeURIComponent(tag) : "Unknown";

  return (
    <BlogLayout showBack>
      <SEO
        title={locale === "zh-CN" ? `#${tagName} 文章` : `#${tagName} Articles`}
        description={
          locale === "zh-CN"
            ? `浏览所有标记为 ${tagName} 的文章。发现关于 ${tagName} 的技巧、指南和见解。`
            : `Browse all articles tagged with ${tagName}. Find tips, guides, and insights about ${tagName}.`
        }
        canonical={`${SITE_URL}${localePath(`/blog/tag/${tag}`, locale)}`}
        robots="index,follow"
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {locale === "zh-CN" ? "标签：" : "Tag: "}
            <span className="text-teal-400">#{tagName}</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {locale === "zh-CN"
              ? `浏览所有标记为 ${tagName} 的文章。`
              : `Browse all articles tagged with ${tagName}.`}
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
              {locale === "zh-CN" ? "没有找到带有此标签的文章。" : "No articles found with this tag."}
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
