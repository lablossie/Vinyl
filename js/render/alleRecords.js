// "Alle platen": platte lijst van alle platen in bezit, sorteerbaar.

window.Views = window.Views || {};

Views.alleRecords = async function (container) {
  let sort = 'recent';

  function sortRecords(list) {
    const copy = list.slice();
    if (sort === 'artist') copy.sort((a, b) => (a.artist || '').localeCompare(b.artist || '', 'nl') || (a.title || '').localeCompare(b.title || '', 'nl'));
    else if (sort === 'year') copy.sort((a, b) => (b.year || 0) - (a.year || 0));
    else copy.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    return copy;
  }

  function render() {
    const list = sortRecords(State.all().filter((r) => !r.wishlist));
    const rows = list.map((r) => `
      <div class="album-row" data-id="${r.id}">
        <div class="album-row-cover">${coverHtml(r, { size: 56, radius: 8 })}</div>
        <div class="album-row-info">
          <div class="album-row-title">${escapeHtml(r.title)}</div>
          <div class="album-row-meta">${escapeHtml(r.artist)} ${r.year ? '&middot; ' + r.year : ''}</div>
        </div>
        ${r.favorite ? '<span class="mini-star">&#9733;</span>' : ''}
      </div>`).join('');

    container.innerHTML = `
      <div class="screen-header">
        <h1 class="serif">Alle platen</h1>
        <div class="muted-sm">${list.length} in totaal</div>
      </div>
      <div class="sort-row">
        ${['recent', 'artist', 'year'].map((k) => `<button class="sort-pill ${sort === k ? 'active' : ''}" data-sort="${k}">${{ recent: 'Nieuw', artist: 'Artiest', year: 'Jaar' }[k]}</button>`).join('')}
      </div>
      <div class="album-list" style="padding-bottom:90px;">${rows || '<div class="empty-state"><p>Nog geen platen.</p></div>'}</div>`;

    container.querySelectorAll('[data-sort]').forEach((btn) => {
      btn.addEventListener('click', () => { sort = btn.dataset.sort; render(); });
    });
    container.querySelectorAll('.album-row').forEach((row) => {
      row.addEventListener('click', () => Router.navigate('album/' + row.dataset.id));
    });
  }

  render();
  return () => {};
};
