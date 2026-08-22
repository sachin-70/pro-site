import React from 'react';
import { Newspaper, Bell, AlertTriangle, CheckCircle, Tag, Calendar, User } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsSectionProps {
  news: NewsItem[];
  searchQuery: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, searchQuery }) => {
  const filteredNews = news.filter((item) => {
    return (
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div id="news-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Newspaper className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">News, Security Alerts & Releases</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time notifications regarding Android updates, Termux repository health, and critical bug fixes.
          </p>
        </div>
      </div>

      {/* News list */}
      {filteredNews.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <Newspaper className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No news announcements match your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              id={`news-card-${item.id}`}
              className={`p-5 rounded-2xl border transition-all ${
                item.urgent
                  ? 'bg-gradient-to-r from-red-950/20 via-slate-900/90 to-slate-900 border-red-500/30 hover:border-red-500/50 shadow-lg'
                  : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/40 shadow-md'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {item.urgent && (
                  <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> URGENT NOTICE
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold rounded-full uppercase">
                  {item.tag || item.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 ml-auto">
                  <Calendar className="w-3 h-3" /> {item.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#0A0F1E]/60 p-3 rounded-xl border border-slate-800/80 mb-3">
                {item.content}
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-cyan-400" /> Published by: <span className="text-slate-300">{item.author}</span>
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Verified Post
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
