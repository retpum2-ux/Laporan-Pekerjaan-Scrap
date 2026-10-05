import { getAccessToken } from './auth';

export interface DriveSpreadsheet {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

// Headers definition for each area's sheet tab
export const AREA_HEADERS: Record<number, string[]> = {
  1: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Mesin',
    'Jumlah Tromol Scrap (bobin)',
    'Jumlah Mesin Oven',
    'Kuras Limbah COC (kg)',
    'Hasil Scrap CU (kg)',
    'Hasil Scrap AL (kg)',
  ],
  2: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Pekerjaan',
    'Tipe Cat & Jumlah 1 (liter)',
    'Tipe Cat & Jumlah 2 (liter)',
    'Tipe Cat & Jumlah 3 (liter)',
    'Tiner (liter)',
    'Hasil Pekerjaan',
    'Keterangan',
  ],
  3: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Jenis Pekerjaan',
    'Ukuran Bahan',
    'Hasil Kupas CU (kg)',
    'Keterangan',
  ],
  4: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Jumlah Bahan CU (pallet)',
    'Jumlah Bahan AL (pallet)',
    'Hasil Kupas CU (kg)',
    'Hasil Kupas AL (kg)',
  ],
  5: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Pilihan Mesin',
    'Jumlah Bahan CU (pallet)',
    'Jumlah Bahan AL (pallet)',
    'Hasil Kupas CU (kg)',
    'Hasil Kupas AL (kg)',
    'Hasil Potong Hidrolik (kg)',
    'Hasil Hidrolik CU (kg)',
  ],
  6: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Hasil Scrap CU (kg)',
    'Hasil Scrap AL (kg)',
    'Kabel Bisa Dikupas (pallet)',
    'No Tromol/Drum',
    'Tipe Kabel',
    'Panjang (m)',
    'No PRO (kg)',
    'No Label (kg)',
  ],
  7: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Sapu Hall DT-5 / IS-15',
    'Sapu Hall 1',
    'Sapu Hall 2',
    'Sapu Hall 3',
    'Sapu Hall 4',
    'Sapu Hall 5',
    'Sapu Hall 6',
    'Sapu Hall 7',
    'Sapu Hall 8',
    'Cuci Mesin',
    'Sawang',
    'Bemper',
    'Kerapian Tromol',
    'Kerapian Material',
  ],
  8: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
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
  ],
  9: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Tuang Box Besar Kabel (box)',
    'Taung Box Kecil Kabel (box)',
    'Taung Box CU (box)',
    'Tuang Box AL (box)',
    'Hasil Sortir Bahan <10mm (pallet)',
    'Hasil Sortir Bahan >10mm (pallet)',
    'Hasil Sampah Kecil siap kirim SA (karung)',
  ],
  10: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Sortiran Kabel Bisa Dikupas (palet)',
    'Sortir Potongan Pendek karung pvc',
    'Sortiran Kabel Pendek siap dikirim SA (karung besar)',
    'Pekerjaan Lainnya',
  ],
  11: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Box PVC Sortir (box)',
    'Box XLPE Sortir (box)',
    'Hasil Potong Kabel LV (pallet)',
    'Hasil Potong Kabel MV (pallet)',
    'Hasil Potong Kabel HV (pallet)',
  ],
  12: [
    'Timestamp',
    'Tanggal',
    'Nama Operator',
    'Box Karung (box)',
    'Box Steel (box)',
    'Box PVC Spool (box)',
    'Box XLPE Spool (box)',
    'Box Kabel (box)',
    'Box CU (box)',
    'Box AL (box)',
    'Rajangan PVC (palet)',
    'Deskripsi Pekerjaan Lainnya',
  ],
};

const MASTER_HEADER = [
  'Timestamp',
  'Area No',
  'Nama Area',
  'Tanggal',
  'Nama Operator',
  'Ringkasan Data',
];

// Helper to make authorized Google API request
async function gFetch(url: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Sesi Google kadaluarsa atau belum masuk. Silakan login kembali dengan Google.');
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    let errMsg = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson?.error?.message) {
        errMsg = errJson.error.message;
      }
    } catch {
      // fallback
    }
    throw new Error(errMsg);
  }

  return res.json();
}

/**
 * List existing spreadsheets in user's Google Drive
 */
