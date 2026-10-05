import React from 'react';
import { SubmissionLog } from '../types/scrap';
import {
  History,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Trash2,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface SubmissionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: SubmissionLog[];
  onClearLogs: () => void;
  currentSpreadsheetId: string | null;
}

export const SubmissionHistoryModal: React.FC<SubmissionHistoryModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  currentSpreadsheetId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Riwayat Pengiriman Laporan</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar data laporan scrap yang telah dikirimkan ke Google Spreadsheet
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
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">Belum ada riwayat laporan</p>
              <p className="text-xs mt-1">Data yang Anda simpan akan tercatat dan tersinkronisasi di sini.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/70 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center">
                      {log.areaId}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      {log.areaTitle}
                    </span>
                  </div>
                  {log.status === 'synced' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tersinkron Drive
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      Lokal
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 grid grid-cols-2 sm:grid-cols-3 gap-1">
                  <div>
                    <span className="text-slate-400">Operator: </span>
                    <span className="font-medium text-slate-800">{log.operator}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Tgl: </span>
                    <span className="font-medium text-slate-800">{log.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Waktu: </span>
                    <span className="font-medium text-slate-800">{log.timestamp}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-500">Ringkasan: </span>
                  <span>{log.summary}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          {logs.length > 0 ? (
            <button
              type="button"
              onClick={onClearLogs}
              className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Riwayat Lokal</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {currentSpreadsheetId && (
              <a
                href={`https://docs.google.com/spreadsheets/d/${currentSpreadsheetId}/edit`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Lihat di Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
