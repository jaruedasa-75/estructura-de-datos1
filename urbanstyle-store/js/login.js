
(function () {
  function showError(message) {
    const error = document.getElementById('loginError');
    if (error) error.textContent = message;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      const validUser = window.STORE_CONFIG?.demoUser || 'demo@urbanstyle.com';
      const validPassword = window.STORE_CONFIG?.demoPassword || '123456';

      if (username === validUser && password === validPassword) {
        sessionStorage.setItem('urbanstyleAuth', 'true');
        sessionStorage.setItem('urbanstyleUser', username);
        window.location.replace('index.html');
        return;
      }

      showError('Credenciales incorrectas. Verifica el usuario y la contraseña de demostración.');
    });

    [usernameInput, passwordInput].forEach((input) => {
      if (input) input.addEventListener('input', () => showError(''));
    });
  });
})();
