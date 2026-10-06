import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// API route: Submit report to Google Spreadsheet via backend
app.post('/api/submit-report', async (req, res) => {
  try {
    const { areaId, areaTitle, pageTitle, sheetName, tgl, operator, rows, summary } = req.body;

    if (!areaId || !operator) {
      return res.status(400).json({ success: false, error: 'Data tidak lengkap (areaId & operator wajib diisi).' });
    }

    console.log(`[BACKEND REPORT] Area ${areaId}: ${areaTitle} | Operator: ${operator} | Tgl: ${tgl}`);

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let sheetSynced = false;
    let syncMessage = 'Data laporan berhasil disimpan di backend server.';

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
          syncMessage = 'Data laporan berhasil dikirim dan tersimpan di Google Spreadsheet!';
        } else {
          const errText = await webhookResponse.text();
          console.warn('[GOOGLE SHEET WEBHOOK FAILED]', webhookResponse.status, errText);
          syncMessage = 'Tersimpan di server, webhook Google Spreadsheet merespons: ' + webhookResponse.status;
        }
      } catch (webhookErr) {
        console.error('[GOOGLE SHEET WEBHOOK ERROR]', webhookErr);
        syncMessage = 'Tersimpan di server (Webhook Google Spreadsheet tidak dapat dijangkau).';
      }
    } else {
      console.log('[INFO] GOOGLE_SHEET_WEBHOOK_URL belum disetel di .env / environment variables. Data tersimpan di server.');
    }

    return res.json({
      success: true,
      message: syncMessage,
      synced: sheetSynced,
      receivedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/submit-report:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Terjadi kesalahan pada server saat memproses laporan.',
    });
  }
});

// API route: Health check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasWebhook: Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL),
    timestamp: new Date().toISOString(),
  });
});

// Dev server or static files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Backend server ready at http://0.0.0.0:${port}`);
  });
}

startServer();
