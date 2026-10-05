import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea4Data } from '../../types/scrap';

interface Area4Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea4Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

export const Area4KupasMvForm: React.FC<Area4Props> = ({
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
  const [jumlahBahanCu, setJumlahBahanCu] = useState('');
  const [jumlahBahanAl, setJumlahBahanAl] = useState('');
  const [hasilKupasCu, setHasilKupasCu] = useState('');
  const [hasilKupasAl, setHasilKupasAl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea4Data = {
      tgl,
      namaOperator,
      jumlahBahanCu,
      jumlahBahanAl,
      hasilKupasCu,
      hasilKupasAl,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      jumlahBahanCu || '-',
      jumlahBahanAl || '-',
      hasilKupasCu || '-',
      hasilKupasAl || '-',
    ];

    const summary = `Bahan CU: ${jumlahBahanCu || 0} pal, AL: ${jumlahBahanAl || 0} pal | Kupas CU: ${hasilKupasCu || 0} kg, AL: ${hasilKupasAl || 0} kg`;

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
      {/* Jumlah bahan CU : opsional pallet */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">pallet</span>
        </div>
      </div>

      {/* Jumlah bahan AL : opsional pallet */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">pallet</span>
        </div>
      </div>

      {/* Hasil kupas CU : opsional kg */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
        </div>
      </div>

      {/* Hasil kupas AL : opsional kg */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-14 shrink-0">kg</span>
        </div>
      </div>
    </FormLayout>
  );
};
