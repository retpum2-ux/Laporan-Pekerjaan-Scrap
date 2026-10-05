import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from './lib/auth';
import { submitScrapReportToSheets } from './lib/googleDriveSheets';
import { AREA_LIST, AreaDef, SubmissionLog } from './types/scrap';
import { HomeAreaList } from './components/HomeAreaList';
import { SpreadsheetModal } from './components/SpreadsheetModal';
import { SubmissionHistoryModal } from './components/SubmissionHistoryModal';
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

import { CheckCircle2, AlertCircle, ExternalLink, X, FileSpreadsheet, History, LogOut } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaDef | null>(null);

  // Active Google Spreadsheet state
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(() => {
    return localStorage.getItem('scrap_app_sheet_id') || null;
  });
  const [spreadsheetName, setSpreadsheetName] = useState<string | null>(() => {
    return localStorage.getItem('scrap_app_sheet_name') || null;
  });

  // Modals state
  const [isSpreadsheetModalOpen, setIsSpreadsheetModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
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
    linkUrl?: string;
  } | null>(null);

  // Submission logs
  const [logs, setLogs] = useState<SubmissionLog[]>(() => {
    try {
      const saved = localStorage.getItem('scrap_app_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculate submission counts per area
  const submissionCounts = React.useMemo(() => {
    const counts: Record<number, number> = {};
    logs.forEach((log) => {
      counts[log.areaId] = (counts[log.areaId] || 0) + 1;
    });
    return counts;
  }, [logs]);

  // Save logs to localStorage
  useEffect(() => {
    localStorage.setItem('scrap_app_logs', JSON.stringify(logs));
  }, [logs]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
      },
      () => {
        setUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToast({
          type: 'success',
          message: `Berhasil masuk sebagai ${result.user.displayName || result.user.email}`,
        });
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      const msg = err instanceof Error ? err.message : 'Gagal menghubungkan akun Google.';
      setToast({
        type: 'error',
        message: msg,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToast({
      type: 'info',
      message: 'Anda telah keluar dari akun Google.',
    });
  };

  const handleSelectSpreadsheet = (id: string, name: string, _url?: string) => {
    setSpreadsheetId(id);
    setSpreadsheetName(name);
    localStorage.setItem('scrap_app_sheet_id', id);
    localStorage.setItem('scrap_app_sheet_name', name);
    setToast({
      type: 'success',
      message: `Spreadsheet "${name}" berhasil dihubungkan!`,
      linkUrl: `https://docs.google.com/spreadsheets/d/${id}/edit`,
    });
  };

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

    // Check if user is signed in
    if (!user) {
      setIsConfirmModalOpen(false);
      try {
        const authRes = await googleSignIn();
        if (!authRes) return;
        setUser(authRes.user);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Login Google diperlukan untuk menyimpan.';
        setToast({ type: 'error', message: msg });
        return;
      }
    }

    // Check if spreadsheet is chosen; if not, open modal
    let activeSheetId = spreadsheetId;
    if (!activeSheetId) {
      setIsConfirmModalOpen(false);
      setIsSpreadsheetModalOpen(true);
      setToast({
        type: 'info',
        message: 'Silakan pilih atau buat Google Spreadsheet terlebih dahulu.',
      });
      return;
    }

    setIsSubmitting(true);
    const { area, rows, summary } = pendingSubmission;
    const operator = String(rows[0][2] || user?.displayName || 'Operator');
    const dateVal = String(rows[0][1] || new Date().toISOString().split('T')[0]);

    try {
      const res = await submitScrapReportToSheets(
        activeSheetId,
        area.id,
        area.sheetName,
        area.title,
        dateVal,
        operator,
        rows,
        summary
      );

      // Record successful log
      const newLog: SubmissionLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString('id-ID'),
        areaId: area.id,
        areaTitle: area.title,
        sheetName: area.sheetName,
        operator,
        date: dateVal,
        summary,
        spreadsheetId: activeSheetId,
        spreadsheetName: spreadsheetName || 'Spreadsheet Scrap',
        status: 'synced',
      };
      setLogs((prev) => [newLog, ...prev]);

      setIsConfirmModalOpen(false);
      setPendingSubmission(null);
      setToast({
        type: 'success',
        message: `Data ${area.title} berhasil disimpan ke Spreadsheet Google Drive!`,
        linkUrl: res.spreadsheetUrl,
      });

      // Optionally navigate back to home
      setSelectedArea(null);
    } catch (err: unknown) {
      console.error('Submit error:', err);
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan ke Google Spreadsheet.';
      setToast({
        type: 'error',
        message: `Gagal simpan ke Sheets: ${msg}. Silakan coba lagi.`,
      });

      // Record local log with error status
      const newLog: SubmissionLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString('id-ID'),
        areaId: area.id,
        areaTitle: area.title,
        sheetName: area.sheetName,
        operator,
        date: dateVal,
        summary,
        status: 'error',
        errorMessage: msg,
      };
      setLogs((prev) => [newLog, ...prev]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultOperator = user?.displayName || '';

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header removed per user request */}

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                {toast.linkUrl && (
                  <a
                    href={toast.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-xs font-bold underline text-emerald-200 hover:text-white"
                  >
                    <span>Buka Spreadsheet di Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
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
          /* Home Page (Page 1 in PDF) */
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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
                defaultOperator={defaultOperator}
                spreadsheetId={spreadsheetId}
                spreadsheetName={spreadsheetName}
                onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
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

      {/* Discreet bottom bar for Google Spreadsheet connection & sync */}
      <footer className="mt-auto py-3.5 border-t border-slate-200 bg-white/90 backdrop-blur-xs text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Google Drive:</span>
            <button
              type="button"
              onClick={() => setIsSpreadsheetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate max-w-[200px] sm:max-w-[320px]">
                {spreadsheetName || 'Pilih Google Spreadsheet'}
              </span>
            </button>
            {spreadsheetId && (
              <a
                href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-emerald-700 p-1 transition-colors"
                title="Buka Spreadsheet di Drive"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(true)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Riwayat ({logs.length})</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <span className="text-slate-700 font-medium truncate max-w-[120px]">
                  {user.displayName || user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer pl-2 border-l border-slate-200"
              >
                {isLoggingIn ? 'Menghubungkan...' : 'Masuk Google'}
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Spreadsheet Picker / Creator Modal */}
      <SpreadsheetModal
        isOpen={isSpreadsheetModalOpen}
        onClose={() => setIsSpreadsheetModalOpen(false)}
        currentSpreadsheetId={spreadsheetId}
        currentSpreadsheetName={spreadsheetName}
        onSelectSpreadsheet={handleSelectSpreadsheet}
        isAuthenticated={!!user}
        onLoginPrompt={handleLogin}
      />

      {/* Submission History Modal */}
      <SubmissionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
        currentSpreadsheetId={spreadsheetId}
      />

      {/* Workspace Explicit Confirmation Modal before writing data */}
      {pendingSubmission && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          title="Konfirmasi Simpan ke Spreadsheet"
          areaTitle={pendingSubmission.area.pageTitle}
          spreadsheetName={spreadsheetName || 'Spreadsheet Terhubung'}
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
