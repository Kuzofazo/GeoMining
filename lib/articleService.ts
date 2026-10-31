import { supabase } from './supabase';
import {
  Article,
  ArticleFormData,
  ArticleSection,
  ArticleStatus,
} from '../types/article';
import { BlogPost } from '../types/blog';
import { BLOG_POSTS } from '../constants/blogData';

// ─── SQL Setup Script (displayed in admin for one-time setup) ──────────────
export const ARTICLES_TABLE_SQL = `
-- Create the articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT 'Industry Insights',
  section TEXT DEFAULT 'news_desk' CHECK (section IN ('news_desk', 'latest_articles', 'events')),
  author TEXT DEFAULT 'Technical Team',
  image_url TEXT DEFAULT '',
  read_time TEXT DEFAULT '5 min read',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  is_featured BOOLEAN DEFAULT false,
  publish_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read for published articles
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (status = 'published' AND publish_date <= now());

-- Allow all operations for authenticated service role (admin)
CREATE POLICY "Service role has full access"
  ON articles FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for article images (run separately in Storage tab)
-- Bucket name: article-images (set to public)
`;

// ─── Utility: Convert Supabase row → BlogPost (for backward compat) ────────
export const articleToBlogPost = (article: Article): BlogPost => ({
  id: parseInt(article.id.replace(/-/g, '').slice(0, 8), 16) || Date.now(),
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  content: article.content,
  category: article.category,
  date: new Date(article.publish_date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  }),
  readTime: article.read_time,
  author: article.author,
  image: article.image_url,
  keywords: '',
});

// ─── Utility: Auto-generate slug from title ────────────────────────────────
export const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

// ─── Check if articles table exists ────────────────────────────────────────
export const checkArticlesTableExists = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('articles').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};

// ─── Public: Fetch published articles (with static fallback) ───────────────
export const fetchPublishedArticles = async (
  section?: ArticleSection
): Promise<BlogPost[]> => {
  try {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .lte('publish_date', new Date().toISOString())
      .order('publish_date', { ascending: false });

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;

    if (error || !data) {
      return BLOG_POSTS.filter((_) => true); // return all as fallback
    }

    const dynamicPosts = data.map(articleToBlogPost);

    // Merge dynamic posts with static posts to ensure new static events always show
    const staticToKeep = BLOG_POSTS.filter(
      (sp) =>
        !dynamicPosts.some((dp) => dp.title === sp.title || dp.slug === sp.slug)
    );

    const combined = [...dynamicPosts, ...staticToKeep];

    // Sort combined articles by date descending
    combined.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
    });

    return combined;
  } catch {
    return BLOG_POSTS;
  }
};

// ─── Admin: Fetch ALL articles (any status) ────────────────────────────────
export const fetchAllArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// ─── Admin: Create article ─────────────────────────────────────────────────
export const createArticle = async (
  formData: ArticleFormData
): Promise<Article> => {
  const payload = {
    ...formData,
    slug: formData.slug || generateSlug(formData.title),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('articles')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ─── Admin: Update article ─────────────────────────────────────────────────
export const updateArticle = async (
  id: string,
  formData: Partial<ArticleFormData>
): Promise<Article> => {
  const payload = {
    ...formData,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('articles')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ─── Admin: Delete article ─────────────────────────────────────────────────
export const deleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
};

// ─── Admin: Upload image to Supabase Storage ──────────────────────────────
export const uploadArticleImage = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from('article-images')
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('article-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};
