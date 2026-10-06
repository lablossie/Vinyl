// Hash-based router. Elke navigatie verandert location.hash, en de browser/PWA
// voegt dat automatisch toe aan de geschiedenis. Zo werkt de Android hardware-
// terugknop (en de terug-gebaar) vanzelf: die stuurt gewoon een "popstate"/
// "hashchange" en we renderen het vorige scherm, in plaats van dat de app sluit.

const Router = (() => {
  const viewEl = document.getElementById('view');
  let currentCleanup = null;

  function parse(hash) {
    const h = (hash || location.hash || '#/artiesten').replace(/^#\/?/, '');
    const [name, ...rest] = h.split('/');
    return { name: name || 'artiesten', param: rest.length ? decodeURIComponent(rest.join('/')) : null };
  }

  function navigate(path) {
    if (location.hash === '#/' + path) {
      render();
    } else {
      location.hash = '#/' + path;
    }
  }

  function back() {
    history.back();
  }

  async function render() {
    if (typeof currentCleanup === 'function') {
      try { currentCleanup(); } catch (e) {}
      currentCleanup = null;
    }
    const { name, param } = parse();
    viewEl.scrollTop = 0;
    updateTabbar(name);

    switch (name) {
      case 'artiest':
        currentCleanup = await Views.artiestDetail(viewEl, param);
        break;
      case 'album':
        currentCleanup = await Views.albumDetail(viewEl, param);
        break;
      case 'alle':
        currentCleanup = await Views.alleRecords(viewEl);
        break;
      case 'wenslijst':
        currentCleanup = await Views.wenslijst(viewEl);
        break;
      case 'toevoegen':
        currentCleanup = await Views.toevoegen(viewEl);
        break;
      case 'artiesten':
      default:
        currentCleanup = await Views.artiestenLijst(viewEl);
        break;
    }
  }

  function updateTabbar(name) {
    const tabbar = document.querySelector('.tabbar');
    if (!tabbar) return;
    const activeMap = { artiesten: 'artiesten', alle: 'alle', wenslijst: 'wenslijst' };
    tabbar.querySelectorAll('[data-nav]').forEach((btn) => {
      btn.classList.toggle('active', activeMap[name] === btn.dataset.nav);
    });
    tabbar.hidden = (name === 'toevoegen');
  }

  window.addEventListener('hashchange', render);

  return { navigate, back, render, parse };
})();
