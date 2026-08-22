import React, { useState } from 'react';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle, X, Check, Sparkles } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = StorageService.loginAdmin(username, password);
      setLoading(false);
      if (res.success) {
        onLoginSuccess();
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleFillDefault = () => {
    const settings = StorageService.getSettings();
    setUsername(settings.adminUsername || 'admin');
    setPassword(settings.adminPasswordHash || 'alcadmin123');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                RESTRICTED PORTAL
              </h2>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">ALCHOSTING Admin Access</h3>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> Admin Username
            </label>
            <input
              id="admin-username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Secret Admin Password
            </label>
            <input
              id="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Authorize & Enter Admin Panel'}</span>
          </button>
        </form>

        {/* Quick Helper for user convenience */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Default: <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">admin</code> / <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">alcadmin123</code></span>
          <button
            type="button"
            onClick={handleFillDefault}
            className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
          >
            <Sparkles className="w-3 h-3" /> Auto-fill
          </button>
        </div>

        <p className="mt-4 text-[10px] text-center text-slate-600 font-mono">
          Authorized Admin Personnel Only. Password can be modified in Admin Settings.
        </p>
      </div>
    </div>
  );
};
