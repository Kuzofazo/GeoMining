import { useState, useEffect } from 'react';
import { BlogPost } from '../types/blog';
import { ArticleSection } from '../types/article';
import { fetchPublishedArticles } from '../lib/articleService';
import { BLOG_POSTS } from '../constants/blogData';

interface UseArticlesResult {
  articles: BlogPost[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches published articles from Supabase for a given section.
 * Falls back transparently to static BLOG_POSTS if DB is unavailable or empty.
 *
 * @param section - 'news_desk' | 'latest_articles' | 'events' | undefined (all)
 */
export const useArticles = (section?: ArticleSection): UseArticlesResult => {
  const [articles, setArticles] = useState<BlogPost[]>(BLOG_POSTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPublishedArticles(section);
        if (!cancelled) {
          setArticles(data.length > 0 ? data : BLOG_POSTS);
        }
      } catch (err) {
        if (!cancelled) {
          // Silently fall back to static data — no error shown to public
          setArticles(BLOG_POSTS);
          setError(
            err instanceof Error ? err.message : 'Failed to load articles'
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [section]);

  return { articles, isLoading, error };
};
