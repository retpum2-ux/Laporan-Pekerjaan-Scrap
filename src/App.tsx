import React, { useState } from 'react';
import { AREA_LIST, AreaDef } from './types/scrap';
import { HomeAreaList } from './components/HomeAreaList';
import { ConfirmModal } from './components/ConfirmModal';

// Area forms
import { Area1DrawingForm } from './components/forms/Area1DrawingForm';
import { Area2CatLasForm } from './components/forms/Area2CatLasForm';
import { Area3KupasLvForm } from './components/forms/Area3KupasLvForm';
import { Area4KupasMvForm } from './components/forms/Area4KupasMvForm';
import { Area5KupasHvForm } from './components/forms/Area5KupasHvForm';
import { Area6KosongkanTromolForm } from './components/forms/Area6KosongkanTromolForm';
import { Area7KebersihanHallForm } from './components/forms/Area7KebersihanHallForm';
import { Area8KebersihanCvForm } from './components/forms/Area8KebersihanCvForm';
import { Area9SortirKabelForm } from './components/forms/Area9SortirKabelForm';
import { Area10SortirSampahForm } from './components/forms/Area10SortirSampahForm';
import { Area11PotongKabelForm } from './components/forms/Area11PotongKabelForm';
import { Area12ForkliftForm } from './components/forms/Area12ForkliftForm';

