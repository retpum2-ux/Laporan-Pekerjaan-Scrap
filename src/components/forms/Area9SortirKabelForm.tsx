import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea9Data } from '../../types/scrap';

interface Area9Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea9Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

export const Area9SortirKabelForm: React.FC<Area9Props> = ({
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
  const [tuangBoxBesar, setTuangBoxBesar] = useState('');
  const [taungBoxKecil, setTaungBoxKecil] = useState('');
  const [taungBoxCu, setTaungBoxCu] = useState('');
  const [tuangBoxAl, setTuangBoxAl] = useState('');
  const [sortirKurang10, setSortirKurang10] = useState('');
  const [sortirLebih10, setSortirLebih10] = useState('');
  const [sampahKecil, setSampahKecil] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea9Data = {
      tgl,
      namaOperator,
      tuangBoxBesarKabel: tuangBoxBesar,
      tuangBoxKecilKabel: taungBoxKecil,
      tuangBoxCu: taungBoxCu,
      tuangBoxAl,
      hasilSortirKurang10mm: sortirKurang10,
      hasilSortirLebih10mm: sortirLebih10,
      hasilSampahKecil: sampahKecil,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      tuangBoxBesar,
      taungBoxKecil || '-',
      taungBoxCu,
      tuangBoxAl || '-',
      sortirKurang10,
      sortirLebih10,
      sampahKecil || '-',
    ];

    const summary = `Box: Bsr ${tuangBoxBesar}, Kcl ${taungBoxKecil || 0}, CU ${taungBoxCu} | Sortir: <10mm ${sortirKurang10} pal, >10mm ${sortirLebih10} pal`;

    onSubmitReport(formData, [row], summary);
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
      {/* Tuang box besar kabel : box */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Tuang box besar kabel : <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            required
            placeholder="0"
            value={tuangBoxBesar}
            onChange={(e) => setTuangBoxBesar(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Taung box kecil kabel : opsional box */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Taung box kecil kabel :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={taungBoxKecil}
            onChange={(e) => setTaungBoxKecil(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Taung box CU : box */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Taung box CU : <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            required
            placeholder="0"
            value={taungBoxCu}
            onChange={(e) => setTaungBoxCu(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Tuang box AL : opsional box */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Tuang box AL :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={tuangBoxAl}
            onChange={(e) => setTuangBoxAl(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Hasil sortir bahan <10 mm : pallet */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Hasil sortir bahan &lt;10 mm : <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            required
            placeholder="0"
            value={sortirKurang10}
            onChange={(e) => setSortirKurang10(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">pallet</span>
        </div>
      </div>

      {/* Hasil sortir bahan >10 mm : pallet */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Hasil sortir bahan &gt;10 mm : <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            required
            placeholder="0"
            value={sortirLebih10}
            onChange={(e) => setSortirLebih10(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">pallet</span>
        </div>
      </div>

      {/* Hasil sampah kecil (siap kirim SA) : opsional Karung */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            Hasil sampah kecil :
          </label>
          <span className="text-[11px] text-slate-500">(siap kirim SA)</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={sampahKecil}
            onChange={(e) => setSampahKecil(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">Karung</span>
        </div>
      </div>
    </FormLayout>
  );
};
