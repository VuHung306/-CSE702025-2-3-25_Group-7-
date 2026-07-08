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

  const showToast = message => {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  };

  const updateStats = () => {
    document.getElementById('total-books').textContent = state.books.length;
    document.getElementById('available-books').textContent = state.books.filter(book => book.status === 'Available').length;
    document.getElementById('borrowed-books').textContent = state.books.filter(book => book.status === 'Borrowed').length;
    document.getElementById('total-users').textContent = state.users.length;
    document.getElementById('active-borrows').textContent = state.borrowRecords.filter(record => record.status === 'Active' || record.status === 'Overdue').length;

    const mostBorrowedBook = state.books[0] ? state.books[0].title : 'None';
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
        <td><span class="badge ${record.status === 'Overdue' ? 'overdue' : record.status === 'Returned' ? 'returned' : 'active'}">${record.status}</span></td>
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
        <td><span class="badge ${book.status === 'Available' ? 'available' : 'active'}">${book.status}</span></td>
        <td>
          <button class="action-btn edit" type="button">Edit</button>
          <button class="action-btn delete" type="button" data-type="book" data-id="${book.id}">Delete</button>
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
        <td><span class="badge ${user.status === 'Active' ? 'enabled' : 'active'}">${user.status}</span></td>
        <td>
          <button class="action-btn edit" type="button">Edit</button>
          <button class="action-btn delete" type="button" data-type="user" data-id="${user.id}">Delete</button>
        </td>
      `;
      usersBody.appendChild(row);
    });
  };

  const openDeleteModal = (type, id) => {
    state.selectedType = type;
    state.selectedItem = id;
    modalMessage.textContent = `Are you sure you want to delete this ${type}?`;
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
    showToast('Item deleted successfully');
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
