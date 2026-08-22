import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Heart, 
  Download, 
  Maximize2, 
  X, 
  Sparkles, 
  Eye
} from 'lucide-react';
import { GalleryItem } from '../types';
import { StorageService } from '../services/storageService';

interface GallerySectionProps {
  gallery: GalleryItem[];
  searchQuery: string;
  onRefreshData: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  gallery,
  searchQuery,
  onRefreshData
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos & Wallpapers' },
    { id: 'termux-setup', label: 'Termux Setups' },
    { id: 'ui-theme', label: 'UI Themes & HUDs' },
    { id: 'wallpapers', label: 'Cyber Wallpapers' },
    { id: 'app-previews', label: 'App Previews' },
  ];

  const filteredGallery = gallery.filter((item) => {
    const matchesSearch = 
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleLike = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    StorageService.likeGalleryItem(item.id);
    onRefreshData();
  };

  const handleDownload = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    StorageService.downloadGalleryItem(item.id);
    onRefreshData();

    const a = document.createElement('a');
    a.href = item.url;
    a.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="gallery-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Pictures, Themes & Wallpaper Gallery</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual showcases of custom Termux prompts, Linux desktop setups, and 4K cyber wallpapers.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                active
                  ? 'bg-pink-500 text-slate-950 shadow-md shadow-pink-950/40 font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Photos Grid */}
      {filteredGallery.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No photos found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className="bg-slate-900/70 border border-slate-800 hover:border-pink-500/40 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded text-[10px] font-mono text-pink-300">
                  {item.category}
                </span>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleLike(e, item)}
                    className="p-1.5 bg-slate-900/80 hover:bg-pink-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                    title="Like"
                  >
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDownload(e, item)}
                    className="p-1.5 bg-slate-900/80 hover:bg-cyan-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                    title="Download Photo"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm text-white group-hover:text-pink-300 transition-colors line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {item.caption}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-pink-400">
                      <Heart className="w-3 h-3 fill-current" /> {item.likes || 0}
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Download className="w-3 h-3" /> {item.downloads || 0}
                    </span>
                  </div>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeLightboxItem.url}
                alt={activeLightboxItem.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border-t border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block mb-1">
                  {activeLightboxItem.category}
                </span>
                <h3 className="text-lg font-bold text-white">{activeLightboxItem.title}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">{activeLightboxItem.caption}</p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={(e) => handleLike(e, activeLightboxItem)}
                  className="px-3 py-2 bg-slate-800 hover:bg-pink-600/20 text-pink-400 border border-pink-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Like ({activeLightboxItem.likes})</span>
                </button>

                <button
                  onClick={(e) => handleDownload(e, activeLightboxItem)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
