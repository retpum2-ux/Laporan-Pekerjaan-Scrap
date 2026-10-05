import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea1Data } from '../../types/scrap';

interface Area1Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea1Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

export const Area1DrawingForm: React.FC<Area1Props> = ({
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
  const [mesin, setMesin] = useState<'IU-27' | 'IU-10' | ''>('IU-27');
  const [jumlahTromolScrap, setJumlahTromolScrap] = useState('');
  const [jumlahMesinOven, setJumlahMesinOven] = useState('');
  const [kurasLimbahCoc, setKurasLimbahCoc] = useState('');
  const [hasilScrapCu, setHasilScrapCu] = useState('');
  const [hasilScrapAl, setHasilScrapAl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea1Data = {
      tgl,
      namaOperator,
      mesin,
      jumlahTromolScrap,
      jumlahMesinOven,
      kurasLimbahCoc,
      hasilScrapCu,
      hasilScrapAl,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      mesin,
      jumlahTromolScrap,
      jumlahMesinOven || '-',
      kurasLimbahCoc || '-',
      hasilScrapCu || '-',
      hasilScrapAl || '-',
    ];

    const summary = `Mesin: ${mesin} | Tromol: ${jumlahTromolScrap} bobin | CU: ${hasilScrapCu || 0}kg, AL: ${hasilScrapAl || 0}kg`;

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
      {/* Mesin Selection: IU-27 dan IU-10 */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white">
        <label className="block text-xs font-bold text-slate-800 mb-2">
          Mesin <span className="font-normal text-slate-500">(ada pilihan IU-27 dan IU-10)</span>
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['IU-27', 'IU-10'] as const).map((opt) => (
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
                name="mesin"
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

      {/* Jumlah tromol Scrap (bobin) */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Jumlah tromol Scrap :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            required
            placeholder="0"
            value={jumlahTromolScrap}
            onChange={(e) => setJumlahTromolScrap(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">bobin</span>
        </div>
      </div>

      {/* Jumlah mesin oven (opsional) */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Jumlah mesin oven :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={jumlahMesinOven}
            onChange={(e) => setJumlahMesinOven(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="w-14 shrink-0"></span>
        </div>
      </div>

      {/* Kuras limbah COC (opsional kg) */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Kuras limbah COC :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={kurasLimbahCoc}
            onChange={(e) => setKurasLimbahCoc(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
        </div>
      </div>

      {/* Hasil scrap CU (opsional kg) */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
        </div>
      </div>

      {/* Hasil scrap AL (opsional kg) */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
        </div>
      </div>
    </FormLayout>
  );
};
