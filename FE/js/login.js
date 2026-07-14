(() => {
  const form = document.getElementById('login-form');
  const identifier = document.getElementById('identifier');
  const password = document.getElementById('password');
  const message = document.getElementById('form-message');
  const toggle = document.getElementById('toggle-password');
  const remember = document.getElementById('remember-me');

  const saved = localStorage.getItem('smartlibrary-identifier');
  if (saved) identifier.value = saved;
  remember.checked = localStorage.getItem('smartlibrary-remember') === 'true';
  toggle.addEventListener('click', () => {
    password.type = password.type === 'password' ? 'text' : 'password';
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    message.textContent = '';
    if (!identifier.value.trim() || !password.value) {
      message.textContent = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      message.style.color = '#dc2626';
      return;
    }
    try {
      // Backend currently authenticates by username, not email.
      const user = await SmartLibraryApi.post('/users/login', { username: identifier.value.trim(), password: password.value });
      SmartLibraryApi.setCurrentUser(user);
      if (remember.checked) {
        localStorage.setItem('smartlibrary-identifier', identifier.value.trim());
        localStorage.setItem('smartlibrary-remember', 'true');
      }
      message.textContent = 'Đăng nhập thành công, đang chuyển trang...';
      message.style.color = '#166534';
      setTimeout(() => {
        const isStaff = user.role && (user.role.name === 'ADMIN' || user.role.name.toUpperCase() === 'LIBRARIAN');
        window.location.href = isStaff ? 'admin.html' : 'profile.html';
      }, 500);
    } catch (error) {
      message.textContent = 'Tài khoản hoặc mật khẩu không chính xác, vui lòng nhập lại.';
      message.style.color = '#dc2626';
    }
  });
})();
