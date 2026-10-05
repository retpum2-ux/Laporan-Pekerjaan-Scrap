import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea11Data } from '../../types/scrap';

interface Area11Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea11Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

export const Area11PotongKabelForm: React.FC<Area11Props> = ({
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
  const [boxPvc, setBoxPvc] = useState('');
  const [boxXlpe, setBoxXlpe] = useState('');
  const [potongLv, setPotongLv] = useState('');
  const [potongMv, setPotongMv] = useState('');
  const [potongHv, setPotongHv] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea11Data = {
      tgl,
      namaOperator,
      boxPvcSortir: boxPvc,
      boxXlpeSortir: boxXlpe,
      hasilPotongKabelLv: potongLv,
      hasilPotongKabelMv: potongMv,
      hasilPotongKabelHv: potongHv,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      boxPvc || '-',
      boxXlpe || '-',
      potongLv || '-',
      potongMv || '-',
      potongHv || '-',
    ];

    const summary = `Box: PVC ${boxPvc || 0}, XLPE ${boxXlpe || 0} | Potong: LV ${potongLv || 0} pal, MV ${potongMv || 0} pal, HV ${potongHv || 0} pal`;

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
      {/* Box PVC sortir : opsional box */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Box PVC sortir :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={boxPvc}
            onChange={(e) => setBoxPvc(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Box XLPE sortir : opsional box */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Box XLPE sortir :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={boxXlpe}
            onChange={(e) => setBoxXlpe(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Hasil potong kabel LV : opsional pallet */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Hasil potong kabel LV :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={potongLv}
            onChange={(e) => setPotongLv(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">pallet</span>
        </div>
      </div>

      {/* Hasil potong kabel MV : opsional pallet */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Hasil potong kabel MV :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={potongMv}
            onChange={(e) => setPotongMv(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">pallet</span>
        </div>
      </div>

      {/* Hasil potong kabel HV : opsional pallet */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Hasil potong kabel HV :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={potongHv}
            onChange={(e) => setPotongHv(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">pallet</span>
        </div>
      </div>
    </FormLayout>
  );
};
