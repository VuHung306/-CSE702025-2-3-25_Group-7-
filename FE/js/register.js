(() => {
  const form = document.getElementById('register-form');
  const message = document.getElementById('form-message');
  const password = document.getElementById('password');
  document.getElementById('toggle-password').addEventListener('click', () => {
    password.type = password.type === 'password' ? 'text' : 'password';
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const fullName = document.getElementById('full-name').value.trim();
    const username = document.getElementById('student-id').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const names = fullName.split(/\s+/);
    if (!fullName || !username || !email || !phone || password.value.length < 8) {
      message.textContent = 'Vui lòng điền đủ thông tin; mật khẩu tối thiểu 8 ký tự.';
      message.style.color = '#dc2626';
      return;
    }
    try {
      await SmartLibraryApi.post('/users/register', {
        username, password: password.value, firstname: names.shift(), lastname: names.join(' '), email, phone, dob: null
      });
      message.textContent = 'Đăng ký thành công. Bạn có thể đăng nhập ngay.';
      message.style.color = '#166534';
      form.reset();
    } catch (error) {
      message.textContent = error.message || 'Không thể đăng ký.';
      message.style.color = '#dc2626';
    }
  });
})();
