(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  let bag = [];
  const countNodes = document.querySelectorAll('.bag-count');
  const bagStatus = document.querySelector('.cart-status');
  const renderBag = () => {
    countNodes.forEach(node => node.textContent = String(bag.length));
    if (bagStatus) bagStatus.textContent = bag.length
      ? bag.length + (bag.length === 1 ? ' piece in your demo bag: ' : ' pieces in your demo bag: ') + bag.join(', ') + '. This is a visual demo; no checkout is connected.'
      : 'Your bag is waiting for its first piece.';
  };
  document.querySelectorAll('[data-add]').forEach(button => {
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    const add = event => {
      event.preventDefault();
      bag.push(button.dataset.add);
      renderBag();
      button.textContent = 'ADDED ✓';
      window.setTimeout(() => { button.textContent = '+ ADD'; }, 1100);
    };
    button.addEventListener('click', add);
    button.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') add(event);
    });
  });
  const clearBag = document.getElementById('clear-bag');
  if (clearBag) clearBag.addEventListener('click', () => { bag = []; renderBag(); });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const productGrid = document.getElementById('collection-grid');
  const sortSelect = document.getElementById('sort-products');
  let currentFilter = 'all';
  const applyCollection = () => {
    if (!productGrid) return;
    const cards = [...productGrid.querySelectorAll('.product-card')];
    cards.forEach(card => { card.hidden = currentFilter !== 'all' && card.dataset.category !== currentFilter; });
    if (sortSelect) {
      const visible = cards.filter(card => !card.hidden);
      visible.sort((a, b) => {
        if (sortSelect.value === 'low') return Number(a.dataset.price) - Number(b.dataset.price);
        if (sortSelect.value === 'high') return Number(b.dataset.price) - Number(a.dataset.price);
        return cards.indexOf(a) - cards.indexOf(b);
      });
      visible.forEach(card => productGrid.appendChild(card));
    }
  };
  filterButtons.forEach(button => button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    applyCollection();
  }));
  if (sortSelect) sortSelect.addEventListener('change', applyCollection);

  document.querySelectorAll('.newsletter-form, .contact-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const message = form.querySelector('.form-message');
      if (!form.reportValidity()) return;
      if (message) {
        message.textContent = form.classList.contains('contact-form')
          ? 'Thanks — your demo message has been checked locally. Nothing was sent or stored.'
          : 'You are on the demo list — no email was sent or saved.';
        message.className = 'form-message success';
      }
      form.reset();
    });
  });
})();