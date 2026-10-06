export default async function handler(req: any, res: any) {
  // Allow CORS if needed
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { areaId, areaTitle, pageTitle, sheetName, tgl, operator, rows, summary } = req.body || {};

    if (!areaId || !operator) {
      return res.status(400).json({ success: false, error: 'Data tidak lengkap (areaId & operator wajib).' });
    }

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let sheetSynced = false;
    let syncMessage = 'Data laporan diterima oleh backend Vercel.';

    if (webhookUrl && webhookUrl.trim().length > 0) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            areaId,
            areaTitle,
            pageTitle,
            sheetName,
            tgl,
            operator,
            rows,
            summary,
            timestamp: new Date().toLocaleString('id-ID', { timeZoneName: 'short' }),
          }),
        });

        if (webhookResponse.ok) {
          sheetSynced = true;
          syncMessage = 'Data laporan berhasil dikirim ke Google Spreadsheet!';
        } else {
          const errText = await webhookResponse.text();
          console.warn('[VERCEL WEBHOOK FAILED]', webhookResponse.status, errText);
          syncMessage = 'Webhook Google Spreadsheet mengembalikan status: ' + webhookResponse.status;
        }
      } catch (webhookErr: any) {
        console.error('[VERCEL WEBHOOK ERROR]', webhookErr);
        syncMessage = 'Tersimpan di server (Webhook Google Spreadsheet tidak dapat dihubungi).';
      }
    }

    return res.status(200).json({
      success: true,
      message: syncMessage,
      synced: sheetSynced,
      receivedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in Vercel handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