import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [selectedArea, setSelectedArea] = useState<AreaDef | null>(null);

  // Modal confirmation state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Pending submission for confirm dialog
  const [pendingSubmission, setPendingSubmission] = useState<{
    area: AreaDef;
    data: unknown;
    rows: (string | number)[][];
    summary: string;
    summaryItems: { label: string; value: string }[];
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Count of submissions stored in localStorage
  const [submissionCounts, setSubmissionCounts] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('scrap_submission_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleOpenReportSubmission = (
    area: AreaDef,
    data: unknown,
    rows: (string | number)[][],
    summary: string,
    summaryItems: { label: string; value: string }[]
  ) => {
    setPendingSubmission({
      area,
      data,
      rows,
      summary,
      summaryItems,
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!pendingSubmission) return;

    setIsSubmitting(true);
    const { area, rows, summary } = pendingSubmission;
    const operator = String(rows[0][2] || 'Operator');
    const dateVal = String(rows[0][1] || new Date().toISOString().split('T')[0]);

    try {
      // Send directly to backend API
      const response = await fetch('/api/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          areaId: area.id,
          areaTitle: area.title,
          pageTitle: area.pageTitle,
          sheetName: area.sheetName,
          tgl: dateVal,
          operator,
          rows,
          summary,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menyimpan ke server backend.');
      }

      // Update local submission counts
      setSubmissionCounts((prev) => {
        const updated = {
          ...prev,
          [area.id]: (prev[area.id] || 0) + 1,
        };
        localStorage.setItem('scrap_submission_counts', JSON.stringify(updated));
        return updated;
      });

      setIsConfirmModalOpen(false);
      setPendingSubmission(null);
      setToast({
        type: 'success',
        message: result.message || `Laporan ${area.title} berhasil disimpan!`,
      });

      // Navigate back to home table
      setSelectedArea(null);
    } catch (err: unknown) {
      console.error('Submit error:', err);
      const msg = err instanceof Error ? err.message : 'Gagal mengirim laporan ke server backend.';
      setToast({
        type: 'error',
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans pb-10">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <p className="font-semibold leading-snug">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {!selectedArea ? (
          /* Home Page (Pure PDF Table Page 1) */
          <HomeAreaList
            onSelectArea={(area) => setSelectedArea(area)}
            submissionCounts={submissionCounts}
          />
        ) : (
          /* Area Forms (Pages 2 - 13 in PDF) */
          <div className="space-y-4">
            {selectedArea.id === 1 && (
              <Area1DrawingForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    { label: 'Mesin', value: data.mesin },
                    { label: 'Jumlah Tromol Scrap', value: `${data.jumlahTromolScrap} bobin` },
                    { label: 'Jumlah Mesin Oven', value: data.jumlahMesinOven || '-' },
                    { label: 'Kuras Limbah COC', value: data.kurasLimbahCoc ? `${data.kurasLimbahCoc} kg` : '-' },
                    { label: 'Hasil Scrap CU', value: data.hasilScrapCu ? `${data.hasilScrapCu} kg` : '-' },
                    { label: 'Hasil Scrap AL', value: data.hasilScrapAl ? `${data.hasilScrapAl} kg` : '-' },
                  ])
                }
              />
            )}

            {selectedArea.id === 2 && (
              <Area2CatLasForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    { label: 'Pekerjaan', value: data.pekerjaan },
                    { label: 'Cat 1', value: data.tipeCatDanJumlah1 ? `${data.tipeCatDanJumlah1} liter` : '-' },
                    { label: 'Cat 2', value: data.tipeCatDanJumlah2 ? `${data.tipeCatDanJumlah2} liter` : '-' },
                    { label: 'Cat 3', value: data.tipeCatDanJumlah3 ? `${data.tipeCatDanJumlah3} liter` : '-' },
                    { label: 'Tiner', value: data.tiner ? `${data.tiner} liter` : '-' },
                    { label: 'Hasil Pekerjaan', value: data.hasilPekerjaan },
                    { label: 'Keterangan', value: data.keterangan || '-' },
                  ])
                }
              />
            )}

            {selectedArea.id === 3 && (
              <Area3KupasLvForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    { label: 'Jenis Pekerjaan', value: data.jenisPekerjaan },
                    { label: 'Ukuran Bahan', value: data.ukuranBahan },
                    { label: 'Hasil Kupas (CU)', value: `${data.hasilKupasCu} kg` },
                    { label: 'Keterangan', value: data.keterangan || '-' },
                  ])
                }
              />
            )}

            {selectedArea.id === 4 && (
              <Area4KupasMvForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    { label: 'Jumlah Bahan CU', value: data.jumlahBahanCu ? `${data.jumlahBahanCu} pallet` : '-' },
                    { label: 'Jumlah Bahan AL', value: data.jumlahBahanAl ? `${data.jumlahBahanAl} pallet` : '-' },
                    { label: 'Hasil Kupas CU', value: data.hasilKupasCu ? `${data.hasilKupasCu} kg` : '-' },
                    { label: 'Hasil Kupas AL', value: data.hasilKupasAl ? `${data.hasilKupasAl} kg` : '-' },
                  ])
                }
              />
            )}

            {selectedArea.id === 5 && (
              <Area5KupasHvForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    { label: 'Pilihan Mesin', value: data.mesin },
                    { label: 'Bahan CU', value: data.jumlahBahanCu ? `${data.jumlahBahanCu} pallet` : '-' },
                    { label: 'Bahan AL', value: data.jumlahBahanAl ? `${data.jumlahBahanAl} pallet` : '-' },
                    { label: 'Hasil Kupas CU', value: data.hasilKupasCu ? `${data.hasilKupasCu} kg` : '-' },
                    { label: 'Hasil Kupas AL', value: data.hasilKupasAl ? `${data.hasilKupasAl} kg` : '-' },
                    { label: 'Hasil Potong Hidrolik', value: data.hasilPotongHidrolik ? `${data.hasilPotongHidrolik} kg` : '-' },
                    { label: 'Hasil Hidrolik CU', value: data.hasilHidrolikCu ? `${data.hasilHidrolikCu} kg` : '-' },
                  ])
                }
              />
            )}

            {selectedArea.id === 6 && (
              <Area6KosongkanTromolForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    { label: 'Hasil Scrap CU', value: data.hasilScrapCu ? `${data.hasilScrapCu} kg` : '-' },
                    { label: 'Hasil Scrap AL', value: data.hasilScrapAl ? `${data.hasilScrapAl} kg` : '-' },
                    { label: 'Kabel Bisa Dikupas', value: data.kabelBisaDikupas ? `${data.kabelBisaDikupas} pallet` : '-' },
                    { label: 'Jumlah Tromol', value: `${data.daftarTromol.length} unit drum/tromol` },
                  ])
                }
              />
            )}

            {selectedArea.id === 7 && (
              <Area7KebersihanHallForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    {
                      label: 'Area Sapu Hall',
                      value: `${Object.values(data.sapuHallChecklist).filter(Boolean).length} area selesai`,
                    },
                    { label: 'Cuci Mesin', value: data.cuciMesin ? `${data.cuciMesin} Mesin` : '-' },
                    { label: 'Sawang', value: data.sawang ? `${data.sawang} Mesin` : '-' },
                    { label: 'Bemper', value: data.bemper ? `${data.bemper} Mesin` : '-' },
                    { label: 'Kerapian Tromol', value: data.kerapianTromol ? `${data.kerapianTromol} Mesin` : '-' },
                    { label: 'Kerapian Material', value: data.kerapianMaterial ? `${data.kerapianMaterial} Mesin` : '-' },
                  ])
                }
              />
            )}

            {selectedArea.id === 8 && (
              <Area8KebersihanCvForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    {
                      label: 'Pekerjaan CV-Line Selesai',
                      value: `${Object.values(data.checklistPekerjaan).filter(Boolean).length} dari 13 pekerjaan`,
                    },
                  ])
                }
              />
            )}

            {selectedArea.id === 9 && (
              <Area9SortirKabelForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    { label: 'Tuang Box Besar Kabel', value: `${data.tuangBoxBesarKabel} box` },
                    { label: 'Taung Box Kecil Kabel', value: data.tuangBoxKecilKabel ? `${data.tuangBoxKecilKabel} box` : '-' },
                    { label: 'Taung Box CU', value: `${data.tuangBoxCu} box` },
                    { label: 'Tuang Box AL', value: data.tuangBoxAl ? `${data.tuangBoxAl} box` : '-' },
                    { label: 'Hasil Sortir <10mm', value: `${data.hasilSortirKurang10mm} pallet` },
                    { label: 'Hasil Sortir >10mm', value: `${data.hasilSortirLebih10mm} pallet` },
                    { label: 'Hasil Sampah Kecil (SA)', value: data.hasilSampahKecil ? `${data.hasilSampahKecil} Karung` : '-' },
                  ])
                }
              />
            )}

            {selectedArea.id === 10 && (
              <Area10SortirSampahForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    { label: 'Kabel Bisa Dikupas', value: data.sortiranKabelBisaDikupas ? `${data.sortiranKabelBisaDikupas} palet` : '-' },
                    { label: 'Potongan Pendek (karung PVC)', value: `${data.sortirPotonganPendekKarungPvc} karung pvc` },
                    { label: 'Kabel Pendek Siap Kirim SA', value: data.sortiranKabelPendekSiapKirimSa ? `${data.sortiranKabelPendekSiapKirimSa} karung besar` : '-' },
                    { label: 'Pekerjaan Lainnya', value: data.pekerjaanLainnya || '-' },
                  ])
                }
              />
            )}

            {selectedArea.id === 11 && (
              <Area11PotongKabelForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    { label: 'Box PVC Sortir', value: data.boxPvcSortir ? `${data.boxPvcSortir} box` : '-' },
                    { label: 'Box XLPE Sortir', value: data.boxXlpeSortir ? `${data.boxXlpeSortir} box` : '-' },
                    { label: 'Hasil Potong Kabel LV', value: data.hasilPotongKabelLv ? `${data.hasilPotongKabelLv} pallet` : '-' },
                    { label: 'Hasil Potong Kabel MV', value: data.hasilPotongKabelMv ? `${data.hasilPotongKabelMv} pallet` : '-' },
                    { label: 'Hasil Potong Kabel HV', value: data.hasilPotongKabelHv ? `${data.hasilPotongKabelHv} pallet` : '-' },
                  ])
                }
              />
            )}

            {selectedArea.id === 12 && (
              <Area12ForkliftForm
                area={selectedArea}
                onBack={() => setSelectedArea(null)}
                onSelectArea={setSelectedArea}
                defaultOperator=""
                spreadsheetId={null}
                spreadsheetName={null}
                onOpenSpreadsheetModal={() => {}}
                isSubmitting={isSubmitting}
                onSubmitReport={(data, rows, summary) =>
                  handleOpenReportSubmission(selectedArea, data, rows, summary, [
                    { label: 'Box Karung', value: data.boxKarung ? `${data.boxKarung} box` : '-' },
                    { label: 'Box Steel', value: data.boxSteel ? `${data.boxSteel} box` : '-' },
                    { label: 'Box PVC Spool', value: data.boxPvcSpool ? `${data.boxPvcSpool} box` : '-' },
                    { label: 'Box XLPE Spool', value: data.boxXlpeSpool ? `${data.boxXlpeSpool} box` : '-' },
                    { label: 'Box Kabel', value: data.boxKabel ? `${data.boxKabel} box` : '-' },
                    { label: 'Box CU', value: data.boxCu ? `${data.boxCu} box` : '-' },
                    { label: 'Box AL', value: data.boxAl ? `${data.boxAl} box` : '-' },
                    { label: 'Rajangan PVC', value: data.rajanganPvc ? `${data.rajanganPvc} palet` : '-' },
                    { label: 'Deskripsi Lainnya', value: data.deskripsiPekerjaanLainnya || '-' },
                  ])
                }
              />
            )}
          </div>
        )}
      </main>

      {/* Confirmation Modal before writing data */}
      {pendingSubmission && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          title="Konfirmasi Simpan Laporan"
          areaTitle={pendingSubmission.area.pageTitle}
          summaryItems={pendingSubmission.summaryItems}
          onConfirm={handleConfirmSubmit}
          onCancel={() => {
            setIsConfirmModalOpen(false);
            setPendingSubmission(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
