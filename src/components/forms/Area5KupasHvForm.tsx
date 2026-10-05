import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea5Data } from '../../types/scrap';

interface Area5Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea5Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

export const Area5KupasHvForm: React.FC<Area5Props> = ({
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
  const [mesin, setMesin] = useState<'Mesin HV' | 'Mesin Hidrolik' | ''>('Mesin HV');
  const [jumlahBahanCu, setJumlahBahanCu] = useState('');
  const [jumlahBahanAl, setJumlahBahanAl] = useState('');
  const [hasilKupasCu, setHasilKupasCu] = useState('');
  const [hasilKupasAl, setHasilKupasAl] = useState('');
  const [hasilPotongHidrolik, setHasilPotongHidrolik] = useState('');
  const [hasilHidrolikCu, setHasilHidrolikCu] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea5Data = {
      tgl,
      namaOperator,
      mesin,
      jumlahBahanCu,
      jumlahBahanAl,
      hasilKupasCu,
      hasilKupasAl,
      hasilPotongHidrolik,
      hasilHidrolikCu,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      mesin,
      jumlahBahanCu || '-',
      jumlahBahanAl || '-',
      hasilKupasCu || '-',
      hasilKupasAl || '-',
      hasilPotongHidrolik || '-',
      hasilHidrolikCu || '-',
    ];

    const summary = `${mesin} | HV: CU ${hasilKupasCu || 0}kg / AL ${hasilScrapSummary(hasilKupasAl)} | Hidrolik: Potong ${hasilPotongHidrolik || 0}kg / CU ${hasilHidrolikCu || 0}kg`;

    onSubmitReport(formData, [row], summary);
  };

  const hasilScrapSummary = (val: string) => (val ? `${val}kg` : '0kg');

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
      {/* Pilihan Mesin : Mesin HV / Mesin Hidrolik */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white">
        <label className="block text-xs font-bold text-slate-800 mb-2">
          Mesin : <span className="text-red-600 font-semibold">Pilihan: Mesin HV / Mesin Hidrolik</span>
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['Mesin HV', 'Mesin Hidrolik'] as const).map((opt) => (
            <label
              key={opt}
              className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                mesin === opt
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <input
                type="radio"
                name="mesinHv"
                required
                value={opt}
                checked={mesin === opt}
                onChange={() => setMesin(opt)}
                className="w-4 h-4 text-blue-600"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bagian Mesin HV (orange/amber tint matching PDF) */}
      <div className="border-2 border-amber-300 bg-amber-50/40 rounded-xl p-3 sm:p-4 space-y-3">
        <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
          Area Mesin HV
        </h4>

        {/* Jumlah bahan CU */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Jumlah bahan CU :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              placeholder="opsional"
              value={jumlahBahanCu}
              onChange={(e) => setJumlahBahanCu(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">pallet</span>
          </div>
        </div>

        {/* Jumlah bahan AL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Jumlah bahan AL :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              placeholder="opsional"
              value={jumlahBahanAl}
              onChange={(e) => setJumlahBahanAl(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">pallet</span>
          </div>
        </div>

        {/* Hasil kupas CU */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Hasil kupas CU :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              placeholder="opsional"
              value={hasilKupasCu}
              onChange={(e) => setHasilKupasCu(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
          </div>
        </div>

        {/* Hasil kupas AL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Hasil kupas AL :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              placeholder="opsional"
              value={hasilKupasAl}
              onChange={(e) => setHasilKupasAl(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
          </div>
        </div>
      </div>

      {/* Bagian Mesin Hidrolik (purple/blue tint matching PDF) */}
      <div className="border-2 border-indigo-200 bg-indigo-50/40 rounded-xl p-3 sm:p-4 space-y-3">
        <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
          Area Mesin Hidrolik
        </h4>

        {/* Hasil potong hidrolik : opsional kg */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Hasil potong hidrolik :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              placeholder="opsional"
              value={hasilPotongHidrolik}
              onChange={(e) => setHasilPotongHidrolik(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
          </div>
        </div>

        {/* Hasil hidrolik CU : opsional kg */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Hasil hidrolik CU :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              placeholder="opsional"
              value={hasilHidrolikCu}
              onChange={(e) => setHasilHidrolikCu(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
          </div>
        </div>
      </div>
    </FormLayout>
  );
};
