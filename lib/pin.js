// Controleert de pincode die de app in de "x-app-pin" header meestuurt
// tegen de APP_PIN-omgevingsvariabele in Vercel.

function checkPin(req, res) {
  const expected = process.env.APP_PIN;
  if (!expected) {
    res.status(500).json({ error: 'APP_PIN is niet ingesteld op de server. Zet deze in de Vercel-projectinstellingen.' });
    return false;
  }
  const given = req.headers['x-app-pin'];
  if (!given || given !== expected) {
    res.status(401).json({ error: 'Onjuiste of ontbrekende pincode.' });
    return false;
  }
  return true;
}

module.exports = { checkPin };
