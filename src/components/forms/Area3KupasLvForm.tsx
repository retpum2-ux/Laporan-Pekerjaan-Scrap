import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea3Data } from '../../types/scrap';

interface Area3Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea3Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

export const Area3KupasLvForm: React.FC<Area3Props> = ({
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
  const [jenisPekerjaan, setJenisPekerjaan] = useState<'LV1' | 'LV2' | 'LV3' | ''>('LV1');
  const [ukuranBahan, setUkuranBahan] = useState<'>10mm' | '<10mm' | ''>('>10mm');
  const [hasilKupasCu, setHasilKupasCu] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea3Data = {
      tgl,
      namaOperator,
      jenisPekerjaan,
      ukuranBahan,
      hasilKupasCu,
      keterangan,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      jenisPekerjaan,
      ukuranBahan,
      hasilKupasCu,
      keterangan || '-',
    ];

    const summary = `${jenisPekerjaan} | Ukuran: ${ukuranBahan} | Hasil CU: ${hasilKupasCu} kg`;

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
      {/* Jenis pekerjaan : Pilihan (LV1, LV2, LV3) */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white">
        <label className="block text-xs font-bold text-slate-800 mb-2">
          Jenis pekerjaan : <span className="text-red-600 font-semibold">Pilihan (LV1, LV2, LV3)</span>
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {(['LV1', 'LV2', 'LV3'] as const).map((opt) => (
            <label
              key={opt}
              className={`flex items-center justify-center gap-2 p-2.5 border-2 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                jenisPekerjaan === opt
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <input
                type="radio"
                name="jenisPekerjaan"
                required
                value={opt}
                checked={jenisPekerjaan === opt}
                onChange={() => setJenisPekerjaan(opt)}
                className="w-4 h-4 text-blue-600"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ukuran bahan : Pilihan (>10mm, <10mm) */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white">
        <label className="block text-xs font-bold text-slate-800 mb-2">
          Ukuran bahan : <span className="text-red-600 font-semibold">Pilihan (&gt;10mm, &lt;10mm)</span>
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['>10mm', '<10mm'] as const).map((opt) => (
            <label
              key={opt}
              className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                ukuranBahan === opt
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <input
                type="radio"
                name="ukuranBahan"
                required
                value={opt}
                checked={ukuranBahan === opt}
                onChange={() => setUkuranBahan(opt)}
                className="w-4 h-4 text-blue-600"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Hasil kupas (CU) : kg */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Hasil kupas (CU) : <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            required
            placeholder="0"
            value={hasilKupasCu}
            onChange={(e) => setHasilKupasCu(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right"
          />
          <span className="text-xs font-bold text-slate-600 w-12 shrink-0">kg</span>
        </div>
      </div>

      {/* Keterangan : opsional kg / catatan */}
      <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          Keterangan :
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="opsional"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
          />
          <span className="text-xs font-bold text-slate-600 w-12 shrink-0">kg</span>
        </div>
      </div>
    </FormLayout>
  );
};
