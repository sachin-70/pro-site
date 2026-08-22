import { CommandItem, AndroidAppItem, GalleryItem, NewsItem, BlogItem, ResourceLinkItem, SiteSettings, ActivityLog } from '../types';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'ALCHOSTING',
  tagline: 'Cyber & Android Power Hub',
  announcementText: '🚀 Server Active on a23pro.alc.onl | Termux v4.2 Pro & Android Toolsuite Repository is live!',
  showAnnouncement: true,
  adminUsername: 'admin',
  adminPasswordHash: 'alcadmin123', // default initial password (changeable in admin settings)
  heroTitle: 'Termux Advanced Toolkit & Android Hub',
  heroSubtitle: 'High performance commands, curated mod tools, direct APK downloads, security updates, and scripts for developers & power users.',
  featuredAppId: 'app-termux-pro',
  telegramLink: 'https://t.me/alchosting_official',
  contactEmail: 'a23pro.developer@gmail.com',
  systemVersion: 'v2.8.4-STABLE',
  hosting: {
    accountUsername: 'alcy_42677631',
    accountPasswordMasked: '••••••••••',
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
  }
};

export const DEFAULT_COMMANDS: CommandItem[] = [
  {
    id: 'cmd-alchosting-ftp-deploy',
    title: 'Termux 1-Click FTP Deploy to a23pro.alc.onl',
    command: 'pkg install lftp -y && lftp -u alcy_42677631 ftp.alchosting.xyz -e "set ssl:verify-certificate no; mirror -R --verbose ./htdocs /htdocs; bye"',
    category: 'automation',
    description: 'Installs lftp and synchronizes your local website directory directly to your ALC Hosting htdocs server folder.',
    platform: 'Termux',
    isPro: true,
    copiedCount: 1845,
    date: '2026-08-22',
    tags: ['alchosting', 'ftp', 'deploy', 'web-hosting', 'htdocs']
  },
  {
    id: 'cmd-alchosting-mysql-connect',
    title: 'Connect Termux MariaDB CLI to ALC MySQL Server',
    command: 'pkg install mariadb -y && mariadb -h sql202.alchosting.xyz -P 3306 -u alcy_42677631 -p',
    category: 'networking',
    description: 'Directly access and manage your remote ALC Hosting MySQL database (sql202.alchosting.xyz:3306) via terminal SQL prompt.',
    platform: 'Termux',
    isPro: true,
    copiedCount: 920,
    date: '2026-08-22',
    tags: ['mysql', 'database', 'sql202', 'alchosting', 'mariadb']
  },
  {
    id: 'cmd-dns-bypass-android',
    title: 'DNS Cache Flush & Cloudflare 1.1.1.1 Switch (ADB)',
    command: 'settings put global private_dns_mode hostname && settings put global private_dns_specifier one.one.one.one',
    category: 'networking',
    description: 'Instant workaround for the 72-hour ALC Hosting DNS propagation delay by forcing Cloudflare 1.1.1.1 private DNS.',
    platform: 'Android Shell',
    isPro: true,
    copiedCount: 1290,
    date: '2026-08-22',
    tags: ['dns', 'alchosting', 'cloudflare', 'bypass', 'propagation']
  },
  {
    id: 'cmd-pkg-setup',
    title: 'Full Termux Core & Mirror Setup',
    command: 'pkg update -y && pkg upgrade -y && termux-setup-storage && pkg install git curl wget zsh nano python clang -y',
    category: 'termux-basic',
    description: 'Initializes and updates all core repositories, grants storage access, and installs fundamental utilities.',
    platform: 'Termux',
    isPro: true,
    copiedCount: 1420,
    date: '2026-08-15',
    tags: ['essential', 'first-install', 'storage', 'git']
  },
  {
    id: 'cmd-oh-my-zsh',
    title: 'Zsh Cyber Terminal Theme & Powerline',
    command: 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting',
    category: 'ui-styling',
    description: 'Install ZSH shell with cyber styling, syntax highlighting, and auto-completions.',
    platform: 'Termux',
    isPro: false,
    copiedCount: 890,
    date: '2026-08-10',
    tags: ['zsh', 'styling', 'theme', 'powerline']
  },
  {
    id: 'cmd-kali-nethunter',
    title: 'Kali NetHunter Rootless Install',
    command: 'wget -O install-nethunter-termux https://offs.ec/2MceZWr && chmod +x install-nethunter-termux && ./install-nethunter-termux',
    category: 'kali-pentest',
    description: 'Deploys a full Kali Linux NetHunter rootless environment directly inside Termux with GUI support.',
    platform: 'Termux',
    isPro: true,
    copiedCount: 2310,
    date: '2026-08-18',
    tags: ['kali', 'nethunter', 'pentest', 'rootless']
  },
  {
    id: 'cmd-adb-wifi',
    title: 'Wireless ADB Pair & Connect Command',
    command: 'adb pair 192.168.1.XX:PORT && adb connect 192.168.1.XX:PORT && adb devices',
    category: 'networking',
    description: 'Enables wireless debugging on Android 11+ without any USB cable connection.',
    platform: 'Android Shell',
    isPro: false,
    copiedCount: 654,
    date: '2026-08-01',
    tags: ['adb', 'wireless', 'debugging', 'android']
  },
  {
    id: 'cmd-python-web-server',
    title: 'Instant Local HTTP Fast File Server',
    command: 'python -m http.server 8080 --bind 0.0.0.0 --directory ~/storage/shared',
    category: 'networking',
    description: 'Hosts an instant file-sharing server on local Wi-Fi from your Android storage directory.',
    platform: 'Termux',
    isPro: false,
    copiedCount: 1120,
    date: '2026-07-28',
    tags: ['python', 'http', 'fileserver', 'wifi']
  },
  {
    id: 'cmd-root-su-backup',
    title: 'Root Titanium Partition Dump & Backup',
    command: 'su -c "dd if=/dev/block/bootdevice/by-name/boot of=/sdcard/boot_backup.img status=progress"',
    category: 'root-tools',
    description: 'Extracts your current device kernel boot image safely to SD card storage via Root privileges.',
    platform: 'Termux',
    isPro: true,
    copiedCount: 430,
    date: '2026-07-20',
    tags: ['root', 'su', 'magisk', 'kernel-backup']
  },
  {
    id: 'cmd-termux-x11',
    title: 'Termux-X11 Desktop GUI Launcher',
    command: 'export DISPLAY=:0 && XDG_RUNTIME_DIR=${TMPDIR} termux-x11 :0 & dbus-launch --exit-with-session xfce4-session',
    category: 'ui-styling',
    description: 'Launches full XFCE4 desktop GUI streaming seamlessly via Termux-X11 display app.',
    platform: 'Termux',
    isPro: true,
    copiedCount: 1780,
    date: '2026-08-12',
    tags: ['x11', 'xfce4', 'desktop', 'gui']
  },
  {
    id: 'cmd-repo-fix',
    title: 'Termux Repository 404 Fixer (Change Mirrors)',
    command: 'termux-change-repo && pkg clean && pkg autoclean && pkg update -y',
    category: 'package-mgr',
    description: 'Selects the fastest working mirror in your region when pkg update gives 404 or repository errors.',
    platform: 'Termux',
    isPro: false,
    copiedCount: 3100,
    date: '2026-08-19',
    tags: ['repo', 'mirror', 'fix-404', 'package']
  }
];

