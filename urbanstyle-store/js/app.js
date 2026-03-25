
(function () {
  const state = {
    products: [],
    filtered: [],
    query: '',
    category: 'all'
  };

  function formatCurrency(value) {
    return window.StoreCart.formatCurrency(value);
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  function openModal(title, message) {
    const modal = document.getElementById('checkoutModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    if (!modal || !modalTitle || !modalMessage) return;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  function renderCart(cart) {
    const totals = window.StoreCart.getTotals();
    const desktopItems = document.querySelector('[data-cart-items]');
    const mobileItems = document.querySelector('[data-mobile-cart-items]');
    const desktopSubtotal = document.querySelector('[data-cart-subtotal]');
    const desktopShipping = document.querySelector('[data-cart-shipping]');
    const desktopTotal = document.querySelector('[data-cart-total]');
    const mobileSubtotal = document.querySelector('[data-mobile-cart-subtotal]');
    const mobileShipping = document.querySelector('[data-mobile-cart-shipping]');
    const mobileTotal = document.querySelector('[data-mobile-cart-total]');
    const headerCount = document.querySelector('[data-header-count]');
    const cartCount = document.querySelector('[data-cart-count]');

    const emptyHtml = `
      <div class="cart-empty">
        Tu carrito está vacío. Agrega productos desde el catálogo para ver el total.
      </div>
    `;

    function buildCartMarkup() {
      if (!cart.length) return emptyHtml;

      return cart.map((item) => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <div class="cart-item-top">
              <div>
                <h4>${item.name}</h4>
                <p>${formatCurrency(item.price)}</p>
              </div>
              <button class="remove-btn" type="button" data-remove="${item.id}" aria-label="Eliminar ${item.name}">×</button>
            </div>
            <div class="cart-item-actions">
              <button class="quantity-btn" type="button" data-decrease="${item.id}" aria-label="Disminuir">−</button>
              <strong>${item.quantity}</strong>
              <button class="quantity-btn" type="button" data-increase="${item.id}" aria-label="Aumentar">+</button>
              <span style="margin-left:auto">${formatCurrency(item.price * item.quantity)}</span>
            </div>
          </div>
        </article>
      `).join('');
    }

    if (desktopItems) desktopItems.innerHTML = buildCartMarkup();
    if (mobileItems) mobileItems.innerHTML = buildCartMarkup();

    if (desktopSubtotal) desktopSubtotal.textContent = formatCurrency(totals.subtotal);
    if (desktopShipping) desktopShipping.textContent = window.StoreCart.getShippingLabel(totals.subtotal);
    if (desktopTotal) desktopTotal.textContent = formatCurrency(totals.total);

    if (mobileSubtotal) mobileSubtotal.textContent = formatCurrency(totals.subtotal);
    if (mobileShipping) mobileShipping.textContent = window.StoreCart.getShippingLabel(totals.subtotal);
    if (mobileTotal) mobileTotal.textContent = formatCurrency(totals.total);

    if (headerCount) headerCount.textContent = String(totals.items);
    if (cartCount) cartCount.textContent = String(totals.items);

    attachCartControls();
  }

  function attachCartControls() {
    document.querySelectorAll('[data-increase]').forEach((btn) => {
      btn.onclick = () => {
        const cart = window.StoreCart.readCart();
        const item = cart.find((entry) => entry.id === btn.dataset.increase);
        if (item) window.StoreCart.setQuantity(item.id, item.quantity + 1);
      };
    });

    document.querySelectorAll('[data-decrease]').forEach((btn) => {
      btn.onclick = () => {
        const cart = window.StoreCart.readCart();
        const item = cart.find((entry) => entry.id === btn.dataset.decrease);
        if (item) window.StoreCart.setQuantity(item.id, item.quantity - 1);
      };
    });

    document.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.onclick = () => window.StoreCart.removeFromCart(btn.dataset.remove);
    });
  }

  function renderFilteredCatalog() {
    state.filtered = window.StoreCatalog.filterProducts(state.products, state.query, state.category);
    window.StoreCatalog.renderFeatured(state.filtered.length ? state.filtered : state.products);
    window.StoreCatalog.renderCatalog(state.filtered);
  }

  function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        state.query = event.target.value;
        renderFilteredCatalog();
      });
    }

    if (categoryFilter) {
      categoryFilter.addEventListener('change', (event) => {
        state.category = event.target.value;
        renderFilteredCatalog();
      });
    }
  }

  function setupCheckout() {
    const checkoutForm = document.getElementById('checkoutForm');
    const modal = document.getElementById('checkoutModal');
    const closeButton = document.getElementById('closeModal');
    const modalButton = document.getElementById('modalButton');

    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const cart = window.StoreCart.readCart();
        const totals = window.StoreCart.getTotals();

        if (!cart.length) {
          showToast('Agrega productos al carrito antes de comprar');
          return;
        }

        const name = document.getElementById('buyerName')?.value.trim();
        const email = document.getElementById('buyerEmail')?.value.trim();
        const address = document.getElementById('buyerAddress')?.value.trim();

        if (!name || !email || !address) {
          showToast('Completa nombre, correo y dirección');
          return;
        }

        const orderNumber = 'US-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        openModal(
          '¡Pedido confirmado!',
          `${name}, tu compra por ${formatCurrency(totals.total)} fue registrada con éxito. Número de pedido: ${orderNumber}.`
        );

        checkoutForm.reset();
        window.StoreCart.clearCart();
      });
    }

    [closeButton, modal, modalButton].forEach((element) => {
      if (!element) return;
    });

    if (closeButton) closeButton.addEventListener('click', closeModal);
    if (modalButton) modalButton.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
      });
    }
  }

  function setupProductEvents() {
    document.addEventListener('add-to-cart', (event) => {
      window.StoreCart.addToCart(event.detail);
      showToast(`${event.detail.name} agregado al carrito`);
    });
  }

  async function init() {
    await window.loadShell();

    const products = await window.StoreCatalog.loadProducts();
    state.products = products;
    window.StoreCatalog.populateCategories(products);
    renderFilteredCatalog();

    setupFilters();
    setupProductEvents();
    setupCheckout();

    window.StoreCart.addListener(renderCart);
    renderCart(window.StoreCart.readCart());

    const urlHash = window.location.hash;
    if (urlHash) {
      const target = document.querySelector(urlHash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  window.showToast = showToast;
  window.openModal = openModal;
  window.closeModal = closeModal;
  document.addEventListener('DOMContentLoaded', init);
})();
