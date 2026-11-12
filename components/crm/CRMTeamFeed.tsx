import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Pin,
  Heart,
  CornerDownRight,
  Trash2,
  AlertCircle,
  Megaphone,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  RefreshCw,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import { TeamMessage } from '../../types/crm';

export const CRMTeamFeed: React.FC = () => {
  const [messages, setMessages] = useState<TeamMessage[]>(() => crmService.getTeamMessages());
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'announcement' | 'operational' | 'urgent' | 'general'>('operational');
  const [newPinned, setNewPinned] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const currentUser = crmService.getCurrentUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'administrator' || currentUser?.role === 'management';

  const refreshMessages = () => {
    setMessages(crmService.getTeamMessages());
  };

  useEffect(() => {
    const unsubscribe = crmService.subscribe(refreshMessages);
    return () => unsubscribe();
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await crmService.syncFromBackend();
    refreshMessages();
    setTimeout(() => setIsSyncing(false), 500);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) {
      alert('Please enter post content');
      return;
    }

    crmService.addTeamMessage({
      title: newTitle.trim() || undefined,
      content: newContent,
      category: newCategory,
      isPinned: newPinned && (isSuperAdmin || isAdmin),
    });

    setNewTitle('');
    setNewContent('');
    setNewCategory('operational');
    setNewPinned(false);
    refreshMessages();
  };

  const handleSendReply = (messageId: string) => {
    if (!replyInput.trim()) return;
    crmService.addMessageReply(messageId, replyInput);
    setReplyInput('');
    setActiveReplyId(null);
    refreshMessages();
  };

  const handleToggleLike = (messageId: string) => {
    crmService.toggleLikeMessage(messageId);
    refreshMessages();
  };

  const handleTogglePin = (messageId: string) => {
    crmService.togglePinMessage(messageId);
    refreshMessages();
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      crmService.deleteTeamMessage(messageId);
      refreshMessages();
    }
  };

  const getCategoryBadge = (category: TeamMessage['category']) => {
    switch (category) {
      case 'announcement':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1"><Megaphone size={10} /> Announcement</span>;
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 flex items-center gap-1"><AlertCircle size={10} /> Urgent Notice</span>;
      case 'operational':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-[#2a602f] border border-emerald-200">Operational</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">General</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 text-[#2a602f] border border-emerald-200">
              <MessageSquare size={20} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Internal Team Feed & Collaboration
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Bitrix24-style company broadcast wall, inter-departmental discussions & operational announcements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase Cloud Connected</span>
          </span>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Pull latest team broadcasts from Supabase database"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin text-[#2a602f]' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Feed'}</span>
          </button>
        </div>
      </div>

      {/* Broadcast Form Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-[#2a602f]" />
          <span>Broadcast Departmental Update as {currentUser?.name}</span>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Subject or Title (e.g. 📢 Updated Cadastre Concession Verification SOP)"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f] focus:bg-white font-semibold"
          />

          <textarea
            rows={3}
            required
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Share instructions, daily briefings, or questions with the team..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f] focus:bg-white resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
              >
                <option value="operational">Operational</option>
                <option value="announcement">Announcement</option>
                <option value="urgent">Urgent Directive</option>
                <option value="general">General</option>
              </select>

              {(isSuperAdmin || isAdmin) && (
                <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPinned}
                    onChange={(e) => setNewPinned(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#2a602f] rounded"
                  />
                  <span>Pin to top</span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#2a602f] hover:bg-[#224f26] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Send size={13} />
              <span>Broadcast Update</span>
            </button>
          </div>
        </form>
      </div>

      {/* Messages Timeline */}
      <div className="space-y-4">
        {messages.map((msg) => {
          const userLiked = currentUser && (msg.likedByUsers || []).includes(currentUser.email.toLowerCase());

          return (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                msg.isPinned
                  ? 'border-emerald-300 ring-2 ring-emerald-100/50'
                  : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm flex items-center justify-center border border-slate-200">
                    {msg.authorName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{msg.authorName}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">({msg.authorDepartment})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">{msg.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getCategoryBadge(msg.category)}
                  {msg.isPinned && (
                    <span className="p-1 rounded-lg bg-emerald-50 text-[#2a602f]" title="Pinned message">
                      <Pin size={13} className="rotate-45" />
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Content */}
              {msg.title && (
                <h3 className="font-black text-slate-900 text-sm mb-1.5">{msg.title}</h3>
              )}
              <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed mb-4">
                {msg.content}
              </p>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(msg.id)}
                    className={`flex items-center gap-1.5 font-bold transition-colors ${
                      userLiked ? 'text-red-600' : 'text-slate-500 hover:text-red-500'
                    }`}
                  >
                    <Heart size={14} className={userLiked ? 'fill-current' : ''} />
                    <span>{msg.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => setActiveReplyId(activeReplyId === msg.id ? null : msg.id)}
                    className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <MessageSquare size={14} />
                    <span>{msg.replies.length} replies</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {(isSuperAdmin || isAdmin) && (
                    <button
                      onClick={() => handleTogglePin(msg.id)}
                      className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                    >
                      {msg.isPinned ? 'Unpin' : 'Pin'}
                    </button>
                  )}

                  {(isSuperAdmin || currentUser?.id === msg.authorId) && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Threaded Replies */}
              {(msg.replies.length > 0 || activeReplyId === msg.id) && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50/60 -mx-5 -mb-5 p-5 rounded-b-2xl">
                  {msg.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-2.5 text-xs">
                      <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {reply.authorName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-900">{reply.authorName}</span>
                          <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                        </div>
                        <p className="text-slate-700 text-xs">{reply.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Reply Input */}
                  {activeReplyId === msg.id && (
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder={`Reply to ${msg.authorName}...`}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendReply(msg.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSendReply(msg.id)}
                        className="px-3 py-2 rounded-xl bg-[#2a602f] hover:bg-[#224f26] text-white font-bold text-xs"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

