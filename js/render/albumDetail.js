// Albumdetailscherm.

window.Views = window.Views || {};

Views.albumDetail = async function (container, id) {
  function render() {
    const r = State.get(id);
    if (!r) {
      Router.navigate('artiesten');
      return;
    }
    const backTarget = r.wishlist ? 'wenslijst' : ('artiest/' + encodeURIComponent(r.artist));

    container.innerHTML = `
      <div class="detail-topbar">
        <button class="back-btn" id="back-btn" aria-label="Terug">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>
      <div class="album-detail-body">
        <div class="album-cover-xl">
          ${coverHtml(r, { size: 'full', radius: 14 })}
          <button class="fav-overlay ${r.favorite ? 'is-fav' : ''}" id="fav-toggle" aria-label="Favoriet">${r.favorite ? '&#9733;' : '&#9734;'}</button>
        </div>

        <div class="eyebrow">${escapeHtml(r.artist)}</div>
        <h1 class="serif album-title">${escapeHtml(r.title)}</h1>

        <div class="stats-row">
          <div class="stat"><div class="stat-val serif">${r.year || '—'}</div><div class="stat-label">Jaar</div></div>
          <div class="stat"><div class="stat-val serif">${escapeHtml(r.format || 'LP')}</div><div class="stat-label">Formaat</div></div>
          <div class="stat"><div class="stat-val serif">${escapeHtml(r.condition || '—')}</div><div class="stat-label">Conditie</div></div>
          <div class="stat"><div class="stat-val serif">${formatEuro(r.value) || '—'}</div><div class="stat-label">Waarde</div></div>
        </div>

        ${r.genre || r.label ? `<div class="tag-row">
          ${r.genre ? `<span class="tag">${escapeHtml(r.genre)}</span>` : ''}
          ${r.label ? `<span class="tag">${escapeHtml(r.label)}</span>` : ''}
        </div>` : ''}

        ${r.description ? `
          <div class="section-label">Over dit album</div>
          <p class="body-text">${escapeHtml(r.description)}</p>` : ''}

        ${r.notes ? `
          <div class="section-label">Opmerkingen</div>
          <p class="body-text">${escapeHtml(r.notes)}</p>` : ''}

        <button class="btn-secondary" id="edit-btn">Bewerken</button>
      </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => Router.navigate(backTarget));
    container.querySelector('#fav-toggle').addEventListener('click', () => State.toggleFavorite(r.id));
    container.querySelector('#edit-btn').addEventListener('click', () => {
      RecordModal.open(r, (result) => {
        if (result.deleted) Router.navigate(backTarget);
      });
    });
  }

  render();
  return () => RecordModal.close();
};
