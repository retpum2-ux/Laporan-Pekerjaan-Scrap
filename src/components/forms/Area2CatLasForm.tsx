import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea2Data } from '../../types/scrap';

interface Area2Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea2Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

export const Area2CatLasForm: React.FC<Area2Props> = ({
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
  const [pekerjaan, setPekerjaan] = useState<'Pengecatan' | 'Pengelasan' | ''>('Pengecatan');
  const [cat1, setCat1] = useState('');
  const [cat2, setCat2] = useState('');
  const [cat3, setCat3] = useState('');
  const [tiner, setTiner] = useState('');
  const [hasilPekerjaan, setHasilPekerjaan] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea2Data = {
      tgl,
      namaOperator,
      pekerjaan,
      tipeCatDanJumlah1: cat1,
      tipeCatDanJumlah2: cat2,
      tipeCatDanJumlah3: cat3,
      tiner,
      hasilPekerjaan,
      keterangan,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      pekerjaan,
      cat1 || '-',
      cat2 || '-',
      cat3 || '-',
      tiner || '-',
      hasilPekerjaan,
      keterangan || '-',
    ];

    const summary = `${pekerjaan} | Hasil: ${hasilPekerjaan} | Cat1: ${cat1 || '-'}, Tiner: ${tiner || '-'}`;

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
      {/* Pilihan Pekerjaan: Pengecatan / Pengelasan */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white">
        <label className="block text-xs font-bold text-slate-800 mb-2">
          Pekerjaan : <span className="text-red-600 font-normal">Pilihan: Pengecatan / Pengelasan</span>
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['Pengecatan', 'Pengelasan'] as const).map((opt) => (
            <label
              key={opt}
              className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                pekerjaan === opt
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <input
                type="radio"
                name="pekerjaan"
                required
                value={opt}
                checked={pekerjaan === opt}
                onChange={() => setPekerjaan(opt)}
                className="w-4 h-4 text-blue-600"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tipe cat & jumlah (liter) 1 */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Tipe cat & jumlah :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="opsional"
            value={cat1}
            onChange={(e) => setCat1(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-12 shrink-0">liter</span>
        </div>
      </div>

      {/* Tipe cat & jumlah (liter) 2 */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Tipe cat & jumlah :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="opsional"
            value={cat2}
            onChange={(e) => setCat2(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-12 shrink-0">liter</span>
        </div>
      </div>

      {/* Tipe cat & jumlah (liter) 3 */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Tipe cat & jumlah :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="opsional"
            value={cat3}
            onChange={(e) => setCat3(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-12 shrink-0">liter</span>
        </div>
      </div>

      {/* Tiner (liter) */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Tiner :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={tiner}
            onChange={(e) => setTiner(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-12 shrink-0">liter</span>
        </div>
      </div>

      {/* Hasil pekerjaan */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white space-y-1">
        <label className="block text-xs sm:text-sm font-bold text-slate-800">
          Hasil pekerjaan : <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Tuliskan hasil pekerjaan..."
          value={hasilPekerjaan}
          onChange={(e) => setHasilPekerjaan(e.target.value)}
          className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600"
        />
      </div>

      {/* Keterangan */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white space-y-1">
        <label className="block text-xs sm:text-sm font-bold text-slate-800">
          Keterangan :
        </label>
        <input
          type="text"
          placeholder="Keterangan tambahan..."
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600"
        />
      </div>
    </FormLayout>
  );
};
