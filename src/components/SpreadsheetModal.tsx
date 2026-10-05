import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  X,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  listUserSpreadsheets,
  createScrapSpreadsheet,
  DriveSpreadsheet,
} from '../lib/googleDriveSheets';

interface SpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpreadsheetId: string | null;
  currentSpreadsheetName: string | null;
  onSelectSpreadsheet: (id: string, name: string, url?: string) => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}

export const SpreadsheetModal: React.FC<SpreadsheetModalProps> = ({
  isOpen,
  onClose,
  currentSpreadsheetId,
  currentSpreadsheetName,
  onSelectSpreadsheet,
  isAuthenticated,
  onLoginPrompt,
}) => {
  const [spreadsheets, setSpreadsheets] = useState<DriveSpreadsheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchSpreadsheets = async (query = searchQuery) => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const files = await listUserSpreadsheets(query);
      setSpreadsheets(files);
    } catch (err: unknown) {
      console.error('Fetch spreadsheets error:', err);
      const message = err instanceof Error ? err.message : 'Gagal mengambil daftar spreadsheet dari Google Drive.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchSpreadsheets();
    }
  }, [isOpen, isAuthenticated]);

  const handleCreateNew = async () => {
    if (!isAuthenticated) {
      onLoginPrompt();
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const result = await createScrapSpreadsheet();
      onSelectSpreadsheet(result.id, result.name, result.url);
      onClose();
    } catch (err: unknown) {
      console.error('Create spreadsheet error:', err);
      const message = err instanceof Error ? err.message : 'Gagal membuat spreadsheet baru di Google Drive.';
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    // Check if user pasted full URL: https://docs.google.com/spreadsheets/d/FILE_ID/edit...
    let sheetId = manualInput.trim();
    const match = sheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      sheetId = match[1];
    }

    onSelectSpreadsheet(sheetId, `Spreadsheet (${sheetId.substring(0, 8)}...)`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Pilih Google Spreadsheet</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tempat data laporan pekerjaan scrap akan disimpan secara otomatis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {!isAuthenticated ? (
            <div className="text-center py-8 px-4 bg-blue-50/60 border border-blue-200 rounded-2xl">
              <FileSpreadsheet className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-base">Masuk dengan Akun Google</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 mb-4">
                Hubungkan akun Google Anda untuk mengakses spreadsheet di Google Drive Anda atau membuat file baru secara otomatis.
              </p>
              <button
                onClick={onLoginPrompt}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Masuk dengan Google
              </button>
            </div>
          ) : (
            <>
              {/* Active sheet status */}
              {currentSpreadsheetId && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                        Spreadsheet Aktif Saat Ini
                      </div>
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {currentSpreadsheetName || currentSpreadsheetId}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${currentSpreadsheetId}/edit`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/60 rounded-lg transition-colors shrink-0"
                    title="Buka di tab baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Action 1: Create new spreadsheet automatically */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Buat Spreadsheet Baru Otomatis</span>
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                      Direkomendasikan
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Otomatis membuat file lengkap dengan tab khusus untuk setiap area scrap di Google Drive Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateNew}
                  disabled={creating}
                  className="w-full sm:w-auto shrink-0 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {creating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Membuat File...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Buat Baru Sekarang</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error notice */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action 2: Select existing file from Google Drive */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pilih File dari Google Drive
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchSpreadsheets()}
                    disabled={loading}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    <span>Segarkan</span>
                  </button>
                </div>

                {/* Search input */}
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama spreadsheet di Drive..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchSpreadsheets(searchQuery)}
                    className="w-full pl-9 pr-20 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => fetchSpreadsheets(searchQuery)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Cari
                  </button>
                </div>

                {/* List of files */}
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {loading ? (
                    <div className="p-6 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat spreadsheet dari Google Drive...</span>
                    </div>
                  ) : spreadsheets.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Tidak ada file spreadsheet ditemukan. Anda dapat membuat yang baru di atas.
                    </div>
                  ) : (
                    spreadsheets.map((file) => {
                      const isSelected = file.id === currentSpreadsheetId;
                      return (
                        <div
                          key={file.id}
                          onClick={() => {
                            onSelectSpreadsheet(file.id, file.name, file.webViewLink);
                            onClose();
                          }}
                          className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <FileSpreadsheet className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-emerald-600'}`} />
                            <div className="min-w-0">
                              <p className={`text-xs sm:text-sm truncate font-medium ${isSelected ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>
                                {file.name}
                              </p>
                              {file.modifiedTime && (
                                <p className="text-[10px] text-slate-400">
                                  Diubah: {new Date(file.modifiedTime).toLocaleDateString('id-ID')}
                                </p>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-blue-600 shrink-0 text-xs font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Dipilih</span>
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Action 3: Or paste Link/ID */}
              <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Atau Tempel Tautan (URL) / ID Spreadsheet:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-xl shrink-0 cursor-pointer"
                  >
                    Gunakan
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium text-xs sm:text-sm rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
