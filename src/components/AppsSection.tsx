import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  QrCode, 
  X, 
  Check, 
  Layers, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AndroidAppItem } from '../types';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface AppsSectionProps {
  apps: AndroidAppItem[];
  searchQuery: string;
  onRefreshData: () => void;
}

export const AppsSection: React.FC<AppsSectionProps> = ({
  apps,
  searchQuery,
  onRefreshData
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeAppModal, setActiveAppModal] = useState<AndroidAppItem | null>(null);
  const [qrModalApp, setQrModalApp] = useState<AndroidAppItem | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Android APKs' },
    { id: 'termux-add-on', label: 'Termux Add-ons' },
    { id: 'mod-tool', label: 'VIP Mod Tools' },
    { id: 'developer', label: 'Developer & ADB' },
    { id: 'root-utility', label: 'Root Utilities' },
  ];

  const filteredApps = apps.filter((app) => {
    const matchesSearch = 
      !searchQuery ||
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDownload = (app: AndroidAppItem) => {
    StorageService.incrementAppDownload(app.id);
    onRefreshData();
    setDownloadSuccessId(app.id);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    if (app.downloadUrl.startsWith('http')) {
      window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Simulated direct file download
      const content = `ALCHOSTING APK Package: ${app.title}\nVersion: ${app.version}\nPackage: ${app.packageName}\nDownloaded from ALCHOSTING Hub`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${app.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${app.version}.apk.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2500);
  };

  return (
    <div id="apps-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Smartphone className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Android Apps & Toolsuite Vault</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verified APK packages, mod utilities, and Termux extensions with virus check certification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs font-mono rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% VirusTotal Clean Verified
          </span>
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
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40 font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Apps Grid */}
      {filteredApps.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <Smartphone className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No applications found matching your search.</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-4 px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs hover:bg-emerald-600/30"
          >
            Show All Apps
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              id={`app-card-${app.id}`}
              className="bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Top Info */}
                <div className="flex items-start gap-3.5 mb-3">
                  <img
                    src={app.icon}
                    alt={app.title}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                        {app.version}
                      </span>
                      <div className="flex items-center text-amber-400 text-xs font-bold gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{app.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors truncate mt-1">
                      {app.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500 truncate">
                      {app.packageName}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                  {app.description}
                </p>

                {/* Specs Pill Box */}
                <div className="grid grid-cols-2 gap-2 bg-[#0A0F1E] border border-slate-800/80 p-2.5 rounded-xl text-[11px] font-mono text-slate-400 mb-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">FILE SIZE</span>
                    <span className="text-slate-200 font-semibold">{app.size}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">MIN ANDROID</span>
                    <span className="text-slate-200">{app.minAndroid}</span>
                  </div>
                </div>

                {/* Changelog Highlights preview */}
                {app.changelog && app.changelog.length > 0 && (
                  <div className="text-[11px] text-slate-400 space-y-1 mb-4 bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
                    <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
                      WHAT'S NEW:
                    </span>
                    <p className="text-slate-300 truncate text-[11px]">
                      • {app.changelog[0]}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveAppModal(app)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-colors"
                    title="View Full Details & Screenshots"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setQrModalApp(app)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded-lg text-xs transition-colors"
                    title="Scan QR Code to Download on Phone"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleDownload(app)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    downloadSuccessId === app.id
                      ? 'bg-emerald-400 text-slate-950 shadow-emerald-950/40'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-950/30'
                  }`}
                >
                  {downloadSuccessId === app.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download APK</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* App Details Modal */}
      {activeAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setActiveAppModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <img
                src={activeAppModal.icon}
                alt={activeAppModal.title}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{activeAppModal.title}</h3>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">{activeAppModal.packageName}</p>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-400">
                  <span className="text-emerald-400 font-bold">{activeAppModal.version}</span>
                  <span>•</span>
                  <span>{activeAppModal.size}</span>
                  <span>•</span>
                  <span>{activeAppModal.downloads.toLocaleString()} downloads</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div>
                <h4 className="text-slate-400 font-mono text-[11px] uppercase tracking-wider mb-1">About App:</h4>
                <p className="leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {activeAppModal.description}
                </p>
              </div>

              {activeAppModal.changelog && activeAppModal.changelog.length > 0 && (
                <div>
                  <h4 className="text-slate-400 font-mono text-[11px] uppercase tracking-wider mb-1">Full Changelog & Improvements:</h4>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    {activeAppModal.changelog.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-200">
                        <span className="text-cyan-400">▸</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeAppModal.screenshots && activeAppModal.screenshots.length > 0 && (
                <div>
                  <h4 className="text-slate-400 font-mono text-[11px] uppercase tracking-wider mb-2">Screenshots & Preview:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {activeAppModal.screenshots.map((shot, i) => (
                      <img
                        key={i}
                        src={shot}
                        alt="Screenshot"
                        className="rounded-xl border border-slate-800 object-cover h-36 w-full"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveAppModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(activeAppModal);
                }}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download APK ({activeAppModal.size})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Quick Mobile Download Modal */}
      {qrModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center relative shadow-2xl">
            <button
              onClick={() => setQrModalApp(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <QrCode className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">Scan to Download on Phone</h3>
            <p className="text-xs text-slate-400 mb-4">{qrModalApp.title} ({qrModalApp.version})</p>

            {/* QR Code visual */}
            <div className="bg-white p-4 rounded-xl inline-block shadow-lg mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrModalApp.downloadUrl.startsWith('http') ? qrModalApp.downloadUrl : window.location.href)}`}
                alt="QR Code"
                className="w-44 h-44 object-contain"
              />
            </div>

            <p className="text-[11px] text-slate-400 font-mono mb-4">
              Open your Android Camera or Scanner app and scan the QR code above to start download directly.
            </p>

            <button
              onClick={() => setQrModalApp(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
