(() => {
  const list = document.getElementById('borrow-list');
  const message = document.getElementById('borrow-message');
  const user = SmartLibraryApi.currentUser();
  let cart = JSON.parse(localStorage.getItem('smartlibrary-borrow-cart') || '[]');
  const today = new Date(); const due = new Date(today); due.setDate(today.getDate() + 14);
  const date = value => value.toLocaleDateString('vi-VN');
  document.getElementById('borrow-date').value = date(today);
  document.getElementById('return-date').value = date(due);
  if (user) {
    document.getElementById('student-name').value = `${user.firstname || ''} ${user.lastname || ''}`.trim();
    document.getElementById('student-id').value = user.username;
  }
  const render = () => {
    list.innerHTML = cart.length ? '' : '<tr><td colspan="6" class="empty-state">Chưa chọn sách để mượn.</td></tr>';
    cart.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `<td><div class="borrow-cover"></div></td><td>${book.name}</td><td>${book.author}</td><td>${book.publisher || '-'}</td><td>${book.status ? 'Có' : 'Hết'}</td><td><button class="remove-btn" data-id="${book.id}">Xóa</button></td>`;
      list.appendChild(row);
    });
  };
  list.onclick = event => {
    const button = event.target.closest('.remove-btn'); if (!button) return;
    cart = cart.filter(book => book.id !== Number(button.dataset.id));
    localStorage.setItem('smartlibrary-borrow-cart', JSON.stringify(cart)); render();
  };
  document.getElementById('confirm-borrow').onclick = async () => {
    if (!user) { message.textContent = 'Vui lòng đăng nhập trước khi mượn sách.'; message.style.color = '#b91c1c'; return; }
    if (!cart.length) { message.textContent = 'Vui lòng chọn ít nhất một cuốn sách.'; return; }
    try {
      await Promise.all(cart.map(book => SmartLibraryApi.post('/borrows/borrow', {
        userId: user.id, bookId: book.id, quantity: 1, dueDate: due.toISOString().slice(0, 19)
      })));
      localStorage.removeItem('smartlibrary-borrow-cart'); cart = []; render();
      message.textContent = 'Mượn sách thành công.'; message.style.color = '#166534';
    } catch (error) { message.textContent = error.message || 'Không thể mượn sách.'; message.style.color = '#b91c1c'; }
  };
  document.getElementById('cancel-borrow').onclick = () => { cart = []; localStorage.removeItem('smartlibrary-borrow-cart'); render(); };
  render();
})();
