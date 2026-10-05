import React, { useState } from 'react';
import { FormLayout } from '../FormLayout';
import { AreaDef, FormArea8Data } from '../../types/scrap';
import { Check } from 'lucide-react';

interface Area8Props {
  area: AreaDef;
  onBack: () => void;
  onSelectArea: (area: AreaDef) => void;
  onSubmitReport: (
    data: FormArea8Data,
    rows: (string | number)[][],
    summary: string
  ) => void;
  isSubmitting: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  onOpenSpreadsheetModal: () => void;
  defaultOperator: string;
}

const CV_TASKS = [
  'Sapu lantai 1',
  'Sapu lantai 2',
  'Sapu lantai 3',
  'Sapu banker',
  'Pel lantai 1',
  'Pel lantai 2',
  'Pel lantai 3',
  'Membersihkan kaca',
  'Membersihkan lift',
  'Kuras residu',
  'Bemper',
  'Membersihkan tube endseal',
  'Membersihkan sawang',
];

export const Area8KebersihanCvForm: React.FC<Area8Props> = ({
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
    CV_TASKS.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const handleToggle = (task: string) => {
    setChecklist((prev) => ({ ...prev, [task]: !prev[task] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString('id-ID');
    const formData: FormArea8Data = {
      tgl,
      namaOperator,
      checklistPekerjaan: checklist,
    };

    const row = [
      timestamp,
      tgl,
      namaOperator,
      ...CV_TASKS.map((t) => (checklist[t] ? 'V' : '-')),
    ];

    const completedCount = CV_TASKS.filter((t) => checklist[t]).length;
    const summary = `Ceklist CV-Line: ${completedCount}/${CV_TASKS.length} pekerjaan selesai`;

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
      {/* Ceklist Pekerjaan Table */}
      <div className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white">
        <div className="p-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-800">Ceklist Pekerjaan</h4>
          <span className="text-xs text-slate-500 font-medium">
            Centang manual ({Object.values(checklist).filter(Boolean).length}/{CV_TASKS.length})
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-300 text-xs text-slate-700 uppercase font-bold">
              <th className="py-2.5 px-4">Pekerjaan</th>
              <th className="py-2.5 px-4 text-center w-28">Ceklist</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {CV_TASKS.map((task) => {
              const checked = !!checklist[task];
              return (
                <tr
                  key={task}
                  onClick={() => handleToggle(task)}
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
                      <span>{task}</span>
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
    </FormLayout>
  );
};
