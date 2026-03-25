(function () {
  function toList(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function loadProducts() {
    return fetch('data/products.json', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar products.json');
        return response.json();
      })
      .catch(() => window.FALLBACK_PRODUCTS || []);
  }

  function filterProducts(products, query, category) {
    const normalizedQuery = toList(query);
    return products.filter((product) => {
      const matchesQuery = !normalizedQuery
        || toList(product.name).includes(normalizedQuery)
        || toList(product.description).includes(normalizedQuery)
        || toList(product.category).includes(normalizedQuery)
        || toList(product.info).includes(normalizedQuery);
      const matchesCategory = category === 'all' || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }

  function renderFeatured(products) {
    const container = document.getElementById('featuredGrid');
    const template = document.getElementById('product-template');
    if (!container || !template) return;

    container.innerHTML = '';
    const featured = products.slice(0, 3);

    featured.forEach((product) => {
      const clone = template.content.cloneNode(true);
      const card = clone.querySelector('.product-card');
      card.querySelector('.product-badge').textContent = product.badge || 'Destacado';
      const image = card.querySelector('.product-image');
      image.src = product.image;
      image.alt = product.name;
      card.querySelector('.product-category').textContent = product.category;
      card.querySelector('.product-title').textContent = product.name;
      card.querySelector('.product-description').textContent = product.description;
      card.querySelector('.product-info').textContent = product.info || '';
      card.querySelector('.product-price').textContent = window.StoreCart.formatCurrency(product.price);

      const button = card.querySelector('.product-add');
      button.addEventListener('click', () => {
        window.StoreCart.addToCart(product);
        window.showToast(`${product.name} agregado al carrito`);
      });

      container.appendChild(clone);
    });
  }

  function renderCatalog(products) {
    const container = document.getElementById('catalogGrid');
    if (!container) return;

    container.innerHTML = '';
    const visibleProducts = products.length ? products : [];

    if (!visibleProducts.length) {
      container.innerHTML = `
        <div class="cart-empty" style="grid-column:1/-1">
          No se encontraron productos con los filtros actuales.
        </div>
      `;
      return;
    }

    visibleProducts.forEach((product) => {
      const item = document.createElement('store-product');
      item.setAttribute('product-id', product.id);
      item.setAttribute('name', product.name);
      item.setAttribute('price', product.price);
      item.setAttribute('description', product.description);
      item.setAttribute('info', product.info || '');
      item.setAttribute('image', product.image);
      item.setAttribute('badge', product.badge || 'Disponible');
      item.setAttribute('category', product.category);
      container.appendChild(item);
    });
  }

  function populateCategories(products) {
    const select = document.getElementById('categoryFilter');
    if (!select) return;

    const categories = Array.from(new Set(products.map((product) => product.category)));
    const current = select.value || 'all';
    select.innerHTML = '<option value="all">Todas</option>';

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });

    select.value = categories.includes(current) ? current : 'all';
  }

  window.StoreCatalog = {
    loadProducts,
    filterProducts,
    renderFeatured,
    renderCatalog,
    populateCategories
  };
})();
