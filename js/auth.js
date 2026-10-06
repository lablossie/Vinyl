// PIN-scherm: controleert de pincode via de server (zelfde pincode geldt voor iedereen
// die toegang heeft tot de app, net als bij de Wijnkelder).

(function () {
  const authScreen = document.getElementById('auth-screen');
  const appShell = document.getElementById('app');
  const form = document.getElementById('auth-form');
  const input = document.getElementById('pin-input');
  const submitBtn = document.getElementById('auth-submit');
  const errorEl = document.getElementById('auth-error');

  async function tryUnlock(pin) {
    State.setPin(pin);
    try {
      await State.apiFetch('/api/inventory');
      return true;
    } catch (e) {
      State.clearPin();
      return false;
    }
  }

  async function boot() {
    const existing = State.getPin();
    if (existing) {
      const ok = await tryUnlock(existing);
      if (ok) return enterApp();
    }
    authScreen.hidden = false;
  }

  function enterApp() {
    authScreen.hidden = true;
    appShell.hidden = false;
    App.start();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pin = input.value.trim();
    if (!pin) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Controleren…';
    errorEl.hidden = true;

    const ok = await tryUnlock(pin);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Ontgrendelen';

    if (ok) {
      enterApp();
    } else {
      errorEl.hidden = false;
      input.value = '';
      input.focus();
    }
  });

  boot();
})();
