// Hoofdscherm: lijst van artiesten, elk met het aantal albums en een hoes-thumbnail
// (favoriete album als die er is, anders de eerst toegevoegde).

window.Views = window.Views || {};

Views.artiestenLijst = async function (container) {
  let query = '';

  function albumsFor(artist, all) {
    return all.filter((r) => r.artist === artist && !r.wishlist);
  }

  function render() {
    const all = State.all();
    const byArtist = State.byArtist();
    let artists = Array.from(byArtist.keys()).sort((a, b) => a.localeCompare(b, 'nl'));

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      artists = artists.filter((a) => {
        if (a.toLowerCase().includes(q)) return true;
        return byArtist.get(a).some((r) => (r.title || '').toLowerCase().includes(q));
      });
    }

    const rows = artists.map((artist) => {
      const albums = byArtist.get(artist);
      const favCover = albums.find((a) => a.favorite) || albums[0];
      return `
        <button class="artist-row" data-artist="${escapeHtml(artist)}">
          ${coverHtml(favCover, { size: 54, radius: 10 })}
          <div class="artist-row-info">
            <div class="artist-row-name">${escapeHtml(artist)}</div>
            <div class="artist-row-count">${albums.length} album${albums.length === 1 ? '' : 's'}</div>
          </div>
          <span class="chevron">&rsaquo;</span>
        </button>`;
    }).join('');

    container.innerHTML = `
      <div class="screen-header" style="display:flex;align-items:flex-end;justify-content:space-between;">
        <div>
          <div class="eyebrow">Platencollectie</div>
          <h1 class="serif">Platenkast</h1>
        </div>
        <button class="icon-btn" id="settings-btn" aria-label="Instellingen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>
      <div class="search-wrap">
        <input id="artist-search" class="search-input" placeholder="Zoek op artiest of album…" value="${escapeHtml(query)}">
      </div>
      <div class="list-section" style="padding-bottom:90px;">
        <div class="section-label">Artiesten &middot; ${artists.length}</div>
        ${rows || emptyState()}
      </div>`;

    container.querySelector('#artist-search').addEventListener('input', debounce((e) => {
      query = e.target.value;
      render();
      container.querySelector('#artist-search').focus();
      const val = container.querySelector('#artist-search');
      val.value = query;
      val.setSelectionRange(val.value.length, val.value.length);
    }, 180));

    container.querySelectorAll('.artist-row').forEach((btn) => {
      btn.addEventListener('click', () => Router.navigate('artiest/' + encodeURIComponent(btn.dataset.artist)));
    });

    const settingsBtn = container.querySelector('#settings-btn');
    if (settingsBtn) settingsBtn.addEventListener('click', () => SettingsMenu.open());
  }

  function emptyState() {
    return `<div class="empty-state">
      <div class="empty-emoji">&#127925;</div>
      <p>Nog geen platen toegevoegd.</p>
      <button class="btn-primary" style="width:auto;padding:10px 20px;" id="empty-add">Voeg je eerste plaat toe</button>
    </div>`;
  }

  render();

  const addBtn = () => container.querySelector('#empty-add');
  const handler = () => { if (addBtn()) addBtn().addEventListener('click', () => Router.navigate('toevoegen')); };
  handler();

  return () => {};
};
