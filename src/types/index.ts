export interface CommandItem {
  id: string;
  title: string;
  command: string;
  category: 'termux-basic' | 'package-mgr' | 'root-tools' | 'networking' | 'ui-styling' | 'kali-pentest' | 'automation';
  description: string;
  platform: 'Termux' | 'Android Shell' | 'Linux' | 'All';
  isPro?: boolean;
  copiedCount: number;
  date: string;
  tags: string[];
}

export interface AndroidAppItem {
  id: string;
  title: string;
  packageName: string;
  version: string;
  size: string;
  category: 'termux-add-on' | 'root-utility' | 'developer' | 'mod-tool' | 'customization';
  downloadUrl: string;
  icon: string;
  screenshots: string[];
  description: string;
  changelog: string[];
  downloads: number;
  rating: number;
  date: string;
  minAndroid: string;
  isFeatured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  url: string;
  category: 'termux-setup' | 'ui-theme' | 'wallpapers' | 'app-previews' | 'banner';
  caption: string;
  date: string;
  likes: number;
  downloads: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'alert' | 'release' | 'patch' | 'announcement';
  urgent: boolean;
  tag: string;
  date: string;
  author: string;
}

export interface BlogItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  date: string;
  views: number;
}

export interface ResourceLinkItem {
  id: string;
  title: string;
  url: string;
  category: 'official' | 'community' | 'telegram' | 'github' | 'tools' | 'hosting' | 'developer';
  description: string;
  clicks: number;
  badge?: string;
}

export interface HostingConfig {
  accountUsername: string;
  accountPasswordMasked?: string;
  domain: string;
  serverIp: string;
  status: 'Active' | 'Pending DNS' | 'Suspended';
  sslStatus: 'SSL Active' | 'Pending Verification' | 'Self-Signed';
  diskUsedMB: number;
  diskTotalGB: number;
  bandwidthUsedMB: number;
  bandwidthUnlimited: boolean;
  inodesUsed: number;
  inodesTotal: number;
  mysqlHost: string;
  mysqlPort: number;
  ftpHost: string;
  ftpPort: number;
  controlPanelUrl: string;
  fileManagerUrl: string;
  builderUrl: string;
  dnsCacheNotice: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  announcementText: string;
  showAnnouncement: boolean;
  adminUsername: string;
  adminPasswordHash: string; // stored hashed or verified
  heroTitle: string;
  heroSubtitle: string;
  featuredAppId?: string;
  telegramLink?: string;
  contactEmail?: string;
  systemVersion: string;
  hosting?: HostingConfig;
}

export interface ActivityLog {
  id: string;
  text: string;
  category: string;
  time: string;
  type: 'script' | 'app' | 'news' | 'system' | 'admin';
}
