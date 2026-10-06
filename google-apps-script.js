/**
 * GOOGLE APPS SCRIPT UNTUK MENERIMA LAPORAN PEKERJAAN SCRAP
 * 
 * CARA MEMASANG (HANYA 1 MENIT):
 * 1. Buka Google Spreadsheet Anda di Google Drive.
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus kode default yang ada di editor, lalu salin (copy-paste) seluruh isi kode ini.
 * 4. Klik tombol "Simpan" (ikon disket).
 * 5. Klik tombol biru "Terapkan" (Deploy) di kanan atas > pilih "Penerapan baru" (New deployment).
 * 6. Pada ikon gerigi "Pilih jenis" (Select type) > pilih "Aplikasi Web" (Web app).
 * 7. Isi konfigurasi berikut:
 *    - Deskripsi: Webhook Laporan Scrap
 *    - Jalankan sebagai (Execute as): Saya (email Anda)
 *    - Yang memiliki akses (Who has access): Siapa saja (Anyone) -> PENTING agar backend Vercel bisa mengirim data!
 * 8. Klik "Terapkan" (Deploy) dan berikan izin akses (Authorize access).
 * 9. Salin URL Aplikasi Web (Web App URL) yang muncul (berakhiran /exec).
 * 10. Masukkan URL tersebut ke konfigurasi Environment Variable Vercel / file .env:
 *     GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = data.sheetName || ('Area ' + data.areaId);
    var targetSheet = ss.getSheetByName(sheetName);

    // Jika tab sheet untuk area ini belum ada, buat tab baru otomatis
    if (!targetSheet) {
      targetSheet = ss.insertSheet(sheetName);
    }

    var rows = data.rows || [];

    // Jika sheet masih kosong, buat baris header
    if (targetSheet.getLastRow() === 0 && rows.length > 0) {
      var defaultHeaders = getHeadersForArea(data.areaId);
      targetSheet.appendRow(defaultHeaders);
      targetSheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight("bold").setBackground("#D9E1F2");
    }

    // Tulis baris data
    for (var i = 0; i < rows.length; i++) {
      targetSheet.appendRow(rows[i]);
    }

    // Tambahkan juga ke Master Riwayat jika belum ada
    var masterSheet = ss.getSheetByName("Master Riwayat");
    if (!masterSheet) {
      masterSheet = ss.insertSheet("Master Riwayat", 0);
      masterSheet.appendRow(["Timestamp", "Area No", "Nama Area", "Tanggal", "Nama Operator", "Ringkasan Data"]);
      masterSheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#B4C6E7");
    }
    masterSheet.appendRow([
      data.timestamp || new Date().toLocaleString("id-ID"),
      data.areaId,
      data.areaTitle,
      data.tgl,
      data.operator,
      data.summary
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil dicatat" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getHeadersForArea(areaId) {
  var headers = {
    1: ['Timestamp', 'Tanggal', 'Nama Operator', 'Mesin', 'Jumlah Tromol Scrap (bobin)', 'Jumlah Mesin Oven', 'Kuras Limbah COC (kg)', 'Hasil Scrap CU (kg)', 'Hasil Scrap AL (kg)'],
    2: ['Timestamp', 'Tanggal', 'Nama Operator', 'Pekerjaan', 'Tipe Cat & Jumlah 1 (liter)', 'Tipe Cat & Jumlah 2 (liter)', 'Tipe Cat & Jumlah 3 (liter)', 'Tiner (liter)', 'Hasil Pekerjaan', 'Keterangan'],
    3: ['Timestamp', 'Tanggal', 'Nama Operator', 'Jenis Pekerjaan', 'Ukuran Bahan', 'Hasil Kupas CU (kg)', 'Keterangan'],
    4: ['Timestamp', 'Tanggal', 'Nama Operator', 'Jumlah Bahan CU (pallet)', 'Jumlah Bahan AL (pallet)', 'Hasil Kupas CU (kg)', 'Hasil Kupas AL (kg)'],
    5: ['Timestamp', 'Tanggal', 'Nama Operator', 'Pilihan Mesin', 'Jumlah Bahan CU (pallet)', 'Jumlah Bahan AL (pallet)', 'Hasil Kupas CU (kg)', 'Hasil Kupas AL (kg)', 'Hasil Potong Hidrolik (kg)', 'Hasil Hidrolik CU (kg)'],
    6: ['Timestamp', 'Tanggal', 'Nama Operator', 'Hasil Scrap CU (kg)', 'Hasil Scrap AL (kg)', 'Kabel Bisa Dikupas (pallet)', 'No Tromol/Drum', 'Tipe Kabel', 'Panjang (m)', 'No PRO (kg)', 'No Label (kg)'],
    7: ['Timestamp', 'Tanggal', 'Nama Operator', 'Hall DT-5 / IS-15', 'Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Hall 5', 'Hall 6', 'Hall 7', 'Hall 8', 'Cuci Mesin', 'Sawang', 'Bemper', 'Kerapian Tromol', 'Kerapian Material'],
    8: ['Timestamp', 'Tanggal', 'Nama Operator', 'Sapu lantai 1', 'Sapu lantai 2', 'Sapu lantai 3', 'Sapu banker', 'Pel lantai 1', 'Pel lantai 2', 'Pel lantai 3', 'Membersihkan kaca', 'Membersihkan lift', 'Kuras residu', 'Bemper', 'Membersihkan tube endseal', 'Membersihkan sawang'],
    9: ['Timestamp', 'Tanggal', 'Nama Operator', 'Tuang Box Besar Kabel (box)', 'Taung Box Kecil Kabel (box)', 'Taung Box CU (box)', 'Tuang Box AL (box)', 'Hasil Sortir Bahan <10mm (pallet)', 'Hasil Sortir Bahan >10mm (pallet)', 'Hasil Sampah Kecil siap kirim SA (karung)'],
    10: ['Timestamp', 'Tanggal', 'Nama Operator', 'Sortiran Kabel Bisa Dikupas (palet)', 'Sortir Potongan Pendek karung pvc', 'Sortiran Kabel Pendek siap dikirim SA (karung besar)', 'Pekerjaan Lainnya'],
    11: ['Timestamp', 'Tanggal', 'Nama Operator', 'Box PVC Sortir (box)', 'Box XLPE Sortir (box)', 'Hasil Potong Kabel LV (pallet)', 'Hasil Potong Kabel MV (pallet)', 'Hasil Potong Kabel HV (pallet)'],
    12: ['Timestamp', 'Tanggal', 'Nama Operator', 'Box Karung (box)', 'Box Steel (box)', 'Box PVC Spool (box)', 'Box XLPE Spool (box)', 'Box Kabel (box)', 'Box CU (box)', 'Box AL (box)', 'Rajangan PVC (palet)', 'Deskripsi Pekerjaan Lainnya']
  };
  return headers[areaId] || ['Timestamp', 'Tanggal', 'Nama Operator', 'Detail'];
}
