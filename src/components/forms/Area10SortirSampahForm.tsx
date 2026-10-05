import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea10Data } from '../../types/scrap';

interface Area10Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea10Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

export const Area10SortirSampahForm: React.FC<Area10Props> = ({
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
  const [kabelBisaDikupas, setKabelBisaDikupas] = useState('');
  const [potonganPendek, setPotonganPendek] = useState('');
  const [kabelPendekSa, setKabelPendekSa] = useState('');
  const [pekerjaanLainnya, setPekerjaanLainnya] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea10Data = {
      tgl,
      namaOperator,
      sortiranKabelBisaDikupas: kabelBisaDikupas,
      sortirPotonganPendekKarungPvc: potonganPendek,
      sortiranKabelPendekSiapKirimSa: kabelPendekSa,
      pekerjaanLainnya,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      kabelBisaDikupas || '-',
      potonganPendek,
      kabelPendekSa || '-',
      pekerjaanLainnya || '-',
    ];

    const summary = `Potongan Pendek: ${potonganPendek} krg pvc | Siap Kirim SA: ${kabelPendekSa || 0} krg bsr | Kabel Dikupas: ${kabelBisaDikupas || 0} palet`;

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
      {/* Sortiran kabel bisa dikupas : opsional palet */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Sortiran kabel bisa dikupas :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={kabelBisaDikupas}
            onChange={(e) => setKabelBisaDikupas(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-16 shrink-0">palet</span>
        </div>
      </div>

      {/* Sortir potongan pendek (karung pvc) : karung pvc */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            Sortir potongan pendek : <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-slate-500">(karung pvc)</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            required
            placeholder="0"
            value={potonganPendek}
            onChange={(e) => setPotonganPendek(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right"
          />
          <span className="text-xs font-bold text-slate-600 w-24 shrink-0">karung pvc</span>
        </div>
      </div>

      {/* Sortiran kabel pendek siap dikirim SA : opsional karung besar */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            Sortiran kabel pendek :
          </label>
          <span className="text-[11px] text-slate-500">siap dikirim SA</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            placeholder="opsional"
            value={kabelPendekSa}
            onChange={(e) => setKabelPendekSa(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-24 shrink-0">karung besar</span>
        </div>
      </div>

      {/* Pekerjaan lainnya : opsional */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white space-y-1">
        <label className="block text-xs sm:text-sm font-bold text-slate-800">
          Pekerjaan lainnya :
        </label>
        <input
          type="text"
          placeholder="opsional"
          value={pekerjaanLainnya}
          onChange={(e) => setPekerjaanLainnya(e.target.value)}
          className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 placeholder:text-amber-600/70 placeholder:italic"
        />
      </div>
    </FormLayout>
  );
};
