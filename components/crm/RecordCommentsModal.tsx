import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Clock,
  User,
  ShieldCheck,
  Building2,
  FileCheck2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { crmService, ROLE_LABELS } from '../../lib/crmService';
import { RecordComment, UserRole } from '../../types/crm';

interface RecordCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
  recordType: 'company' | 'license' | 'compliance' | 'client';
  recordTitle: string;
  recordReference: string;
}

export const RecordCommentsModal: React.FC<RecordCommentsModalProps> = ({
  isOpen,
  onClose,
  recordId,
  recordType,
  recordTitle,
  recordReference,
}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentUser = crmService.getCurrentUser();
  const canAddComment = crmService.checkPermission('canAddComments');
  const comments = crmService.getComments(recordId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('Please enter observation notes before submitting.');
      return;
    }

    setIsSubmitting(true);
    const res = crmService.addComment(recordId, recordType, recordReference, content.trim());
    setIsSubmitting(false);

    if (res.success) {
      setContent('');
    } else {
      setError(res.error || 'Failed to submit observation.');
    }
  };

  const getRecordTypeBadge = () => {
    switch (recordType) {
      case 'company':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#2a602f] border border-emerald-200 text-[10px] font-black uppercase">
            <Building2 size={11} /> Company Registration
          </span>
        );
      case 'license':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-black uppercase">
            <FileCheck2 size={11} /> Mining License Concession
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black uppercase">
            Statutory Cadastre
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {getRecordTypeBadge()}
              <span className="font-mono text-[11px] font-bold text-slate-500">{recordReference}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              Observations &amp; Inter-Departmental Notes
            </h2>
            <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
              Record: <span className="font-bold text-slate-900">{recordTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Security / Accountability Disclaimer */}
        <div className="px-6 py-2.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-900 font-medium">
          <ShieldCheck size={14} className="text-[#2a602f] shrink-0" />
          <span>
            Statutory Audit Log: All observations are tamper-resistant, append-only, and permanently attributed to your authenticated credential profile.
          </span>
        </div>

        {/* Comment Thread List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <MessageSquare size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No observations recorded yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Executive Directorate, Administrators, and Registry officers can submit operational observations and reviews below without altering official records.
              </p>
            </div>
          ) : (
            comments.map((cmt) => {
              const roleMeta = ROLE_LABELS[cmt.userRole] || {
                label: cmt.userRole,
                badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
              };
              const isCurrentUser = currentUser?.id === cmt.userId;

              return (
                <div
                  key={cmt.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrentUser
                      ? 'bg-emerald-50/40 border-emerald-200 shadow-sm'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#2a602f] text-[#ffc30d] font-black text-xs flex items-center justify-center">
                        {cmt.userName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900">
                          {cmt.userName}
                          {isCurrentUser && <span className="text-emerald-700 font-semibold ml-1">(You)</span>}
                        </span>
                        <div className="text-[10px] text-slate-500 font-medium">{cmt.department}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${roleMeta.badgeColor}`}>
                        {roleMeta.label}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Clock size={11} />
                        <span>{cmt.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-normal leading-relaxed whitespace-pre-wrap">
                    {cmt.content}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Comment Input Box */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200">
          {canAddComment ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="relative">
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Add official observation or executive note regarding ${recordReference}...`}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2a602f] focus:ring-2 focus:ring-[#2a602f]/20 transition-all font-normal"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <User size={12} className="text-[#2a602f]" />
                  <span>Posting as:</span>
                  <span className="font-bold text-slate-800">{currentUser?.name}</span>
                  <span className="text-[10px] text-slate-400">({currentUser?.department})</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2a602f] hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={13} className="text-[#ffc30d]" />
                  <span>{isSubmitting ? 'Recording...' : 'Submit Observation'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 p-3 rounded-xl border border-slate-200">
              <Lock size={14} />
              <span>Your current system role does not have authorization to post observation notes.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
