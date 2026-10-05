import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea12Data } from '../../types/scrap';

interface Area12Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea12Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

export const Area12ForkliftForm: React.FC<Area12Props> = ({
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
  const [boxKarung, setBoxKarung] = useState('');
  const [boxSteel, setBoxSteel] = useState('');
  const [boxPvcSpool, setBoxPvcSpool] = useState('');
  const [boxXlpeSpool, setBoxXlpeSpool] = useState('');
  const [boxKabel, setBoxKabel] = useState('');
  const [boxCu, setBoxCu] = useState('');
  const [boxAl, setBoxAl] = useState('');
  const [rajanganPvc, setRajanganPvc] = useState('');
  const [deskripsiLainnya, setDeskripsiLainnya] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea12Data = {
      tgl,
      namaOperator,
      boxKarung,
      boxSteel,
      boxPvcSpool,
      boxXlpeSpool,
      boxKabel,
      boxCu,
      boxAl,
      rajanganPvc,
      deskripsiPekerjaanLainnya: deskripsiLainnya,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      boxKarung || '-',
      boxSteel || '-',
      boxPvcSpool || '-',
      boxXlpeSpool || '-',
      boxKabel || '-',
      boxCu || '-',
      boxAl || '-',
      rajanganPvc || '-',
      deskripsiLainnya || '-',
    ];

    const summary = `Box: Karung ${boxKarung || 0}, Steel ${boxSteel || 0}, Kabel ${boxKabel || 0}, CU ${boxCu || 0}, AL ${boxAl || 0} | Rajangan PVC: ${rajanganPvc || 0} palet`;

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
      {/* Box Karung */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Box Karung :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={boxKarung}
            onChange={(e) => setBoxKarung(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Box Steel */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Box Steel :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={boxSteel}
            onChange={(e) => setBoxSteel(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Box PVC spool */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Box PVC spool :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={boxPvcSpool}
            onChange={(e) => setBoxPvcSpool(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Box XLPE spool */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Box XLPE spool :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={boxXlpeSpool}
            onChange={(e) => setBoxXlpeSpool(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Box Kabel */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Box Kabel :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={boxKabel}
            onChange={(e) => setBoxKabel(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Box CU */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Box CU :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={boxCu}
            onChange={(e) => setBoxCu(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Box AL */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Box AL :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={boxAl}
            onChange={(e) => setBoxAl(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">box</span>
        </div>
      </div>

      {/* Rajangan PVC : opsional palet */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Rajangan PVC :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={rajanganPvc}
            onChange={(e) => setRajanganPvc(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">palet</span>
        </div>
      </div>

      {/* Deskripsi pekerjaan lainnya : opsional */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white space-y-1">
        <label className="block text-xs sm:text-sm font-bold text-slate-800">
          Deskripsi pekerjaan lainnya :
        </label>
        <input
          type="text"
          placeholder="opsional"
          value={deskripsiLainnya}
          onChange={(e) => setDeskripsiLainnya(e.target.value)}
          className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 placeholder:text-amber-600/70 placeholder:italic"
        />
      </div>
    </FormLayout>
  );
};
