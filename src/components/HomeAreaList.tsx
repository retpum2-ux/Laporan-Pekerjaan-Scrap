import React from 'react';
import { AREA_LIST, AreaDef } from '../types/scrap';
import { ChevronRight } from 'lucide-react';

interface HomeAreaListProps {
  onSelectArea: (area: AreaDef) => void;
  submissionCounts: Record<number, number>;
}

export const HomeAreaList: React.FC<HomeAreaListProps> = ({
  onSelectArea,
  submissionCounts,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title Header - exactly matching PDF Page 1 */}
      <div className="text-center pt-2 pb-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
          LAPORAN PEKERJAAN SCRAP
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
          Dept. Produksi (PP)
        </h2>
      </div>

      {/* Pure PDF Table Format */}
      <div className="bg-white rounded-xl shadow-md border-2 border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#B4C6E7] border-b-2 border-slate-600 text-slate-900">
              <th className="py-3 px-4 sm:px-6 w-16 sm:w-20 text-center font-extrabold text-base sm:text-lg border-r-2 border-slate-600">
                No
              </th>
              <th className="py-3 px-4 sm:px-6 font-extrabold text-base sm:text-lg text-center">
                Area
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-400">
            {AREA_LIST.map((area) => {
              const count = submissionCounts[area.id] || 0;
              return (
                <tr
                  key={area.id}
                  onClick={() => onSelectArea(area)}
                  className="bg-[#DCEAD9] hover:bg-[#C9DFCA] active:bg-[#bad6bb] transition-colors cursor-pointer group"
                >
                  <td className="py-3 sm:py-3.5 px-4 sm:px-6 text-center font-bold text-slate-900 text-base sm:text-lg border-r-2 border-slate-400 select-none">
                    {area.id}
                  </td>
                  <td className="py-3 sm:py-3.5 px-4 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-900 transition-colors">
                        {area.title}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {count > 0 && (
                          <span className="text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                            {count} tersimpan
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
