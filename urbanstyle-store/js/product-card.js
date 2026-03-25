(function () {
  class StoreProduct extends HTMLElement {
    static get observedAttributes() {
      return ['name', 'price', 'description', 'info', 'image', 'badge', 'category', 'product-id'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      if (this.isConnected) {
        this.render();
      }
    }

    get data() {
      return {
        id: this.getAttribute('product-id') || '',
        name: this.getAttribute('name') || '',
        price: Number(this.getAttribute('price') || 0),
        description: this.getAttribute('description') || '',
        info: this.getAttribute('info') || '',
        image: this.getAttribute('image') || '',
        badge: this.getAttribute('badge') || '',
        category: this.getAttribute('category') || ''
      };
    }

    render() {
      const product = this.data;
      const currency = window.StoreCart ? window.StoreCart.formatCurrency(product.price) : `$${product.price}`;
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; }
          .card {
            overflow: hidden;
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.06);
            box-shadow: 0 18px 40px rgba(2,6,23,0.2);
          }
          .badge {
            position: absolute;
            top: 16px;
            left: 16px;
            z-index: 1;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(2, 6, 23, 0.48);
            color: #fff;
            font-size: 0.8rem;
            backdrop-filter: blur(10px);
          }
          .media { position: relative; }
          img {
            width: 100%;
            aspect-ratio: 4 / 3;
            object-fit: cover;
            display: block;
          }
          .body {
            padding: 18px;
            color: #e5eefc;
            font-family: Inter, system-ui, sans-serif;
          }
          .category {
            margin: 0 0 6px;
            color: #cfd8ee;
            font-size: 0.84rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          h3 { margin: 0 0 8px; font-size: 1.15rem; }
          p {
            margin: 0 0 14px;
            color: #a7b4ce;
            line-height: 1.6;
          }
          .info {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 14px;
            color: #d7def0;
            font-size: 0.9rem;
          }
          .info span {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 10px;
            border-radius: 999px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.1);
          }
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
          }
          .price { font-weight: 800; font-size: 1.05rem; }
          button {
            border: 0;
            padding: 12px 16px;
            border-radius: 999px;
            cursor: pointer;
            color: white;
            background: linear-gradient(135deg, #7c3aed, #4f46e5);
            font-weight: 700;
            transition: transform .2s ease;
          }
          button:hover { transform: translateY(-1px); }
        </style>
        <article class="card">
          <div class="media">
            <span class="badge">${product.badge || 'Disponible'}</span>
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="body">
            <p class="category">${product.category || 'Producto'}</p>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="info">${product.info ? `<span>ℹ ${product.info}</span>` : ''}</div>
            <div class="footer">
              <strong class="price">${currency}</strong>
              <button type="button" part="button">Añadir</button>
            </div>
          </div>
        </article>
      `;

      const button = this.shadowRoot.querySelector('button');
      button.addEventListener('click', () => {
        const detail = { ...product };
        this.dispatchEvent(new CustomEvent('add-to-cart', {
          detail,
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  if (!customElements.get('store-product')) {
    customElements.define('store-product', StoreProduct);
  }
})();
