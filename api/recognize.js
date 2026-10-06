// POST /api/recognize  { image: "data:image/jpeg;base64,..." }
// Stuurt de hoesfoto naar Claude, die de artiest/albumtitel herkent en de
// vrijgave-gegevens opzoekt via de web-search tool. Geeft gestructureerde JSON terug.

const { checkPin } = require('../lib/pin');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (!checkPin(req, res)) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Methode niet toegestaan.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is niet ingesteld op de server.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const dataUrl = body && body.image;
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return res.status(400).json({ error: 'Geen geldige foto ontvangen.' });
  }

  const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) {
    return res.status(400).json({ error: 'Kon de foto niet verwerken.' });
  }
  const [, mediaType, base64Data] = match;

  const systemPrompt = `Je bent een platenkenner die een foto van een vinyl-hoes krijgt. Herken de artiest en het album, zoek de releasegegevens op als dat helpt, en antwoord UITSLUITEND met geldige JSON (geen markdown, geen uitleg) in dit exacte formaat:
{"artist": string, "title": string, "year": number|null, "genre": string, "format": "LP"|"EP"|"Single", "label": string, "description": string}
"description" is 1-2 zinnen in het Nederlands over het album (sfeer, achtergrond). Als je iets niet zeker weet, laat het veld leeg ("" of null) in plaats van te raden. Als de foto geen platenhoes toont, geef dan {"artist": "", "title": "", "year": null, "genre": "", "format": "LP", "label": "", "description": ""}.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }],
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            { type: 'text', text: 'Welke artiest en welk album is dit? Zoek de releasegegevens op en antwoord met de JSON zoals beschreven.' }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(502).json({ error: 'AI-herkenning is momenteel niet beschikbaar.' });
    }

    const data = await response.json();
    const textBlocks = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text);
    const rawText = textBlocks.join('\n').trim();

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(502).json({ error: 'Kon de hoes niet herkennen. Vul de gegevens handmatig in.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      return res.status(502).json({ error: 'Kon de hoes niet herkennen. Vul de gegevens handmatig in.' });
    }

    if (!parsed.artist && !parsed.title) {
      return res.status(502).json({ error: 'Geen hoes herkend op deze foto. Vul de gegevens handmatig in.' });
    }

    return res.status(200).json({
      artist: parsed.artist || '',
      title: parsed.title || '',
      year: parsed.year || null,
      genre: parsed.genre || '',
      format: parsed.format || 'LP',
      label: parsed.label || '',
      description: parsed.description || ''
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Er ging iets mis bij het herkennen van de hoes.' });
  }
};
