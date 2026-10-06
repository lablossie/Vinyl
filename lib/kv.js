// Dunne laag rond Vercel KV, zodat de API-bestanden niet rechtstreeks van het
// pakket afhangen en we een duidelijke Nederlandse foutmelding kunnen geven
// als de database nog niet gekoppeld is.

const { kv } = require('@vercel/kv');

const RECORDS_KEY = 'platenkast:records';

async function getRecords(seedFallback) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error('NO_KV');
  }
  const data = await kv.get(RECORDS_KEY);
  if (data == null) {
    await kv.set(RECORDS_KEY, seedFallback);
    return seedFallback;
  }
  return data;
}

async function setRecords(records) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error('NO_KV');
  }
  await kv.set(RECORDS_KEY, records);
}

module.exports = { getRecords, setRecords };