export const DEFAULT_APPS: AndroidAppItem[] = [
  {
    id: 'app-termux-pro',
    title: 'Termux Pro Modded & Extended',
    packageName: 'com.termux.alcpro',
    version: 'v0.119.2-Pro',
    size: '98.5 MB',
    category: 'termux-add-on',
    downloadUrl: 'https://github.com/termux/termux-app/releases/latest',
    icon: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Enhanced Termux package with pre-bundled dependencies, custom shell aliases, zsh integration, and zero repository 404 errors.',
    changelog: [
      'Added pre-configured grimler and alchosting mirrors',
      'Fixed Android 14/15 process freeze bug',
      'Pre-installed Python 3.12, Node.js 22, Git, and Clang',
      'High DPI hardware rendering support'
    ],
    downloads: 14820,
    rating: 4.9,
    date: '2026-08-18',
    minAndroid: 'Android 7.0 - 15.0',
    isFeatured: true
  },
  {
    id: 'app-termux-x11',
    title: 'Termux:X11 GPU Accelerated Server',
    packageName: 'com.termux.x11',
    version: 'v1.03.01',
    size: '14.2 MB',
    category: 'termux-add-on',
    downloadUrl: 'https://github.com/termux/termux-x11/releases',
    icon: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'High-speed X11 display server for Android with Vulkan and OpenGLES hardware acceleration support for Linux Desktop apps.',
    changelog: [
      'Smooth 120Hz refresh rate support',
      'Dynamic resolution scaling',
      'Touchscreen mouse emulation enhancements'
    ],
    downloads: 9400,
    rating: 4.8,
    date: '2026-08-14',
    minAndroid: 'Android 8.0+'
  },
  {
    id: 'app-mt-manager',
    title: 'MT Manager VIP Mod Tools',
    packageName: 'bin.mt.plus',
    version: 'v2.15.4-Rev',
    size: '22.8 MB',
    category: 'mod-tool',
    downloadUrl: '#download-mt-manager',
    icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Industry-standard Android dual-pane file manager, APK decompiler, DEX editor, and resource compiler.',
    changelog: [
      'Enhanced Arsc string search',
      'Support for Android 15 APK Signature Scheme v4',
      'Fixed batch APK signing error'
    ],
    downloads: 18230,
    rating: 5.0,
    date: '2026-08-05',
    minAndroid: 'Android 5.0+'
  },
  {
    id: 'app-shizuku',
    title: 'Shizuku ADB Permission Manager',
    packageName: 'moe.shizuku.privileged.api',
    version: 'v13.5.4',
    size: '5.1 MB',
    category: 'developer',
    downloadUrl: 'https://shizuku.rikka.app/download/',
    icon: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Run Android apps with ADB privileges directly without root access using Wireless ADB service.',
    changelog: [
      'One-tap auto start on boot via wireless ADB',
      'Performance optimizations for Android 14/15'
    ],
    downloads: 12100,
    rating: 4.9,
    date: '2026-07-29',
    minAndroid: 'Android 6.0+'
  },
  {
    id: 'app-apkmirror',
    title: 'APK Editor Studio Pro Edition',
    packageName: 'com.apk.editor.studio',
    version: 'v4.1.0',
    size: '34.6 MB',
    category: 'mod-tool',
    downloadUrl: '#download-apk-editor',
    icon: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Edit Android app manifests, change package names, replace assets, and remove unneeded permissions effortlessly.',
    changelog: [
      'Instant manifest XML beautifier',
      'Automated signature key generator'
    ],
    downloads: 8740,
    rating: 4.7,
    date: '2026-07-15',
    minAndroid: 'Android 8.0+'
  }
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-cyber-matrix',
    title: 'Termux Cyberpunk Custom Neo-Matrix HUD',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    category: 'termux-setup',
    caption: 'Customized zsh prompt with live CPU telemetry, memory metrics, and neo-cyan colors on Termux.',
    date: '2026-08-16',
    likes: 342,
    downloads: 198
  },
  {
    id: 'gal-x11-desktop',
    title: 'Full XFCE4 Desktop Running on Android Phone',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    category: 'ui-theme',
    caption: 'Running full desktop Linux environment with VS Code and Chromium via Termux-X11 display.',
    date: '2026-08-12',
    likes: 512,
    downloads: 380
  },
  {
    id: 'gal-cyber-wallpaper',
    title: 'ALCHOSTING Dark Minimalist AMOLED Wallpaper',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    category: 'wallpapers',
    caption: '4K Ultra HD cyberpunk circuit grid wallpaper designed for power users and terminal lovers.',
    date: '2026-08-08',
    likes: 890,
    downloads: 620
  },
  {
    id: 'gal-server-rack',
    title: 'High Velocity Cloud Node Architecture',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    category: 'app-previews',
    caption: 'ALCHOSTING infrastructure nodes powering high-bandwidth command downloads and mirror synchronization.',
    date: '2026-08-02',
    likes: 275,
    downloads: 140
  },
  {
    id: 'gal-code-ide',
    title: 'Android Mobile Code Development Setup',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    category: 'app-previews',
    caption: 'Coding Python and Node.js on smartphone with external mechanical keyboard and split screen.',
    date: '2026-07-28',
    likes: 410,
    downloads: 290
  }
];

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'news-mirror-speed',
    title: '⚡ ALCHOSTING Fast Mirror Sync Enabled',
    content: 'All Termux and Android packages are now mirrored across 6 global CDN endpoints for zero latency and instant downloads.',
    category: 'release',
    urgent: true,
    tag: 'SYSTEM UPDATE',
    date: '2026-08-20',
    author: 'Admin'
  },
  {
    id: 'news-android15-fix',
    title: '🛡️ Android 15 Compatibility Notice & Phantom Process Fix',
    content: 'Google added stricter phantom process killing in newer Android builds. We have uploaded the 1-click ADB command to disable phantom process limits permanently.',
    category: 'alert',
    urgent: true,
    tag: 'SECURITY / OS',
    date: '2026-08-17',
    author: 'ALC Security Team'
  },
  {
    id: 'news-new-apk-release',
    title: '📦 New APK Toolsuite Pack v2.8 Available for Download',
    content: 'Download the newly tested MT Manager VIP, APK Editor Studio, and Termux-X11 Vulkan builds in the Apps section.',
    category: 'announcement',
    urgent: false,
    tag: 'TOOL RELEASE',
    date: '2026-08-11',
    author: 'Admin'
  }
];

