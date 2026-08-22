import {
  CommandItem,
  AndroidAppItem,
  GalleryItem,
  NewsItem,
  BlogItem,
  ResourceLinkItem,
  SiteSettings,
  ActivityLog
} from '../types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_COMMANDS,
  DEFAULT_APPS,
  DEFAULT_GALLERY,
  DEFAULT_NEWS,
  DEFAULT_BLOGS,
  DEFAULT_LINKS,
  DEFAULT_ACTIVITIES
} from '../data/defaultData';

const KEYS = {
  SETTINGS: 'alchosting_settings',
  COMMANDS: 'alchosting_commands',
  APPS: 'alchosting_apps',
  GALLERY: 'alchosting_gallery',
  NEWS: 'alchosting_news',
  BLOGS: 'alchosting_blogs',
  LINKS: 'alchosting_links',
  ACTIVITIES: 'alchosting_activities',
  ADMIN_SESSION: 'alchosting_admin_session',
  SAVED_BOOKMARKS: 'alchosting_user_bookmarks',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const StorageService = {
  // Settings
  getSettings(): SiteSettings {
    const s = safeGet<SiteSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
    // Ensure hosting defaults exist if previously stored without it
    if (!s.hosting && DEFAULT_SETTINGS.hosting) {
      s.hosting = DEFAULT_SETTINGS.hosting;
    }
    return s;
  },
  saveSettings(settings: SiteSettings): void {
    safeSet(KEYS.SETTINGS, settings);
  },
  updateHostingConfig(hosting: Partial<SiteSettings['hosting']>): void {
    const s = this.getSettings();
    s.hosting = {
      ...(DEFAULT_SETTINGS.hosting || {
        accountUsername: 'alcy_42677631',
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
        dnsCacheNotice: 'Some of the hosting features may not work. It may take up to 72 hours for the hosting account to work properly.'
      }),
      ...(s.hosting || {}),
      ...hosting
    } as any;
    this.saveSettings(s);
    this.addActivity(`Hosting Server Configuration for ${s.hosting?.domain} updated`, 'System', 'system');
  },

  // Commands
  getCommands(): CommandItem[] {
    return safeGet<CommandItem[]>(KEYS.COMMANDS, DEFAULT_COMMANDS);
  },
  saveCommands(commands: CommandItem[]): void {
    safeSet(KEYS.COMMANDS, commands);
  },
  addCommand(command: Omit<CommandItem, 'id' | 'copiedCount' | 'date'>): CommandItem {
    const commands = this.getCommands();
    const newItem: CommandItem = {
      ...command,
      id: 'cmd-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      copiedCount: 0,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...commands];
    this.saveCommands(updated);
    this.addActivity(`New Command: ${newItem.title} added`, 'Commands', 'script');
    return newItem;
  },
  updateCommand(id: string, updates: Partial<CommandItem>): boolean {
    const commands = this.getCommands();
    const idx = commands.findIndex(c => c.id === id);
    if (idx === -1) return false;
    commands[idx] = { ...commands[idx], ...updates };
    this.saveCommands(commands);
    return true;
  },
  deleteCommand(id: string): boolean {
    const commands = this.getCommands();
    const updated = commands.filter(c => c.id !== id);
    this.saveCommands(updated);
    return true;
  },
  incrementCommandCopy(id: string): void {
    const commands = this.getCommands();
    const item = commands.find(c => c.id === id);
    if (item) {
      item.copiedCount = (item.copiedCount || 0) + 1;
      this.saveCommands(commands);
    }
  },

  // Android Apps
  getApps(): AndroidAppItem[] {
    return safeGet<AndroidAppItem[]>(KEYS.APPS, DEFAULT_APPS);
  },
  saveApps(apps: AndroidAppItem[]): void {
    safeSet(KEYS.APPS, apps);
  },
  addApp(app: Omit<AndroidAppItem, 'id' | 'downloads' | 'date'>): AndroidAppItem {
    const apps = this.getApps();
    const newItem: AndroidAppItem = {
      ...app,
      id: 'app-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      downloads: 0,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...apps];
    this.saveApps(updated);
    this.addActivity(`New APK Release: ${newItem.title} (${newItem.version})`, 'Apps', 'app');
    return newItem;
  },
  updateApp(id: string, updates: Partial<AndroidAppItem>): boolean {
    const apps = this.getApps();
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) return false;
    apps[idx] = { ...apps[idx], ...updates };
    this.saveApps(apps);
    return true;
  },
  deleteApp(id: string): boolean {
    const apps = this.getApps();
    const updated = apps.filter(a => a.id !== id);
    this.saveApps(updated);
    return true;
  },
  incrementAppDownload(id: string): void {
    const apps = this.getApps();
    const item = apps.find(a => a.id === id);
    if (item) {
      item.downloads = (item.downloads || 0) + 1;
      this.saveApps(apps);
    }
  },

  // Gallery
  getGallery(): GalleryItem[] {
    return safeGet<GalleryItem[]>(KEYS.GALLERY, DEFAULT_GALLERY);
  },
  saveGallery(gallery: GalleryItem[]): void {
    safeSet(KEYS.GALLERY, gallery);
  },
  addGalleryItem(item: Omit<GalleryItem, 'id' | 'likes' | 'downloads' | 'date'>): GalleryItem {
    const gallery = this.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      likes: 0,
      downloads: 0,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...gallery];
    this.saveGallery(updated);
    this.addActivity(`New Photo/Preview: ${newItem.title} uploaded`, 'Gallery', 'system');
    return newItem;
  },
  updateGalleryItem(id: string, updates: Partial<GalleryItem>): boolean {
    const gallery = this.getGallery();
    const idx = gallery.findIndex(g => g.id === id);
    if (idx === -1) return false;
    gallery[idx] = { ...gallery[idx], ...updates };
    this.saveGallery(gallery);
    return true;
  },
  deleteGalleryItem(id: string): boolean {
    const gallery = this.getGallery();
    const updated = gallery.filter(g => g.id !== id);
    this.saveGallery(updated);
    return true;
  },
  likeGalleryItem(id: string): void {
    const gallery = this.getGallery();
    const item = gallery.find(g => g.id === id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      this.saveGallery(gallery);
    }
  },
  downloadGalleryItem(id: string): void {
    const gallery = this.getGallery();
    const item = gallery.find(g => g.id === id);
    if (item) {
      item.downloads = (item.downloads || 0) + 1;
      this.saveGallery(gallery);
    }
  },

  // News
  getNews(): NewsItem[] {
    return safeGet<NewsItem[]>(KEYS.NEWS, DEFAULT_NEWS);
  },
  saveNews(news: NewsItem[]): void {
    safeSet(KEYS.NEWS, news);
  },
  addNews(news: Omit<NewsItem, 'id' | 'date'>): NewsItem {
    const newsList = this.getNews();
    const newItem: NewsItem = {
      ...news,
      id: 'news-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...newsList];
    this.saveNews(updated);
    this.addActivity(`News Published: ${newItem.title}`, 'News', 'news');
    return newItem;
  },
  updateNews(id: string, updates: Partial<NewsItem>): boolean {
    const news = this.getNews();
    const idx = news.findIndex(n => n.id === id);
    if (idx === -1) return false;
    news[idx] = { ...news[idx], ...updates };
    this.saveNews(news);
    return true;
  },
  deleteNews(id: string): boolean {
    const news = this.getNews();
    const updated = news.filter(n => n.id !== id);
    this.saveNews(updated);
    return true;
  },

  // Blogs
  getBlogs(): BlogItem[] {
    return safeGet<BlogItem[]>(KEYS.BLOGS, DEFAULT_BLOGS);
  },
  saveBlogs(blogs: BlogItem[]): void {
    safeSet(KEYS.BLOGS, blogs);
  },
  addBlog(blog: Omit<BlogItem, 'id' | 'views' | 'date'>): BlogItem {
    const blogs = this.getBlogs();
    const newItem: BlogItem = {
      ...blog,
      id: 'blog-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      views: 0,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...blogs];
    this.saveBlogs(updated);
    this.addActivity(`New Blog/Tutorial: ${newItem.title}`, 'Blogs', 'news');
    return newItem;
  },
  updateBlog(id: string, updates: Partial<BlogItem>): boolean {
    const blogs = this.getBlogs();
    const idx = blogs.findIndex(b => b.id === id);
    if (idx === -1) return false;
    blogs[idx] = { ...blogs[idx], ...updates };
    this.saveBlogs(blogs);
    return true;
  },
  deleteBlog(id: string): boolean {
    const blogs = this.getBlogs();
    const updated = blogs.filter(b => b.id !== id);
    this.saveBlogs(updated);
    return true;
  },
  incrementBlogViews(id: string): void {
    const blogs = this.getBlogs();
    const item = blogs.find(b => b.id === id);
    if (item) {
      item.views = (item.views || 0) + 1;
      this.saveBlogs(blogs);
    }
  },

  // Links
  getLinks(): ResourceLinkItem[] {
    return safeGet<ResourceLinkItem[]>(KEYS.LINKS, DEFAULT_LINKS);
  },
  saveLinks(links: ResourceLinkItem[]): void {
    safeSet(KEYS.LINKS, links);
  },
  addLink(link: Omit<ResourceLinkItem, 'id' | 'clicks'>): ResourceLinkItem {
    const links = this.getLinks();
    const newItem: ResourceLinkItem = {
      ...link,
      id: 'link-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      clicks: 0
    };
    const updated = [newItem, ...links];
    this.saveLinks(updated);
    return newItem;
  },
  updateLink(id: string, updates: Partial<ResourceLinkItem>): boolean {
    const links = this.getLinks();
    const idx = links.findIndex(l => l.id === id);
    if (idx === -1) return false;
    links[idx] = { ...links[idx], ...updates };
    this.saveLinks(links);
    return true;
  },
  deleteLink(id: string): boolean {
    const links = this.getLinks();
    const updated = links.filter(l => l.id !== id);
    this.saveLinks(updated);
    return true;
  },
  incrementLinkClicks(id: string): void {
    const links = this.getLinks();
    const item = links.find(l => l.id === id);
    if (item) {
      item.clicks = (item.clicks || 0) + 1;
      this.saveLinks(links);
    }
  },

  // Activity Feed
  getActivities(): ActivityLog[] {
    return safeGet<ActivityLog[]>(KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
  },
  addActivity(text: string, category: string, type: 'script' | 'app' | 'news' | 'system' | 'admin'): void {
    const activities = this.getActivities();
    const newAct: ActivityLog = {
      id: 'act-' + Date.now().toString(36),
      text,
      category,
      time: 'Just now',
      type
    };
    const updated = [newAct, ...activities.slice(0, 19)];
    safeSet(KEYS.ACTIVITIES, updated);
  },

  // User Bookmarks / Saved
  getUserBookmarks(): string[] {
    return safeGet<string[]>(KEYS.SAVED_BOOKMARKS, []);
  },
  toggleBookmark(itemId: string): boolean {
    const bookmarks = this.getUserBookmarks();
    const exists = bookmarks.includes(itemId);
    let updated: string[];
    if (exists) {
      updated = bookmarks.filter(id => id !== itemId);
    } else {
      updated = [...bookmarks, itemId];
    }
    safeSet(KEYS.SAVED_BOOKMARKS, updated);
    return !exists;
  },

  // Admin Authentication
  isAdminLoggedIn(): boolean {
    const token = localStorage.getItem(KEYS.ADMIN_SESSION);
    return token === 'alc_authenticated_true';
  },
  loginAdmin(usernameInput: string, passwordInput: string): { success: boolean; message: string } {
    const settings = this.getSettings();
    const trimmedUser = usernameInput.trim();
    const trimmedPass = passwordInput.trim();

    if (trimmedUser === settings.adminUsername && trimmedPass === settings.adminPasswordHash) {
      localStorage.setItem(KEYS.ADMIN_SESSION, 'alc_authenticated_true');
      this.addActivity(`Admin session authenticated successfully`, 'Admin', 'admin');
      return { success: true, message: 'Welcome back, Admin!' };
    }
    return { success: false, message: 'Invalid Admin Username or Password.' };
  },
  logoutAdmin(): void {
    localStorage.removeItem(KEYS.ADMIN_SESSION);
  },
  updateAdminCredentials(newUsername: string, newPassword: string): void {
    const settings = this.getSettings();
    settings.adminUsername = newUsername.trim() || 'admin';
    settings.adminPasswordHash = newPassword.trim() || 'alcadmin123';
    this.saveSettings(settings);
    this.addActivity(`Admin security credentials updated`, 'Admin', 'admin');
  },

  // Backup & Restore
  exportAllData(): string {
    const fullBackup = {
      exportDate: new Date().toISOString(),
      settings: this.getSettings(),
      commands: this.getCommands(),
      apps: this.getApps(),
      gallery: this.getGallery(),
      news: this.getNews(),
      blogs: this.getBlogs(),
      links: this.getLinks(),
      activities: this.getActivities(),
      version: '2.8'
    };
    return JSON.stringify(fullBackup, null, 2);
  },
  importAllData(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) safeSet(KEYS.SETTINGS, data.settings);
      if (Array.isArray(data.commands)) safeSet(KEYS.COMMANDS, data.commands);
      if (Array.isArray(data.apps)) safeSet(KEYS.APPS, data.apps);
      if (Array.isArray(data.gallery)) safeSet(KEYS.GALLERY, data.gallery);
      if (Array.isArray(data.news)) safeSet(KEYS.NEWS, data.news);
      if (Array.isArray(data.blogs)) safeSet(KEYS.BLOGS, data.blogs);
      if (Array.isArray(data.links)) safeSet(KEYS.LINKS, data.links);
      this.addActivity('Database successfully restored from JSON backup', 'Admin', 'admin');
      return { success: true, message: 'All data successfully imported!' };
    } catch {
      return { success: false, message: 'Invalid JSON backup format.' };
    }
  },
  resetToDefaults(): void {
    safeSet(KEYS.SETTINGS, DEFAULT_SETTINGS);
    safeSet(KEYS.COMMANDS, DEFAULT_COMMANDS);
    safeSet(KEYS.APPS, DEFAULT_APPS);
    safeSet(KEYS.GALLERY, DEFAULT_GALLERY);
    safeSet(KEYS.NEWS, DEFAULT_NEWS);
    safeSet(KEYS.BLOGS, DEFAULT_BLOGS);
    safeSet(KEYS.LINKS, DEFAULT_LINKS);
    safeSet(KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
  }
};
