// Mock data and interactive behavior for the admin dashboard.

(() => {
  const borrowRecords = [
    { studentName: 'Nguyễn Văn An', studentId: '20240001', title: 'Clean Code', borrowDate: '01/07/2026', dueDate: '15/07/2026', status: 'Active' },
    { studentName: 'Trần Thị B', studentId: '20240002', title: 'The Hobbit', borrowDate: '28/06/2026', dueDate: '12/07/2026', status: 'Overdue' },
    { studentName: 'Lê Văn C', studentId: '20240003', title: 'Atomic Habits', borrowDate: '10/06/2026', dueDate: '20/06/2026', status: 'Returned' }
  ];

  const books = [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', quantity: 5, status: 'Available' },
    { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', quantity: 2, status: 'Borrowed' },
    { id: 3, title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', quantity: 7, status: 'Available' }
  ];

  const users = [
    { id: 1, studentId: '20240001', name: 'Nguyễn Văn An', email: 'an@student.edu.vn', phone: '0901234567', status: 'Active' },
    { id: 2, studentId: '20240002', name: 'Trần Thị B', email: 'b@student.edu.vn', phone: '0912345678', status: 'Active' },
    { id: 3, studentId: '20240003', name: 'Lê Văn C', email: 'c@student.edu.vn', phone: '0923456789', status: 'Inactive' }
  ];

  const state = {
    borrowRecords: [...borrowRecords],
    books: [...books],
    users: [...users],
    selectedItem: null,
    selectedType: null
  };

  const borrowRecordsBody = document.getElementById('borrow-records-body');
  const booksBody = document.getElementById('books-body');
  const usersBody = document.getElementById('users-body');
  const bookSearch = document.getElementById('book-search');
  const userSearch = document.getElementById('user-search');
  const filterSelect = document.getElementById('borrow-status-filter');
  const modal = document.getElementById('delete-modal');
  const modalMessage = document.getElementById('delete-modal-message');
  const cancelDelete = document.getElementById('cancel-delete');
  const confirmDelete = document.getElementById('confirm-delete');
  const toast = document.getElementById('toast');

  const booksSection = document.getElementById('books-section');
  const addBookButton = document.createElement('button');
  addBookButton.className = 'add-book-btn';
  addBookButton.type = 'button';
  addBookButton.textContent = '+ Thêm sách';
  booksSection.querySelector('.section-heading').appendChild(addBookButton);

  const addBookModal = document.createElement('div');
  addBookModal.className = 'modal-backdrop';
  addBookModal.id = 'add-book-modal';
  addBookModal.style.display = 'none';
  addBookModal.setAttribute('aria-hidden', 'true');
  addBookModal.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="add-book-title">
      <h3 id="add-book-title">Thêm sách mới</h3>
      <form id="add-book-form" class="book-form">
        <label>Tên sách<input name="title" type="text" required /></label>
        <label>Tác giả<input name="author" type="text" required /></label>
        <label>Thể loại<input name="category" type="text" required /></label>
        <label>Số lượng<input name="quantity" type="number" min="1" step="1" required /></label>
        <p class="form-error" id="add-book-error" aria-live="polite"></p>
        <div class="modal-actions">
          <button class="modal-cancel-btn" id="cancel-add-book" type="button">Hủy</button>
          <button class="modal-submit-btn" type="submit">Lưu sách</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(addBookModal);

  const addBookForm = document.getElementById('add-book-form');
  const cancelAddBook = document.getElementById('cancel-add-book');
  const addBookError = document.getElementById('add-book-error');

  const closeAddBookModal = () => {
    addBookModal.style.display = 'none';
    addBookModal.setAttribute('aria-hidden', 'true');
  };

  const showToast = message => {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  };

  const statusLabels = {
    Active: 'Đang hoạt động',
    Available: 'Có sẵn',
    Borrowed: 'Đang mượn',
    Overdue: 'Quá hạn',
    Returned: 'Đã trả',
    Inactive: 'Không hoạt động'
  };

  const updateStats = () => {
    document.getElementById('total-books').textContent = state.books.length;
    document.getElementById('available-books').textContent = state.books.filter(book => book.status === 'Available').length;
    document.getElementById('borrowed-books').textContent = state.books.filter(book => book.status === 'Borrowed').length;
    document.getElementById('total-users').textContent = state.users.length;
    document.getElementById('active-borrows').textContent = state.borrowRecords.filter(record => record.status === 'Active' || record.status === 'Overdue').length;

    const mostBorrowedBook = state.books[0] ? state.books[0].title : 'Không có';
    document.getElementById('most-borrowed').textContent = mostBorrowedBook;
    document.getElementById('active-users').textContent = state.users.filter(user => user.status === 'Active').length;
    document.getElementById('overdue-books').textContent = state.borrowRecords.filter(record => record.status === 'Overdue').length;
    document.getElementById('books-added-month').textContent = '3';
  };

  const renderBorrowRecords = () => {
    const search = filterSelect.value;
    const filtered = state.borrowRecords.filter(record => search === 'all' || record.status === search);

    borrowRecordsBody.innerHTML = '';
    filtered.forEach(record => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.studentName}</td>
        <td>${record.studentId}</td>
        <td>${record.title}</td>
        <td>${record.borrowDate}</td>
        <td>${record.dueDate}</td>
        <td><span class="badge ${record.status === 'Overdue' ? 'overdue' : record.status === 'Returned' ? 'returned' : 'active'}">${statusLabels[record.status]}</span></td>
      `;
      borrowRecordsBody.appendChild(row);
    });
  };

  const renderBooks = () => {
    const query = bookSearch.value.trim().toLowerCase();
    const filtered = state.books.filter(book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query));

    booksBody.innerHTML = '';
    filtered.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><div class="book-cover" aria-hidden="true"></div></td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.category}</td>
        <td>${book.quantity}</td>
        <td><span class="badge ${book.status === 'Available' ? 'available' : 'active'}">${statusLabels[book.status]}</span></td>
        <td>
          <button class="action-btn edit" type="button">Sửa</button>
          <button class="action-btn delete" type="button" data-type="book" data-id="${book.id}">Xóa</button>
        </td>
      `;
      booksBody.appendChild(row);
    });
  };

  const renderUsers = () => {
    const query = userSearch.value.trim().toLowerCase();
    const filtered = state.users.filter(user => user.name.toLowerCase().includes(query) || user.studentId.toLowerCase().includes(query));

    usersBody.innerHTML = '';
    filtered.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.studentId}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td><span class="badge ${user.status === 'Active' ? 'enabled' : 'active'}">${statusLabels[user.status]}</span></td>
        <td>
          <button class="action-btn edit" type="button">Sửa</button>
          <button class="action-btn delete" type="button" data-type="user" data-id="${user.id}">Xóa</button>
        </td>
      `;
      usersBody.appendChild(row);
    });
  };

  const openAddBookModal = () => {
    addBookForm.reset();
    addBookError.textContent = '';
    addBookModal.style.display = 'grid';
    addBookModal.setAttribute('aria-hidden', 'false');
    addBookForm.elements.title.focus();
  };

  const openDeleteModal = (type, id) => {
    state.selectedType = type;
    state.selectedItem = id;
    modalMessage.textContent = `Bạn có chắc muốn xóa ${type === 'book' ? 'sách' : 'người dùng'} này?`;
    modal.style.display = 'grid';
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeDeleteModal = () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  };

  const handleDelete = () => {
    if (!state.selectedType || state.selectedItem === null) return;

    if (state.selectedType === 'book') {
      state.books = state.books.filter(book => book.id !== state.selectedItem);
    } else if (state.selectedType === 'user') {
      state.users = state.users.filter(user => user.id !== state.selectedItem);
    }

    renderBooks();
    renderUsers();
    updateStats();
    closeDeleteModal();
    showToast('Đã xóa thành công');
  };

  // Highlight the current sidebar section.
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-nav a').forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Search and filter events.
  bookSearch.addEventListener('input', renderBooks);
  userSearch.addEventListener('input', renderUsers);
  filterSelect.addEventListener('change', renderBorrowRecords);

  addBookButton.addEventListener('click', openAddBookModal);
  cancelAddBook.addEventListener('click', closeAddBookModal);
  addBookModal.addEventListener('click', event => {
    if (event.target === addBookModal) closeAddBookModal();
  });
  addBookForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(addBookForm);
    const quantity = Number(formData.get('quantity'));

    if (!Number.isInteger(quantity) || quantity < 1) {
      addBookError.textContent = 'Số lượng phải là số nguyên lớn hơn 0.';
      return;
    }

    state.books.push({
      id: Math.max(0, ...state.books.map(book => book.id)) + 1,
      title: formData.get('title').trim(),
      author: formData.get('author').trim(),
      category: formData.get('category').trim(),
      quantity,
      status: 'Available'
    });
    renderBooks();
    updateStats();
    closeAddBookModal();
    showToast('Đã thêm sách thành công');
  });

  // Delete button handling.
  document.addEventListener('click', event => {
    const deleteButton = event.target.closest('.action-btn.delete');
    if (deleteButton) {
      openDeleteModal(deleteButton.dataset.type, Number(deleteButton.dataset.id));
    }
  });

  cancelDelete.addEventListener('click', closeDeleteModal);
  confirmDelete.addEventListener('click', handleDelete);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeDeleteModal();
  });

  renderBorrowRecords();
  renderBooks();
  renderUsers();
  updateStats();
})();
