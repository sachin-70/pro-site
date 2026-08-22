import React, { useState } from 'react';
import { Link2, ExternalLink, Copy, Check, Sparkles, Send, Github, Globe, Shield } from 'lucide-react';
import { ResourceLinkItem } from '../types';
import { StorageService } from '../services/storageService';

interface LinksSectionProps {
  links: ResourceLinkItem[];
  searchQuery: string;
  onRefreshData: () => void;
}

export const LinksSection: React.FC<LinksSectionProps> = ({
  links,
  searchQuery,
  onRefreshData
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLinks = links.filter((l) => {
    return (
      !searchQuery ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenLink = (link: ResourceLinkItem) => {
    StorageService.incrementLinkClicks(link.id);
    onRefreshData();
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyUrl = (e: React.MouseEvent, link: ResourceLinkItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'telegram': return Send;
      case 'github': return Github;
      case 'official': return Shield;
      default: return Globe;
    }
  };

  return (
    <div id="links-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Link2 className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Verified Resource Links & Mirrors</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official community channels, source repositories, documentation links, and hosting mirrors.
          </p>
        </div>
      </div>

      {/* Links Grid */}
      {filteredLinks.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <Link2 className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No links found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLinks.map((link) => {
            const Icon = getCategoryIcon(link.category);
            const isCopied = copiedId === link.id;
            return (
              <div
                key={link.id}
                onClick={() => handleOpenLink(link)}
                className="bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                          {link.title}
                        </h3>
                        <span className="text-[11px] font-mono text-cyan-400 truncate max-w-xs block">
                          {link.url}
                        </span>
                      </div>
                    </div>

                    {link.badge && (
                      <span className="px-2 py-0.5 bg-teal-950/80 text-teal-300 border border-teal-500/30 text-[10px] font-mono rounded font-semibold whitespace-nowrap">
                        {link.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-2 mb-4 leading-relaxed">
                    {link.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                  <span>{link.clicks || 0} visits</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCopyUrl(e, link)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors flex items-center gap-1"
                      title="Copy URL"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px]">{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <span className="text-teal-400 flex items-center gap-1 font-semibold text-xs group-hover:underline">
                      Open <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
