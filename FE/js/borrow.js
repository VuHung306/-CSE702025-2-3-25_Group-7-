(() => {
  const list = document.getElementById('borrow-list');
  const message = document.getElementById('borrow-message');
  const borrowDateInput = document.getElementById('borrow-date');
  const returnDateInput = document.getElementById('return-date');
  const user = SmartLibraryApi.currentUser();
  let cart = JSON.parse(localStorage.getItem('smartlibrary-borrow-cart') || '[]');

  const isoDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const addDays = (dateString, days) => {
    const date = new Date(`${dateString}T00:00:00`);
    date.setDate(date.getDate() + days);
    return isoDate(date);
  };
  const today = isoDate(new Date());
  borrowDateInput.min = today;
  borrowDateInput.value = today;
  const updateReturnDateLimits = () => {
    const borrowDate = borrowDateInput.value || today;
    const minReturn = addDays(borrowDate, 1);
    const maxReturn = addDays(borrowDate, 30);
    returnDateInput.min = minReturn;
    returnDateInput.max = maxReturn;
    if (!returnDateInput.value || returnDateInput.value < minReturn || returnDateInput.value > maxReturn) {
      returnDateInput.value = addDays(borrowDate, 14);
    }
  };
  updateReturnDateLimits();
  borrowDateInput.addEventListener('change', updateReturnDateLimits);

  if (user) {
    document.getElementById('student-name').value = `${user.firstname || ''} ${user.lastname || ''}`.trim();
    document.getElementById('student-id').value = user.username;
  }

  const render = () => {
    list.innerHTML = cart.length ? '' : '<tr><td colspan="6" class="empty-state">Chưa chọn sách để mượn.</td></tr>';
    cart.forEach(book => {
      const row = document.createElement('tr');
      const typeNames = (book.types || []).map(type => type.name).join(', ') || '-';
      row.innerHTML = `<td><div class="borrow-cover"></div></td><td>${book.name}</td><td>${book.author}</td><td>${typeNames}</td><td>${book.status ? 'Có' : 'Hết'}</td><td><button class="remove-btn" data-id="${book.id}">Xóa</button></td>`;
      list.appendChild(row);
    });
  };
  list.onclick = event => {
    const button = event.target.closest('.remove-btn');
    if (!button) return;
    cart = cart.filter(book => book.id !== Number(button.dataset.id));
    localStorage.setItem('smartlibrary-borrow-cart', JSON.stringify(cart));
    render();
  };
  document.getElementById('confirm-borrow').onclick = async () => {
    if (!user) { message.textContent = 'Vui lòng đăng nhập trước khi mượn sách.'; message.style.color = '#b91c1c'; return; }
    if (!cart.length) { message.textContent = 'Vui lòng chọn ít nhất một cuốn sách.'; message.style.color = '#b91c1c'; return; }
    const borrowDate = borrowDateInput.value;
    const returnDate = returnDateInput.value;
    if (!borrowDate || !returnDate || returnDate < addDays(borrowDate, 1) || returnDate > addDays(borrowDate, 30)) {
      message.textContent = 'Ngày trả phải từ 1 đến 30 ngày sau ngày mượn.';
      message.style.color = '#b91c1c';
      return;
    }
    try {
      await Promise.all(cart.map(book => SmartLibraryApi.post('/borrows/borrow', {
        userId: user.id, bookId: book.id, quantity: 1,
        borrowDate: `${borrowDate}T00:00:00`, dueDate: `${returnDate}T00:00:00`
      })));
      localStorage.removeItem('smartlibrary-borrow-cart');
      cart = [];
      render();
      message.textContent = 'Mượn sách thành công.';
      message.style.color = '#166534';
    } catch (error) {
      message.textContent = error.message || 'Không thể mượn sách.';
      message.style.color = '#b91c1c';
    }
  };
  document.getElementById('cancel-borrow').onclick = () => {
    cart = [];
    localStorage.removeItem('smartlibrary-borrow-cart');
    render();
  };
  render();
})();
