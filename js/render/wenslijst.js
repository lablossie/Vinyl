// Wenslijst: platen die je nog wilt hebben, nog niet in bezit.

window.Views = window.Views || {};

Views.wenslijst = async function (container) {
  function render() {
    const list = State.wishlistItems();
    const rows = list.map((r) => `
      <div class="album-row" data-id="${r.id}">
        <div class="album-row-cover">${coverHtml(r, { size: 56, radius: 8 })}</div>
        <div class="album-row-info">
          <div class="album-row-title">${escapeHtml(r.title)}</div>
          <div class="album-row-meta">${escapeHtml(r.artist)} ${r.year ? '&middot; ' + r.year : ''}</div>
        </div>
        <button class="btn-mini" data-own="${r.id}">In bezit</button>
      </div>`).join('');

    container.innerHTML = `
      <div class="screen-header">
        <h1 class="serif">Wenslijst</h1>
        <div class="muted-sm">${list.length} op je lijst</div>
      </div>
      <div class="album-list" style="padding-bottom:90px;">${rows || `
        <div class="empty-state">
          <div class="empty-emoji">&#10022;</div>
          <p>Nog niets op je wenslijst.</p>
        </div>`}</div>`;

    container.querySelectorAll('.album-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-own]')) return;
        Router.navigate('album/' + row.dataset.id);
      });
    });
    container.querySelectorAll('[data-own]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await State.update(btn.dataset.own, { wishlist: false });
        showToast('Verplaatst naar je collectie.');
      });
    });
  }

  render();
  return () => {};
};