export const DEFAULT_BLOGS: BlogItem[] = [
  {
    id: 'blog-complete-termux-guide',
    title: 'Complete 2026 Termux Masterclass: Zero to Terminal Ninja',
    summary: 'A step-by-step master guide on installing repositories, resolving 404 package errors, configuring zsh, and running full Linux desktop.',
    content: `### 1. Introduction to Modern Termux Architecture

Termux is an Android terminal emulator and Linux environment that functions directly without rooting or setup hassles. A minimal base system is installed automatically—additional packages are available using the APT package manager.

### 2. Overcoming Repository 404 Errors

When you first install Termux from F-Droid or GitHub, you might encounter repository 404 errors when running:
\`\`\`bash
pkg update && pkg upgrade
\`\`\`

To resolve this issue permanently, run the interactive mirror selector:
\`\`\`bash
termux-change-repo
\`\`\`
Select the **Grimler** or **A17 / Alchosting** CDN mirror, press Enter, and re-run the upgrade.

### 3. Granting Full Android Storage Access

Allow Termux to read and write files to your device storage (Downloads, DCIM, Documents) by issuing:
\`\`\`bash
termux-setup-storage
\`\`\`
A permission popup will appear. Tap **Allow**. You can now access internal memory at \`~/storage/shared\`.

### 4. Installing Python, Node.js, and C/C++ Compilers

You can turn your Android into a full-fledged portable development machine:
\`\`\`bash
pkg install python python-pip nodejs-lts clang git -y
\`\`\`

### 5. Running a Local Python Web Server

Share files with any device on your local Wi-Fi in 2 seconds:
\`\`\`bash
python -m http.server 8080 --bind 0.0.0.0
\`\`\`
Open \`http://<your-phone-ip>:8080\` on your PC or tablet!`,
    author: 'ALC Master Engineer',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    tags: ['Termux', 'Tutorial', 'Linux', 'Python', 'Beginners'],
    date: '2026-08-14',
    views: 3420
  },
  {
    id: 'blog-wireless-adb-guide',
    title: 'Wireless ADB & Shizuku Setup Without PC or Root',
    summary: 'How to pair wireless debugging, activate Shizuku privilege manager, and control background services seamlessly.',
    content: `### Wireless Debugging in Android 11+

Android provides built-in Wireless Debugging inside Developer Options. This allows you to run high-level privileged commands without plugging in a USB cable or having root access.

#### Step 1: Enable Developer Options
1. Go to **Settings** -> **About Phone**.
2. Tap **Build Number** 7 times until you see "You are now a developer!".
3. Enter **System** -> **Developer Options**.

#### Step 2: Split Screen & Pair
1. Turn on **Wireless Debugging**.
2. Tap **Pair device with pairing code**.
3. Copy the 6-digit Wi-Fi code and port number into Shizuku or Termux adb pair command:
\`\`\`bash
adb pair 192.168.1.50:39845
\`\`\`
4. Enter the 6-digit code.

#### Step 3: Connect and Execute
\`\`\`bash
adb connect 192.168.1.50:41235
adb shell "settings put global settings_enable_monitor_phantom_procs false"
\`\`\`
This permanently disables Android process killing on intensive scripts!`,
    author: 'Security Specialist',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=80',
    tags: ['ADB', 'Android', 'Shizuku', 'Rootless', 'Optimization'],
    date: '2026-08-09',
    views: 2890
  }
];

