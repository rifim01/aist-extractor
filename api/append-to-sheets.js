const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'Data kosong atau format tidak valid' });
    }

    // Ambil credentials dari env var
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const spreadsheetId   = process.env.REACT_APP_SPREADSHEET_ID;
    const sheetName       = process.env.REACT_APP_SHEET_NAME || 'Pengisian Saldo';

    // Auth dengan service account
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Format data: [[tanggal, sum, account], ...]
    const values = data.map(row => [row.date, row.sum, row.account]);

    // Append ke sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A4`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });

    return res.status(200).json({
      success: true,
      message: `${data.length} baris berhasil ditambahkan ke sheet "${sheetName}"`,
      updatedRange: response.data.updates?.updatedRange,
      updatedRows: response.data.updates?.updatedRows,
    });

  } catch (error) {
    console.error('Sheets API Error:', error.message);
    return res.status(500).json({
      error: 'Gagal menambahkan data ke Google Sheet',
      details: error.message,
    });
  }
};
