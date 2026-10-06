// Centrale state: lijst van platen + wat lokale UI-state.
// Wordt gesynchroniseerd met de gedeelde database via /api/inventory.

const State = (() => {
  let records = [];      // elke plaat: { id, artist, title, year, genre, format, condition, label, value, notes, description, cover, favorite, wishlist, addedAt }
  let loaded = false;
  let listeners = [];

  function getPin() {
    return sessionStorage.getItem('platenkast_pin') || '';
  }

  function setPin(pin) {
    sessionStorage.setItem('platenkast_pin', pin);
  }

  function clearPin() {
    sessionStorage.removeItem('platenkast_pin');
  }

  async function apiFetch(path, opts = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json', 'x-app-pin': getPin() }, opts.headers || {});
    const res = await fetch(path, Object.assign({ cache: 'no-store' }, opts, { headers }));
    if (res.status === 401) {
      clearPin();
      throw new Error('UNAUTHORIZED');
    }
    if (!res.ok) {
      let msg = 'Er ging iets mis.';
      try { const j = await res.json(); if (j && j.error) msg = j.error; } catch (e) {}
      throw new Error(msg);
    }
    return res.json();
  }

  async function load() {
    try {
      const data = await apiFetch('/api/inventory');
      records = Array.isArray(data.records) ? data.records : [];
      loaded = true;
    } catch (e) {
      if (e.message === 'UNAUTHORIZED') throw e;
      // Netwerk/serverprobleem: val terug op lokale kopie zodat de app niet leeg blijft.
      const cached = localStorage.getItem('platenkast_cache');
      records = cached ? JSON.parse(cached) : [];
      loaded = true;
      showToast('Kon niet verbinden met de server, lokale kopie geladen.');
    }
    cacheLocally();
    notify();
  }

  function cacheLocally() {
    try { localStorage.setItem('platenkast_cache', JSON.stringify(records)); } catch (e) {}
  }

  async function persist() {
    cacheLocally();
    try {
      await apiFetch('/api/inventory', { method: 'POST', body: JSON.stringify({ records }) });
    } catch (e) {
      showToast('Opslaan op de server mislukt, wijziging staat lokaal klaar.');
    }
  }

  function notify() {
    listeners.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function all() {
    return records.slice();
  }

  function get(id) {
    return records.find((r) => r.id === id);
  }

  function byArtist() {
    const map = new Map();
    for (const r of records) {
      if (r.wishlist) continue;
      const key = r.artist || 'Onbekend';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return map;
  }

  function wishlistItems() {
    return records.filter((r) => r.wishlist);
  }

  async function add(record) {
    const r = Object.assign({
      id: uid('rec'),
      favorite: false,
      wishlist: false,
      addedAt: new Date().toISOString()
    }, record);
    records.unshift(r);
    notify();
    await persist();
    return r;
  }

  async function update(id, patch) {
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return;
    records[idx] = Object.assign({}, records[idx], patch);
    notify();
    await persist();
  }

  async function remove(id) {
    records = records.filter((r) => r.id !== id);
    notify();
    await persist();
  }

  async function toggleFavorite(id) {
    const r = get(id);
    if (!r) return;
    await update(id, { favorite: !r.favorite });
  }

  async function resetToSeed() {
    records = (window.SEED_RECORDS || []).map((r) => Object.assign({}, r));
    notify();
    await persist();
  }

  return {
    load, all, get, byArtist, wishlistItems,
    add, update, remove, toggleFavorite, resetToSeed,
    onChange, getPin, setPin, clearPin, apiFetch,
    isLoaded: () => loaded
  };
})();
