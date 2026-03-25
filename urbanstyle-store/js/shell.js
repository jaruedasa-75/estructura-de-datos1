(function () {
  const fallback = {
    header: `
      <header class="site-header">
        <div class="brand-block">
          <img class="brand-logo brand-logo-sm" src="assets/images/urbanstyle-logo.svg" alt="UrbanStyle" />
          <div>
            <p class="eyebrow">Colección urbana</p>
            <span class="muted">Moda, accesorios y estilo para el día a día.</span>
          </div>
        </div>
        <div class="header-meta">
          <span class="status-pill">Nuevos lanzamientos</span>
          <span class="header-cart-pill">Artículos: <strong data-header-count>0</strong></span>
          <button class="btn btn-secondary" id="logoutButton" type="button">Cerrar sesión</button>
        </div>
      </header>
    `,
    sidebar: `
      <aside class="site-sidebar">
        <div class="sidebar-card">
          <p class="eyebrow">Menú</p>
          <nav class="side-nav">
            <a href="#inicio">Inicio</a>
            <a href="#destacados">Favoritos</a>
            <a href="#catalogo">Colección</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>
        <div class="sidebar-card sidebar-info">
          <p class="eyebrow">Lo mejor de la tienda</p>
          <ul>
            <li>Prendas cómodas para todos los días</li>
            <li>Accesorios fáciles de combinar</li>
            <li>Diseño limpio y moderno</li>
            <li>Carrito visible en todo momento</li>
          </ul>
        </div>
        <div class="sidebar-card promo-card">
          <span class="status-pill">Envío gratis</span>
          <h3>En compras mayores a $250.000</h3>
          <p class="muted">Una experiencia clara para mostrar una tienda atractiva y funcional.</p>
        </div>
      </aside>
    `,
    footer: `
      <footer class="site-footer" id="contacto">
        <div class="footer-brand">
          <div class="brand-block footer-brand-block">
            <img class="brand-logo brand-logo-sm" src="assets/images/urbanstyle-logo.svg" alt="UrbanStyle" />
          </div>
          <p class="footer-copy">Moda urbana con un estilo limpio, pensada para verse bien y navegarse fácil.</p>
        </div>
        <div class="footer-contact-grid">
          <a class="contact-card contact-instagram" href="https://www.instagram.com/urbanstyle.store/" target="_blank" rel="noreferrer">
            <span class="contact-icon">IG</span>
            <div><small>Instagram</small><strong>@urbanstyle.store</strong></div>
          </a>
          <a class="contact-card contact-facebook" href="https://www.facebook.com/urbanstyle.store/" target="_blank" rel="noreferrer">
            <span class="contact-icon">f</span>
            <div><small>Facebook</small><strong>UrbanStyle Store</strong></div>
          </a>
          <a class="contact-card contact-email" href="mailto:hola@urbanstyle.com">
            <span class="contact-icon">@</span>
            <div><small>Correo</small><strong>hola@urbanstyle.com</strong></div>
          </a>
        </div>
        <div class="footer-bottom">
          <p>© <span id="footerYear"></span> UrbanStyle. Todos los derechos reservados.</p>
          <p>Catálogo, compra y contacto en un solo lugar.</p>
        </div>
      </footer>
    `
  };

  async function loadFragment(targetSelector, filePath, fallbackHtml) {
    const target = document.querySelector(targetSelector);
    if (!target) return null;

    try {
      const response = await fetch(filePath, { cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudo cargar el fragmento');
      target.innerHTML = await response.text();
    } catch (error) {
      target.innerHTML = fallbackHtml;
    }

    return target;
  }

  async function loadShell() {
    const [header, sidebar, footer] = await Promise.all([
      loadFragment('#site-header', 'components/header.html', fallback.header),
      loadFragment('#site-sidebar', 'components/sidebar.html', fallback.sidebar),
      loadFragment('#site-footer', 'components/footer.html', fallback.footer)
    ]);

    const year = document.getElementById('footerYear');
    if (year) year.textContent = new Date().getFullYear();

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('urbanstyleAuth');
        sessionStorage.removeItem('urbanstyleUser');
        window.location.replace('login.html');
      });
    }

    document.querySelectorAll('.side-nav a').forEach((link) => {
      link.addEventListener('click', () => {
        document.querySelectorAll('.side-nav a').forEach((item) => item.classList.remove('active'));
        link.classList.add('active');
      });
    });

    return { header, sidebar, footer };
  }

  window.loadShell = loadShell;
})();
