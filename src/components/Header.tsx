import React from 'react';
import {
  FileSpreadsheet,
  LogOut,
  History,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  user: User | null;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  onOpenHistoryModal: () => void;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  spreadsheetId,
  spreadsheetName,
  onOpenSpreadsheetModal,
  onOpenHistoryModal,
  onLogin,
  onLogout,
  isLoggingIn,
  onGoHome,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & App Title */}
          <div
            onClick={onGoHome}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  LAPORAN PEKERJAAN SCRAP
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                  Dept. Produksi (PP)
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Sistem Input Data Produksi & Integrasi Google Drive Spreadsheet
              </p>
            </div>
          </div>

          {/* Action and status area */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Google Sheets selector status button */}
            <button
              onClick={onOpenSpreadsheetModal}
              type="button"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                spreadsheetId
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
              }`}
              title="Konfigurasi spreadsheet tujuan di Google Drive"
            >
              {spreadsheetId ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-[130px] sm:max-w-[200px]">
                    {spreadsheetName || 'Spreadsheet Terhubung'}
                  </span>
                  <FolderOpen className="w-3 h-3 text-emerald-700" />
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Pilih Spreadsheet Drive</span>
                </>
              )}
            </button>

            {spreadsheetId && (
              <a
                href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors"
                title="Buka Spreadsheet di Google Drive tab baru"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Buka Sheet</span>
              </a>
            )}

            {/* Riwayat / History button */}
            <button
              onClick={onOpenHistoryModal}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Riwayat</span>
            </button>

            {/* User Profile / Google Sign-in */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-slate-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:block text-left text-[11px] leading-tight">
                  <div className="font-semibold text-slate-800 truncate max-w-[110px]">
                    {user.displayName || 'Operator'}
                  </div>
                  <div className="text-slate-500 truncate max-w-[110px]">{user.email}</div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Keluar / Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                disabled={isLoggingIn}
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {/* Official Google 'G' icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? 'Menghubungkan...' : 'Masuk Google'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
