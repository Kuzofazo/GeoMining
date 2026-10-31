import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../constants/blogData';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from 'lucide-react';

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post) {
      navigate('/blog');
    }
  }, [post, navigate]);

  if (!post) return null;

  // Simple related posts logic (same category or next in list)
  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.category === post.category && p.id !== post.id
  ).slice(0, 2);

  if (relatedPosts.length < 2) {
    const others = BLOG_POSTS.filter((p) => p.id !== post.id).slice(
      0,
      2 - relatedPosts.length
    );
    relatedPosts.push(...others);
  }

  return (
    <div className="bg-white">
      <SEO
        title={`${post.title} | GeoMining Blog`}
        description={post.excerpt}
        keywords={post.keywords}
        image={post.image}
      />

      <Hero
        title={post.title}
        category={post.category}
        subtitle={post.excerpt}
        showButtons={false}
        isFullHeight={false}
      />

      <article className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {/* Breadcrumbs & Back */}
          <div className="flex items-center justify-between mb-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-[#2d5a27] transition-colors"
            >
              <ArrowLeft size={16} /> Back to Insights
            </Link>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Link to="/" className="hover:text-slate-600">
                Home
              </Link>
              <ChevronRight size={10} />
              <Link to="/blog" className="hover:text-slate-600">
                Blog
              </Link>
              <ChevronRight size={10} />
              <span className="text-slate-900 truncate max-w-[150px]">
                {post.category}
              </span>
            </div>
          </div>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-100 mb-12 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-amber-500" />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-amber-500" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-2">
              <User size={14} className="text-amber-500" />
              {post.author}
            </span>
          </div>

          {/* Featured Image */}
          <div className="mb-16 rounded-sm overflow-hidden shadow-2xl">
            <img
              loading="lazy"
              decoding="async"
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>

          {/* Content Body */}
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-[#2d5a27] prose-img:rounded-sm">
            {post.content.split('\n').map((line, idx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith('###')) {
                return (
                  <h3 key={idx} className="text-2xl mt-12 mb-6">
                    {trimmed.replace('###', '').trim()}
                  </h3>
                );
              }
              const renderText = (text: string) => {
                const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);
                return parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                      <strong key={i} className="font-bold text-slate-900">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return part;
                });
              };

              if (
                trimmed.startsWith('•') ||
                trimmed.startsWith('- ') ||
                trimmed.startsWith('* ')
              ) {
                const bulletText = trimmed.replace(/^[•\-\*]\s*/, '');
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 my-2 text-slate-700 leading-relaxed"
                  >
                    <span className="text-amber-500 font-bold shrink-0 mt-0.5">
                      •
                    </span>
                    <span>{renderText(bulletText)}</span>
                  </div>
                );
              }

              return (
                <p key={idx} className="mb-6 text-justify">
                  {renderText(trimmed)}
                </p>
              );
            })}
          </div>

          {/* Event Photo Highlights & Additional Photos */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">
                  Conference Photo Highlights
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {post.gallery.map((item, gIdx) => {
                  const imgUrl = typeof item === 'string' ? item : item.url;
                  const caption =
                    typeof item === 'string' ? '' : item.caption;
                  const alt =
                    typeof item === 'string'
                      ? `${post.title} photo ${gIdx + 1}`
                      : item.alt || caption || post.title;
                  return (
                    <figure
                      key={gIdx}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-md transition-all hover:shadow-xl hover:border-amber-500"
                    >
                      <div className="h-64 sm:h-72 overflow-hidden bg-slate-900 relative">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={imgUrl}
                          alt={alt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      {caption && (
                        <figcaption className="p-4 text-xs font-medium text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                          {caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            </div>
          )}

          {/* Share/Footer */}
          <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">
                Published by
              </h4>
              <p className="text-slate-500 text-sm font-medium">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC Technical Desk
              </p>
            </div>
            <Link
              to="/contact"
              className="bg-slate-900 text-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-sm hover:bg-amber-500 hover:text-slate-900 transition-all shadow-xl active:scale-95"
            >
              Discuss a Project
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-black text-slate-900 mb-12 uppercase tracking-widest text-center">
            Continue Reading
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id}
                to={`/blog/${rPost.slug}`}
                className="group bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-xl hover:border-amber-500 transition-all"
              >
                <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={rPost.image}
                    alt={rPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 sm:w-2/3 flex flex-col justify-center">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2">
                    {rPost.category}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-[#2d5a27] transition-colors">
                    {rPost.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {rPost.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostDetail;
