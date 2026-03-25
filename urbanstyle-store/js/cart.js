
(function () {
  const STORAGE_KEY = 'urbanstyleCart';
  const listeners = [];

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    notify();
  }

  function notify() {
    const cart = readCart();
    listeners.forEach((callback) => {
      try {
        callback(cart);
      } catch (error) {
        console.error('Cart listener error:', error);
      }
    });
  }

  function addListener(callback) {
    listeners.push(callback);
    callback(readCart());
    return function unsubscribe() {
      const index = listeners.indexOf(callback);
      if (index >= 0) listeners.splice(index, 1);
    };
  }

  function addToCart(product, quantity = 1) {
    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        description: product.description,
        quantity
      });
    }

    writeCart(cart);
  }

  function setQuantity(id, quantity) {
    const cart = readCart()
      .map((item) => item.id === id ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0);
    writeCart(cart);
  }

  function removeFromCart(id) {
    writeCart(readCart().filter((item) => item.id !== id));
  }

  function clearCart() {
    writeCart([]);
  }

  function getTotals() {
    const cart = readCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal === 0 ? 0 : (subtotal >= (window.STORE_CONFIG?.freeShippingThreshold || 250000) ? 0 : (window.STORE_CONFIG?.shippingCost || 12900));
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      items: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value || 0);
  }

  function getShippingLabel(subtotal) {
    if (subtotal === 0) return formatCurrency(0);
    return subtotal >= (window.STORE_CONFIG?.freeShippingThreshold || 250000)
      ? 'Gratis'
      : formatCurrency(window.STORE_CONFIG?.shippingCost || 12900);
  }

  window.StoreCart = {
    addListener,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
    getTotals,
    formatCurrency,
    getShippingLabel,
    readCart
  };
})();
