export type ArticleSection = 'news_desk' | 'latest_articles' | 'events';
export type ArticleStatus = 'draft' | 'published' | 'scheduled';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  section: ArticleSection;
  author: string;
  image_url: string;
  read_time: string;
  status: ArticleStatus;
  is_featured: boolean;
  publish_date: string; // ISO 8601
  created_at: string;
  updated_at: string;
}

export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  section: ArticleSection;
  author: string;
  image_url: string;
  read_time: string;
  status: ArticleStatus;
  is_featured: boolean;
  publish_date: string;
}

export const ARTICLE_CATEGORIES = [
  'Environmental',
  'Technology',
  'Industry Insights',
  'Sustainability',
  'Corporate',
  'Engineering',
  'Geology',
  'Governance',
  'Operations',
  'Social Responsibility',
] as const;

export const ARTICLE_SECTIONS: { value: ArticleSection; label: string }[] = [
  { value: 'news_desk', label: 'Mining & Regional News Desk' },
  { value: 'latest_articles', label: 'Latest Articles (Blog)' },
  { value: 'events', label: 'Events' },
];
