import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  Terminal, 
  Smartphone, 
  Image as ImageIcon, 
  Newspaper, 
  BookOpen, 
  Link2, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  Save, 
  RefreshCw, 
  X, 
  Check, 
  Activity, 
  Eye, 
  Copy,
  Lock,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { 
  CommandItem, 
  AndroidAppItem, 
  GalleryItem, 
  NewsItem, 
  BlogItem, 
  ResourceLinkItem, 
  SiteSettings, 
  ActivityLog 
} from '../../types';
import { StorageService } from '../../services/storageService';

interface AdminDashboardProps {
  settings: SiteSettings;
  commands: CommandItem[];
  apps: AndroidAppItem[];
  gallery: GalleryItem[];
  news: NewsItem[];
  blogs: BlogItem[];
  links: ResourceLinkItem[];
  activities: ActivityLog[];
  onRefreshData: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  commands,
  apps,
  gallery,
  news,
  blogs,
  links,
  activities,
  onRefreshData,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'commands' | 'apps' | 'gallery' | 'news' | 'blogs' | 'links' | 'settings'>('overview');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Command Form State
  const [editingCommand, setEditingCommand] = useState<CommandItem | null>(null);
  const [isAddingCommand, setIsAddingCommand] = useState(false);
  const [cmdForm, setCmdForm] = useState({
    title: '',
    command: '',
    category: 'termux-basic' as CommandItem['category'],
    description: '',
    platform: 'Termux' as CommandItem['platform'],
    isPro: false,
    tags: ''
  });

  // App Form State
  const [editingApp, setEditingApp] = useState<AndroidAppItem | null>(null);
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [appForm, setAppForm] = useState({
    title: '',
    packageName: '',
    version: 'v1.0.0',
    size: '15.0 MB',
    category: 'termux-add-on' as AndroidAppItem['category'],
    downloadUrl: '',
    icon: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=200&auto=format&fit=crop&q=80',
    screenshots: '',
    description: '',
    changelog: '',
    rating: 4.8,
    minAndroid: 'Android 8.0+'
  });

