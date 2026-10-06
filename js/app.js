// Opstarten van de app: data laden, navigatie-knoppen koppelen, eerste render.

const App = (() => {
  let started = false;

  async function start() {
    if (started) return;
    started = true;

    document.querySelectorAll('.tabbar [data-nav]').forEach((btn) => {
      btn.addEventListener('click', () => Router.navigate(btn.dataset.nav));
    });

    State.onChange(() => {
      // Her-render het huidige scherm bij elke databewerking, zodat lijsten direct bijwerken.
      Router.render();
    });

    try {
      await State.load();
    } catch (e) {
      if (e.message === 'UNAUTHORIZED') {
        location.reload();
        return;
      }
    }

    if (!location.hash) location.hash = '#/artiesten';
    Router.render();

    registerServiceWorker();
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  return { start };
})();
