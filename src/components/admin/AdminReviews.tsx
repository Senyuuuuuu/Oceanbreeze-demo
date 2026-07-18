import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Star, MessageSquare, Check, X, ShieldAlert, Heart,
  Sparkles, Reply, HelpCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { bookingStore } from '../../lib/bookingStore';
import { ReviewItem } from '../../types';

interface AdminReviewsProps {
  onRefresh: () => void;
}

export default function AdminReviews({ onRefresh }: AdminReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => bookingStore.getReviews());
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const refreshReviews = () => {
    const list = bookingStore.getReviews();
    setReviews(list);
    onRefresh();
  };

  const handleStatusChange = (id: string, status: ReviewItem['status']) => {
    bookingStore.updateReview(id, { status });
    refreshReviews();
  };

  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    bookingStore.updateReview(id, { featured: !currentFeatured });
    refreshReviews();
  };

  const handlePostResponse = (id: string) => {
    const response = replyText[id] || '';
    if (!response.trim()) return;

    bookingStore.updateReview(id, { ownerResponse: response });
    
    // Clear state
    setReplyText(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setActiveReplyId(null);
    refreshReviews();
  };

  // KPIs
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';
  const pendingReviews = reviews.filter(r => r.status === 'Pending').length;
  const featuredReviews = reviews.filter(r => r.featured).length;

  return (
    <div className="space-y-6" id="admin-reviews">
      {/* KPI stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-sm">
            <Star className="w-4.5 h-4.5 fill-amber-500" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Average Rating</span>
            <span className="text-sm font-bold text-charcoal block mt-0.5">{avgRating} / 5.0 Rating</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
            {totalReviews}
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total Feedbacks</span>
            <span className="text-xs text-charcoal font-semibold block mt-0.5">Guest responses</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
            {pendingReviews}
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Pending Moderation</span>
            <span className="text-xs text-charcoal font-semibold block mt-0.5">Need approval</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
            {featuredReviews}
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Featured Carousel</span>
            <span className="text-xs text-charcoal font-semibold block mt-0.5">Live on Homepage</span>
          </div>
        </div>
      </div>

      {/* Reviews feed */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center text-gray-400">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No reviews have been logged in the resort database.
          </div>
        ) : (
          reviews.map(r => {
            let statusBadge = 'bg-slate-100 border-slate-200 text-slate-600';
            if (r.status === 'Approved') statusBadge = 'bg-emerald-50 border-emerald-100 text-emerald-800';
            else if (r.status === 'Pending') statusBadge = 'bg-amber-50 border-amber-100 text-amber-800';
            else if (r.status === 'Flagged') statusBadge = 'bg-rose-50 border-rose-100 text-rose-800';

            return (
              <div 
                key={r.id} 
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200/80 transition-colors flex flex-col md:flex-row gap-6 justify-between"
              >
                {/* Info & Comment */}
                <div className="flex-1 space-y-4">
                  
                  {/* Guest metadata */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 font-serif font-bold text-charcoal flex items-center justify-center border border-slate-100 uppercase">
                      {r.guestName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-charcoal text-sm">{r.guestName}</span>
                        <span className="text-[10px] text-gray-400">({r.checkInMonth})</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex gap-0.5 text-amber-500">
                          {Array.from({ length: r.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="font-sans text-[10px] font-mono text-gray-400">{r.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="font-sans text-xs text-gray-600 leading-relaxed font-light">
                    "{r.comment}"
                  </p>

                  {/* Owner response block */}
                  {r.ownerResponse ? (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/60 space-y-1 ml-4 relative">
                      <span className="text-[9px] text-sunset font-bold uppercase tracking-wider block">Official Management Response</span>
                      <p className="font-sans text-xs text-charcoal leading-relaxed font-light italic">
                        "{r.ownerResponse}"
                      </p>
                    </div>
                  ) : (
                    activeReplyId === r.id && (
                      <div className="space-y-2 ml-4">
                        <textarea
                          placeholder="Type your official, warm reply to this guest review..."
                          value={replyText[r.id] || ''}
                          onChange={(e) => setReplyText(prev => ({ ...prev, [r.id]: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-sans text-charcoal focus:bg-white focus:outline-none focus:border-sunset transition-all"
                          rows={2.5}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveReplyId(null)}
                            className="px-3 py-1 bg-white hover:bg-slate-100 text-gray-500 text-[10px] uppercase font-bold rounded-lg border border-slate-200 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handlePostResponse(r.id)}
                            className="px-3 py-1 bg-charcoal hover:bg-sunset text-white text-[10px] uppercase font-bold rounded-lg cursor-pointer transition-colors"
                          >
                            Post Response
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Status Badges & Action Buttons (Right Aligned) */}
                <div className="flex flex-col justify-between items-end md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-slate-50 pt-4 md:pt-0 md:pl-6 space-y-4">
                  <div className="w-full flex md:flex-col items-center md:items-end justify-between gap-2.5">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider md:hidden">Status</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusBadge}`}>
                      {r.status}
                    </span>
                  </div>

                  {/* Quick features toggle */}
                  <div className="w-full flex items-center justify-between gap-3 text-xs">
                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Show public Carousel</span>
                    <button
                      onClick={() => handleToggleFeatured(r.id, !!r.featured)}
                      className={`px-2.5 py-1 rounded-lg border font-sans text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        r.featured
                          ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-gray-400 hover:bg-slate-50'
                      }`}
                    >
                      {r.featured ? '★ Featured' : 'Feature'}
                    </button>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-2 w-full justify-end">
                    {!r.ownerResponse && activeReplyId !== r.id && (
                      <button
                        onClick={() => setActiveReplyId(r.id)}
                        className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-lg text-gray-500 hover:text-charcoal transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 uppercase tracking-wide text-[10px] font-sans"
                        title="Reply to review"
                      >
                        <Reply className="w-3.5 h-3.5" /> Reply
                      </button>
                    )}

                    {r.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(r.id, 'Approved')}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-emerald-800 transition-colors cursor-pointer"
                          title="Approve post"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(r.id, 'Flagged')}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg text-rose-800 transition-colors cursor-pointer"
                          title="Flag / hide feedback"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {r.status === 'Approved' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'Flagged')}
                        className="px-2 py-1 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg text-gray-400 hover:text-rose-600 transition-colors cursor-pointer font-sans font-bold text-[10px] uppercase"
                      >
                        Flag Review
                      </button>
                    )}

                    {r.status === 'Flagged' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'Approved')}
                        className="px-2 py-1 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer font-sans font-bold text-[10px] uppercase"
                      >
                        Restore
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
