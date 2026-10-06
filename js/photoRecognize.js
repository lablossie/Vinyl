// Stuurt een hoesfoto naar de server, die Claude vraagt om artiest/album/jaar/genre/label
// te herkennen. Gooit een Error met een Nederlandse melding als het niet lukt.

const PhotoRecognize = (() => {
  async function recognize(base64Image) {
    const res = await fetch('/api/recognize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-app-pin': State.getPin() },
      body: JSON.stringify({ image: base64Image })
    });
    if (res.status === 401) throw new Error('Pincode verlopen, herlaad de app.');
    if (!res.ok) {
      let msg = 'Herkenning via AI is mislukt. Vul de gegevens handmatig in.';
      try { const j = await res.json(); if (j && j.error) msg = j.error; } catch (e) {}
      throw new Error(msg);
    }
    return res.json(); // { artist, title, year, genre, format, label, description, confidence }
  }

  return { recognize };
})();
