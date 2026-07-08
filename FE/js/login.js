// Simple form validation and UI behavior for the login page.

(() => {
  const form = document.getElementById('login-form');
  const identifierInput = document.getElementById('identifier');
  const passwordInput = document.getElementById('password');
  const togglePasswordButton = document.getElementById('toggle-password');
  const rememberMeCheckbox = document.getElementById('remember-me');
  const formMessage = document.getElementById('form-message');
  const identifierError = document.getElementById('identifier-error');
  const passwordError = document.getElementById('password-error');

  // Load saved remember-me preference from localStorage.
  const savedIdentifier = localStorage.getItem('smartlibrary-identifier');
  const savedRemember = localStorage.getItem('smartlibrary-remember') === 'true';

  if (savedIdentifier) {
    identifierInput.value = savedIdentifier;
  }

  if (savedRemember) {
    rememberMeCheckbox.checked = true;
  }

  // Toggle password visibility.
  togglePasswordButton.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordButton.textContent = isPassword ? 'Ẩn' : 'Hiện';
  });

  // Validate the form before submission.
  const validateForm = () => {
    let isValid = true;

    identifierError.textContent = '';
    passwordError.textContent = '';
    formMessage.textContent = '';

    if (identifierInput.value.trim() === '') {
      identifierError.textContent = 'Vui lòng nhập mã sinh viên hoặc email.';
      isValid = false;
    }

    if (passwordInput.value.trim() === '') {
      passwordError.textContent = 'Vui lòng nhập mật khẩu.';
      isValid = false;
    }

    return isValid;
  };

  // Handle form submission.
  form.addEventListener('submit', event => {
    event.preventDefault();

    if (!validateForm()) {
      formMessage.textContent = 'Vui lòng điền đầy đủ thông tin.';
      formMessage.style.color = '#dc2626';
      return;
    }

    if (rememberMeCheckbox.checked) {
      localStorage.setItem('smartlibrary-identifier', identifierInput.value.trim());
      localStorage.setItem('smartlibrary-remember', 'true');
    } else {
      localStorage.removeItem('smartlibrary-identifier');
      localStorage.setItem('smartlibrary-remember', 'false');
    }

    formMessage.textContent = 'Đăng nhập thành công!';
    formMessage.style.color = '#166534';
  });
})();
