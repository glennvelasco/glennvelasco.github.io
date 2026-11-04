/* Reveal the full Mansion Tax table when following a price-bracket link. */
(function () {
  var panel = document.getElementById('cost-panel-3');
  if (!panel) return;
  function reveal() {
    panel.open = true;
    panel.querySelector('summary').focus({ preventScroll: true });
    panel.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  document.querySelectorAll('.cost-brackets-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (location.hash !== '#cost-panel-3') history.pushState(null, '', '#cost-panel-3');
      reveal();
    });
  });
  function fromHash() {
    if (location.hash === '#cost-panel-3') reveal();
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
