// Herbruikbare modal om een plaat te bewerken of te verwijderen.

window.Views = window.Views || {};

const RecordModal = (() => {
  let overlay;

  function fieldRow(label, name, value, type) {
    type = type || 'text';
    return `
      <div class="field">
        <label>${escapeHtml(label)}</label>
        <input name="${name}" type="${type}" value="${escapeHtml(value == null ? '' : value)}">
      </div>`;
  }

  function open(record, onDone) {
    close();
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <h2 class="serif" style="margin:0 0 16px;font-size:20px;">Plaat bewerken</h2>
        <form id="modal-form">
          <div class="field-row-2">
            ${fieldRow('Artiest', 'artist', record.artist)}
            ${fieldRow('Albumtitel', 'title', record.title)}
          </div>
          <div class="field-row-2">
            ${fieldRow('Jaar', 'year', record.year, 'number')}
            ${fieldRow('Genre', 'genre', record.genre)}
          </div>
          <div class="field-row-2">
            ${fieldRow('Formaat', 'format', record.format || 'LP')}
            ${fieldRow('Conditie', 'condition', record.condition || 'NM')}
          </div>
          <div class="field-row-2">
            ${fieldRow('Label', 'label', record.label)}
            ${fieldRow('Waarde (€)', 'value', record.value, 'number')}
          </div>
          <div class="field">
            <label>Opmerkingen</label>
            <textarea name="notes" rows="3">${escapeHtml(record.notes)}</textarea>
          </div>
          <label class="checkbox-row">
            <input type="checkbox" name="wishlist" ${record.wishlist ? 'checked' : ''}>
            <span>Op wenslijst (nog niet in bezit)</span>
          </label>
          <div class="modal-actions">
            <button type="button" id="modal-delete" class="btn-ghost-danger">Verwijderen</button>
            <div style="flex:1"></div>
            <button type="button" id="modal-cancel" class="btn-ghost">Annuleren</button>
            <button type="submit" class="btn-primary" style="width:auto;padding:12px 22px;">Opslaan</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('#modal-cancel').addEventListener('click', close);

    overlay.querySelector('#modal-delete').addEventListener('click', async () => {
      if (!confirm(`"${record.title}" verwijderen uit je collectie?`)) return;
      await State.remove(record.id);
      close();
      if (onDone) onDone({ deleted: true });
    });

    overlay.querySelector('#modal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const patch = {
        artist: fd.get('artist').trim(),
        title: fd.get('title').trim(),
        year: fd.get('year') ? Number(fd.get('year')) : null,
        genre: fd.get('genre').trim(),
        format: fd.get('format').trim() || 'LP',
        condition: fd.get('condition').trim() || 'NM',
        label: fd.get('label').trim(),
        value: fd.get('value') ? Number(fd.get('value')) : null,
        notes: fd.get('notes').trim(),
        wishlist: fd.get('wishlist') === 'on'
      };
      await State.update(record.id, patch);
      close();
      showToast('Opgeslagen.');
      if (onDone) onDone({ updated: true });
    });
  }

  function close() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  return { open, close };
})();
