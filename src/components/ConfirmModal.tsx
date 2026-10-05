import React from 'react';
import { AlertCircle, Check, X, FileSpreadsheet } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  areaTitle: string;
  spreadsheetName?: string;
  summaryItems: { label: string; value: string }[];
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  areaTitle,
  spreadsheetName,
  summaryItems,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FileSpreadsheet className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{title}</h3>
              <p className="text-xs text-blue-100 mt-0.5">{areaTitle}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm p-3 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Konfirmasi Penyimpanan:</span> Data berikut akan ditambahkan sebagai baris baru pada spreadsheet Google Drive:
              <span className="block font-medium text-slate-800 mt-1 truncate">
                📊 {spreadsheetName || 'Spreadsheet Terpilih'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 divide-y divide-slate-200">
            {summaryItems.map((item, idx) => (
              <div key={idx} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-600 font-medium">{item.label}</span>
                <span className="text-slate-900 font-bold text-right ml-4 max-w-[60%] truncate">
                  {item.value || '-'}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 text-center">
            Apakah Anda yakin data ini sudah benar dan ingin menyimpannya sekarang?
          </p>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-white font-medium text-sm transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan ke Sheets...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Ya, Simpan ke Spreadsheet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
