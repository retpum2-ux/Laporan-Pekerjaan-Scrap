export interface AreaDef {
  id: number;
  title: string;
  subTitle?: string;
  pageTitle: string;
  sheetName: string;
  description: string;
  badge?: string;
}

export const AREA_LIST: AreaDef[] = [
  {
    id: 1,
    title: 'Scrap tromol area drawing',
    pageTitle: 'Scrap Tromol Area Drawing Stranding',
    sheetName: 'Scrap Tromol Drawing',
    description: 'Pencatatan scrap tromol bobin, oven, limbah COC, scrap CU & AL',
  },
  {
    id: 2,
    title: 'Pengecatan dan Pengelasan',
    pageTitle: 'Pengecatan dan Pengelasan',
    sheetName: 'Pengecatan & Pengelasan',
    description: 'Cat (liter), tiner, hasil pekerjaan, dan keterangan',
  },
  {
    id: 3,
    title: 'Mesin kupas kabel LV - 1, 2, 3',
    pageTitle: 'Mesin Kupas LV 1/2/3',
    sheetName: 'Mesin Kupas LV',
    description: 'Jenis pekerjaan LV1/LV2/LV3, ukuran bahan, hasil kupas CU',
  },
  {
    id: 4,
    title: 'Mesin kupas kabel MV',
    pageTitle: 'Mesin Kupas MV',
    sheetName: 'Mesin Kupas MV',
    description: 'Bahan CU/AL (pallet) dan hasil kupas CU/AL (kg)',
  },
  {
    id: 5,
    title: 'Mesin kupas kabel HV',
    pageTitle: 'Mesin Kupas HV',
    sheetName: 'Mesin Kupas HV',
    description: 'Mesin HV / Hidrolik, bahan CU/AL, hasil potong & hidrolik CU',
  },
  {
    id: 6,
    title: 'Mengosongkan tromol kabel scrap',
    pageTitle: 'Mengosongkan Tromol Kabel Scrap',
    sheetName: 'Mengosongkan Tromol',
    description: 'Hasil scrap CU/AL, kabel bisa dikupas, detail nomor tromol',
  },
  {
    id: 7,
    title: 'Kebersihan Hall (hall 1-10)',
    pageTitle: 'Kebersihan HALL',
    sheetName: 'Kebersihan Hall',
    description: 'Ceklist sapu Hall 1-8/DT-5, cuci mesin, sawang, bemper, kerapian',
  },
  {
    id: 8,
    title: 'Kebersihan area CV-Line',
    pageTitle: 'Kebersihan CV-LINE',
    sheetName: 'Kebersihan CV-Line',
    description: 'Ceklist 13 pekerjaan pembersihan lantai, bunker, lift, residu, sawang',
  },
  {
    id: 9,
    title: 'Sortir kabel',
    pageTitle: 'Sortir Kabel',
    sheetName: 'Sortir Kabel',
    description: 'Tuang box besar/kecil/CU/AL, hasil sortir bahan & sampah kecil',
  },
  {
    id: 10,
    title: 'Sortir sampah kecil',
    pageTitle: 'Sortir Sampah Kecil',
    sheetName: 'Sortir Sampah Kecil',
    description: 'Kabel bisa dikupas, potongan pendek karung PVC, siap kirim SA',
  },
  {
    id: 11,
    title: 'Scrap box dan pemotongan kabel',
    pageTitle: 'Pemotongan Kabel',
    sheetName: 'Pemotongan Kabel',
    description: 'Box PVC/XLPE sortir dan hasil potong kabel LV, MV, HV',
  },
  {
    id: 12,
    title: 'Driver Forklift Scrap',
    pageTitle: 'Driver Forklift Scrap',
    sheetName: 'Driver Forklift',
    description: 'Pencatatan mobilitas box karung, steel, spool, kabel, CU, AL, rajangan PVC',
  },
];

// Area 1 data
export interface FormArea1Data {
  tgl: string;
  namaOperator: string;
  mesin: 'IU-27' | 'IU-10' | '';
  jumlahTromolScrap: string; // bobin (wajib)
  jumlahMesinOven?: string; // opsional
  kurasLimbahCoc?: string; // opsional kg
  hasilScrapCu?: string; // opsional kg
  hasilScrapAl?: string; // opsional kg
}

// Area 2 data
export interface FormArea2Data {
  tgl: string;
  namaOperator: string;
  pekerjaan: 'Pengecatan' | 'Pengelasan' | '';
  tipeCatDanJumlah1?: string; // opsional liter
  tipeCatDanJumlah2?: string; // opsional liter
  tipeCatDanJumlah3?: string; // opsional liter
  tiner?: string; // opsional liter
  hasilPekerjaan: string;
  keterangan: string;
}

