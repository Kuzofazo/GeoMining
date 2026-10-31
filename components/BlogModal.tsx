import React, { useState } from 'react';
import { BlogPost } from '../types/blog';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
} from 'lucide-react';
import Logo from './Logo';

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!post) return null;

  const shareUrl = `${window.location.origin}/blog/${post.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(`Check out this article: ${post.title}`);
    const url = encodeURIComponent(shareUrl);

    let shareLink = '';
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(post.title)}`;
        break;
    }

    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 max-h-[90vh] flex flex-col border border-white/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close article"
          className="absolute top-3.5 right-3.5 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-amber-500 hover:text-slate-900 transition-all z-20 border border-white/20 shadow-xl"
        >
          <X size={20} className="sm:hidden" />
          <X size={24} className="hidden sm:block" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar">
          {/* Header Image Section */}
          <div className="h-[300px] md:h-[450px] relative">
            <img
              loading="lazy"
              decoding="async"
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="inline-block bg-amber-500 text-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm mb-6 shadow-xl">
                {post.category}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight py-1 max-w-3xl">
                {post.title}
              </h2>
            </div>
          </div>

          {/* Article Meta & Content */}
          <div className="px-8 md:px-16 py-12 md:py-16">
            <div className="flex flex-wrap items-center gap-8 pb-10 border-b border-slate-100 mb-12 text-xs font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2.5 text-[#2d5a27]">
                <Calendar size={16} />
                {post.date}
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={16} />
                {post.readTime}
              </div>
              <div className="flex items-center gap-2.5">
                <User size={16} />
                {post.author}
              </div>
            </div>

            {/* Content Body */}
            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-widest prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-[#2d5a27]">
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
              <div className="mt-12 pt-10 border-t border-slate-100">
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

            {/* Share Section */}
            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Share this article
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleShare('facebook')}
                  aria-label="Share on Facebook"
                  className="p-3 bg-slate-50 text-slate-600 rounded-full hover:bg-[#1877F2] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group"
                >
                  <Facebook size={18} />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  aria-label="Share on Twitter"
                  className="p-3 bg-slate-50 text-slate-600 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group"
                >
                  <Twitter size={18} />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  aria-label="Share on LinkedIn"
                  className="p-3 bg-slate-50 text-slate-600 rounded-full hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group"
                >
                  <Linkedin size={18} />
                </button>
                <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block"></div>
                <button
                  onClick={handleCopyLink}
                  aria-label="Copy Link"
                  className="px-4 py-2.5 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-200 transition-all shadow-sm flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
                >
                  {isCopied ? (
                    <>
                      <Check size={16} className="text-emerald-500" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Link2 size={16} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-12 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <Logo className="w-14 h-14 shadow-lg border border-slate-50" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
                    GEOMINING Technical Desk
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1">
                    Industry Insights ”¢ 2026
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="tel:+231777772778"
                  aria-label="Call GEOMINING"
                  className="p-4 bg-slate-50 text-slate-900 rounded-2xl hover:bg-[#2d5a27] hover:text-white transition-all shadow-sm"
                >
                  <Phone size={20} />
                </a>
                <a
                  href="mailto:geomininge@gmail.com"
                  aria-label="Email GEOMINING"
                  className="p-4 bg-slate-50 text-slate-900 rounded-2xl hover:bg-amber-500 hover:text-slate-900 transition-all shadow-sm"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
