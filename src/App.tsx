/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Smartphone, 
  Image as ImageIcon, 
  Newspaper, 
  BookOpen, 
  Link2, 
  ShieldCheck, 
  Sparkles, 
  Bot, 
  ChevronRight, 
  Layers, 
  Zap, 
  Download, 
  Copy, 
  Check, 
  ArrowRight,
  TrendingUp,
  Activity,
  Flame,
  Star
} from 'lucide-react';
import { 
  SiteSettings, 
  CommandItem, 
  AndroidAppItem, 
  GalleryItem, 
  NewsItem, 
  BlogItem, 
  ResourceLinkItem, 
  ActivityLog 
} from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CommandsSection } from './components/CommandsSection';
import { AppsSection } from './components/AppsSection';
import { GallerySection } from './components/GallerySection';
import { NewsSection } from './components/NewsSection';
import { BlogsSection } from './components/BlogsSection';
import { LinksSection } from './components/LinksSection';
import { AIChatAssistant } from './components/AIChatAssistant';
import { TerminalSimulator } from './components/TerminalSimulator';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { HostingManager } from './components/HostingManager';
import { Footer } from './components/Footer';
import confetti from 'canvas-confetti';

export default function App() {
  // Application Data States
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [commands, setCommands] = useState<CommandItem[]>(StorageService.getCommands());
  const [apps, setApps] = useState<AndroidAppItem[]>(StorageService.getApps());
  const [gallery, setGallery] = useState<GalleryItem[]>(StorageService.getGallery());
  const [news, setNews] = useState<NewsItem[]>(StorageService.getNews());
  const [blogs, setBlogs] = useState<BlogItem[]>(StorageService.getBlogs());
  const [links, setLinks] = useState<ResourceLinkItem[]>(StorageService.getLinks());
  const [activities, setActivities] = useState<ActivityLog[]>(StorageService.getActivities());

  // UI Control States
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(StorageService.isAdminLoggedIn());
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [terminalInitialCmd, setTerminalInitialCmd] = useState<string>('');
  const [quickCopiedId, setQuickCopiedId] = useState<string | null>(null);

  const refreshAllData = () => {
    setSettings(StorageService.getSettings());
    setCommands(StorageService.getCommands());
    setApps(StorageService.getApps());
    setGallery(StorageService.getGallery());
    setNews(StorageService.getNews());
    setBlogs(StorageService.getBlogs());
    setLinks(StorageService.getLinks());
    setActivities(StorageService.getActivities());
    setIsAdminLoggedIn(StorageService.isAdminLoggedIn());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleOpenTerminalWith = (cmd: string) => {
    setTerminalInitialCmd(cmd);
    setShowTerminal(true);
  };

  const handleAdminAction = () => {
    if (isAdminLoggedIn) {
      setCurrentTab('admin');
    } else {
      setShowAdminLoginModal(true);
    }
  };

  const handleLogout = () => {
    StorageService.logoutAdmin();
    setIsAdminLoggedIn(false);
    setCurrentTab('home');
    refreshAllData();
  };

  const handleQuickCopy = (e: React.MouseEvent, cmd: CommandItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd.command);
    setQuickCopiedId(cmd.id);
    StorageService.incrementCommandCopy(cmd.id);
    refreshAllData();

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => setQuickCopiedId(null), 2000);
  };

  // Find featured app for hero
  const featuredApp = apps.find(a => a.id === settings.featuredAppId) || apps[0];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Topbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        settings={settings}
        isAdmin={isAdminLoggedIn}
        onOpenAdmin={handleAdminAction}
        onOpenTerminal={() => setShowTerminal(prev => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Terminal Simulator Floating / Drawer when opened */}
        {showTerminal && (
          <div className="mb-8 animate-fadeIn">
            <TerminalSimulator
              initialCommand={terminalInitialCmd}
              onClose={() => setShowTerminal(false)}
              availableCommands={commands}
            />
          </div>
        )}

        {/* View Switcher based on currentTab */}
        {currentTab === 'home' && (
          <div className="space-y-10">
            {/* Hero Showcase Banner */}
            <HeroBanner
              settings={settings}
              featuredApp={featuredApp}
              onExploreCommands={() => setCurrentTab('commands')}
              onExploreApps={() => setCurrentTab('apps')}
              onOpenTerminalWithCmd={handleOpenTerminalWith}
            />

            {/* Quick 3-Category Sleek Cards (as per design theme) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Commands Vault */}
              <div 
                onClick={() => setCurrentTab('commands')}
                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    Script Commands Vault
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Curated list of 500+ Termux & ADB shell commands for automation, Kali NetHunter, and styling.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400">$ pkg install alchosting</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Android APKs */}
              <div 
                onClick={() => setCurrentTab('apps')}
                className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    Android APK Downloads
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Premium modded tools, MT Manager VIP, Shizuku, and developer utilities for Android.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">Browse APKs ({apps.length})</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Latest News & Blogs */}
              <div 
                onClick={() => setCurrentTab('news')}
                className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                    <Newspaper className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                    Security & Releases
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Stay updated with Android 15 patch advisories, Termux mirror status, and tech blogs.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400">Read Updates</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Split Section: Trending Commands & Live Activity Signal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Trending Commands (Left 8 Cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400 fill-current" />
                    <h2 className="text-lg font-bold text-white">Popular & Trending Scripts</h2>
                  </div>
                  <button
                    onClick={() => setCurrentTab('commands')}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    View All {commands.length} Commands <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {commands.slice(0, 4).map((cmd) => {
                    const isCopied = quickCopiedId === cmd.id;
                    return (
                      <div
                        key={cmd.id}
                        className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold rounded">
                              {cmd.platform}
                            </span>
                            <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                              {cmd.title}
                            </h4>
                          </div>
                          <div className="bg-[#0A0F1E] border border-slate-800/80 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-300 truncate max-w-xl">
                            $ {cmd.command}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleOpenTerminalWith(cmd.command)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded-lg text-xs transition-colors"
                            title="Run in Virtual Terminal"
                          >
                            <Terminal className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleQuickCopy(e, cmd)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                              isCopied
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                            }`}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Live Updates Feed & Admin Quick Access */}
              <div className="lg:col-span-4 space-y-6">
                {/* ALC Hosting Server Status Quick Widget */}
                {settings.hosting && (
                  <div className="bg-gradient-to-br from-[#0F172A] to-[#111C38] border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> ALC HOSTING LIVE
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {settings.hosting.serverIp}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-white truncate font-mono">
                        {settings.hosting.domain}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        FTP: {settings.hosting.ftpHost} | User: {settings.hosting.accountUsername}
                      </p>
                    </div>

                    <button
                      onClick={() => setCurrentTab('hosting')}
                      className="w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Open Hosting & Deploy Suite</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Live Activity Feed */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-mono">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> Live System Updates
                  </h3>
                  <div className="space-y-3">
                    {activities.slice(0, 4).map((act) => (
                      <div key={act.id} className="border-l-2 border-cyan-500/40 pl-3 py-1">
                        <p className="text-xs text-slate-200 font-medium leading-snug">{act.text}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{act.time} in [{act.category}]</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Admin Access Banner */}
                <div className="bg-gradient-to-br from-slate-900 to-[#0F172A] border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Admin Management
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Access master controls to publish scripts, upload APKs, manage photo gallery, and broadcast alerts.
                  </p>
                  <button
                    onClick={handleAdminAction}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>{isAdminLoggedIn ? 'Open Admin Control Panel' : 'Secure Admin Login'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Wallpapers & Setups Showcase row */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-pink-400" />
                  <h2 className="text-lg font-bold text-white">4K Wallpapers & Termux Setups</h2>
                </div>
                <button
                  onClick={() => setCurrentTab('gallery')}
                  className="text-xs text-pink-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Explore Gallery <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {gallery.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentTab('gallery')}
                    className="bg-slate-900/60 border border-slate-800 hover:border-pink-500/40 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all"
                  >
                    <div className="h-40 overflow-hidden bg-slate-950">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5">
                      <h4 className="font-bold text-xs text-white truncate group-hover:text-pink-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-1">{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'hosting' && (
          <HostingManager
            settings={settings}
            isAdmin={isAdminLoggedIn}
            onOpenTerminalWithCmd={handleOpenTerminalWith}
            onRefreshData={refreshAllData}
          />
        )}

        {currentTab === 'commands' && (
          <CommandsSection
            commands={commands}
            searchQuery={searchQuery}
            onRunInTerminal={handleOpenTerminalWith}
            onRefreshData={refreshAllData}
          />
        )}

        {currentTab === 'apps' && (
          <AppsSection
            apps={apps}
            searchQuery={searchQuery}
            onRefreshData={refreshAllData}
          />
        )}

        {currentTab === 'gallery' && (
          <GallerySection
            gallery={gallery}
            searchQuery={searchQuery}
            onRefreshData={refreshAllData}
          />
        )}

        {currentTab === 'news' && (
          <NewsSection
            news={news}
            searchQuery={searchQuery}
          />
        )}

        {currentTab === 'blogs' && (
          <BlogsSection
            blogs={blogs}
            searchQuery={searchQuery}
            onRefreshData={refreshAllData}
          />
        )}

        {currentTab === 'links' && (
          <LinksSection
            links={links}
            searchQuery={searchQuery}
            onRefreshData={refreshAllData}
          />
        )}

        {currentTab === 'ai-assistant' && (
          <AIChatAssistant
            onRunInTerminal={handleOpenTerminalWith}
            onSaveToVault={(cmd) => {
              StorageService.addCommand(cmd);
              refreshAllData();
            }}
            isAdmin={isAdminLoggedIn}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            settings={settings}
            commands={commands}
            apps={apps}
            gallery={gallery}
            news={news}
            blogs={blogs}
            links={links}
            activities={activities}
            onRefreshData={refreshAllData}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setCurrentTab('admin');
          refreshAllData();
        }}
      />

      {/* Sleek Cyber Footer */}
      <Footer
        settings={settings}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={handleAdminAction}
      />
    </div>
  );
}