export async function listUserSpreadsheets(searchQuery?: string): Promise<DriveSpreadsheet[]> {
  let q = "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false";
  if (searchQuery && searchQuery.trim().length > 0) {
    const escaped = searchQuery.replace(/'/g, "\\'");
    q += ` and name contains '${escaped}'`;
  }

  const params = new URLSearchParams({
    q,
    fields: 'files(id, name, modifiedTime, webViewLink)',
    orderBy: 'modifiedTime desc',
    pageSize: '30',
  });

  const data = await gFetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
  return data.files || [];
}

/**
 * Create a new spreadsheet with customized tabs for Scrap reporting
 */
export async function createScrapSpreadsheet(title = 'Laporan Pekerjaan Scrap - Dept. Produksi (PP)'): Promise<{
  id: string;
  name: string;
  url: string;
}> {
  const body = {
    properties: {
      title,
    },
    sheets: [
      {
        properties: {
          title: 'Master Riwayat',
          tabColor: { red: 0.15, green: 0.45, blue: 0.8 },
        },
      },
    ],
  };

  const res = await gFetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const spreadsheetId = res.spreadsheetId;
  const webViewLink = res.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Initialize Master Riwayat header
  await appendValuesToSheet(spreadsheetId, 'Master Riwayat', [MASTER_HEADER], 'RAW');

  return {
    id: spreadsheetId,
    name: title,
    url: webViewLink,
  };
}

/**
 * Fetch spreadsheet metadata to see existing sheet tabs
 */
export async function getSpreadsheetDetails(spreadsheetId: string) {
  return await gFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,spreadsheetUrl,sheets.properties(sheetId,title)`);
}

/**
 * Ensure a specific sheet tab exists; create it and add headers if not existing.
 */
export async function ensureSheetTab(
  spreadsheetId: string,
  sheetName: string,
  headers: string[]
): Promise<void> {
  const details = await getSpreadsheetDetails(spreadsheetId);
  const existingSheets: Array<{ properties: { sheetId: number; title: string } }> = details.sheets || [];
  const exists = existingSheets.some((s) => s.properties.title.toLowerCase() === sheetName.toLowerCase());

  if (!exists) {
    // Add sheet tab
    await gFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
                gridProperties: {
                  frozenRowCount: 1,
                },
              },
            },
          },
        ],
      }),
    });

    // Write header row
    await gFetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        body: JSON.stringify({
          values: [headers],
        }),
      }
    );
  } else {
    // Check if header is already populated
    try {
      const existingValues = await gFetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:Z1`
      );
      if (!existingValues.values || existingValues.values.length === 0) {
        await gFetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1?valueInputOption=USER_ENTERED`,
          {
            method: 'PUT',
            body: JSON.stringify({
              values: [headers],
            }),
          }
        );
      }
    } catch (err) {
      console.warn('Could not verify headers:', err);
    }
  }
}

/**
 * Append rows to a specific sheet tab
 */
export async function appendValuesToSheet(
  spreadsheetId: string,
  sheetName: string,
  rows: (string | number)[][],
  valueInputOption: 'USER_ENTERED' | 'RAW' = 'USER_ENTERED'
) {
  return await gFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:append?valueInputOption=${valueInputOption}`,
    {
      method: 'POST',
      body: JSON.stringify({
        values: rows,
      }),
    }
  );
}

/**
 * Submit form data for an area to Google Sheets:
 * 1. Appends to the specific area tab (e.g. "Scrap Tromol Drawing")
 * 2. Also appends a summary row to the "Master Riwayat" tab for central visibility
 */
export async function submitScrapReportToSheets(
  spreadsheetId: string,
  areaId: number,
  sheetName: string,
  areaTitle: string,
  tgl: string,
  operator: string,
  rowsForAreaTab: (string | number)[][],
  summaryText: string
): Promise<{ success: boolean; spreadsheetUrl: string }> {
  // Ensure the area sheet tab exists with correct headers
  const headers = AREA_HEADERS[areaId] || ['Timestamp', 'Tanggal', 'Nama Operator', 'Detail'];
  await ensureSheetTab(spreadsheetId, sheetName, headers);

  // Append to Area Sheet Tab
  await appendValuesToSheet(spreadsheetId, sheetName, rowsForAreaTab);

  // Ensure and append to Master Riwayat Tab
  try {
    await ensureSheetTab(spreadsheetId, 'Master Riwayat', MASTER_HEADER);
    const timestamp = new Date().toLocaleString('id-ID', { timeZoneName: 'short' });
    await appendValuesToSheet(spreadsheetId, 'Master Riwayat', [
      [timestamp, areaId, areaTitle, tgl, operator, summaryText],
    ]);
  } catch (mErr) {
    console.warn('Master sheet update skipped or failed:', mErr);
  }

  return {
    success: true,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}
