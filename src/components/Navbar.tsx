import React, { useState } from 'react';
import { 
  Terminal, 
  Smartphone, 
  Image as ImageIcon, 
  Newspaper, 
  BookOpen, 
  Link2, 
  ShieldCheck, 
  Search, 
  Menu, 
  X, 
  Sparkles,
  Bot,
  Server
} from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  settings: SiteSettings;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onOpenTerminal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  settings,
  isAdmin,
  onOpenAdmin,
  onOpenTerminal,
  searchQuery,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Overview', icon: Sparkles },
    { id: 'hosting', label: 'Hosting Server', icon: Server, badge: 'Active' },
    { id: 'commands', label: 'Commands & Scripts', icon: Terminal },
    { id: 'apps', label: 'Android Apps', icon: Smartphone },
    { id: 'gallery', label: 'Photos / Gallery', icon: ImageIcon },
    { id: 'news', label: 'News & Updates', icon: Newspaper },
    { id: 'blogs', label: 'Blogs & Guides', icon: BookOpen },
    { id: 'links', label: 'Other Links', icon: Link2 },
    { id: 'ai-assistant', label: 'AI Script Gen', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 transition-colors">
      {/* Announcement bar if enabled */}
      {settings.showAnnouncement && settings.announcementText && (
        <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-b border-cyan-500/20 px-4 py-1 text-center text-xs text-cyan-300 font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
          <span>{settings.announcementText}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => { onSelectTab('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center">
              ALC<span className="text-cyan-400">HOSTING</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-mono tracking-wider">
              {settings.tagline || 'CYBER & ANDROID HUB'}
            </span>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search commands, APKs, blogs..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 text-slate-500 hover:text-slate-300 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-medium text-slate-400">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-[11px] xl:text-xs whitespace-nowrap ${
                  active
                    ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 font-bold shadow-sm shadow-cyan-950'
                    : 'hover:text-cyan-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.id === 'hosting' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden xl:inline-block" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions - Right */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Terminal Trigger */}
          <button
            onClick={onOpenTerminal}
            className="p-2 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            title="Open Termux Virtual Terminal"
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden sm:inline">Shell</span>
          </button>

          {/* Admin Panel Button */}
          <button
            id="admin-panel-toggle-btn"
            onClick={onOpenAdmin}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md ${
              isAdmin
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold shadow-cyan-900/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Admin Portal' : 'Admin Login'}</span>
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0F1E] border-b border-slate-800 px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {/* Mobile search */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search scripts, APKs, news..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg text-left flex items-center gap-2 text-xs font-medium transition-all ${
                    active
                      ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/40'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
