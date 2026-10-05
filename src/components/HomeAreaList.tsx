import React, { useState } from 'react';
import { AREA_LIST, AreaDef } from '../types/scrap';
import {
  ChevronRight,
  Search,
  LayoutGrid,
  Table as TableIcon,
  ArrowRight,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

interface HomeAreaListProps {
  onSelectArea: (area: AreaDef) => void;
  submissionCounts: Record<number, number>;
}

export const HomeAreaList: React.FC<HomeAreaListProps> = ({
  onSelectArea,
  submissionCounts,
}) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredAreas = AREA_LIST.filter(
    (area) =>
      area.title.toLowerCase().includes(search.toLowerCase()) ||
      area.id.toString().includes(search) ||
      area.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title Banner - exactly matching PDF Page 1 */}
      <div className="text-center pt-2 pb-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
          LAPORAN PEKERJAAN SCRAP
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-slate-800 mt-1">
          Dept. Produksi (PP)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-2">
          Pilih salah satu nomor atau area pekerjaan di bawah ini untuk mengisi formulir laporan dan sinkronisasi otomatis ke Google Spreadsheet.
        </p>
      </div>

      {/* Control bar: Search & View switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari area pekerjaan (contoh: kupas, sortir, tromol, dll)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tampilan Tabel Standar PDF"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Format Tabel PDF</span>
            <span className="sm:hidden">Tabel</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tampilan Kartu Modern"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kartu</span>
          </button>
        </div>
      </div>

      {/* View 1: Authentic PDF Table Format */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#B4C6E7] border-b-2 border-slate-400 text-slate-900">
                  <th className="py-3 px-4 sm:px-6 w-16 sm:w-20 text-center font-extrabold text-sm sm:text-base border-r border-slate-400">
                    No
                  </th>
                  <th className="py-3 px-4 sm:px-6 font-extrabold text-sm sm:text-base text-center">
                    Area
                  </th>
                  <th className="py-3 px-4 w-28 text-center font-extrabold text-xs text-slate-700 hidden sm:table-cell">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {filteredAreas.map((area) => {
                  const count = submissionCounts[area.id] || 0;
                  return (
                    <tr
                      key={area.id}
                      onClick={() => onSelectArea(area)}
                      className="bg-[#DCEAD9] hover:bg-[#C9DFCA] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 sm:px-6 text-center font-bold text-slate-900 text-sm sm:text-base border-r border-slate-300">
                        {area.id}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-900 transition-colors">
                            {area.title}
                          </span>
                          <div className="flex items-center gap-2">
                            {count > 0 && (
                              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                                {count} input hari ini
                              </span>
                            )}
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-white/70 px-2.5 py-1 rounded-lg border border-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                          Buka Form
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View 2: Modern responsive cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredAreas.map((area) => {
            const count = submissionCounts[area.id] || 0;
            return (
              <div
                key={area.id}
                onClick={() => onSelectArea(area)}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-extrabold text-sm flex items-center justify-center border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {area.id}
                    </span>
                    {count > 0 && (
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {count} tersimpan
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors leading-snug">
                    {area.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {area.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Isi Formulir</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredAreas.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-700">Area pekerjaan tidak ditemukan</p>
          <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian lainnya.</p>
        </div>
      )}
    </div>
  );
};
