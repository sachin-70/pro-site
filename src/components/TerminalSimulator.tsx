import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Maximize2, Minimize2, Trash2, Play, Sparkles, Check, Copy } from 'lucide-react';
import { CommandItem } from '../types';

interface TerminalSimulatorProps {
  initialCommand?: string;
  onClose?: () => void;
  availableCommands?: CommandItem[];
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  initialCommand = '',
  onClose,
  availableCommands = []
}) => {
  const [input, setInput] = useState(initialCommand);
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output' | 'system' | 'error'; text: string; id: string }>>([
    { id: '1', type: 'system', text: 'Welcome to ALCHOSTING Termux Virtual Engine (v4.2.1-PRO)' },
    { id: '2', type: 'system', text: 'Type "help" or "list" for commands, or test any bash script.' },
    { id: '3', type: 'system', text: 'Root state: ROOTLESS (Virtual Sandboxed Shell)' }
  ]);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCommand) {
      setInput(initialCommand);
    }
  }, [initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const newLogs = [...history, { id: Date.now().toString(), type: 'input' as const, text: `$ ${trimmed}` }];

    const lower = trimmed.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setHistory([
        { id: Date.now().toString(), type: 'system', text: 'ALCHOSTING Termux Virtual Engine - Terminal Cleared.' }
      ]);
      setInput('');
      return;
    }

    if (lower === 'help') {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: `Available Terminal Commands:
- help                 : Display this command manual
- list / ls            : List available scripts in ALCHOSTING repository
- pkg update           : Simulate repository update & mirror handshake
- pkg install <pkg>    : Simulate installation of tool (e.g. git, python, nethunter, zsh)
- termux-setup-storage : Simulate storage permissions setup
- uname -a             : Display Linux / Android kernel emulation info
- clear                : Clear terminal screen
- whoami               : Current user identity (u0_a248)
- run <id>             : Execute a specific command by ID from database`
      });
    } else if (lower === 'list' || lower === 'ls') {
      const listText = availableCommands.length > 0 
        ? availableCommands.map(c => `[${c.category}] ${c.title} -> "${c.command.substring(0, 45)}..."`).join('\n')
        : 'Repositories loaded: git, python, clang, zsh, nethunter, termux-x11, adb';
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: `=== ALCHOSTING Termux Package Directory ===\n${listText}`
      });
    } else if (lower.startsWith('pkg update') || lower.startsWith('apt update')) {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: `Get:1 https://alchosting.cdn.org/termux/termux-main stable InRelease [14.2 kB]
Get:2 https://grimler.se/termux/termux-root stable InRelease [8.9 kB]
Get:3 https://alchosting.cdn.org/termux/termux-x11 stable InRelease [11.0 kB]
Hit:4 https://packages.termux.dev/apt/termux-main stable Packages [1.8 MB]
Fetched 1,834 kB in 1s (1,420 kB/s)
Reading package lists... Done
Building dependency tree... Done
All 324 packages are up to date. Mirror latency: 18ms [OK]`
      });
    } else if (lower.startsWith('pkg install') || lower.startsWith('apt install')) {
      const pkg = trimmed.split(' ')[2] || 'package';
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: `Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  ${pkg} (v4.2.0-pro)
Need to get 14.8 MB of archives.
After this operation, 48.2 MB of additional disk space will be used.
Unpacking ${pkg} (v4.2.0-pro)...
Setting up ${pkg} ...
Processing triggers for man-db ...
[✓] Installation of ${pkg} completed successfully in Termux!`
      });
    } else if (lower.includes('termux-setup-storage')) {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: `[✓] Symlink created: ~/storage/shared -> /sdcard
[✓] Symlink created: ~/storage/downloads -> /sdcard/Download
[✓] Symlink created: ~/storage/dcim -> /sdcard/DCIM
Storage permission verified and granted.`
      });
    } else if (lower === 'uname -a') {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: `Linux localhost 6.1.75-android15-alchosting-pro #1 SMP PREEMPT aarch64 Android`
      });
    } else if (lower === 'whoami') {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: `u0_a248 (uid=10248 gid=10248 groups=3003,9997,50248)`
      });
    } else if (lower.includes('nethunter')) {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: `[*] Downloading NetHunter Rootless rootfs for aarch64...
[####################################] 100% (840 MB)
[*] Verifying SHA256 cryptographic signature... [VALID]
[*] Extracting rootfs to /data/data/com.termux/files/home/kali-arm64...
[✓] Kali NetHunter rootless ready! Start with 'nh' or 'kex' for graphical desktop!`
      });
    } else {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        text: `[EXEC] Executed: ${trimmed}\nExit Code: 0 (Success) - Shell simulated environment response.`
      });
    }

    setHistory(newLogs);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  const copyEntireLog = () => {
    const text = history.map(h => h.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="terminal-simulator-container"
      className={`bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
        isMaximized ? 'fixed inset-4 z-50 shadow-cyan-500/10' : 'w-full h-[400px]'
      }`}
    >
      {/* Header bar */}
      <div className="h-10 bg-[#0F172A] border-b border-slate-800 px-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:opacity-100" onClick={onClose} title="Close" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 cursor-pointer hover:opacity-100" onClick={() => setHistory([])} title="Clear logs" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 cursor-pointer hover:opacity-100" onClick={() => setIsMaximized(!isMaximized)} title="Maximize" />
          </div>
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-300">
            ALC-Termux@localhost:~ <span className="text-cyan-400 text-[10px] font-normal px-1.5 py-0.5 bg-cyan-950/60 border border-cyan-500/30 rounded">SIMULATOR</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyEntireLog}
            className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors text-xs flex items-center gap-1 px-2"
            title="Copy Terminal Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px] hidden sm:inline">{copied ? 'Copied' : 'Copy Logs'}</span>
          </button>
          <button
            onClick={() => setHistory([{ id: Date.now().toString(), type: 'system', text: 'Terminal reset.' }])}
            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
            title="Clear Screen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 bg-[#0A0F1E]/95 select-text">
        {history.map((line) => (
          <div key={line.id} className="leading-relaxed break-words">
            {line.type === 'input' && (
              <span className="text-cyan-400 font-semibold">{line.text}</span>
            )}
            {line.type === 'output' && (
              <span className="text-slate-300 whitespace-pre-wrap">{line.text}</span>
            )}
            {line.type === 'system' && (
              <span className="text-emerald-400 font-medium">{line.text}</span>
            )}
            {line.type === 'error' && (
              <span className="text-red-400 font-medium">{line.text}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="p-3 bg-[#0F172A] border-t border-slate-800 flex items-center gap-2">
        <span className="text-cyan-400 font-mono text-xs font-bold select-none">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command (e.g. pkg update, help, list) or paste bash..."
          className="flex-1 bg-transparent font-mono text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          autoFocus
        />
        <button
          onClick={() => executeCommand(input)}
          disabled={!input.trim()}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold text-xs rounded flex items-center gap-1.5 transition-all shadow-sm shadow-cyan-900/40"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Execute</span>
        </button>
      </div>

      {/* Quick script pills */}
      <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-900 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
        <span className="text-slate-500 font-mono flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Quick Tests:
        </span>
        <button
          onClick={() => executeCommand('pkg update && pkg upgrade')}
          className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 hover:text-cyan-300 border border-slate-800 rounded font-mono shrink-0 transition-colors"
        >
          pkg update
        </button>
        <button
          onClick={() => executeCommand('pkg install git python clang zsh')}
          className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 hover:text-cyan-300 border border-slate-800 rounded font-mono shrink-0 transition-colors"
        >
          install dev tools
        </button>
        <button
          onClick={() => executeCommand('termux-setup-storage')}
          className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 hover:text-cyan-300 border border-slate-800 rounded font-mono shrink-0 transition-colors"
        >
          setup storage
        </button>
        <button
          onClick={() => executeCommand('help')}
          className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 hover:text-cyan-300 border border-slate-800 rounded font-mono shrink-0 transition-colors"
        >
          help
        </button>
      </div>
    </div>
  );
};
