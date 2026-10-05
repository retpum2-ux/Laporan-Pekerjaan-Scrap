import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea6Data, TromolItem } from '../../types/scrap';
import { Plus, Trash2 } from 'lucide-react';

interface Area6Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea6Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

export const Area6KosongkanTromolForm: React.FC<Area6Props> = ({
  area,
  onBack,
  onSelectArea,
  onSubmitReport,
  isSubmitting,
  spreadsheetId,
  spreadsheetName,
  onOpenSpreadsheetModal,
  defaultOperator,
}) => {
  const [tgl, setTgl] = useState(new Date().toISOString().split('T')[0]);
  const [namaOperator, setNamaOperator] = useState(defaultOperator);
  const [hasilScrapCu, setHasilScrapCu] = useState('');
  const [hasilScrapAl, setHasilScrapAl] = useState('');
  const [kabelBisaDikupas, setKabelBisaDikupas] = useState('');

  const [daftarTromol, setDaftarTromol] = useState<TromolItem[]>([
    {
      id: '1',
      noTromolDrum: '',
      tipeKabel: '',
      panjang: '',
      noPro: '',
      noLabel: '',
    },
  ]);

  const handleAddTromol = () => {
    setDaftarTromol((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        noTromolDrum: '',
        tipeKabel: '',
        panjang: '',
        noPro: '',
        noLabel: '',
      },
    ]);
  };

  const handleRemoveTromol = (id: string) => {
    if (daftarTromol.length <= 1) return;
    setDaftarTromol((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTromolChange = (id: string, field: keyof TromolItem, val: string) => {
    setDaftarTromol((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea6Data = {
      tgl,
      namaOperator,
      hasilScrapCu,
      hasilScrapAl,
      kabelBisaDikupas,
      daftarTromol,
    };

    // Prepare rows for sheet - one row per tromol item, or at least 1 row
    const rows = daftarTromol.map((item) => [
      timestamp,
      tgl,
      namaOperator,
      hasilScrapCu || '-',
      hasilScrapAl || '-',
      kabelBisaDikupas || '-',
      item.noTromolDrum || '-',
      item.tipeKabel || '-',
      item.panjang || '-',
      item.noPro || '-',
      item.noLabel || '-',
    ]);

    const tromolListSummary = daftarTromol
      .map((t) => `${t.noTromolDrum || 'Drum'} (${t.tipeKabel || '-'}, ${t.panjang || 0}m)`)
      .join(', ');

    const summary = `CU: ${hasilScrapCu || 0}kg, AL: ${hasilScrapAl || 0}kg | ${daftarTromol.length} Tromol: ${tromolListSummary}`;

    onSubmitReport(formData, rows, summary);
  };

  return (
    <FormLayout
      area={area}
      onBack={onBack}
      onSelectArea={onSelectArea}
      tgl={tgl}
      onTglChange={setTgl}
      namaOperator={namaOperator}
      onNamaOperatorChange={setNamaOperator}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      spreadsheetId={spreadsheetId}
      spreadsheetName={spreadsheetName}
      onOpenSpreadsheetModal={onOpenSpreadsheetModal}
    >
      {/* Top Section (greenish tint as in PDF) */}
      <div className="border-2 border-emerald-200 bg-emerald-50/50 rounded-xl p-3 sm:p-4 space-y-3">
        {/* Hasil scrap CU */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Hasil scrap CU :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              placeholder="opsional"
              value={hasilScrapCu}
              onChange={(e) => setHasilScrapCu(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
          </div>
        </div>

        {/* Hasil scrap AL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Hasil scrap AL :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              placeholder="opsional"
              value={hasilScrapAl}
              onChange={(e) => setHasilScrapAl(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
          </div>
        </div>

        {/* Kabel bisa dikupas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Kabel bisa dikupas :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              placeholder="opsional"
              value={kabelBisaDikupas}
              onChange={(e) => setKabelBisaDikupas(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">pallet</span>
          </div>
        </div>
      </div>

      {/* Section: Data scrap tromol */}
      <div className="space-y-3">
        <h4 className="text-sm font-extrabold text-purple-800">
          Data scrap tromol
        </h4>

        {daftarTromol.map((item, index) => (
          <div
            key={item.id}
            className="border-2 border-amber-300 bg-amber-50/40 rounded-xl p-3 sm:p-4 space-y-3 relative"
          >
            <div className="flex items-center justify-between pb-1 border-b border-amber-200">
              <span className="text-xs font-bold text-amber-900">
                Tromol #{index + 1}
              </span>
              {daftarTromol.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTromol(item.id)}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              )}
            </div>

            {/* No Tromol / Drum */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800">
                No Tromol / Drum : <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="No Tromol / Drum..."
                value={item.noTromolDrum}
                onChange={(e) => handleTromolChange(item.id, 'noTromolDrum', e.target.value)}
                className="w-full sm:w-60 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Tipe kabel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800">
                Tipe kabel : <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Tipe kabel..."
                value={item.tipeKabel}
                onChange={(e) => handleTromolChange(item.id, 'tipeKabel', e.target.value)}
                className="w-full sm:w-60 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Panjang (m) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800">
                Panjang : <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0"
                  value={item.panjang}
                  onChange={(e) => handleTromolChange(item.id, 'panjang', e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right"
                />
                <span className="text-xs font-bold text-slate-600 w-8 shrink-0">m</span>
              </div>
            </div>

            {/* No PRO (opsional kg) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800">
                No PRO :
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="opsional"
                  value={item.noPro}
                  onChange={(e) => handleTromolChange(item.id, 'noPro', e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
                />
                <span className="text-xs font-bold text-slate-600 w-8 shrink-0">kg</span>
              </div>
            </div>

            {/* No Label (opsional kg) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800">
                No Label :
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="opsional"
                  value={item.noLabel}
                  onChange={(e) => handleTromolChange(item.id, 'noLabel', e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
                />
                <span className="text-xs font-bold text-slate-600 w-8 shrink-0">kg</span>
              </div>
            </div>
          </div>
        ))}

        {/* Button Tambah Tromol (matching red/pink border in PDF) */}
        <button
          type="button"
          onClick={handleAddTromol}
          className="w-full sm:w-auto px-4 py-2 border-2 border-red-500 bg-white hover:bg-red-50 text-red-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tromol</span>
        </button>
      </div>
    </FormLayout>
  );
};
