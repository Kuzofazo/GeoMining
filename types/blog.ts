export interface BlogGalleryItem {
  url: string;
  caption?: string;
  alt?: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  keywords?: string;
  gallery?: (string | BlogGalleryItem)[];
}
