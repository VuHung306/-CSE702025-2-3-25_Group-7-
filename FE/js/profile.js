// Mock data for the profile page and simple modal editing.

(() => {
  const defaultUser = {
    fullName: 'Nguyễn Văn An',
    studentId: '20240001',
    email: 'an.nguyen@student.edu.vn',
    phone: '0901234567',
    faculty: 'Công nghệ thông tin',
    className: 'KTPM-K16'
  };

  const borrowedBooks = [
    { title: 'Clean Code', borrowDate: '01/07/2026', dueDate: '15/07/2026', status: 'On Time' },
    { title: 'The Hobbit', borrowDate: '28/06/2026', dueDate: '12/07/2026', status: 'Overdue' }
  ];

  const borrowHistory = [
    { title: 'Atomic Habits', borrowDate: '10/06/2026', returnDate: '20/06/2026', status: 'Completed' },
    { title: 'Deep Work', borrowDate: '05/05/2026', returnDate: '12/05/2026', status: 'Completed' }
  ];

  const storedUser = localStorage.getItem('smartlibrary-profile');
  const user = storedUser ? JSON.parse(storedUser) : defaultUser;

  const fullNameEl = document.getElementById('profile-full-name');
  const studentIdEl = document.getElementById('profile-student-id');
  const emailEl = document.getElementById('profile-email');
  const phoneEl = document.getElementById('profile-phone');
  const facultyEl = document.getElementById('profile-faculty');
  const classEl = document.getElementById('profile-class');
  const sidebarNameEl = document.getElementById('sidebar-name');
  const sidebarStudentEl = document.getElementById('sidebar-student');
  const sidebarEmailEl = document.getElementById('sidebar-email');
  const sidebarPhoneEl = document.getElementById('sidebar-phone');
  const borrowedBody = document.getElementById('borrowed-books-body');
  const historyBody = document.getElementById('borrow-history-body');
  const messageEl = document.getElementById('profile-message');
  const editBtn = document.getElementById('edit-profile-btn');
  const modal = document.getElementById('edit-profile-modal');
  const cancelBtn = document.getElementById('modal-cancel');
  const form = document.getElementById('profile-edit-form');
  const errorEl = document.getElementById('profile-form-error');

  const renderProfile = () => {
    sidebarNameEl.textContent = user.fullName;
    fullNameEl.textContent = user.fullName;
    studentIdEl.textContent = user.studentId;
    emailEl.textContent = user.email;
    phoneEl.textContent = user.phone;
    facultyEl.textContent = user.faculty;
    classEl.textContent = user.className;

    sidebarStudentEl.textContent = user.studentId;
    sidebarEmailEl.textContent = user.email;
    sidebarPhoneEl.textContent = user.phone;
  };

  const renderBorrowedBooks = () => {
    borrowedBody.innerHTML = '';

    borrowedBooks.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><div class="book-cover" aria-hidden="true"></div></td>
        <td>${book.title}</td>
        <td>${book.borrowDate}</td>
        <td>${book.dueDate}</td>
        <td><span class="status-badge ${book.status === 'Overdue' ? 'overdue' : 'on-time'}">${book.status}</span></td>
      `;
      borrowedBody.appendChild(row);
    });
  };

  const renderHistory = () => {
    historyBody.innerHTML = '';

    borrowHistory.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.title}</td>
        <td>${item.borrowDate}</td>
        <td>${item.returnDate}</td>
        <td><span class="status-badge completed">${item.status}</span></td>
      `;
      historyBody.appendChild(row);
    });
  };

  const openModal = () => {
    if (!modal) return;
    form.elements.fullName.value = user.fullName;
    form.elements.studentId.value = user.studentId;
    form.elements.email.value = user.email;
    form.elements.phone.value = user.phone;
    form.elements.faculty.value = user.faculty;
    form.elements.className.value = user.className;
    errorEl.textContent = '';
    modal.style.display = 'grid';
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  };

  const validateForm = () => {
    const values = {
      fullName: form.elements.fullName.value.trim(),
      studentId: form.elements.studentId.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      faculty: form.elements.faculty.value.trim(),
      className: form.elements.className.value.trim()
    };

    if (!values.fullName || !values.studentId || !values.email || !values.phone || !values.faculty || !values.className) {
      errorEl.textContent = 'Please fill in all fields.';
      return null;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      return null;
    }

    if (!/^\d{10,11}$/.test(values.phone)) {
      errorEl.textContent = 'Please enter a valid phone number.';
      return null;
    }

    return values;
  };

  const saveProfile = event => {
    event.preventDefault();
    const values = validateForm();

    if (!values) return;

    Object.assign(user, values);
    localStorage.setItem('smartlibrary-profile', JSON.stringify(user));
    renderProfile();
    closeModal();
    messageEl.textContent = 'Profile updated successfully.';
  };

  editBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  form.addEventListener('submit', saveProfile);

  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });

  renderProfile();
  renderBorrowedBooks();
  renderHistory();
})();
