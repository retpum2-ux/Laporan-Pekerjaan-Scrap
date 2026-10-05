import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea7Data } from '../../types/scrap';
import { Check } from 'lucide-react';

interface Area7Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea7Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

const HALL_AREAS = [
  'Hall DT-5 / IS-15',
  'Hall 1',
  'Hall 2',
  'Hall 3',
  'Hall 4',
  'Hall 5',
  'Hall 6',
  'Hall 7',
  'Hall 8',
];

export const Area7KebersihanHallForm: React.FC<Area7Props> = ({
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
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    HALL_AREAS.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );
  const [cuciMesin, setCuciMesin] = useState('');
  const [sawang, setSawang] = useState('');
  const [bemper, setBemper] = useState('');
  const [kerapianTromol, setKerapianTromol] = useState('');
  const [kerapianMaterial, setKerapianMaterial] = useState('');

  const handleToggle = (item: string) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea7Data = {
      tgl,
      namaOperator,
      sapuHallChecklist: checklist,
      cuciMesin,
      sawang,
      bemper,
      kerapianTromol,
      kerapianMaterial,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      ...HALL_AREAS.map((a) => (checklist[a] ? 'V' : '-')),
      cuciMesin || '-',
      sawang || '-',
      bemper || '-',
      kerapianTromol || '-',
      kerapianMaterial || '-',
    ];

    const completedCount = HALL_AREAS.filter((a) => checklist[a]).length;
    const summary = `Sapu Hall: ${completedCount}/${HALL_AREAS.length} area | Cuci: ${cuciMesin || 0}, Sawang: ${sawang || 0}, Tromol: ${kerapianTromol || 0}`;

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
      {/* Sapu Hall Table */}
      <div className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white">
        <div className="p-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-800">Sapu Hall</h4>
          <span className="text-xs text-slate-500 font-medium">
            Centang manual ({Object.values(checklist).filter(Boolean).length}/{HALL_AREAS.length})
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-300 text-xs text-slate-700 uppercase font-bold">
              <th className="py-2.5 px-4">Area</th>
              <th className="py-2.5 px-4 text-center w-28">Ceklist</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {HALL_AREAS.map((hall) => {
              const checked = !!checklist[hall];
              return (
                <tr
                  key={hall}
                  onClick={() => handleToggle(hall)}
                  className={`cursor-pointer transition-all select-none ${
                    checked ? 'bg-blue-50/80 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-4 text-slate-800">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full transition-colors ${
                          checked ? 'bg-blue-600' : 'bg-transparent'
                        }`}
                      />
                      <span>{hall}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center justify-center">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          checked
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                            : 'border-slate-400 bg-white hover:border-blue-500'
                        }`}
                      >
                        {checked && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Additional cleaning fields */}
      <div className="space-y-3 pt-2">
        {/* Cuci mesin */}
        <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Cuci mesin :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="opsional"
              value={cuciMesin}
              onChange={(e) => setCuciMesin(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">Mesin</span>
          </div>
        </div>

        {/* Sawang */}
        <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Sawang :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="opsional"
              value={sawang}
              onChange={(e) => setSawang(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">Mesin</span>
          </div>
        </div>

        {/* Bemper */}
        <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Bemper :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="opsional"
              value={bemper}
              onChange={(e) => setBemper(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">Mesin</span>
          </div>
        </div>

        {/* Kerapian tromol */}
        <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Kerapian tromol :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="opsional"
              value={kerapianTromol}
              onChange={(e) => setKerapianTromol(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">Mesin</span>
          </div>
        </div>

        {/* Kerapian material */}
        <div className="border-2 border-slate-300 rounded-xl p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Kerapian material :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="opsional"
              value={kerapianMaterial}
              onChange={(e) => setKerapianMaterial(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-600 text-right placeholder:text-amber-600/70 placeholder:italic"
            />
            <span className="text-xs font-bold text-slate-600 w-14 shrink-0">Mesin</span>
          </div>
        </div>
      </div>
    </FormLayout>
  );
};
