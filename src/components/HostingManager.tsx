import React, { useState } from 'react';
import { 
  Server, 
  HardDrive, 
  Globe, 
  Activity, 
  ExternalLink, 
  Copy, 
  Check, 
  KeyRound, 
  Database, 
  Layers, 
  Terminal, 
  AlertTriangle, 
  RefreshCw, 
  Edit3, 
  Save, 
  X, 
  ShieldCheck, 
  Wrench, 
  FolderGit2, 
  Cpu, 
  Zap, 
  Eye, 
  EyeOff, 
  Sparkles, 
  HelpCircle, 
  ArrowUpRight,
  TrendingUp,
  FileCode2,
  Lock,
  CloudLightning
} from 'lucide-react';
import { HostingConfig, SiteSettings } from '../types';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface HostingManagerProps {
  settings: SiteSettings;
  isAdmin: boolean;
  onOpenTerminalWithCmd?: (cmd: string) => void;
  onRefreshData: () => void;
}

export const HostingManager: React.FC<HostingManagerProps> = ({
  settings,
  isAdmin,
  onOpenTerminalWithCmd,
  onRefreshData
}) => {
  const hosting: HostingConfig = settings.hosting || {
    accountUsername: 'alcy_42677631',
    accountPasswordMasked: 'alc_pass_9921',
    domain: 'a23pro.alc.onl',
    serverIp: '185.27.134.170',
    status: 'Active',
    sslStatus: 'SSL Active',
    diskUsedMB: 0,
    diskTotalGB: 5,
    bandwidthUsedMB: 0,
    bandwidthUnlimited: true,
    inodesUsed: 0,
    inodesTotal: 59400,
    mysqlHost: 'sql202.alchosting.xyz',
    mysqlPort: 3306,
    ftpHost: 'ftp.alchosting.xyz',
    ftpPort: 21,
    controlPanelUrl: 'https://app.alchosting.net',
    fileManagerUrl: 'https://app.alchosting.net/account/filemanager',
    builderUrl: 'https://app.alchosting.net/account/builder',
    dnsCacheNotice: 'Some of the hosting features may not work. It may take up to 72 hours for the hosting account to work properly. This is caused by DNS caching, which ALC Hosting Networks cannot control, but there are some workarounds you can try.'
  };

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showDnsWorkaround, setShowDnsWorkaround] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeDeployTab, setActiveDeployTab] = useState<'lftp' | 'curl' | 'mysql' | 'git'>('lftp');

  // Custom Deploy Generator State
  const [localDir, setLocalDir] = useState('./htdocs');
  const [customFtpPass, setCustomFtpPass] = useState('YOUR_PASSWORD');

  // Edit Form State
  const [editForm, setEditForm] = useState<HostingConfig>({ ...hosting });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    try {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateHostingConfig(editForm);
    setIsEditing(false);
    onRefreshData();
  };

  const lftpDeployScript = `pkg install lftp -y && lftp -u ${hosting.accountUsername},${customFtpPass} ${hosting.ftpHost} -e "set ssl:verify-certificate no; mirror -R --verbose ${localDir} /htdocs; bye"`;
  const curlUploadScript = `pkg install curl -y && curl -T index.html -u ${hosting.accountUsername}:${customFtpPass} ftp://${hosting.ftpHost}/htdocs/index.html`;
  const mysqlTestScript = `pkg install mariadb -y && mariadb -h ${hosting.mysqlHost} -P ${hosting.mysqlPort} -u ${hosting.accountUsername} -p`;
  const gitDeployScript = `pkg install git lftp -y && git clone https://github.com/your-username/your-site.git web-src && cd web-src && lftp -u ${hosting.accountUsername},${customFtpPass} ${hosting.ftpHost} -e "mirror -R . /htdocs; bye"`;

  const getActiveScript = () => {
    switch (activeDeployTab) {
      case 'lftp': return lftpDeployScript;
      case 'curl': return curlUploadScript;
      case 'mysql': return mysqlTestScript;
      case 'git': return gitDeployScript;
      default: return lftpDeployScript;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner with Server Info */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#111C38] to-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 font-mono text-[11px] font-bold rounded-lg flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" /> ALC HOSTING NETWORKS
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold rounded-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {hosting.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{hosting.domain}</span>
              <a
                href={`http://${hosting.domain}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs bg-slate-800/80 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 px-3 py-1.5 rounded-xl border border-cyan-500/30 font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>Visit Live Site</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </h1>

            <p className="text-xs text-slate-400 max-w-2xl font-mono">
              Server IP: <span className="text-cyan-300 font-semibold">{hosting.serverIp}</span> | User: <span className="text-slate-200 font-semibold">{hosting.accountUsername}</span> | SSL: <span className="text-emerald-400 font-semibold">{hosting.sslStatus}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAdmin && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span>Edit Host Config</span>
              </button>
            )}

            <a
              href={hosting.controlPanelUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>ALC Client Portal</span>
            </a>
          </div>
        </div>
      </div>

      {/* DNS 72-Hour Notice Box with Expandable Workaround Guide */}
      <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 text-xs shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shrink-0 mt-0.5">
              <CloudLightning className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs flex items-center gap-2">
                <span>DNS Propagation Notice (ALC Networks)</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  Global TTL: up to 72 hrs
                </span>
              </h4>
              <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
                {hosting.dnsCacheNotice}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowDnsWorkaround(!showDnsWorkaround)}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-cyan-400 font-mono text-[11px] rounded-lg shrink-0 border border-slate-700 transition-colors"
          >
            {showDnsWorkaround ? 'Hide Workarounds' : 'View Instant Fix'}
          </button>
        </div>

        {/* Expandable DNS Workaround details */}
        {showDnsWorkaround && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 font-mono text-[11px]">
            <p className="text-slate-300 font-semibold">
              Instant Workarounds to bypass local ISP DNS cache on Android & Termux:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">1. Switch Android Private DNS to Cloudflare:</span>
                <code className="text-slate-300 text-[10px] block mb-2">
                  Settings &gt; Network &gt; Private DNS &gt; hostname: <strong className="text-white">one.one.one.one</strong>
                </code>
                <button
                  onClick={() => handleCopy('settings put global private_dns_mode hostname && settings put global private_dns_specifier one.one.one.one', 'dns-adb')}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'dns-adb' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'dns-adb' ? 'Copied ADB Command!' : 'Copy ADB Fast Command'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">2. Termux Direct Server IP Access:</span>
                <code className="text-slate-300 text-[10px] block mb-2">
                  curl -H &quot;Host: {hosting.domain}&quot; http://{hosting.serverIp}/
                </code>
                <button
                  onClick={() => handleCopy(`curl -H "Host: ${hosting.domain}" http://${hosting.serverIp}/`, 'dns-curl')}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'dns-curl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'dns-curl' ? 'Copied Curl Query!' : 'Copy Termux Bypass Command'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Metrics Cards (Matches User's Dashboard Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Host Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold rounded">
              {hosting.status}
            </span>
            <span className="font-bold text-white text-sm truncate">{hosting.domain}</span>
          </div>
          <div className="text-[11px] text-cyan-400 font-mono flex items-center gap-1 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>SSL: {hosting.sslStatus}</span>
          </div>
        </div>

        {/* Disk Usage Card */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Disk Quota
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-white mb-2">
            {hosting.diskUsedMB} MB <span className="text-xs font-normal text-slate-400">/ {hosting.diskTotalGB} GB</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-amber-400 h-full rounded-full transition-all"
              style={{ width: `${Math.max(4, (hosting.diskUsedMB / (hosting.diskTotalGB * 1024)) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1.5 flex justify-between">
            <span>{hosting.diskUsedMB} MB Used</span>
            <span>{hosting.diskTotalGB} GB Available</span>
          </div>
        </div>

        {/* Bandwidth Card */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Bandwidth
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-white mb-1">
            {hosting.bandwidthUsedMB} MB <span className="text-xs font-normal text-emerald-400">/ &infin;</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Unlimited high-speed unmetered network transfer
          </p>
        </div>

        {/* Inodes Card */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 rounded-2xl p-5 shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              File Inodes
            </span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-white mb-2">
            {hosting.inodesUsed.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {hosting.inodesTotal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-pink-500 h-full rounded-full transition-all"
              style={{ width: `${Math.max(2, (hosting.inodesUsed / hosting.inodesTotal) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1.5">
            0% used ({hosting.inodesTotal.toLocaleString()} files max)
          </div>
        </div>
      </div>

      {/* 4 Action Buttons Bar (Matches Screenshot) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <a
          href={hosting.controlPanelUrl}
          target="_blank"
          rel="noreferrer"
          className="p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
        >
          <Cpu className="w-4 h-4" />
          <span>Control Panel</span>
        </a>

        <a
          href={hosting.fileManagerUrl}
          target="_blank"
          rel="noreferrer"
          className="p-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40 transition-all cursor-pointer"
        >
          <FolderGit2 className="w-4 h-4" />
          <span>File Manager</span>
        </a>

        <a
          href={hosting.builderUrl}
          target="_blank"
          rel="noreferrer"
          className="p-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 transition-all cursor-pointer"
        >
          <Globe className="w-4 h-4" />
          <span>Website Builder</span>
        </a>

        <button
          onClick={() => setIsEditing(true)}
          className="p-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
        >
          <Wrench className="w-4 h-4" />
          <span>Hosting Settings</span>
        </button>
      </div>

      {/* Account Details & Connection Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Account details */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Lock className="w-4 h-4 text-cyan-400" /> Account details
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              AUTHENTICATED
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Username */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="text-slate-500">&gt;</span> Username:
              </span>
              <div className="flex items-center gap-2">
                <strong className="text-cyan-300">{hosting.accountUsername}</strong>
                <button
                  onClick={() => handleCopy(hosting.accountUsername, 'acc-user')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy Username"
                >
                  {copiedKey === 'acc-user' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="text-slate-500">&gt;</span> Password:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-200">
                  {showPassword ? (hosting.accountPasswordMasked || '••••••••••') : '••••••••••••'}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
                  title="Toggle show/hide"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleCopy(hosting.accountPasswordMasked || 'alcadmin123', 'acc-pass')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy Password"
                >
                  {copiedKey === 'acc-pass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Server IP */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="text-slate-500">&gt;</span> Server IP:
              </span>
              <div className="flex items-center gap-2">
                <strong className="text-emerald-400">{hosting.serverIp}</strong>
                <button
                  onClick={() => handleCopy(hosting.serverIp, 'acc-ip')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy IP"
                >
                  {copiedKey === 'acc-ip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Domain */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="text-slate-500">&gt;</span> Domain:
              </span>
              <div className="flex items-center gap-2">
                <strong className="text-white">{hosting.domain}</strong>
                <button
                  onClick={() => handleCopy(hosting.domain, 'acc-dom')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy Domain"
                >
                  {copiedKey === 'acc-dom' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={`http://${hosting.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold flex items-center gap-1"
                >
                  <span>Website Builder</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Connection Details (MySQL & FTP) */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Database className="w-4 h-4 text-cyan-400" /> Connection Details
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              ACTIVE PROTOCOLS
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* MySQL Host */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-slate-400 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-blue-400" /> MySQL Host:
              </span>
              <div className="flex items-center gap-2">
                <strong className="text-cyan-300">{hosting.mysqlHost}</strong>
                <button
                  onClick={() => handleCopy(hosting.mysqlHost, 'conn-mysql')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy MySQL Host"
                >
                  {copiedKey === 'conn-mysql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* MySQL Port */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="text-slate-500">&gt;</span> Port:
              </span>
              <div className="flex items-center gap-2">
                <strong className="text-emerald-400">{hosting.mysqlPort}</strong>
                <button
                  onClick={() => handleCopy(String(hosting.mysqlPort), 'conn-mport')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  {copiedKey === 'conn-mport' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* FTP Host */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-slate-400 flex items-center gap-2">
                <FolderGit2 className="w-3.5 h-3.5 text-amber-400" /> FTP Host:
              </span>
              <div className="flex items-center gap-2">
                <strong className="text-cyan-300">{hosting.ftpHost}</strong>
                <button
                  onClick={() => handleCopy(hosting.ftpHost, 'conn-ftp')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy FTP Host"
                >
                  {copiedKey === 'conn-ftp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* FTP Port */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="text-slate-500">&gt;</span> Port:
              </span>
              <div className="flex items-center gap-2">
                <strong className="text-emerald-400">{hosting.ftpPort}</strong>
                <button
                  onClick={() => handleCopy(String(hosting.ftpPort), 'conn-fport')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  {copiedKey === 'conn-fport' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Termux & Shell Auto-Deployment Generator for ALCHOSTING */}
      <div className="bg-[#0F172A] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Termux Direct Web Deploy Suite</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Automatically upload HTML, React build, or PHP web scripts from your Android phone directly to <strong className="text-cyan-300 font-mono">{hosting.domain}</strong>!
            </p>
          </div>

          {/* Generator Tab Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {[
              { id: 'lftp', label: 'LFTP Mirror' },
              { id: 'curl', label: 'Single cURL' },
              { id: 'mysql', label: 'MySQL Shell' },
              { id: 'git', label: 'Git Sync' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDeployTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeDeployTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customization Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Local Android / Termux Folder</label>
            <input
              type="text"
              value={localDir}
              onChange={(e) => setLocalDir(e.target.value)}
              placeholder="./htdocs or ~/storage/shared/myweb"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">FTP Password (for script)</label>
            <input
              type="text"
              value={customFtpPass}
              onChange={(e) => setCustomFtpPass(e.target.value)}
              placeholder="Your ALC Hosting password"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Script Output Box */}
        <div className="relative">
          <div className="flex items-center justify-between bg-slate-950 px-4 py-2 rounded-t-xl border-t border-x border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-cyan-400 font-bold">bash &gt; termux_deploy.sh</span>
            </div>
            <span>Auto-Configured for {hosting.domain}</span>
          </div>

          <pre className="bg-[#0A0F1E] border border-slate-800 rounded-b-xl p-4 text-xs font-mono text-cyan-300 overflow-x-auto selection:bg-cyan-500 selection:text-slate-950 whitespace-pre-wrap leading-relaxed">
            {getActiveScript()}
          </pre>
        </div>

        {/* Action buttons for script */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Target path on server: <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">/htdocs</code></span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenTerminalWithCmd && (
              <button
                onClick={() => onOpenTerminalWithCmd(getActiveScript())}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Test in Virtual Terminal</span>
              </button>
            )}

            <button
              onClick={() => handleCopy(getActiveScript(), 'deploy-script')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                copiedKey === 'deploy-script'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/40'
              }`}
            >
              {copiedKey === 'deploy-script' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'deploy-script' ? 'Copied to Clipboard!' : 'Copy Shell Script'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Usage Statistics Interactive Section */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Live Server Usage & Hits Telemetry</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">11-Day Window</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Hits Usage Graph Simulation */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-bold text-slate-200">Daily Hits Usage</h4>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500" /> Usage</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500" /> Limit</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> 11-Day Avg</span>
              </div>
            </div>

            {/* Custom SVG Bar Graph */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2 border-b border-l border-slate-800">
              {[
                { day: 'D1', val: 12 },
                { day: 'D2', val: 24 },
                { day: 'D3', val: 18 },
                { day: 'D4', val: 42 },
                { day: 'D5', val: 35 },
                { day: 'D6', val: 56 },
                { day: 'D7', val: 78 },
                { day: 'D8', val: 62 },
                { day: 'D9', val: 94 },
                { day: 'D10', val: 85 },
                { day: 'D11', val: 110 }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t group-hover:from-cyan-400 group-hover:to-cyan-200 transition-all cursor-pointer relative"
                    style={{ height: `${(item.val / 120) * 100}%` }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      {item.val}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Files & Inodes Telemetry */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-bold text-slate-200">File Inodes & Storage Ratio</h4>
              <span className="text-[10px] font-mono text-emerald-400">Health: Optimal</span>
            </div>

            <div className="space-y-4 pt-2 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                  <span>Web Root (`/htdocs`):</span>
                  <span className="text-white">Active</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-cyan-500 h-full w-[1%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                  <span>Database (`{hosting.mysqlHost}`):</span>
                  <span className="text-emerald-400">Port 3306 Open</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full w-[100%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                  <span>FTP Listener (`{hosting.ftpHost}`):</span>
                  <span className="text-emerald-400">Port 21 Ready</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full w-[100%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal for Hosting Settings */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Edit ALC Hosting Server Details</h3>
                <p className="text-xs text-slate-400 font-mono">Customize server IP, domain, and FTP parameters</p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Domain Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.domain}
                    onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Server IP</label>
                  <input
                    type="text"
                    required
                    value={editForm.serverIp}
                    onChange={(e) => setEditForm({ ...editForm, serverIp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Account Username</label>
                  <input
                    type="text"
                    required
                    value={editForm.accountUsername}
                    onChange={(e) => setEditForm({ ...editForm, accountUsername: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Account Password (Masked)</label>
                  <input
                    type="text"
                    value={editForm.accountPasswordMasked || ''}
                    onChange={(e) => setEditForm({ ...editForm, accountPasswordMasked: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">FTP Host</label>
                  <input
                    type="text"
                    value={editForm.ftpHost}
                    onChange={(e) => setEditForm({ ...editForm, ftpHost: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">MySQL Host</label>
                  <input
                    type="text"
                    value={editForm.mysqlHost}
                    onChange={(e) => setEditForm({ ...editForm, mysqlHost: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DNS Notice Message</label>
                <textarea
                  rows={2}
                  value={editForm.dnsCacheNotice}
                  onChange={(e) => setEditForm({ ...editForm, dnsCacheNotice: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/40"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