  // Gallery Form State
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    title: '',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    category: 'termux-setup' as GalleryItem['category'],
    caption: ''
  });

  // News Form State
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    category: 'release' as NewsItem['category'],
    urgent: false,
    tag: 'UPDATE',
    author: 'Admin'
  });

  // Blog Form State
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    summary: '',
    content: '',
    author: 'ALC Engineer',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=80',
    tags: 'Termux, Android, Tutorial'
  });

  // Link Form State
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    category: 'official' as ResourceLinkItem['category'],
    description: '',
    badge: 'Verified'
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });
  const [newAdminUsername, setNewAdminUsername] = useState(settings.adminUsername);
  const [newAdminPassword, setNewAdminPassword] = useState(settings.adminPasswordHash);
  const [importJsonText, setImportJsonText] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // --- Handlers for Commands ---
  const handleSaveCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const tagList = cmdForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (editingCommand) {
      StorageService.updateCommand(editingCommand.id, {
        title: cmdForm.title,
        command: cmdForm.command,
        category: cmdForm.category,
        description: cmdForm.description,
        platform: cmdForm.platform,
        isPro: cmdForm.isPro,
        tags: tagList
      });
      showToast('Command updated successfully!');
    } else {
      StorageService.addCommand({
        title: cmdForm.title,
        command: cmdForm.command,
        category: cmdForm.category,
        description: cmdForm.description,
        platform: cmdForm.platform,
        isPro: cmdForm.isPro,
        tags: tagList
      });
      showToast('New command added to database!');
    }
    setEditingCommand(null);
    setIsAddingCommand(false);
    onRefreshData();
  };

  const handleEditCmdClick = (cmd: CommandItem) => {
    setEditingCommand(cmd);
    setCmdForm({
      title: cmd.title,
      command: cmd.command,
      category: cmd.category,
      description: cmd.description,
      platform: cmd.platform,
      isPro: !!cmd.isPro,
      tags: cmd.tags ? cmd.tags.join(', ') : ''
    });
    setIsAddingCommand(true);
  };

  const handleDeleteCmd = (id: string) => {
    if (window.confirm('Are you sure you want to delete this command?')) {
      StorageService.deleteCommand(id);
      showToast('Command deleted.');
      onRefreshData();
    }
  };

  // --- Handlers for Apps ---
  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    const logs = appForm.changelog.split('\n').map(l => l.trim()).filter(Boolean);
    const shots = appForm.screenshots.split('\n').map(s => s.trim()).filter(Boolean);

    if (editingApp) {
      StorageService.updateApp(editingApp.id, {
        title: appForm.title,
        packageName: appForm.packageName,
        version: appForm.version,
        size: appForm.size,
        category: appForm.category,
        downloadUrl: appForm.downloadUrl,
        icon: appForm.icon,
        screenshots: shots.length > 0 ? shots : editingApp.screenshots,
        description: appForm.description,
        changelog: logs.length > 0 ? logs : editingApp.changelog,
        rating: Number(appForm.rating) || 4.8,
        minAndroid: appForm.minAndroid
      });
      showToast('App details updated!');
    } else {
      StorageService.addApp({
        title: appForm.title,
        packageName: appForm.packageName,
        version: appForm.version,
        size: appForm.size,
        category: appForm.category,
        downloadUrl: appForm.downloadUrl || '#download-direct',
        icon: appForm.icon,
        screenshots: shots.length > 0 ? shots : [appForm.icon],
        description: appForm.description,
        changelog: logs.length > 0 ? logs : ['Initial ALCHOSTING release build.'],
        rating: Number(appForm.rating) || 4.8,
        minAndroid: appForm.minAndroid
      });
      showToast('New Android APK added!');
    }
    setEditingApp(null);
    setIsAddingApp(false);
    onRefreshData();
  };

  const handleDeleteApp = (id: string) => {
    if (window.confirm('Delete this app package?')) {
      StorageService.deleteApp(id);
      showToast('App package removed.');
      onRefreshData();
    }
  };

  // --- Handlers for Gallery ---
  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.addGalleryItem({
      title: photoForm.title,
      url: photoForm.url,
      category: photoForm.category,
      caption: photoForm.caption
    });
    setIsAddingPhoto(false);
    setPhotoForm({
      title: '',
      url: '',
      category: 'termux-setup',
      caption: ''
    });
    showToast('Photo added to gallery!');
    onRefreshData();
  };

  const handleDeletePhoto = (id: string) => {
    if (window.confirm('Delete this photo?')) {
      StorageService.deleteGalleryItem(id);
      showToast('Photo removed.');
      onRefreshData();
    }
  };

  // --- Handlers for News ---
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.addNews({
      title: newsForm.title,
      content: newsForm.content,
      category: newsForm.category,
      urgent: newsForm.urgent,
      tag: newsForm.tag,
      author: newsForm.author
    });
    setIsAddingNews(false);
    setNewsForm({
      title: '',
      content: '',
      category: 'release',
      urgent: false,
      tag: 'UPDATE',
      author: 'Admin'
    });
    showToast('News alert published!');
    onRefreshData();
  };

  const handleDeleteNews = (id: string) => {
    if (window.confirm('Delete this announcement?')) {
      StorageService.deleteNews(id);
      showToast('News deleted.');
      onRefreshData();
    }
  };

  // --- Handlers for Blogs ---
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = blogForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    StorageService.addBlog({
      title: blogForm.title,
      summary: blogForm.summary,
      content: blogForm.content,
      author: blogForm.author,
      readTime: blogForm.readTime,
      coverImage: blogForm.coverImage,
      tags: tagsArr
    });
    setIsAddingBlog(false);
    showToast('New blog article published!');
    onRefreshData();
  };

  const handleDeleteBlog = (id: string) => {
    if (window.confirm('Delete this blog post?')) {
      StorageService.deleteBlog(id);
      showToast('Blog deleted.');
      onRefreshData();
    }
  };

  // --- Handlers for Links ---
  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.addLink({
      title: linkForm.title,
      url: linkForm.url,
      category: linkForm.category,
      description: linkForm.description,
      badge: linkForm.badge
    });
    setIsAddingLink(false);
    setLinkForm({
      title: '',
      url: '',
      category: 'official',
      description: '',
      badge: 'Verified'
    });
    showToast('Resource link created!');
    onRefreshData();
  };

  const handleDeleteLink = (id: string) => {
    if (window.confirm('Delete this link?')) {
      StorageService.deleteLink(id);
      showToast('Link removed.');
      onRefreshData();
    }
  };

  // --- Handlers for Settings & Backup ---
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settingsForm);
    StorageService.updateAdminCredentials(newAdminUsername, newAdminPassword);
    showToast('Site settings & credentials saved!');
    onRefreshData();
  };

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alchosting_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded.');
  };

  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    const res = StorageService.importAllData(importJsonText);
    if (res.success) {
      showToast('Data imported successfully!');
      setImportJsonText('');
      onRefreshData();
    } else {
      alert(res.message);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Warning: This will restore initial default dataset. Continue?')) {
      StorageService.resetToDefaults();
      showToast('Reset to default data complete.');
      onRefreshData();
    }
  };

  // Compute analytics
  const totalCommandCopies = commands.reduce((acc, c) => acc + (c.copiedCount || 0), 0);
  const totalAppDownloads = apps.reduce((acc, a) => acc + (a.downloads || 0), 0);
  const totalGalleryLikes = gallery.reduce((acc, g) => acc + (g.likes || 0), 0);

  return (
    <div className="bg-[#0A0F1E] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-slate-950 px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F172A] border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-900/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-lg font-bold text-white tracking-tight">ALCHOSTING Master Admin Control</h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Authenticated Admin: <span className="text-cyan-400 font-semibold">{settings.adminUsername}</span> | System Mode: Live
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshData}
            className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            title="Refresh database"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-medium scrollbar-thin">
        {[
          { id: 'overview', label: 'Analytics & Logs', icon: Activity },
          { id: 'commands', label: `Commands (${commands.length})`, icon: Terminal },
          { id: 'apps', label: `Android APKs (${apps.length})`, icon: Smartphone },
          { id: 'gallery', label: `Gallery (${gallery.length})`, icon: ImageIcon },
          { id: 'news', label: `News (${news.length})`, icon: Newspaper },
          { id: 'blogs', label: `Blogs (${blogs.length})`, icon: BookOpen },
          { id: 'links', label: `Links (${links.length})`, icon: Link2 },
          { id: 'settings', label: 'Settings & Security', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                active
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB CONTENT: OVERVIEW --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] font-mono text-cyan-400 block mb-1">COMMANDS IN VAULT</span>
              <div className="text-2xl font-extrabold text-white">{commands.length}</div>
              <span className="text-[10px] text-slate-400">{totalCommandCopies.toLocaleString()} total copies</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] font-mono text-emerald-400 block mb-1">ANDROID APKS</span>
              <div className="text-2xl font-extrabold text-white">{apps.length}</div>
              <span className="text-[10px] text-slate-400">{totalAppDownloads.toLocaleString()} total downloads</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] font-mono text-pink-400 block mb-1">GALLERY PHOTOS</span>
              <div className="text-2xl font-extrabold text-white">{gallery.length}</div>
              <span className="text-[10px] text-slate-400">{totalGalleryLikes.toLocaleString()} user likes</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] font-mono text-indigo-400 block mb-1">NEWS & BLOGS</span>
              <div className="text-2xl font-extrabold text-white">{news.length + blogs.length}</div>
              <span className="text-[10px] text-slate-400">Published articles</span>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-cyan-400" /> Recent System & Admin Activity Feed
            </h3>
            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-slate-900 text-cyan-400 border border-slate-800 rounded font-mono text-[10px]">
                      {act.category}
                    </span>
                    <span className="text-slate-200 font-medium">{act.text}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: COMMANDS MANAGEMENT --- */}
      {activeTab === 'commands' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Manage Termux & Android Commands</h3>
            <button
              onClick={() => {
                setEditingCommand(null);
                setCmdForm({
                  title: '',
                  command: '',
                  category: 'termux-basic',
                  description: '',
                  platform: 'Termux',
                  isPro: false,
                  tags: ''
                });
                setIsAddingCommand(true);
              }}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Command</span>
            </button>
          </div>

          {/* Add / Edit Form Modal */}
          {isAddingCommand && (
            <div className="bg-[#0F172A] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white">
                  {editingCommand ? 'Edit Command Script' : 'Add New Shell Command'}
                </h4>
                <button onClick={() => setIsAddingCommand(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCommand} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Command Title</label>
                    <input
                      type="text"
                      required
                      value={cmdForm.title}
                      onChange={(e) => setCmdForm({ ...cmdForm, title: e.target.value })}
                      placeholder="e.g. Kali NetHunter Rootless v4.2"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Category</label>
                    <select
                      value={cmdForm.category}
                      onChange={(e) => setCmdForm({ ...cmdForm, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="termux-basic">Termux Basics</option>
                      <option value="package-mgr">Package & Repo</option>
                      <option value="root-tools">Root Tools & Magisk</option>
                      <option value="networking">Networking & ADB</option>
                      <option value="ui-styling">UI Styling & Themes</option>
                      <option value="kali-pentest">Kali / Pentest</option>
                      <option value="automation">Automation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Executable Shell Command Line</label>
                  <textarea
                    required
                    rows={3}
                    value={cmdForm.command}
                    onChange={(e) => setCmdForm({ ...cmdForm, command: e.target.value })}
                    placeholder="pkg update && pkg install python git -y..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Platform</label>
                    <select
                      value={cmdForm.platform}
                      onChange={(e) => setCmdForm({ ...cmdForm, platform: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    >
                      <option value="Termux">Termux</option>
                      <option value="Android Shell">Android Shell (ADB)</option>
                      <option value="Linux">Linux</option>
                      <option value="All">All</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={cmdForm.tags}
                      onChange={(e) => setCmdForm({ ...cmdForm, tags: e.target.value })}
                      placeholder="kali, root, storage"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="isProCheck"
                      checked={cmdForm.isPro}
                      onChange={(e) => setCmdForm({ ...cmdForm, isPro: e.target.checked })}
                      className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-800"
                    />
                    <label htmlFor="isProCheck" className="text-slate-300 font-medium cursor-pointer">
                      Mark as PRO / Verified
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Description</label>
                  <input
                    type="text"
                    value={cmdForm.description}
                    onChange={(e) => setCmdForm({ ...cmdForm, description: e.target.value })}
                    placeholder="Brief explanation of what this command accomplishes..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCommand(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg"
                  >
                    Save Command
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Commands List Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Title & Platform</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Command Preview</th>
                    <th className="p-3.5">Copies</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {commands.map((cmd) => (
                    <tr key={cmd.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white">{cmd.title}</div>
                        <span className="text-[10px] font-mono text-cyan-400">{cmd.platform}</span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400">{cmd.category}</td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-300 max-w-xs truncate">
                        {cmd.command}
                      </td>
                      <td className="p-3.5 font-mono text-cyan-400">{cmd.copiedCount || 0}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditCmdClick(cmd)}
                            className="p-1.5 bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-300 rounded"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCmd(cmd.id)}
                            className="p-1.5 bg-slate-800 hover:bg-red-600/30 text-slate-300 hover:text-red-400 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: APPS MANAGEMENT --- */}
      {activeTab === 'apps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Manage Android APKs & Mod Tools</h3>
            <button
              onClick={() => {
                setEditingApp(null);
                setAppForm({
                  title: '',
                  packageName: '',
                  version: 'v1.0.0',
                  size: '15.0 MB',
                  category: 'termux-add-on',
                  downloadUrl: '',
                  icon: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=200&auto=format&fit=crop&q=80',
                  screenshots: '',
                  description: '',
                  changelog: '',
                  rating: 4.8,
                  minAndroid: 'Android 8.0+'
                });
                setIsAddingApp(true);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Android APK</span>
            </button>
          </div>

          {/* App Form */}
          {isAddingApp && (
            <div className="bg-[#0F172A] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white">
                  {editingApp ? 'Edit Android Application' : 'Add New Android APK'}
                </h4>
                <button onClick={() => setIsAddingApp(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveApp} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">App Title</label>
                    <input
                      type="text"
                      required
                      value={appForm.title}
                      onChange={(e) => setAppForm({ ...appForm, title: e.target.value })}
                      placeholder="e.g. MT Manager VIP"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Package Name</label>
                    <input
                      type="text"
                      required
                      value={appForm.packageName}
                      onChange={(e) => setAppForm({ ...appForm, packageName: e.target.value })}
                      placeholder="com.example.app"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Version</label>
                    <input
                      type="text"
                      required
                      value={appForm.version}
                      onChange={(e) => setAppForm({ ...appForm, version: e.target.value })}
                      placeholder="v2.15.0"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">File Size</label>
                    <input
                      type="text"
                      value={appForm.size}
                      onChange={(e) => setAppForm({ ...appForm, size: e.target.value })}
                      placeholder="24.5 MB"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Category</label>
                    <select
                      value={appForm.category}
                      onChange={(e) => setAppForm({ ...appForm, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    >
                      <option value="termux-add-on">Termux Add-on</option>
                      <option value="mod-tool">VIP Mod Tool</option>
                      <option value="developer">Developer & ADB</option>
                      <option value="root-utility">Root Utility</option>
                      <option value="customization">Customization</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Direct Download Link</label>
                    <input
                      type="text"
                      value={appForm.downloadUrl}
                      onChange={(e) => setAppForm({ ...appForm, downloadUrl: e.target.value })}
                      placeholder="https://... or #download-direct"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">App Icon Image URL</label>
                    <input
                      type="text"
                      value={appForm.icon}
                      onChange={(e) => setAppForm({ ...appForm, icon: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Min Android OS</label>
                    <input
                      type="text"
                      value={appForm.minAndroid}
                      onChange={(e) => setAppForm({ ...appForm, minAndroid: e.target.value })}
                      placeholder="Android 7.0 - 15.0"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={appForm.description}
                    onChange={(e) => setAppForm({ ...appForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Changelog (1 per line)</label>
                  <textarea
                    rows={2}
                    value={appForm.changelog}
                    onChange={(e) => setAppForm({ ...appForm, changelog: e.target.value })}
                    placeholder="Fixed Android 15 process kill&#10;Added offline mirrors"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingApp(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                  >
                    Save APK
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Apps List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map((app) => (
              <div
                key={app.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={app.icon} alt={app.title} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{app.title}</h4>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <span className="text-emerald-400">{app.version}</span>
                      <span>•</span>
                      <span>{app.downloads} DLs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteApp(app.id)}
                    className="p-2 bg-slate-800 hover:bg-red-600/30 text-slate-400 hover:text-red-400 rounded-lg"
                    title="Delete App"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: GALLERY MANAGEMENT --- */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Manage Photo Gallery & Wallpapers</h3>
            <button
              onClick={() => setIsAddingPhoto(true)}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-pink-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Picture</span>
            </button>
          </div>

          {isAddingPhoto && (
            <div className="bg-[#0F172A] border border-pink-500/40 rounded-2xl p-6">
              <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={photoForm.title}
                      onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                      placeholder="e.g. Cyberpunk Termux HUD Setup"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Category</label>
                    <select
                      value={photoForm.category}
                      onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    >
                      <option value="termux-setup">Termux Setup</option>
                      <option value="ui-theme">UI Theme</option>
                      <option value="wallpapers">Wallpapers</option>
                      <option value="app-previews">App Previews</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Image URL</label>
                  <input
                    type="text"
                    required
                    value={photoForm.url}
                    onChange={(e) => setPhotoForm({ ...photoForm, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Caption</label>
                  <input
                    type="text"
                    value={photoForm.caption}
                    onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                    placeholder="Description of the image..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingPhoto(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold rounded-lg">Publish Photo</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img) => (
              <div key={img.id} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden group relative">
                <img src={img.url} alt={img.title} className="w-full h-32 object-cover" />
                <div className="p-2.5">
                  <div className="font-bold text-xs text-white truncate">{img.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>{img.likes} likes</span>
                    <button
                      onClick={() => handleDeletePhoto(img.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: NEWS & UPDATES --- */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Publish News & Urgent Alerts</h3>
            <button
              onClick={() => setIsAddingNews(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Alert / News</span>
            </button>
          </div>

          {isAddingNews && (
            <div className="bg-[#0F172A] border border-amber-500/40 rounded-2xl p-6">
              <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">News Title</label>
                    <input
                      type="text"
                      required
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      placeholder="e.g. Android 15 Mirror Fix"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Tag (e.g. PATCH / SECURITY)</label>
                    <input
                      type="text"
                      value={newsForm.tag}
                      onChange={(e) => setNewsForm({ ...newsForm, tag: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Content / Message</label>
                  <textarea
                    rows={3}
                    required
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    placeholder="Full announcement details..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="urgentCheck"
                    checked={newsForm.urgent}
                    onChange={(e) => setNewsForm({ ...newsForm, urgent: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800"
                  />
                  <label htmlFor="urgentCheck" className="text-red-400 font-bold cursor-pointer flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Priority / Urgent Red Alert
                  </label>
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingNews(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg">Publish News</button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {news.map((item) => (
              <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    {item.urgent && <span className="text-[10px] font-bold text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-500/30">URGENT</span>}
                    <h4 className="font-bold text-white text-xs">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{item.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteNews(item.id)}
                  className="p-2 bg-slate-800 hover:bg-red-600/30 text-slate-400 hover:text-red-400 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: BLOGS & GUIDES --- */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Manage Masterclasses & Blog Articles</h3>
            <button
              onClick={() => setIsAddingBlog(true)}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Tutorial</span>
            </button>
          </div>

          {isAddingBlog && (
            <div className="bg-[#0F172A] border border-indigo-500/40 rounded-2xl p-6">
              <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="e.g. Complete 2026 Termux Kali Linux Guide"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Author Name</label>
                    <input
                      type="text"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Estimated Read Time</label>
                    <input
                      type="text"
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                      placeholder="6 min read"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={blogForm.coverImage}
                    onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Summary / Excerpt</label>
                  <input
                    type="text"
                    required
                    value={blogForm.summary}
                    onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Full Content (Markdown / Code Blocks Supported)</label>
                  <textarea
                    rows={8}
                    required
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingBlog(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg">Publish Article</button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {blogs.map((b) => (
              <div key={b.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-xs">{b.title}</h4>
                  <span className="text-[11px] text-slate-500 font-mono">By {b.author} • {b.views || 0} reads</span>
                </div>
                <button
                  onClick={() => handleDeleteBlog(b.id)}
                  className="p-2 bg-slate-800 hover:bg-red-600/30 text-slate-400 hover:text-red-400 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: LINKS MANAGEMENT --- */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Manage Resource Links & Telegram Channels</h3>
            <button
              onClick={() => setIsAddingLink(true)}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource Link</span>
            </button>
          </div>

          {isAddingLink && (
            <div className="bg-[#0F172A] border border-teal-500/40 rounded-2xl p-6">
              <form onSubmit={handleSaveLink} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Link Title</label>
                    <input
                      type="text"
                      required
                      value={linkForm.title}
                      onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                      placeholder="e.g. Official Telegram Group"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Target URL</label>
                    <input
                      type="text"
                      required
                      value={linkForm.url}
                      onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                      placeholder="https://t.me/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Category</label>
                    <select
                      value={linkForm.category}
                      onChange={(e) => setLinkForm({ ...linkForm, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    >
                      <option value="official">Official</option>
                      <option value="telegram">Telegram</option>
                      <option value="github">GitHub</option>
                      <option value="tools">Tools</option>
                      <option value="hosting">Hosting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={linkForm.badge}
                      onChange={(e) => setLinkForm({ ...linkForm, badge: e.target.value })}
                      placeholder="Verified / 24x7"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Description</label>
                  <input
                    type="text"
                    value={linkForm.description}
                    onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingLink(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg">Save Link</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {links.map((l) => (
              <div key={l.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-xs truncate">{l.title}</h4>
                  <span className="text-[10px] text-cyan-400 font-mono truncate block">{l.url}</span>
                </div>
                <button
                  onClick={() => handleDeleteLink(l.id)}
                  className="p-1.5 bg-slate-800 hover:bg-red-600/30 text-slate-400 hover:text-red-400 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: SETTINGS & SECURITY --- */}
      {activeTab === 'settings' && (
        <div className="space-y-8 max-w-3xl">
          {/* Admin Credentials Config */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2 font-mono">
              <Lock className="w-4 h-4 text-cyan-400" /> Admin Security Credentials
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Change the secret login credentials required to open this Admin Panel.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Admin Username</label>
                <input
                  type="text"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Secret Password</label>
                <input
                  type="text"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Website Branding & Announcements */}
          <form onSubmit={handleSaveSiteSettings} className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2 font-mono">
              <Settings className="w-4 h-4 text-cyan-400" /> Site Customization & Ticker
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Website Brand Name</label>
                <input
                  type="text"
                  value={settingsForm.siteName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Site Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Top Announcement Ticker Text</label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-cyan-300"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showAnnounceCheck"
                checked={settingsForm.showAnnouncement}
                onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncement: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-800"
              />
              <label htmlFor="showAnnounceCheck" className="text-xs text-slate-300 cursor-pointer">
                Show Announcement Banner at Top
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/40"
              >
                <Save className="w-4 h-4" />
                <span>Save All Site Configurations</span>
              </button>
            </div>
          </form>

          {/* Backup & Restore Panel */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Download className="w-4 h-4 text-emerald-400" /> Database Backup & Restore (JSON)
            </h3>
            <p className="text-xs text-slate-400">
              Export all commands, APKs, gallery images, news, and blogs to a single JSON backup file or restore previously saved data.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportBackup}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Full Backup (.json)</span>
              </button>

              <button
                onClick={handleResetDefaults}
                className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold"
              >
                Reset to Default Data
              </button>
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Paste JSON Backup to Restore:</label>
              <textarea
                rows={3}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{"exportDate": "...", "commands": [...]}'
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono"
              />
              <button
                onClick={handleImportBackup}
                disabled={!importJsonText.trim()}
                className="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Import & Restore Database</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
