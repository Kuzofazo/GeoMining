import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  FileText,
  Users,
  Settings,
  Download,
  Check,
  X,
  Briefcase,
  LogOut,
  TrendingUp,
  Activity,
  Award,
  Search,
  Mail,
  Menu,
  Handshake,
  MessageSquare,
  Newspaper,
  Edit3,
  Eye,
  Clock,
  Calendar,
  ImageIcon,
  Globe,
  Star,
  StarOff,
  ChevronDown,
  Copy,
  AlertCircle,
  CheckCircle,
  BarChart2,
} from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { JobPosting, JobApplication } from '../types/jobs';
import { PartnerInquiry, ContactMessage } from '../types/inquiries';
import {
  Article,
  ArticleFormData,
  ArticleSection,
  ArticleStatus,
  ARTICLE_CATEGORIES,
  ARTICLE_SECTIONS,
} from '../types/article';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import {
  fetchAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  uploadArticleImage,
  generateSlug,
  checkArticlesTableExists,
  ARTICLES_TABLE_SQL,
} from '../lib/articleService';

// ─── Article Status Badge ─────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: ArticleStatus }> = ({ status }) => {
  const styles = {
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-slate-50 text-slate-600 border-slate-200',
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  const icons = {
    published: <Globe size={10} />,
    draft: <FileText size={10} />,
    scheduled: <Clock size={10} />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
};

// ─── Section Label ───────────────────────────────────────────────────────
const SectionLabel: React.FC<{ section: ArticleSection }> = ({ section }) => {
  const labels: Record<ArticleSection, string> = {
    news_desk: 'News Desk',
    latest_articles: 'Blog',
    events: 'Events',
  };
  const colors: Record<ArticleSection, string> = {
    news_desk: 'bg-amber-50 text-amber-700 border-amber-200',
    latest_articles: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    events: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${colors[section]}`}
    >
      {labels[section]}
    </span>
  );
};

// ─── Article Editor Modal ─────────────────────────────────────────────────
interface ArticleEditorModalProps {
  article: Article | null; // null = create new
  onClose: () => void;
  onSaved: () => void;
}

const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  article,
  onClose,
  onSaved,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const defaultDate = new Date().toISOString().slice(0, 16);

  const [form, setForm] = useState<ArticleFormData>({
    title: article?.title ?? '',
    slug: article?.slug ?? '',
    excerpt: article?.excerpt ?? '',
    content: article?.content ?? '',
    category: article?.category ?? 'Industry Insights',
    section: article?.section ?? 'news_desk',
    author: article?.author ?? 'Technical Team',
    image_url: article?.image_url ?? '',
    read_time: article?.read_time ?? '5 min read',
    status: article?.status ?? 'draft',
    is_featured: article?.is_featured ?? false,
    publish_date: article?.publish_date
      ? new Date(article.publish_date).toISOString().slice(0, 16)
      : defaultDate,
  });

  const set = (key: keyof ArticleFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (val: string) => {
    set('title', val);
    if (!slugManuallyEdited || !form.slug) {
      set('slug', generateSlug(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError('');
    try {
      const url = await uploadArticleImage(file);
      set('image_url', url);
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed. Use a URL instead.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (publishNow?: boolean) => {
    if (!form.title.trim()) {
      setSaveError('Title is required.');
      return;
    }
    setIsSaving(true);
    setSaveError('');
    try {
      const payload: ArticleFormData = {
        ...form,
        status: publishNow ? 'published' : form.status,
        publish_date: publishNow
          ? new Date().toISOString()
          : new Date(form.publish_date).toISOString(),
      };

      if (article?.id) {
        await updateArticle(article.id, payload);
      } else {
        await createArticle(payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save. Check your Supabase setup.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full sm:w-auto sm:min-w-[680px] max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-8 sm:p-10 animate-[slideUp_0.3s_ease-out]">
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(60px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {article ? 'Edit Article' : 'New Article'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {article
                ? 'Update the article details below.'
                : 'Create a new article for your website.'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            title="Close"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {saveError && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium p-4 rounded-2xl">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {saveError}
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
              Article Title *
            </label>
            <input
              required
              placeholder="e.g. Why EIA is Critical in Mining"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all font-bold text-slate-900"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
              URL Slug
            </label>
            <input
              placeholder="auto-generated-from-title"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-mono text-slate-600"
              value={form.slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                set('slug', e.target.value);
              }}
            />
          </div>

          {/* Section + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="section"
                className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1"
              >
                Assign to Section *
              </label>
              <select
                id="section"
                title="Section"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-bold appearance-none cursor-pointer"
                value={form.section}
                onChange={(e) =>
                  set('section', e.target.value as ArticleSection)
                }
              >
                {ARTICLE_SECTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1"
              >
                Category *
              </label>
              <select
                id="category"
                title="Category"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-bold appearance-none cursor-pointer"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {ARTICLE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Author + Read Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                Author
              </label>
              <input
                placeholder="e.g. Technical Team"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-medium"
                value={form.author}
                onChange={(e) => set('author', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                Read Time
              </label>
              <input
                placeholder="e.g. 5 min read"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-medium"
                value={form.read_time}
                onChange={(e) => set('read_time', e.target.value)}
              />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label
              htmlFor="image_url"
              className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1"
            >
              Featured Image
            </label>
            <div className="flex gap-3">
              <input
                id="image_url"
                title="Image URL"
                placeholder="https://... or upload below"
                className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-medium"
                value={form.image_url}
                onChange={(e) => set('image_url', e.target.value)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="shrink-0 flex items-center gap-2 px-5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all disabled:opacity-50"
              >
                <ImageIcon size={16} />
                {isUploading ? 'Uploading…' : 'Upload'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                title="Upload Featured Image"
                aria-label="Upload Featured Image"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {uploadError && (
              <p className="text-xs text-red-500 mt-2 ml-1">{uploadError}</p>
            )}
            {form.image_url && !uploadError && (
              <div className="mt-3 relative rounded-xl overflow-hidden h-32 border border-slate-200">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = 'none')
                  }
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
              Excerpt / Summary
            </label>
            <textarea
              rows={3}
              placeholder="A short, compelling summary of the article..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all resize-none text-sm leading-relaxed font-medium"
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
              Full Article Content
              <span className="ml-2 normal-case font-medium text-slate-400">
                (Use ### for subheadings)
              </span>
            </label>
            <textarea
              rows={12}
              placeholder={`Write the full article here...\n\n### Subheading\nContent paragraph goes here.\n\n### Another Subheading\nMore content...`}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all resize-y text-sm leading-relaxed font-medium font-mono"
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
            />
          </div>

          {/* Publication Settings */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Publication Settings
            </p>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-3">
                Status
              </label>
              <div className="flex flex-wrap gap-3">
                {(['draft', 'published', 'scheduled'] as ArticleStatus[]).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set('status', s)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                        form.status === s
                          ? 'bg-[#2d5a27] text-white border-[#2d5a27] shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                {form.status === 'scheduled'
                  ? 'Schedule Date & Time'
                  : 'Publication Date'}
              </label>
              <input
                type="datetime-local"
                placeholder="Select date and time"
                title="Publish Date"
                className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-medium"
                value={form.publish_date}
                onChange={(e) => set('publish_date', e.target.value)}
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700">
                  Featured Article
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Highlights this article in the News Desk carousel
                </p>
              </div>
              <button
                type="button"
                aria-label="Toggle Featured"
                title="Toggle Featured"
                onClick={() => set('is_featured', !form.is_featured)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  form.is_featured ? 'bg-amber-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                    form.is_featured ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all text-sm uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex-1 bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(form.status === 'published')}
            disabled={isSaving}
            className="flex-[2] bg-[#2d5a27] text-white font-bold py-4 rounded-xl hover:bg-slate-900 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm uppercase tracking-widest disabled:opacity-50"
          >
            {isSaving
              ? 'Publishing…'
              : form.status === 'published'
                ? 'Publish Now'
                : 'Save & Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DB Setup Modal ───────────────────────────────────────────────────────
const DbSetupModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(ARTICLES_TABLE_SQL.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                One-Time Database Setup Required
              </h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                The{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">
                  articles
                </code>{' '}
                table doesn't exist yet. Run the SQL below in your{' '}
                <strong>Supabase SQL Editor</strong> to enable dynamic article
                management.
              </p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="relative">
            <pre className="bg-slate-900 text-green-400 text-xs font-mono p-6 rounded-2xl overflow-auto max-h-64 leading-relaxed">
              {ARTICLES_TABLE_SQL.trim()}
            </pre>
            <button
              onClick={handleCopy}
              aria-label="Copy SQL"
              className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle size={14} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy SQL
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            After running the SQL, also create a public storage bucket named{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              article-images
            </code>{' '}
            in the Supabase Storage tab.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all text-sm uppercase tracking-widest"
            >
              Close
            </button>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[2] bg-[#2d5a27] text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-all text-sm uppercase tracking-widest text-center"
            >
              Open Supabase Dashboard →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main CareersAdmin Component ──────────────────────────────────────────
const CareersAdmin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const isAuthed = sessionStorage.getItem('g_mec_admin_auth') === 'true';
    if (isAuthed) setIsAuthenticated(true);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const masterKey = import.meta.env.VITE_ADMIN_ACCESS_KEY;
    if (!masterKey) {
      console.error(
        '[Admin] VITE_ADMIN_ACCESS_KEY is not set. Admin access is disabled.'
      );
      setLoginError(true);
      setTimeout(() => setLoginError(false), 500);
      return;
    }
    if (accessKey === masterKey) {
      setIsAuthenticated(true);
      setLoginError(false);
      sessionStorage.setItem('g_mec_admin_auth', 'true');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 500);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccessKey('');
    sessionStorage.removeItem('g_mec_admin_auth');
  };

  // ── State ─────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [partners, setPartners] = useState<PartnerInquiry[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [dbExists, setDbExists] = useState<boolean | null>(null);

  const [activeTab, setActiveTab] = useState<
    'jobs' | 'applications' | 'partners' | 'contacts' | 'articles' | 'analytics'
  >('jobs');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDbSetup, setShowDbSetup] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articleFilter, setArticleFilter] = useState<{
    section: string;
    status: string;
  }>({ section: 'all', status: 'all' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [newJob, setNewJob] = useState<Partial<JobPosting>>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: [],
    deadline: '',
  });

  // ── Data Fetching ─────────────────────────────────────────────────────
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });
      if (!jobsError && jobsData) {
        setJobs(
          jobsData.map((job) => ({
            id: job.id,
            title: job.title,
            department: job.department,
            location: job.location,
            type: job.type,
            description: job.description,
            responsibilities: job.responsibilities || [],
            requirements: job.requirements || [],
            skills: job.skills || [],
            offers: job.offers || [],
            deadline: job.deadline,
            postedAt: job.posted_at,
          }))
        );
      }

      // Applications
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (!appsError && appsData) {
        setApplications(
          appsData.map((app) => ({
            id: app.id,
            jobId: app.job_id,
            jobTitle: app.job_title,
            fullName: app.full_name,
            email: app.email,
            phone: app.phone,
            experience: app.experience,
            skills: app.skills,
            linkedIn: app.linked_in || undefined,
            coverLetter: app.cover_letter,
            resumeUrl: app.resume_url,
            status: app.status as any,
            submittedAt: app.submitted_at,
          }))
        );
      }

      // Partners
      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (partnersData) setPartners(partnersData);

      // Contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (contactsData) setContacts(contactsData);

      // Articles
      const tableExists = await checkArticlesTableExists();
      setDbExists(tableExists);
      if (tableExists) {
        const arts = await fetchAllArticles();
        setArticles(arts);
      }
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshArticles = async () => {
    try {
      const arts = await fetchAllArticles();
      setArticles(arts);
    } catch (err) {
      console.error('Article refresh error:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  // ── Job handlers ──────────────────────────────────────────────────────
  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('jobs')
        .insert([
          {
            title: newJob.title,
            department: newJob.department,
            location: newJob.location,
            type: newJob.type,
            description: newJob.description,
            deadline: newJob.deadline,
          },
        ])
        .select();
      if (error) throw error;
      await fetchData();
      setShowAddModal(false);
      setNewJob({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: [],
        deadline: '',
      });
    } catch (error) {
      console.error('Failed to add job:', error);
      alert('Failed to post job to database.');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
      } catch (error) {
        console.error('Failed to delete job:', error);
        alert('Failed to delete job from database.');
      }
    }
  };

  const updateAppStatus = async (
    id: string,
    status: JobApplication['status']
  ) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update application status in database.');
    }
  };

  const handleDownloadCV = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(fileName, 60);
      if (error) throw new Error('Could not retrieve CV: ' + error.message);
      if (data?.signedUrl) window.open(data.signedUrl, '_blank');
      else throw new Error('Failed to generate download URL');
    } catch (error: any) {
      console.error('Download error:', error);
      alert(error.message || 'There was an issue downloading the CV.');
    }
  };

  // ── Article handlers ──────────────────────────────────────────────────
  const handleDeleteArticle = async (id: string) => {
    setArticleToDelete(id);
  };

  const confirmDeleteArticle = async () => {
    if (!articleToDelete) return;
    try {
      await deleteArticle(articleToDelete);
      await refreshArticles();
      setArticleToDelete(null);
    } catch (err: any) {
      alert(
        err.message || 'Failed to delete article. Check database policies.'
      );
    }
  };

  const handleToggleFeatured = async (article: Article) => {
    try {
      await updateArticle(article.id, { is_featured: !article.is_featured });
      await refreshArticles();
    } catch (err) {
      console.error('Toggle featured failed:', err);
    }
  };

  const handleQuickPublish = async (article: Article) => {
    try {
      await updateArticle(article.id, {
        status: 'published',
        publish_date: new Date().toISOString(),
      });
      await refreshArticles();
    } catch (err: any) {
      alert(err.message || 'Failed to publish article.');
    }
  };

  // ── Computed stats ────────────────────────────────────────────────────
  const stats = {
    liveJobs: jobs.length,
    totalApplicants: applications.length,
    interviewing: applications.filter((a) => a.status === 'Interviewing')
      .length,
    hired: applications.filter((a) => a.status === 'Hired').length,
  };

  const articleStats = {
    total: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    draft: articles.filter((a) => a.status === 'draft').length,
    scheduled: articles.filter((a) => a.status === 'scheduled').length,
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = articles.filter((a) => {
    const sectionMatch =
      articleFilter.section === 'all' || a.section === articleFilter.section;
    const statusMatch =
      articleFilter.status === 'all' || a.status === articleFilter.status;
    const searchMatch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    return sectionMatch && statusMatch && searchMatch;
  });

  // ── Login Screen ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        <SEO
          title="Admin Access"
          description="Restricted area for GeoMining administrators."
          noIndex={true}
        />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2d5a27] rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500 rounded-full blur-[120px] opacity-20"></div>

        <div
          className={`relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl text-center z-10 transition-transform ${loginError ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
        >
          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20%, 60% { transform: translateX(-10px); }
              40%, 80% { transform: translateX(10px); }
            }
          `}</style>
          <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/30">
            <Briefcase size={36} className="animate-pulse" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">
            Intelligence Center
          </h2>
          <p className="text-slate-300 mb-8 font-medium text-sm">
            Enter the master key to access the GeoMining recruitment control
            panel.
          </p>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Access Key"
                className={`w-full px-5 py-4 bg-slate-900/50 border ${loginError ? 'border-red-500' : 'border-white/10'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-center text-lg tracking-[0.2em] font-bold text-white transition-all`}
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-black py-4 rounded-xl uppercase tracking-widest hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Unlock Portal
            </button>
          </form>

          <button
            onClick={() => (window.location.href = '/')}
            className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
          >
            &larr; Return to Website
          </button>
        </div>
      </div>
    );
  }

  // ── Nav Item ──────────────────────────────────────────────────────────
  const NavItem = ({
    id,
    icon: Icon,
    label,
    count,
  }: {
    id: typeof activeTab;
    icon: any;
    label: string;
    count?: number;
  }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
        setSearchQuery('');
      }}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
        activeTab === id
          ? 'bg-[#2d5a27] text-white shadow-md'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          size={18}
          className={
            activeTab === id
              ? 'text-amber-500'
              : 'text-slate-500 group-hover:text-amber-400'
          }
        />
        <span className="uppercase tracking-widest text-[11px]">{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
            activeTab === id
              ? 'bg-white/20 text-white'
              : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  // ── Dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-slate-50 flex font-sans">
      <SEO
        title="Intelligence Center | GeoMining"
        description="GeoMining Administration."
        noIndex={true}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-dvh w-[280px] bg-[#1e293b] border-r border-slate-800 z-[60] flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2d5a27] rounded-xl flex items-center justify-center shadow-inner border border-white/10">
              <Settings size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest text-white leading-tight">
                Intelligence
              </h1>
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em]">
                Center
              </span>
            </div>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            aria-label="Close sidebar"
            title="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 hide-scrollbar">
          {/* Recruitment */}
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 px-2">
            Recruitment
          </div>
          <NavItem
            id="jobs"
            icon={Briefcase}
            label="Vacancies"
            count={jobs.length}
          />
          <NavItem
            id="applications"
            icon={Users}
            label="Applicants"
            count={applications.length}
          />

          {/* Inquiries */}
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 px-2 mt-8">
            Inquiries
          </div>
          <NavItem
            id="partners"
            icon={Handshake}
            label="Partner with us"
            count={partners.length}
          />
          <NavItem
            id="contacts"
            icon={MessageSquare}
            label="Contact"
            count={contacts.length}
          />

          {/* Content */}
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 px-2 mt-8">
            Content
          </div>
          <NavItem
            id="articles"
            icon={Newspaper}
            label="News Articles"
            count={articles.length}
          />

          {/* Analytics */}
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4 px-2 mt-8">
            Analytics
          </div>
          <NavItem id="analytics" icon={BarChart2} label="Website Analytics" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all uppercase tracking-widest"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-dvh overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-6 shrink-0 sticky top-0 z-[40]">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              aria-label="Open menu"
              title="Open menu"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">
              {activeTab === 'jobs' && 'Vacancies'}
              {activeTab === 'applications' && 'Applicants'}
              {activeTab === 'partners' && 'Partner with us'}
              {activeTab === 'contacts' && 'Contact Messages'}
              {activeTab === 'articles' && 'News Articles'}
              {activeTab === 'analytics' && 'Website Analytics'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'articles' && dbExists === false && (
              <button
                onClick={() => setShowDbSetup(true)}
                className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-widest hover:bg-amber-100 transition-all"
              >
                <AlertCircle size={14} />
                Setup DB
              </button>
            )}
            {activeTab === 'articles' && (
              <button
                onClick={() => setEditingArticle(null)}
                className="bg-[#2d5a27] text-white font-bold py-2.5 px-5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">New Article</span>
              </button>
            )}
            {activeTab === 'jobs' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#2d5a27] text-white font-bold py-2.5 px-5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Vacancy</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Stats - visible on all tabs */}
          {activeTab !== 'articles' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Live Vacancies
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {stats.liveJobs}
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Total Applicants
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {stats.totalApplicants}
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Handshake size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Partner With Us
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {partners.length}
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Contact
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {contacts.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Articles Stats ── */}
          {activeTab === 'articles' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {[
                {
                  label: 'Total Articles',
                  value: articleStats.total,
                  color: 'bg-slate-50 text-slate-600',
                  icon: <Newspaper size={20} />,
                },
                {
                  label: 'Published',
                  value: articleStats.published,
                  color: 'bg-emerald-50 text-emerald-600',
                  icon: <Globe size={20} />,
                },
                {
                  label: 'Drafts',
                  value: articleStats.draft,
                  color: 'bg-amber-50 text-amber-600',
                  icon: <FileText size={20} />,
                },
                {
                  label: 'Scheduled',
                  value: articleStats.scheduled,
                  color: 'bg-blue-50 text-blue-600',
                  icon: <Clock size={20} />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-12 h-12 border-4 border-[#2d5a27]/20 border-t-[#2d5a27] rounded-full animate-spin"></div>
            </div>
          ) : activeTab === 'articles' ? (
            /* ─── ARTICLES TAB ─── */
            <div className="space-y-6">
              {/* DB not set up warning */}
              {dbExists === false && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                  <AlertCircle
                    size={20}
                    className="text-amber-600 shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-black text-amber-800 text-sm">
                      Database table not found
                    </p>
                    <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                      The <code>articles</code> table hasn't been created in
                      Supabase yet. Click "View SQL" to get the SQL. Until then,
                      the website displays static articles.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDbSetup(true)}
                    className="shrink-0 bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-amber-600 transition-colors"
                  >
                    View SQL
                  </button>
                </div>
              )}

              {/* Filters toolbar */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30 focus:border-[#2d5a27] transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  aria-label="Filter by section"
                  title="Filter by section"
                  className="px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30 focus:border-[#2d5a27] shadow-sm appearance-none cursor-pointer"
                  value={articleFilter.section}
                  onChange={(e) =>
                    setArticleFilter((f) => ({
                      ...f,
                      section: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Sections</option>
                  {ARTICLE_SECTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Filter by status"
                  title="Filter by status"
                  className="px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30 focus:border-[#2d5a27] shadow-sm appearance-none cursor-pointer"
                  value={articleFilter.status}
                  onChange={(e) =>
                    setArticleFilter((f) => ({
                      ...f,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {/* Articles table */}
              {dbExists ? (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                      <thead className="bg-slate-50/80 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Article
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Section
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Status
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Publish Date
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredArticles.map((art) => (
                          <tr
                            key={art.id}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                {art.image_url ? (
                                  <img
                                    src={art.image_url}
                                    alt={art.title}
                                    className="w-14 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                                    onError={(e) =>
                                      ((
                                        e.target as HTMLImageElement
                                      ).style.display = 'none')
                                    }
                                  />
                                ) : (
                                  <div className="w-14 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                    <ImageIcon
                                      size={16}
                                      className="text-slate-300"
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-2">
                                    {art.title}
                                    {art.is_featured && (
                                      <Star
                                        size={12}
                                        className="text-amber-500 fill-amber-500"
                                      />
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-400 mt-0.5">
                                    {art.category} · {art.author}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <SectionLabel section={art.section} />
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <StatusBadge status={art.status} />
                                {art.status === 'draft' && (
                                  <button
                                    onClick={() => handleQuickPublish(art)}
                                    title="Publish now"
                                    className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Publish
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-sm font-medium text-slate-600">
                              {new Date(art.publish_date).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleToggleFeatured(art)}
                                  title={
                                    art.is_featured
                                      ? 'Remove featured'
                                      : 'Mark as featured'
                                  }
                                  className={`p-2.5 rounded-xl border transition-all ${
                                    art.is_featured
                                      ? 'bg-amber-50 text-amber-500 border-amber-200 hover:bg-amber-100'
                                      : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 border-transparent hover:border-amber-200'
                                  }`}
                                >
                                  {art.is_featured ? (
                                    <Star
                                      size={16}
                                      className="fill-amber-500"
                                    />
                                  ) : (
                                    <StarOff size={16} />
                                  )}
                                </button>
                                <button
                                  onClick={() => setEditingArticle(art)}
                                  title="Edit article"
                                  className="p-2.5 text-slate-400 hover:text-[#2d5a27] hover:bg-[#2d5a27]/5 border border-transparent hover:border-[#2d5a27]/20 rounded-xl transition-all"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteArticle(art.id)}
                                  title="Delete article"
                                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredArticles.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-32 text-center">
                              <div className="inline-flex flex-col items-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                  <Newspaper
                                    size={28}
                                    className="text-slate-300"
                                  />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">
                                  No Articles Found
                                </h3>
                                <p className="text-slate-500 mb-6 text-sm max-w-xs">
                                  {articles.length === 0
                                    ? 'Create your first article to start publishing content dynamically.'
                                    : 'No articles match your current filters.'}
                                </p>
                                {articles.length === 0 && (
                                  <button
                                    onClick={() => setEditingArticle(null)}
                                    className="bg-[#2d5a27] text-white font-bold py-2.5 px-6 rounded-xl hover:shadow-lg transition-all text-xs uppercase tracking-widest"
                                  >
                                    Create First Article
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* DB not set up — placeholder */
                <div className="bg-white rounded-3xl py-32 px-6 text-center border border-slate-200 shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <Newspaper size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">
                    Database Setup Required
                  </h3>
                  <p className="text-slate-500 mb-8 text-sm max-w-sm leading-relaxed">
                    Complete the one-time Supabase setup to enable dynamic
                    article management.
                  </p>
                  <button
                    onClick={() => setShowDbSetup(true)}
                    className="bg-[#2d5a27] text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all text-xs uppercase tracking-widest"
                  >
                    Setup Database
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === 'jobs' ? (
            /* ─── JOBS TAB ─── */
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Role &amp; Title
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Department
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Location &amp; Type
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Deadline
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                        Manage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="font-bold text-slate-900 text-base">
                            {job.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <span>
                              ID: {job.id?.substring(0, 8).toUpperCase()}
                            </span>
                            <span>•</span>
                            <span>
                              Posted{' '}
                              {new Date(job.postedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100/50">
                            {job.department}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="text-sm font-bold text-slate-700">
                              {job.location}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                              {job.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`text-sm font-bold ${
                              new Date(job.deadline) < new Date()
                                ? 'text-red-500'
                                : 'text-emerald-600'
                            }`}
                          >
                            {new Date(job.deadline).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleDeleteJob(job.id!)}
                              title="Delete Job"
                              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {jobs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-32 text-center">
                          <div className="inline-flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                              <Briefcase size={28} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">
                              No Active Postings
                            </h3>
                            <p className="text-slate-500 mb-6 text-sm">
                              Create a new job posting to start receiving
                              applications.
                            </p>
                            <button
                              onClick={() => setShowAddModal(true)}
                              className="bg-[#2d5a27] text-white font-bold py-2.5 px-6 rounded-xl hover:shadow-lg transition-all text-xs uppercase tracking-widest"
                            >
                              Create Posting
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'applications' ? (
            /* ─── APPLICATIONS TAB ─── */
            <div className="space-y-6">
              <div className="relative max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search applicants by name or role..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30 focus:border-[#2d5a27] transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="p-6 sm:p-8 border-b border-slate-100 relative">
                      <div
                        className={`absolute top-6 right-6 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                          app.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : app.status === 'Interviewing'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : app.status === 'Hired'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {app.status}
                      </div>

                      <div className="flex items-center gap-5 mb-6 pr-24">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-xl font-black text-slate-600 shadow-inner shrink-0">
                          {app.fullName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 leading-tight">
                            {app.fullName}
                          </h3>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                            Applied for{' '}
                            <span className="text-[#2d5a27] font-bold">
                              {app.jobTitle}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Experience
                          </p>
                          <p className="font-bold text-slate-800">
                            {app.experience} Years
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Applied On
                          </p>
                          <p className="font-bold text-slate-800">
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex-grow">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Cover Letter / Details
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        "{app.coverLetter}"
                      </p>
                      <div className="mt-6 flex flex-col gap-3">
                        <a
                          href={`mailto:${app.email}`}
                          className="text-sm font-bold text-slate-600 flex items-center gap-3 hover:text-blue-600 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 border border-slate-100 group-hover:border-blue-100 transition-colors">
                            <Mail
                              size={14}
                              className="text-slate-400 group-hover:text-blue-500"
                            />
                          </div>
                          {app.email}
                        </a>
                        <a
                          href={`tel:${app.phone}`}
                          className="text-sm font-bold text-slate-600 flex items-center gap-3 hover:text-blue-600 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 border border-slate-100 group-hover:border-blue-100 transition-colors">
                            <FileText
                              size={14}
                              className="text-slate-400 group-hover:text-blue-500"
                            />
                          </div>
                          {app.phone}
                        </a>
                        <div className="text-sm font-bold text-slate-600 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                            <Award size={14} className="text-slate-400" />
                          </div>
                          {app.skills}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-wrap sm:flex-nowrap gap-3">
                      <button
                        onClick={() => handleDownloadCV(app.resumeUrl!)}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                      >
                        <Download size={16} className="text-slate-400" />
                        View CV
                      </button>

                      <div className="flex gap-2 flex-1 justify-end">
                        {app.status !== 'Hired' && (
                          <button
                            onClick={() =>
                              updateAppStatus(app.id!, 'Interviewing')
                            }
                            className="flex-1 sm:flex-none p-3 px-6 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-sm"
                          >
                            <TrendingUp size={16} />
                            <span className="hidden sm:inline">Progress</span>
                          </button>
                        )}
                        {app.status !== 'Rejected' && (
                          <button
                            onClick={() => updateAppStatus(app.id!, 'Rejected')}
                            className="flex-1 sm:flex-none p-3 px-6 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-sm"
                          >
                            <X size={16} />
                            <span className="hidden sm:inline">Decline</span>
                          </button>
                        )}
                        {app.status === 'Interviewing' && (
                          <button
                            onClick={() => updateAppStatus(app.id!, 'Hired')}
                            className="flex-1 sm:flex-none p-3 px-6 bg-[#2d5a27] text-white hover:bg-slate-900 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-sm"
                          >
                            <Check size={16} />
                            <span className="hidden sm:inline">Hire</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredApplications.length === 0 && applications.length > 0 && (
                <div className="text-center py-20 text-slate-500 font-medium">
                  No applicants match your search "{searchQuery}".
                </div>
              )}
              {applications.length === 0 && (
                <div className="bg-white rounded-3xl py-32 px-6 text-center border border-slate-200 shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <Users size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">
                    No Candidates Yet
                  </h3>
                  <p className="text-slate-500 max-w-md">
                    Once candidates apply for your open vacancies, they will
                    appear here for review.
                  </p>
                </div>
              )}
            </div>
          ) : activeTab === 'partners' ? (
            /* ─── PARTNERS TAB ─── */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1">
                        {partner.organization}
                      </h3>
                      <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                        <Users size={14} /> {partner.name}
                      </p>
                    </div>
                    <span className="bg-amber-50 text-amber-700 border border-amber-100/50 text-[10px] font-black uppercase px-4 py-1.5 rounded-full">
                      {partner.partnership_type}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl text-sm text-slate-600 italic mb-6 flex-grow border border-slate-100/50">
                    "{partner.message}"
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href={`mailto:${partner.email}`}
                      className="inline-flex items-center gap-2 bg-[#2d5a27]/10 text-[#2d5a27] font-bold text-sm px-4 py-2 rounded-xl hover:bg-[#2d5a27]/20 transition-colors"
                    >
                      <Mail size={16} /> Reply to {partner.email}
                    </a>
                  </div>
                </div>
              ))}
              {partners.length === 0 && (
                <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl py-32 text-center border border-slate-200 flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <Handshake size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    No Partnerships Yet
                  </h3>
                  <p className="text-slate-500">
                    Partnership inquiries will appear here.
                  </p>
                </div>
              )}
            </div>
          ) : activeTab === 'analytics' ? (
            /* ─── ANALYTICS TAB ─── */
            <AnalyticsDashboard />
          ) : (
            /* ─── CONTACTS TAB ─── */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {contact.name}
                      </h3>
                      <span className="inline-block mt-2 bg-slate-100 text-slate-700 text-[10px] font-black uppercase px-3 py-1 rounded-md">
                        {contact.service}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl text-sm text-slate-600 mb-6 flex-grow border border-slate-100/50">
                    {contact.message}
                  </div>
                  <div className="pt-2">
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-2 text-slate-600 font-bold text-sm hover:text-blue-600 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 border border-slate-100 transition-colors">
                        <Mail
                          size={14}
                          className="text-slate-400 group-hover:text-blue-500"
                        />
                      </div>
                      {contact.email}
                    </a>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="col-span-1 lg:col-span-3 bg-white rounded-3xl py-32 text-center border border-slate-200 flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <MessageSquare size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    No Contact Messages Yet
                  </h3>
                  <p className="text-slate-500">
                    General messages will appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Add Job Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddModal(false)}
          ></div>
          <div className="relative bg-white w-full sm:w-auto sm:min-w-[600px] max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 sm:p-10 transform transition-transform animate-[slideUp_0.3s_ease-out]">
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>

            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Create Job Posting
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Fill out the details to publish a new role.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
                title="Close modal"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddJob} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  Role Title
                </label>
                <input
                  required
                  placeholder="e.g. Senior Geologist"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all font-bold text-slate-900"
                  value={newJob.title}
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Department
                  </label>
                  <input
                    required
                    placeholder="e.g. Engineering"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-medium"
                    value={newJob.department}
                    onChange={(e) =>
                      setNewJob({ ...newJob, department: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Location
                  </label>
                  <input
                    required
                    placeholder="e.g. Monrovia, Liberia"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-medium"
                    value={newJob.location}
                    onChange={(e) =>
                      setNewJob({ ...newJob, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="employment-type"
                    className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >
                    Employment Type
                  </label>
                  <select
                    id="employment-type"
                    title="Employment Type"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-medium appearance-none cursor-pointer"
                    value={newJob.type}
                    onChange={(e) =>
                      setNewJob({ ...newJob, type: e.target.value as any })
                    }
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="application-deadline"
                    className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >
                    Application Deadline
                  </label>
                  <input
                    id="application-deadline"
                    title="Application Deadline"
                    required
                    type="date"
                    placeholder="Select date"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all text-sm font-medium"
                    value={newJob.deadline}
                    onChange={(e) =>
                      setNewJob({ ...newJob, deadline: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  Detailed Description
                </label>
                <textarea
                  required
                  placeholder="Describe the role, responsibilities, and qualifications..."
                  rows={5}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#2d5a27]/50 focus:border-[#2d5a27] transition-all resize-none text-sm leading-relaxed font-medium"
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
                  }
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all text-sm uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#2d5a27] text-white font-bold py-4 rounded-xl hover:bg-slate-900 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm uppercase tracking-widest"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Article Editor Modal ── */}
      {editingArticle !== null && (
        <ArticleEditorModal
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          onSaved={refreshArticles}
        />
      )}

      {/* Delete Confirmation Modal */}
      {articleToDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setArticleToDelete(null)}
          />
          <div className="relative bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Delete Article?
            </h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              This action cannot be undone. Are you sure you want to permanently
              delete this article from the database?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setArticleToDelete(null)}
                className="flex-1 py-4 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all uppercase tracking-widest text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteArticle}
                className="flex-1 py-4 font-bold text-white bg-red-500 hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 rounded-xl transition-all uppercase tracking-widest text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DB Setup Modal ── */}
      {showDbSetup && <DbSetupModal onClose={() => setShowDbSetup(false)} />}
    </div>
  );
};

export default CareersAdmin;
