import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import BlogModal from '../components/BlogModal';
import { BlogPost } from '../types/blog';
import { useArticles } from '../hooks/useArticles';

const Blog: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { articles } = useArticles('latest_articles');

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  // Display the most recent articles
  const displayedPosts = articles.slice(0, 6);

  return (
    <div
      className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <SEO
        title="Mining & Environmental Insights | GeoMining Consultancy Blog"
        description="Read the latest insights on Environmental Impact Assessments, GIS technologies, and sustainable mining solutions across Liberia and West Africa."
        keywords="Mining Blog Liberia, Environmental Impact Assessment in Mining, GIS Remote Sensing, Sustainable Mining Solutions Africa, West Africa Mining Challenges"
      />
      <Hero
        title="Industry Insights & News"
        category="Thought Leadership"
        subtitle="Expert analysis on mining, geology, and environmental sustainability in West Africa."
        showButtons={false}
        isFullHeight={false}
      />

      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-widest">
              Latest Articles
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Stay informed with our technical perspectives, operational
              strategies, and updates on the evolving regulatory landscape in
              the extractive sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {displayedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-sm border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:border-amber-500 transition-all animate-in fade-in slide-in-from-bottom-4 duration-700"
              >
                <div
                  className="relative h-56 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm shadow-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-amber-500" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-amber-500" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-black text-slate-900 mb-4 leading-tight group-hover:text-[#2d5a27] transition-colors line-clamp-3 cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="inline-flex items-center gap-2 text-[#2d5a27] font-bold text-[10px] uppercase tracking-widest hover:text-amber-500 transition-colors mt-auto group/btn text-left"
                  >
                    Read Full Article
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover/btn:translate-x-1"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
};

export default Blog;
