// Simple form validation and password toggle behavior for the register page.

(() => {
  const form = document.getElementById('register-form');
  const fullNameInput = document.getElementById('full-name');
  const studentIdInput = document.getElementById('student-id');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const togglePasswordButton = document.getElementById('toggle-password');
  const toggleConfirmPasswordButton = document.getElementById('toggle-confirm-password');
  const formMessage = document.getElementById('form-message');

  const fullNameError = document.getElementById('full-name-error');
  const studentIdError = document.getElementById('student-id-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirm-password-error');

  // Toggle the password field visibility.
  togglePasswordButton.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordButton.textContent = isPassword ? 'Ẩn' : 'Hiện';
  });

  // Toggle the confirm password field visibility.
  toggleConfirmPasswordButton.addEventListener('click', () => {
    const isPassword = confirmPasswordInput.type === 'password';
    confirmPasswordInput.type = isPassword ? 'text' : 'password';
    toggleConfirmPasswordButton.textContent = isPassword ? 'Ẩn' : 'Hiện';
  });

  // Validate the form before submission.
  const validateForm = () => {
    let isValid = true;

    fullNameError.textContent = '';
    studentIdError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    formMessage.textContent = '';

    if (fullNameInput.value.trim() === '') {
      fullNameError.textContent = 'Vui lòng nhập họ và tên.';
      isValid = false;
    }

    if (studentIdInput.value.trim() === '') {
      studentIdError.textContent = 'Vui lòng nhập mã sinh viên.';
      isValid = false;
    } else if (!/^\d+$/.test(studentIdInput.value.trim())) {
      studentIdError.textContent = 'Mã sinh viên chỉ được chứa số.';
      isValid = false;
    }

    if (emailInput.value.trim() === '') {
      emailError.textContent = 'Vui lòng nhập email.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      emailError.textContent = 'Email không hợp lệ.';
      isValid = false;
    }

    if (phoneInput.value.trim() === '') {
      phoneError.textContent = 'Vui lòng nhập số điện thoại.';
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneInput.value.trim())) {
      phoneError.textContent = 'Số điện thoại phải có 10 chữ số.';
      isValid = false;
    }

    if (passwordInput.value === '') {
      passwordError.textContent = 'Vui lòng nhập mật khẩu.';
      isValid = false;
    } else if (passwordInput.value.length < 8) {
      passwordError.textContent = 'Mật khẩu phải có ít nhất 8 ký tự.';
      isValid = false;
    }

    if (confirmPasswordInput.value === '') {
      confirmPasswordError.textContent = 'Vui lòng xác nhận mật khẩu.';
      isValid = false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
      confirmPasswordError.textContent = 'Mật khẩu xác nhận không khớp.';
      isValid = false;
    }

    return isValid;
  };

  // Handle form submit.
  form.addEventListener('submit', event => {
    event.preventDefault();

    if (!validateForm()) {
      formMessage.textContent = 'Vui lòng sửa các lỗi bên trên.';
      formMessage.style.color = '#dc2626';
      return;
    }

    formMessage.textContent = 'Đăng ký thành công!';
    formMessage.style.color = '#166534';
    form.reset();
  });
})();
