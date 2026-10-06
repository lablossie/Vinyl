// Toevoegscherm: foto maken/kiezen -> AI-herkenning -> controleren -> opslaan.

window.Views = window.Views || {};

Views.toevoegen = async function (container) {
  let photoDataUrl = null;
  let recognized = null;
  let recognizing = false;
  let wishlist = false;

  function render() {
    container.innerHTML = `
      <div class="add-topbar">
        <button class="back-btn" id="back-btn" aria-label="Terug"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
        <h1 class="serif" style="margin:0;font-size:18px;">Plaat toevoegen</h1>
        <div style="width:40px;"></div>
      </div>
      <div class="add-body">

        <input type="file" id="photo-input" accept="image/*" capture="environment" hidden>

        ${photoDataUrl ? `
          <div class="photo-preview-wrap">
            <img src="${photoDataUrl}" class="photo-preview">
            <button class="btn-mini" id="retake-btn">Andere foto</button>
          </div>
          ${recognizing ? `<div class="recognizing-row"><span class="spinner"></span> Hoes wordt herkend…</div>` : ''}
          ${!recognizing && recognized ? `<div class="recognized-row"><span>&#10003;</span><span>Herkend</span></div>` : ''}
          ${!recognizing && recognized === 'failed' ? `<div class="recognized-row recognized-fail"><span>!</span><span>Niet herkend, vul handmatig aan</span></div>` : ''}
        ` : `
          <button class="photo-box" id="photo-box-btn">
            <div class="photo-box-icon">&#128247;</div>
            <div class="photo-box-title">Maak een foto van de hoes</div>
            <div class="photo-box-sub">Claude herkent artiest, album, jaar en label automatisch</div>
          </button>
          <button class="btn-secondary" id="skip-photo-btn" style="margin-top:12px;">Zonder foto doorgaan</button>
        `}

        ${(photoDataUrl || recognized === 'manual') ? renderForm() : ''}
      </div>`;

    bindEvents();
  }

  function renderForm() {
    const r = recognized && recognized !== 'failed' && recognized !== 'manual' ? recognized : {};
    return `
      <div class="section-label" style="margin-top:22px;">Controleer en vul aan</div>
      <form id="record-form">
        <div class="field-row-2">
          <div class="field"><label>Artiest</label><input name="artist" required value="${escapeHtml(r.artist || '')}"></div>
          <div class="field"><label>Albumtitel</label><input name="title" required value="${escapeHtml(r.title || '')}"></div>
        </div>
        <div class="field-row-2">
          <div class="field"><label>Jaar</label><input name="year" type="number" value="${escapeHtml(r.year || '')}"></div>
          <div class="field"><label>Genre</label><input name="genre" value="${escapeHtml(r.genre || '')}"></div>
        </div>
        <div class="field-row-2">
          <div class="field"><label>Formaat</label><input name="format" value="${escapeHtml(r.format || 'LP')}"></div>
          <div class="field"><label>Conditie</label><input name="condition" value="${escapeHtml(r.condition || 'NM')}"></div>
        </div>
        <div class="field">
          <label>Label</label><input name="label" value="${escapeHtml(r.label || '')}">
        </div>
        ${r.description ? `<div class="field"><label>Omschrijving (AI)</label><textarea name="description" rows="2">${escapeHtml(r.description)}</textarea></div>` : ''}
        <label class="checkbox-row">
          <input type="checkbox" name="wishlist" id="wishlist-check" ${wishlist ? 'checked' : ''}>
          <span>Op wenslijst zetten (nog niet in bezit)</span>
        </label>
        <button type="submit" class="btn-primary" style="margin-top:14px;">Toevoegen aan collectie</button>
      </form>`;
  }

  async function handleFile(file) {
    photoDataUrl = await fileToBase64(file);
    recognized = null;
    recognizing = true;
    render();
    try {
      const result = await PhotoRecognize.recognize(photoDataUrl);
      recognized = result && result.artist ? result : 'failed';
    } catch (e) {
      recognized = 'failed';
      showToast(e.message || 'Herkenning mislukt.');
    }
    recognizing = false;
    render();
  }

  function bindEvents() {
    const backBtn = container.querySelector('#back-btn');
    if (backBtn) backBtn.addEventListener('click', () => Router.navigate('artiesten'));

    const photoBoxBtn = container.querySelector('#photo-box-btn');
    const input = container.querySelector('#photo-input');
    if (photoBoxBtn) photoBoxBtn.addEventListener('click', () => input.click());

    const retakeBtn = container.querySelector('#retake-btn');
    if (retakeBtn) retakeBtn.addEventListener('click', () => { photoDataUrl = null; recognized = null; render(); });

    const skipBtn = container.querySelector('#skip-photo-btn');
    if (skipBtn) skipBtn.addEventListener('click', () => { recognized = 'manual'; render(); });

    if (input) input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleFile(file);
    });

    const form = container.querySelector('#record-form');
    if (form) form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const record = {
        artist: fd.get('artist').trim(),
        title: fd.get('title').trim(),
        year: fd.get('year') ? Number(fd.get('year')) : null,
        genre: (fd.get('genre') || '').trim(),
        format: (fd.get('format') || 'LP').trim(),
        condition: (fd.get('condition') || 'NM').trim(),
        label: (fd.get('label') || '').trim(),
        description: (fd.get('description') || '').trim(),
        wishlist: fd.get('wishlist') === 'on',
        cover: photoDataUrl || null
      };
      if (!record.artist || !record.title) return;
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Opslaan…';
      await State.add(record);
      showToast('Toegevoegd aan je collectie.');
      Router.navigate(record.wishlist ? 'wenslijst' : ('artiest/' + encodeURIComponent(record.artist)));
    });
  }

  render();
  return () => {};
};