export const DEFAULT_LINKS: ResourceLinkItem[] = [
  {
    id: 'link-alchosting-panel',
    title: 'ALC Hosting Networks Client Portal',
    url: 'https://app.alchosting.net',
    category: 'hosting',
    description: 'Main dashboard for a23pro.alc.onl domain, cPanel controls, file manager, and MySQL management.',
    clicks: 3410,
    badge: 'Server Active'
  },
  {
    id: 'link-alchosting-domain',
    title: 'Live Website: a23pro.alc.onl',
    url: 'http://a23pro.alc.onl',
    category: 'hosting',
    description: 'Primary public web address hosted on server IP 185.27.134.170.',
    clicks: 2190,
    badge: 'Live Site'
  },
  {
    id: 'link-alchosting-builder',
    title: 'ALC SitePro Instant Website Builder',
    url: 'https://app.alchosting.net/account/builder',
    category: 'tools',
    description: 'Visual drag-and-drop website editor and template generator for a23pro.alc.onl.',
    clicks: 1650,
    badge: 'Builder'
  },
  {
    id: 'link-termux-github',
    title: 'Official Termux GitHub Repository',
    url: 'https://github.com/termux/termux-app',
    category: 'official',
    description: 'Official open-source releases, issue tracker, and source code of the Termux Android client.',
    clicks: 1840,
    badge: 'Official'
  },
  {
    id: 'link-fdroid-termux',
    title: 'F-Droid Termux Repository Mirror',
    url: 'https://f-droid.org/packages/com.termux/',
    category: 'official',
    description: 'Verified signed APK builds directly hosted on F-Droid open source repository.',
    clicks: 1210,
    badge: 'Verified'
  },
  {
    id: 'link-alc-telegram',
    title: 'ALCHOSTING Official Telegram Channel',
    url: 'https://t.me/alchosting_official',
    category: 'telegram',
    description: 'Daily script drops, immediate server notifications, updates, and community support group.',
    clicks: 4520,
    badge: 'Community 24/7'
  },
  {
    id: 'link-nethunter-docs',
    title: 'Offensive Security NetHunter Documentation',
    url: 'https://www.kali.org/docs/nethunter/',
    category: 'tools',
    description: 'Official guides for deploying Kali Linux NetHunter rootless and root modules on Android.',
    clicks: 980,
    badge: 'Documentation'
  },
  {
    id: 'link-shizuku-guide',
    title: 'Shizuku Privileged API Official Site',
    url: 'https://shizuku.rikka.app/',
    category: 'developer',
    description: 'Documentation and downloads for non-root system API elevated access.',
    clicks: 1420,
    badge: 'Developer'
  }
];

export const DEFAULT_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    text: 'New Command Script: Kali NetHunter Rootless v2026.3 added',
    category: 'Commands',
    time: '5 mins ago',
    type: 'script'
  },
  {
    id: 'act-2',
    text: 'Android Tool: Termux Pro v0.119.2 APK package refreshed',
    category: 'Apps',
    time: '25 mins ago',
    type: 'app'
  },
  {
    id: 'act-3',
    text: 'Security Notice: Android 15 process limits guide published',
    category: 'News',
    time: '2 hours ago',
    type: 'news'
  },
  {
    id: 'act-4',
    text: 'ALCHOSTING Fast CDN Mirror synchronized across 6 locations',
    category: 'System',
    time: '4 hours ago',
    type: 'system'
  }
];
