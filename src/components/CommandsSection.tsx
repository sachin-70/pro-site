import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Sparkles, 
  Filter, 
  Tag, 
  ExternalLink,
  Flame,
  Layers
} from 'lucide-react';
import { CommandItem } from '../types';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface CommandsSectionProps {
  commands: CommandItem[];
  searchQuery: string;
  onRunInTerminal: (cmd: string) => void;
  onRefreshData: () => void;
}

export const CommandsSection: React.FC<CommandsSectionProps> = ({
  commands,
  searchQuery,
  onRunInTerminal,
  onRefreshData
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Commands' },
    { id: 'termux-basic', label: 'Termux Basics' },
    { id: 'package-mgr', label: 'Package & Repo' },
    { id: 'root-tools', label: 'Root Tools & Magisk' },
    { id: 'networking', label: 'Network & ADB' },
    { id: 'ui-styling', label: 'UI Themes & X11' },
    { id: 'kali-pentest', label: 'Kali / Pentest' },
    { id: 'automation', label: 'Automation' },
  ];

  const filteredCommands = useMemo(() => {
    return commands.filter((cmd) => {
      const matchesSearch = 
        !searchQuery ||
        cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || cmd.category === selectedCategory;
      const matchesPlat = selectedPlatform === 'all' || cmd.platform.toLowerCase() === selectedPlatform.toLowerCase();

      return matchesSearch && matchesCat && matchesPlat;
    });
  }, [commands, searchQuery, selectedCategory, selectedPlatform]);

  const handleCopy = (cmd: CommandItem) => {
    navigator.clipboard.writeText(cmd.command);
    setCopiedId(cmd.id);
    StorageService.incrementCommandCopy(cmd.id);
    onRefreshData();

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDownloadScript = (cmd: CommandItem) => {
    const filename = `${cmd.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.sh`;
    const scriptContent = `#!/data/data/com.termux/files/usr/bin/bash
# ==========================================
# ALCHOSTING Termux Script
# Title: ${cmd.title}
# Category: ${cmd.category}
# Platform: ${cmd.platform}
# Date: ${cmd.date}
# ==========================================

echo "[*] Executing: ${cmd.title}..."
${cmd.command}
echo "[✓] Command finished successfully."
`;
    const blob = new Blob([scriptContent], { type: 'text/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="commands-section" className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Termux & Android Script Vault</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse, copy, test, or download executable shell commands curated for Android power users.
          </p>
        </div>

        {/* Platform Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Platform:
          </span>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Environments</option>
            <option value="termux">Termux</option>
            <option value="android shell">Android Shell (ADB)</option>
            <option value="linux">Linux / Debian</option>
          </select>
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
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40 font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {active && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Commands Grid */}
      {filteredCommands.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <Terminal className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No commands found matching your criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try changing filters or search terms.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedPlatform('all'); }}
            className="mt-4 px-4 py-2 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs hover:bg-cyan-600/30"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredCommands.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                id={`cmd-card-${item.id}`}
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 bg-cyan-950/70 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold rounded">
                          {item.platform}
                        </span>
                        {item.isPro && (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold rounded flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-current" /> PRO
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-mono">
                          {item.copiedCount || 0} copies
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Code snippet block */}
                  <div className="relative bg-[#0A0F1E] border border-slate-800/90 rounded-xl p-3 mb-3 font-mono text-xs overflow-x-auto text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 select-none">
                      <span>BASH TERMINAL</span>
                      <span className="text-slate-600">click copy or run</span>
                    </div>
                    <pre className="text-xs text-slate-200 whitespace-pre-wrap break-all font-mono">
                      {item.command}
                    </pre>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800/60">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadScript(item)}
                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg text-xs transition-colors flex items-center gap-1"
                      title="Download as .sh script file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">.sh</span>
                    </button>
                    <button
                      onClick={() => onRunInTerminal(item.command)}
                      className="px-2.5 py-1.5 text-slate-300 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg text-xs transition-colors flex items-center gap-1.5 font-mono"
                      title="Run in Virtual Terminal Simulator"
                    >
                      <Play className="w-3 h-3 text-cyan-400 fill-current" />
                      <span>Test Run</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(item)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isCopied
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-900/40'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/30'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
