import React from 'react';
import { ArrowLeft, Calendar, User as UserIcon, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { AreaDef } from '../types/scrap';

interface FormLayoutProps {
  area: AreaDef;
  onBack: () => void;
  onSelectArea?: (area: AreaDef) => void;
  tgl: string;
  onTglChange: (val: string) => void;
  namaOperator: string;
  onNamaOperatorChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  children: React.ReactNode;
}

export const FormLayout: React.FC<FormLayoutProps> = ({
  area,
  onBack,
  onSelectArea,
  tgl,
  onTglChange,
  namaOperator,
  onNamaOperatorChange,
  onSubmit,
  isSubmitting,
  spreadsheetId,
  spreadsheetName,
  onOpenSpreadsheetModal,
  children,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Top navigation */}
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Home</span>
        </button>
      </div>

      {/* Spreadsheet status reminder banner if not set */}
      {!spreadsheetId && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-start justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Google Spreadsheet belum dipilih</p>
              <p className="text-amber-700 mt-0.5">
                Data akan disimpan sementara di riwayat lokal. Hubungkan ke Spreadsheet di Drive agar terisi otomatis.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenSpreadsheetModal}
            className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
          >
            Pilih Sheet
          </button>
        </div>
      )}

      {/* Main Form Card Container - Styled neatly echoing the PDF box style */}
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl border-2 border-slate-700 shadow-md overflow-hidden"
      >
        {/* Page Title Header matching PDF */}
        <div className="p-4 sm:p-5 text-center border-b border-slate-300 bg-slate-50">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {area.pageTitle}
          </h2>
        </div>

        {/* Global Common Fields: Tgl & Nama Operator */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50 space-y-3">
          {/* Tgl Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Tgl (Tanggal)</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={tgl}
              onChange={(e) => onTglChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>

          {/* Nama Operator Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Nama Operator</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan nama operator..."
              value={namaOperator}
              onChange={(e) => onNamaOperatorChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>
        </div>

        {/* Area-Specific Form Content */}
        <div className="p-4 sm:p-6 space-y-4">{children}</div>

        {/* Big Blue SIMPAN Button matching PDF style */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-[#9BC2E6] hover:bg-[#82b0db] active:bg-[#6c9ece] border-2 border-slate-600 text-slate-900 font-extrabold text-base sm:text-lg tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>MEMPROSES...</span>
              </>
            ) : (
              <span>SIMPAN</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
