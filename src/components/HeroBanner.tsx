import React, { useState } from 'react';
import { Terminal, Download, Sparkles, Copy, Check, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { SiteSettings, AndroidAppItem } from '../types';
import confetti from 'canvas-confetti';

interface HeroBannerProps {
  settings: SiteSettings;
  featuredApp?: AndroidAppItem;
  onExploreCommands: () => void;
  onExploreApps: () => void;
  onOpenTerminalWithCmd: (cmd: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  featuredApp,
  onExploreCommands,
  onExploreApps,
  onOpenTerminalWithCmd
}) => {
  const [copied, setCopied] = useState(false);
  const fastSetupCmd = 'pkg update -y && pkg install git curl python clang -y && termux-setup-storage';

  const handleCopySetup = () => {
    navigator.clipboard.writeText(fastSetupCmd);
    setCopied(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // fallback
    }
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#0A0F1E] border border-slate-800 shadow-2xl p-6 sm:p-8 lg:p-10 mb-8 transition-all">
      {/* Background Decorative Tech Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Hero Copy & Actions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold rounded-full border border-cyan-500/20 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              <span>{settings.systemVersion || 'v4.2 PRO'} RELEASE</span>
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              6 CDN Mirrors Online
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {settings.heroTitle || 'Termux Advanced Toolkit & Android Hub'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            {settings.heroSubtitle || 'Discover tested Termux scripts, Kali NetHunter environments, VIP mod utilities, and direct APK download repositories.'}
          </p>

          {/* Quick 1-Click Fast Start Command Box */}
          <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl shadow-inner max-w-xl">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <span className="flex items-center gap-1 text-cyan-400">
                <Terminal className="w-3.5 h-3.5" /> 1-Click Core Setup:
              </span>
              <span className="text-slate-500">Auto Storage + Dev Packages</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0A0F1E] border border-slate-800/80 rounded-lg p-2 font-mono text-xs">
              <span className="text-cyan-400 select-none">$</span>
              <span className="text-slate-200 truncate flex-1 select-all">{fastSetupCmd}</span>
              <button
                onClick={handleCopySetup}
                className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded flex items-center gap-1 shrink-0 transition-all"
                title="Copy Command"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={() => onOpenTerminalWithCmd(fastSetupCmd)}
                className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors shrink-0"
                title="Run in virtual terminal"
              >
                <Terminal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreCommands}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2 group cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>Browse Commands (500+)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={onExploreApps}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Android APKs</span>
            </button>
          </div>
        </div>

        {/* Right Column: Featured App Highlight Card */}
        <div className="lg:col-span-5">
          {featuredApp ? (
            <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden group transition-all">
              <div className="absolute top-0 right-0 bg-cyan-500/10 text-cyan-400 border-l border-b border-cyan-500/20 px-3 py-1 rounded-bl-xl text-[11px] font-mono font-bold">
                FEATURED APK
              </div>

              <div className="flex items-start gap-4 mb-4">
                <img
                  src={featuredApp.icon}
                  alt={featuredApp.title}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 shadow-md group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {featuredApp.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      {featuredApp.version}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {featuredApp.size}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                {featuredApp.description}
              </p>

              <div className="space-y-1.5 mb-4 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Key Features & Changelog:
                </div>
                {featuredApp.changelog.slice(0, 2).map((log, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                    <span className="text-cyan-400 text-[10px]">▸</span>
                    <span className="truncate">{log}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400 font-mono">
                  <span className="text-emerald-400 font-bold">{featuredApp.downloads.toLocaleString()}+</span> downloads
                </div>
                <button
                  onClick={onExploreApps}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-950/30 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Get APK</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm">High performance Termux & Android ecosystem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
