// GET  /api/inventory  -> huidige collectie
// POST /api/inventory  -> hele collectie opslaan ({ records: [...] })
// Beveiligd met de gedeelde pincode (x-app-pin header).

const { checkPin } = require('../lib/pin');
const { getRecords, setRecords } = require('../lib/kv');
const SEED_RECORDS = require('../js/data/seedRecords');

module.exports = async function handler(req, res) {
  // Nooit cachen: dit endpoint controleert de pincode en geeft persoonlijke
  // data terug, dus elk verzoek moet echt de server bereiken.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (!checkPin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const records = await getRecords(SEED_RECORDS);
      return res.status(200).json({ records });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || !Array.isArray(body.records)) {
        return res.status(400).json({ error: 'Verwacht een lijst van platen onder "records".' });
      }
      await setRecords(body.records);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Methode niet toegestaan.' });
  } catch (e) {
    if (e.message === 'NO_KV') {
      return res.status(500).json({ error: 'Er is nog geen database gekoppeld. Maak in Vercel een KV-database aan en koppel die aan dit project (zie README).' });
    }
    console.error(e);
    return res.status(500).json({ error: 'Er ging iets mis bij het ophalen/opslaan van je collectie.' });
  }
};
