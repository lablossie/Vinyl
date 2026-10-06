// Klein instellingenmenu: uitloggen en terug naar de voorbeeldcollectie.

const SettingsMenu = (() => {
  let overlay;

  function open() {
    close();
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <h2 class="serif" style="margin:0 0 16px;font-size:20px;">Instellingen</h2>
        <button class="btn-secondary" id="settings-reset" style="margin-bottom:10px;">Terug naar voorbeeldcollectie</button>
        <button class="btn-secondary" id="settings-logout" style="margin-bottom:10px;">Uitloggen</button>
        <button class="btn-ghost" id="settings-close">Sluiten</button>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('#settings-close').addEventListener('click', close);

    overlay.querySelector('#settings-reset').addEventListener('click', async () => {
      if (!confirm('Dit vervangt je hele collectie door de voorbeeldcollectie. Doorgaan?')) return;
      await State.resetToSeed();
      close();
      showToast('Voorbeeldcollectie herstelt.');
    });

    overlay.querySelector('#settings-logout').addEventListener('click', () => {
      State.clearPin();
      location.reload();
    });
  }

  function close() {
    if (overlay) { overlay.remove(); overlay = null; }
  }

  return { open, close };
})();