// Area 3 data
export interface FormArea3Data {
  tgl: string;
  namaOperator: string;
  jenisPekerjaan: 'LV1' | 'LV2' | 'LV3' | '';
  ukuranBahan: '>10mm' | '<10mm' | '';
  hasilKupasCu: string; // kg
  keterangan?: string; // opsional kg / catatan
}

// Area 4 data
export interface FormArea4Data {
  tgl: string;
  namaOperator: string;
  jumlahBahanCu?: string; // opsional pallet
  jumlahBahanAl?: string; // opsional pallet
  hasilKupasCu?: string; // opsional kg
  hasilKupasAl?: string; // opsional kg
}

// Area 5 data
export interface FormArea5Data {
  tgl: string;
  namaOperator: string;
  mesin: 'Mesin HV' | 'Mesin Hidrolik' | '';
  // Mesin HV fields
  jumlahBahanCu?: string; // opsional pallet
  jumlahBahanAl?: string; // opsional pallet
  hasilKupasCu?: string; // opsional kg
  hasilKupasAl?: string; // opsional kg
  // Mesin Hidrolik fields
  hasilPotongHidrolik?: string; // opsional kg
  hasilHidrolikCu?: string; // opsional kg
}

// Area 6 data
export interface TromolItem {
  id: string;
  noTromolDrum: string;
  tipeKabel: string;
  panjang: string; // m
  noPro?: string; // opsional kg
  noLabel?: string; // opsional kg
}

export interface FormArea6Data {
  tgl: string;
  namaOperator: string;
  hasilScrapCu?: string; // opsional kg
  hasilScrapAl?: string; // opsional kg
  kabelBisaDikupas?: string; // opsional pallet
  daftarTromol: TromolItem[];
}

// Area 7 data
export interface FormArea7Data {
  tgl: string;
  namaOperator: string;
  sapuHallChecklist: Record<string, boolean>; // e.g. 'Hall DT-5 / IS-15', 'Hall 1'..'Hall 8'
  cuciMesin?: string; // opsional Mesin
  sawang?: string; // opsional Mesin
  bemper?: string; // opsional Mesin
  kerapianTromol?: string; // opsional Mesin
  kerapianMaterial?: string; // opsional Mesin
}

// Area 8 data
export interface FormArea8Data {
  tgl: string;
  namaOperator: string;
  checklistPekerjaan: Record<string, boolean>;
}

// Area 9 data
export interface FormArea9Data {
  tgl: string;
  namaOperator: string;
  tuangBoxBesarKabel: string; // box
  tuangBoxKecilKabel?: string; // opsional box
  tuangBoxCu: string; // box
  tuangBoxAl?: string; // opsional box
  hasilSortirKurang10mm: string; // pallet
  hasilSortirLebih10mm: string; // pallet
  hasilSampahKecil?: string; // opsional Karung (siap kirim SA)
}

// Area 10 data
export interface FormArea10Data {
  tgl: string;
  namaOperator: string;
  sortiranKabelBisaDikupas?: string; // opsional palet
  sortirPotonganPendekKarungPvc: string; // karung pvc
  sortiranKabelPendekSiapKirimSa?: string; // opsional karung besar
  pekerjaanLainnya?: string; // opsional
}

// Area 11 data
export interface FormArea11Data {
  tgl: string;
  namaOperator: string;
  boxPvcSortir?: string; // opsional box
  boxXlpeSortir?: string; // opsional box
  hasilPotongKabelLv?: string; // opsional pallet
  hasilPotongKabelMv?: string; // opsional pallet
  hasilPotongKabelHv?: string; // opsional pallet
}

// Area 12 data
export interface FormArea12Data {
  tgl: string;
  namaOperator: string;
  boxKarung?: string; // opsional box
  boxSteel?: string; // opsional box
  boxPvcSpool?: string; // opsional box
  boxXlpeSpool?: string; // opsional box
  boxKabel?: string; // opsional box
  boxCu?: string; // opsional box
  boxAl?: string; // opsional box
  rajanganPvc?: string; // opsional palet
  deskripsiPekerjaanLainnya?: string; // opsional
}

export interface SubmissionLog {
  id: string;
  timestamp: string;
  areaId: number;
  areaTitle: string;
  sheetName: string;
  operator: string;
  date: string;
  summary: string;
  spreadsheetId?: string;
  spreadsheetName?: string;
  status: 'synced' | 'local_only' | 'error';
  errorMessage?: string;
}
