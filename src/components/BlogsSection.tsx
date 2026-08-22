import React, { useState } from 'react';
import { BookOpen, Clock, User, Eye, ArrowRight, X, Copy, Check, Share2 } from 'lucide-react';
import { BlogItem } from '../types';
import { StorageService } from '../services/storageService';

interface BlogsSectionProps {
  blogs: BlogItem[];
  searchQuery: string;
  onRefreshData: () => void;
}

export const BlogsSection: React.FC<BlogsSectionProps> = ({
  blogs,
  searchQuery,
  onRefreshData
}) => {
  const [activeBlog, setActiveBlog] = useState<BlogItem | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const filteredBlogs = blogs.filter((b) => {
    return (
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleOpenBlog = (blog: BlogItem) => {
    StorageService.incrementBlogViews(blog.id);
    onRefreshData();
    setActiveBlog(blog);
  };

  const copyArticleText = () => {
    if (!activeBlog) return;
    navigator.clipboard.writeText(`${activeBlog.title}\n\n${activeBlog.summary}\n\n${activeBlog.content}`);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div id="blogs-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Tech Blogs, Masterclasses & Guides</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Step-by-step documentation, ADB debugging tricks, root guides, and Termux terminal tutorials.
          </p>
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No blog posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => handleOpenBlog(blog)}
              className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-mono">
                    <span className="bg-indigo-950/80 border border-indigo-500/40 px-2 py-0.5 rounded text-[10px] text-indigo-300">
                      {blog.readTime}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Eye className="w-3.5 h-3.5" /> {(blog.views || 0) + 1} reads
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors leading-snug mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {blog.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {blog.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-800/60 text-xs font-medium">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <User className="w-3 h-3 text-indigo-400" /> {blog.author}
                </span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs font-semibold">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Article Reader Modal */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveBlog(null)}
              className="sticky top-0 float-right p-2 bg-slate-950/80 text-slate-400 hover:text-white rounded-xl border border-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-2">
                <span className="text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded">
                  {activeBlog.readTime}
                </span>
                <span>•</span>
                <span>By {activeBlog.author}</span>
                <span>•</span>
                <span>{activeBlog.date}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {activeBlog.title}
              </h2>
            </div>

            <div className="h-56 rounded-xl overflow-hidden mb-6 border border-slate-800">
              <img
                src={activeBlog.coverImage}
                alt={activeBlog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content Rendered */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 font-sans">
              <div className="p-3.5 bg-[#0A0F1E] border-l-4 border-indigo-500 rounded-r-xl text-slate-300 text-xs font-medium italic">
                {activeBlog.summary}
              </div>

              <div className="whitespace-pre-line text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-sans">
                {activeBlog.content}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-800">
              <div className="flex gap-2">
                {activeBlog.tags.map((t, idx) => (
                  <span key={idx} className="text-xs font-mono bg-slate-950 text-indigo-300 px-2.5 py-1 rounded-lg border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={copyArticleText}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Copied Content' : 'Copy Article'}</span>
                </button>
                <button
                  onClick={() => setActiveBlog(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
