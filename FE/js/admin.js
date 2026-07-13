(() => {
  const user = SmartLibraryApi.currentUser();
  const booksBody = document.getElementById('books-body');
  const usersBody = document.getElementById('users-body');
  const borrowsBody = document.getElementById('borrow-records-body');
  const toast = document.getElementById('toast');
  const isAdmin = user?.role?.name === 'ADMIN';
  const isLibrarian = user?.role?.name?.toUpperCase() === 'LIBRARIAN';
  let books = [], users = [], borrows = [], types = [];

  const notify = message => {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  };
  const fullName = item => `${item.firstname || ''} ${item.lastname || ''}`.trim() || item.username;

  const booksHeading = document.querySelector('#books-section .section-heading');
  const addButton = document.createElement('button');
  addButton.className = 'add-book-btn';
  addButton.type = 'button';
  addButton.textContent = '+ Thêm sách';
  booksHeading.appendChild(addButton);

  const addModal = document.createElement('div');
  addModal.className = 'modal-backdrop';
  addModal.style.display = 'none';
  addModal.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true">
      <h3>Thêm sách mới</h3>
      <form id="add-book-form" class="book-form">
        <label>Tên sách<input name="name" required></label>
        <label>Tác giả<input name="author" required></label>
        <label>Ngày phát hành<input name="release_day" type="date" required></label>
        <label>ISBN<input name="isbn"></label>
        <label>Nhà xuất bản<input name="publisher"></label>
        <label>Thể loại sách
          <select id="book-type-ids" name="typeIds"></select>
        </label>
        <label>Thêm thể loại mới (không bắt buộc)<input name="newType" placeholder="Ví dụ: Truyện tranh"></label>
        <p class="form-error" id="add-book-error"></p>
        <div class="modal-actions">
          <button type="button" class="modal-cancel-btn">Hủy</button>
          <button type="submit" class="modal-submit-btn">Lưu sách</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(addModal);
  const addForm = addModal.querySelector('#add-book-form');
  const typeSelect = addModal.querySelector('#book-type-ids');
  const hiddenTypeNames = new Set(['Technology', 'Literature', 'Economics', 'Foreign Languages', 'Science', 'Life Skills']);
  const renderTypeOptions = () => {
    const visibleTypes = types.filter(type => !hiddenTypeNames.has(type.name));
    typeSelect.innerHTML = '<option value="" selected disabled>-- Chọn thể loại --</option>'
      + visibleTypes.map(type => `<option value="${type.id}">${type.name}</option>`).join('');
  };
  const closeAddModal = () => { addModal.style.display = 'none'; addForm.reset(); };
  addButton.onclick = () => { renderTypeOptions(); addModal.style.display = 'grid'; };
  addModal.querySelector('.modal-cancel-btn').onclick = closeAddModal;
  addModal.onclick = event => { if (event.target === addModal) closeAddModal(); };
  addForm.onsubmit = async event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(addForm));
    try {
      const typeIds = typeSelect.value ? [Number(typeSelect.value)] : [];
      const newTypeName = values.newType?.trim();
      if (newTypeName) {
        const newType = await SmartLibraryApi.post('/types', { userId: user.id, name: newTypeName });
        typeIds.push(newType.id);
        types.push(newType);
      }
      if (!typeIds.length) {
        throw new Error('Vui lòng chọn hoặc thêm ít nhất một thể loại.');
      }
      await SmartLibraryApi.post('/books', {
        userId: user.id,
        name: values.name.trim(), author: values.author.trim(), release_day: values.release_day,
        isbn: values.isbn.trim() || null, publisher: values.publisher.trim() || null,
        status: true, typeIds
      });
      closeAddModal();
      notify('Đã thêm sách mới.');
      load();
    } catch (error) {
      addModal.querySelector('#add-book-error').textContent = error.message || 'Không thể thêm sách.';
    }
  };

  const render = () => {
    const keyword = document.getElementById('book-search').value.toLowerCase();
    booksBody.innerHTML = '';
    books.filter(book => `${book.name} ${book.author}`.toLowerCase().includes(keyword)).forEach(book => {
      booksBody.innerHTML += `<tr><td><div class="book-cover"></div></td><td>${book.name}</td><td>${book.author}</td><td>${book.publisher || '-'}</td><td>-</td><td>${book.status ? 'Có sẵn' : 'Đang mượn'}</td><td><button class="action-btn delete" data-book="${book.id}">Xóa</button></td></tr>`;
    });

    const userKeyword = document.getElementById('user-search').value.toLowerCase();
    usersBody.innerHTML = '';
    users.filter(item => `${fullName(item)} ${item.username}`.toLowerCase().includes(userKeyword)).forEach(item => {
      const roleName = (item.role?.name || 'USER').toUpperCase();
      const normalizedRole = roleName;
      let actions = '-';
      if (isAdmin && normalizedRole === 'USER') {
        actions = `<button class="action-btn edit" data-role="LIBRARIAN" data-user="${item.id}">Cấp quyền thủ thư</button><button class="action-btn delete" data-user="${item.id}">Xóa</button>`;
      } else if (isAdmin && normalizedRole === 'LIBRARIAN') {
        actions = `<button class="action-btn edit" data-role="USER" data-user="${item.id}">Thu hồi quyền</button><button class="action-btn delete" data-user="${item.id}">Xóa</button>`;
      }
      usersBody.innerHTML += `<tr><td>${item.username}</td><td>${fullName(item)}</td><td>${item.email}</td><td>${item.phone || '-'}</td><td>${roleName}</td><td>${actions}</td></tr>`;
    });

    const filter = document.getElementById('borrow-status-filter').value;
    borrowsBody.innerHTML = '';
    borrows.filter(item => filter === 'all' || (filter === 'Returned' ? item.status : !item.status)).forEach(item => {
      const overdue = !item.status && new Date(item.duedate) < new Date();
      const status = item.status ? 'Đã trả' : overdue ? 'Quá hạn' : 'Đang mượn';
      borrowsBody.innerHTML += `<tr><td>${fullName(item.user)}</td><td>${item.user?.username || '-'}</td><td>${item.book?.name || '-'}</td><td>${new Date(item.borrowtime).toLocaleDateString('vi-VN')}</td><td>${new Date(item.duedate).toLocaleDateString('vi-VN')}</td><td>${status}</td></tr>`;
    });
    document.getElementById('total-books').textContent = books.length;
    document.getElementById('available-books').textContent = books.filter(book => book.status).length;
    document.getElementById('borrowed-books').textContent = books.filter(book => !book.status).length;
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('active-borrows').textContent = borrows.filter(item => !item.status).length;
    document.getElementById('active-users').textContent = users.length;
    document.getElementById('overdue-books').textContent = borrows.filter(item => !item.status && new Date(item.duedate) < new Date()).length;
  };

  async function load() {
    if (!user || (!isAdmin && !isLibrarian)) {
      window.location.href = 'login.html';
      return;
    }
    try {
      [books, users, borrows, types] = await Promise.all([
        SmartLibraryApi.get('/books/'),
        SmartLibraryApi.get(`/users/?adminId=${encodeURIComponent(user.id)}`),
        SmartLibraryApi.get('/borrows/'),
        SmartLibraryApi.get('/types/')
      ]);
      render();
    } catch (error) {
      notify(error.message || 'Không tải được dữ liệu quản trị.');
    }
  }

  document.getElementById('book-search').oninput = render;
  document.getElementById('user-search').oninput = render;
  document.getElementById('borrow-status-filter').onchange = render;
  document.addEventListener('click', async event => {
    const bookId = event.target.dataset.book;
    const userId = event.target.dataset.user;
    const requestedRole = event.target.dataset.role;
    try {
      if (bookId && confirm('Xóa sách này?')) {
        await SmartLibraryApi.delete(`/books/${bookId}`, { userId: user.id });
      }
      if (requestedRole && userId && confirm(requestedRole === 'LIBRARIAN' ? 'Cấp quyền thủ thư?' : 'Thu hồi quyền thủ thư?')) {
        await SmartLibraryApi.patch(`/users/${userId}/role`, { adminId: user.id, roleName: requestedRole });
      }
      if (userId && !requestedRole && confirm('Xóa người dùng này?')) {
        await SmartLibraryApi.delete(`/users/${userId}`, { adminId: user.id });
      }
      if (bookId || userId) {
        notify(requestedRole ? 'Đã cập nhật quyền.' : 'Đã xóa.');
        load();
      }
    } catch (error) {
      notify(error.message || 'Không thể thực hiện thao tác.');
    }
  });
  load();
})();
