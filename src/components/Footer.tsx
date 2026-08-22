import React from 'react';
import { Terminal, Shield, Send, Globe, Heart } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onSelectTab: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onSelectTab,
  onOpenAdmin
}) => {
  return (
    <footer className="mt-16 bg-[#0F172A] border-t border-slate-800 text-slate-400 text-xs font-sans">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand & Tagline */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Terminal className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              ALC<span className="text-cyan-400">HOSTING</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Advanced Termux & Android ecosystem repository. Secure, high-speed tools, and scripts curated for power users.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GLOBAL REPOSITORIES: OPERATIONAL</span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">
            Direct Portals
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onSelectTab('hosting')} className="hover:text-cyan-400 font-semibold text-cyan-300 transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Hosting Server (a23pro.alc.onl)</span>
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('commands')} className="hover:text-cyan-400 transition-colors">
                Termux Script Vault
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('apps')} className="hover:text-cyan-400 transition-colors">
                Android APK Downloads
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('gallery')} className="hover:text-cyan-400 transition-colors">
                4K Wallpapers & Setups
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('ai-assistant')} className="hover:text-cyan-400 transition-colors">
                AI Shell Assistant
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Resources & Guides */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">
            Documentation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onSelectTab('news')} className="hover:text-cyan-400 transition-colors">
                Security & Bug Notices
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('blogs')} className="hover:text-cyan-400 transition-colors">
                Termux 2026 Masterclass
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('links')} className="hover:text-cyan-400 transition-colors">
                Official Telegram Group
              </button>
            </li>
            <li>
              <button onClick={onOpenAdmin} className="hover:text-cyan-400 text-cyan-500 font-semibold flex items-center gap-1 transition-colors">
                <Shield className="w-3.5 h-3.5" /> Admin Secure Login
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Community & Support */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">
            Network Status
          </h4>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">ENGINE:</span>
              <span className="text-cyan-400 font-semibold">Termux v4.2 PRO</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">UPTIME:</span>
              <span className="text-emerald-400">99.98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">MIRROR SYNC:</span>
              <span className="text-slate-300">Live (6 Nodes)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
        <div>
          &copy; {new Date().getFullYear()} {settings.siteName || 'ALCHOSTING'} NETWORK. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-4">
          <span>STATUS: <strong className="text-emerald-400">ONLINE</strong></span>
          <span>BUILD: <strong className="text-slate-400">{settings.systemVersion || 'v2.8.4'}</strong></span>
        </div>
      </div>
    </footer>
  );
};
