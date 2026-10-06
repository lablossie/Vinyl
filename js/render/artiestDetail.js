// Artiestscherm: alle albums van 1 artiest, met favoriet-ster per album.

window.Views = window.Views || {};

Views.artiestDetail = async function (container, artistName) {
  function render() {
    const all = State.all().filter((r) => r.artist === artistName && !r.wishlist);
    if (!all.length) {
      Router.navigate('artiesten');
      return;
    }
    const favCount = all.filter((r) => r.favorite).length;
    const favCover = all.find((r) => r.favorite) || all[0];

    const rows = all.map((r) => `
      <div class="album-row" data-id="${r.id}">
        <div class="album-row-cover">${coverHtml(r, { size: 62, radius: 8 })}</div>
        <div class="album-row-info">
          <div class="album-row-title">${escapeHtml(r.title)}</div>
          <div class="album-row-meta">${[r.year, r.format, r.condition].filter(Boolean).join(' · ')}</div>
        </div>
        <button class="star-btn ${r.favorite ? 'is-fav' : ''}" data-fav="${r.id}" aria-label="Favoriet">
          ${r.favorite ? '&#9733;' : '&#9734;'}
        </button>
      </div>`).join('');

    container.innerHTML = `
      <div class="detail-topbar">
        <button class="back-btn" id="back-btn" aria-label="Terug naar artiesten">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>
      <div class="artist-detail-header">
        ${coverHtml(favCover, { size: 64, radius: 12 })}
        <div>
          <h1 class="serif" style="margin:0;font-size:24px;">${escapeHtml(artistName)}</h1>
          <div class="muted-sm">${all.length} album${all.length === 1 ? '' : 's'} &middot; ${favCount} favoriet${favCount === 1 ? '' : 'en'}</div>
        </div>
      </div>
      <div class="album-list" style="padding-bottom:90px;">${rows}</div>`;

    container.querySelector('#back-btn').addEventListener('click', () => Router.navigate('artiesten'));
    container.querySelectorAll('.album-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.star-btn')) return;
        Router.navigate('album/' + row.dataset.id);
      });
    });
    container.querySelectorAll('[data-fav]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await State.toggleFavorite(btn.dataset.fav);
      });
    });
  }

  render();
  return () => {};
};
