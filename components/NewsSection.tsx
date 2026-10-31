import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  ExternalLink,
  Newspaper,
  X,
  ArrowRight,
} from 'lucide-react';
import Logo from './Logo';
import { BLOG_POSTS } from '../constants/blogData';
import BlogModal from './BlogModal';
import { BlogPost } from '../types/blog';
import { useArticles } from '../hooks/useArticles';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  source: string;
  gallery?: BlogPost['gallery'];
}

const NewsSection: React.FC = () => {
  const { articles: dynamicPosts } = useArticles('news_desk');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<BlogPost | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Map to the internal NewsItem shape (same as before)
  const newsData: NewsItem[] = dynamicPosts.map((post) => ({
    id: post.id.toString(),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: post.date,
    category: post.category,
    image: post.image,
    source: 'GeoMining Technical Desk',
    gallery: post.gallery,
  }));

  // Reset index when data changes to avoid out-of-bounds
  useEffect(() => {
    setCurrentIndex(0);
  }, [dynamicPosts]);

  useEffect(() => {
    // 2-day automatically refresh content logic
    const lastRefresh = localStorage.getItem('lastNewsRefresh');
    const now = Date.now();
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

    if (!lastRefresh || now - parseInt(lastRefresh) > twoDaysMs) {
      localStorage.setItem('lastNewsRefresh', now.toString());
    }

    if (isAutoPlaying && newsData.length > 0) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, isAutoPlaying, newsData.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(newsData.length, 1));
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + Math.max(newsData.length, 1)) % Math.max(newsData.length, 1)
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Build a BlogPost-compatible object for the modal
  const openModal = (newsItem: NewsItem) => {
    const match = dynamicPosts.find((p) => p.id.toString() === newsItem.id);
    if (match) {
      setSelectedNews(match);
    } else {
      // Construct minimal BlogPost for modal
      setSelectedNews({
        id: parseInt(newsItem.id) || 0,
        slug: newsItem.slug,
        title: newsItem.title,
        excerpt: newsItem.excerpt,
        content: newsItem.content,
        category: newsItem.category,
        date: newsItem.date,
        readTime: '4 min read',
        author: newsItem.source,
        image: newsItem.image,
        gallery: newsItem.gallery,
      });
    }
  };

  const translateX = [
    'translate-x-0',
    '-translate-x-full',
    '-translate-x-[200%]',
    '-translate-x-[300%]',
    '-translate-x-[400%]',
    '-translate-x-[500%]',
    '-translate-x-[600%]',
    '-translate-x-[700%]',
    '-translate-x-[800%]',
    '-translate-x-[900%]',
  ];

  return (
    <section
      className="py-16 md:py-24 bg-slate-50 overflow-hidden scroll-mt-24 border-y border-slate-100"
      id="news"
    >
      <div className="max-w-[1600px] w-[95%] mx-auto px-4 md:px-8">
        {/* Header with Navigation Integration */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b border-slate-200 pb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-1 bg-amber-500 rounded-full"></div>
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">
                Industry Updates
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Mining &amp; Regional{' '}
              <span className="text-amber-500 italic">News Desk</span>
            </h2>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl w-full shadow-2xl bg-white border border-slate-100">
          <div
            className={`flex transition-transform duration-700 ease-in-out ${
              translateX[currentIndex] ?? 'translate-x-0'
            }`}
          >
            {newsData.map((news) => (
              <div key={news.id} className="w-full shrink-0">
                <div className="flex flex-col md:flex-row h-full min-h-[280px] md:h-[370px] lg:h-[410px]">
                  {/* Image Side */}
                  <div className="w-full md:w-[45%] relative overflow-hidden group h-48 sm:h-56 md:h-full shrink-0">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors duration-500"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-500 text-slate-900 px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-widest rounded shadow-xl">
                        {news.category}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-[55%] p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white">
                    <div className="flex items-center gap-3 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-amber-500" />
                        {news.date}
                      </div>
                      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Newspaper size={14} />
                        {news.source}
                      </div>
                    </div>

                    <button
                      onClick={() => openModal(news)}
                      className="text-2xl md:text-3xl lg:text-[2rem] font-black text-slate-900 mb-3 leading-tight tracking-tighter hover:text-amber-600 transition-colors cursor-pointer shrink-0 text-left"
                    >
                      {news.title}
                    </button>
                    <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-0 line-clamp-2 md:line-clamp-3 font-normal text-justify">
                      {news.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                      <button
                        onClick={() => openModal(news)}
                        className="inline-flex items-center gap-3 text-slate-900 font-black text-xs md:text-sm uppercase tracking-widest hover:text-amber-500 transition-colors group"
                      >
                        Read Full Story
                        <div className="w-6 h-0.5 bg-slate-900 group-hover:bg-amber-500 group-hover:w-12 transition-all duration-300"></div>
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                        <Clock size={12} />4 min read
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators - Compact */}
        <div className="flex justify-center mt-6 gap-1.5">
          {newsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-1 transition-all duration-500 rounded-full ${currentIndex === idx ? 'w-8 bg-amber-500' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <BlogModal post={selectedNews} onClose={() => setSelectedNews(null)} />
    </section>
  );
};

export default NewsSection;
