import React, { useState } from 'react';
import { Bot, Send, Sparkles, Terminal, Copy, Check, Play, RefreshCw, Cpu } from 'lucide-react';
import { CommandItem } from '../types';

interface AIChatAssistantProps {
  onRunInTerminal: (cmd: string) => void;
  onSaveToVault?: (cmd: Omit<CommandItem, 'id' | 'copiedCount' | 'date'>) => void;
  isAdmin?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  commandSnippet?: string;
  category?: string;
  time: string;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  onRunInTerminal,
  onSaveToVault,
  isAdmin = false
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello! I am your ALCHOSTING AI Terminal & Bash Assistant. 
Ask me to generate any Termux script, ADB command, Python tool, or fix any repository/packaging issue on Android!`,
      time: 'Online',
      commandSnippet: 'pkg update && pkg install git python curl wget -y'
    }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSend = async () => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    // Simulate smart cyber generation with contextual intelligence
    setTimeout(() => {
      let replyText = '';
      let snippet = '';
      let category = 'termux-basic';
      const qLower = trimmed.toLowerCase();

      if (qLower.includes('storage') || qLower.includes('permission') || qLower.includes('sdcard')) {
        replyText = `Here is the command to grant full device storage permission to Termux and create symlinks for easy file access:`;
        snippet = `termux-setup-storage && ls -la ~/storage/shared`;
        category = 'termux-basic';
      } else if (qLower.includes('server') || qLower.includes('host') || qLower.includes('web') || qLower.includes('http')) {
        replyText = `Here is a lightweight Python HTTP server command to host any local folder and share files over Wi-Fi:`;
        snippet = `pkg install python -y && python -m http.server 8080 --bind 0.0.0.0`;
        category = 'networking';
      } else if (qLower.includes('wifi') || qLower.includes('adb') || qLower.includes('wireless')) {
        replyText = `Here is the wireless ADB pairing and high-speed connection command:`;
        snippet = `adb pair 192.168.1.50:39845 && adb connect 192.168.1.50:41235 && adb devices`;
        category = 'networking';
      } else if (qLower.includes('kali') || qLower.includes('nethunter') || qLower.includes('pentest')) {
        replyText = `Here is the 1-click Kali NetHunter Rootless installer script with graphical desktop support:`;
        snippet = `wget -O install-nethunter-termux https://offs.ec/2MceZWr && chmod +x install-nethunter-termux && ./install-nethunter-termux`;
        category = 'kali-pentest';
      } else if (qLower.includes('zsh') || qLower.includes('theme') || qLower.includes('style') || qLower.includes('look')) {
        replyText = `Here is the complete setup script for Oh My Zsh with cyberpunk syntax highlighting and auto-suggestions:`;
        snippet = `pkg install zsh git curl -y && sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`;
        category = 'ui-styling';
      } else if (qLower.includes('update') || qLower.includes('404') || qLower.includes('mirror') || qLower.includes('repo')) {
        replyText = `To permanently fix repository 404 and mirror mismatch errors in Termux:`;
        snippet = `termux-change-repo && pkg clean && pkg update -y`;
        category = 'package-mgr';
      } else if (qLower.includes('backup') || qLower.includes('root') || qLower.includes('magisk')) {
        replyText = `Here is a root partition inspection and backup command:`;
        snippet = `su -c "ls -la /dev/block/bootdevice/by-name/ && dd if=/dev/block/bootdevice/by-name/boot of=/sdcard/boot.img"`;
        category = 'root-tools';
      } else {
        replyText = `I have generated an automated Termux execution script for "${trimmed}":`;
        snippet = `pkg update -y && pkg install git python curl -y && echo "[ALCHOSTING] Execution initiated for: ${trimmed.replace(/"/g, '')}"`;
        category = 'automation';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        commandSnippet: snippet,
        category,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToDatabase = (msg: Message) => {
    if (!onSaveToVault || !msg.commandSnippet) return;
    onSaveToVault({
      title: msg.text.slice(0, 45) || 'AI Generated Script',
      command: msg.commandSnippet,
      category: (msg.category as any) || 'automation',
      description: `Generated via ALCHOSTING AI Assistant for query.`,
      platform: 'Termux',
      tags: ['ai-generated', 'script', 'termux']
    });
    setSavedId(msg.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Termux & Linux Script Generator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate custom bash one-liners, Python tools, and Android terminal workflows automatically.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Messages list */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-sans bg-[#0A0F1E]/80">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-slate-950 font-semibold rounded-tr-none'
                    : 'bg-[#0F172A] border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                  <span>{msg.sender === 'user' ? 'You' : 'ALCHOSTING AI'}</span>
                  <span>{msg.time}</span>
                </div>

                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {msg.commandSnippet && (
                  <div className="mt-3 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-300">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 select-none">
                      <span>GENERATED BASH COMMAND</span>
                      <span className="text-cyan-500">Termux Ready</span>
                    </div>
                    <pre className="text-slate-100 whitespace-pre-wrap break-all mb-2">
                      {msg.commandSnippet}
                    </pre>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleCopy(msg.id, msg.commandSnippet!)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => onRunInTerminal(msg.commandSnippet!)}
                        className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run in Shell</span>
                      </button>

                      {isAdmin && onSaveToVault && (
                        <button
                          onClick={() => handleSaveToDatabase(msg)}
                          className="px-2.5 py-1 bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600/40 border border-emerald-500/30 rounded text-xs flex items-center gap-1"
                        >
                          {savedId === msg.id ? <Check className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                          <span>{savedId === msg.id ? 'Saved to Hub' : 'Add to Vault'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 animate-pulse">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Synthesizing script syntax & mirror rules...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#0F172A] border-t border-slate-800">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="e.g. Generate script to setup storage and Python web server..."
              className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!query.trim() || loading}
              className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-3 h-3" />
              <span className="hidden sm:inline">Generate</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2 overflow-x-auto text-[11px] text-slate-500">
            <span>Suggestions:</span>
            <button
              onClick={() => setQuery('Install Kali NetHunter on Termux')}
              className="hover:text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap"
            >
              Kali NetHunter install
            </button>
            <button
              onClick={() => setQuery('Fix repository 404 mirror error')}
              className="hover:text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap"
            >
              Fix 404 Repo
            </button>
            <button
              onClick={() => setQuery('Wireless ADB pairing and phantom proc disable')}
              className="hover:text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap"
            >
              Wireless ADB commands
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
