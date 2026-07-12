(() => {
  const list = document.getElementById('borrowed-list');
  const user = SmartLibraryApi.currentUser();
  const format = value => value ? new Date(value).toLocaleDateString('vi-VN') : '-';
  async function load() {
    if (!user) { list.innerHTML = '<tr><td colspan="6" class="empty-state">Vui lòng đăng nhập để xem sách đang mượn.</td></tr>'; return; }
    try {
      const borrows = (await SmartLibraryApi.get('/borrows/')).filter(item => item.user && item.user.id === user.id && !item.status);
      document.getElementById('total-borrowed').textContent = borrows.length;
      document.getElementById('total-overdue').textContent = borrows.filter(item => new Date(item.duedate) < new Date()).length;
      list.innerHTML = borrows.length ? '' : '<tr><td colspan="6" class="empty-state">Không có sách đang mượn.</td></tr>';
      borrows.forEach(item => {
        const overdue = new Date(item.duedate) < new Date();
        const row = document.createElement('tr');
        row.innerHTML = `<td><div class="return-cover"></div></td><td>${item.book.name}</td><td>${format(item.borrowtime)}</td><td>${format(item.duedate)}</td><td><span class="${overdue ? 'status-overdue' : 'status-on-time'}">${overdue ? 'Quá hạn' : 'Đúng hạn'}</span></td><td><button class="return-btn" data-id="${item.id}">Trả</button></td>`;
        list.appendChild(row);
      });
    } catch (error) { list.innerHTML = `<tr><td colspan="6" class="empty-state">${error.message}</td></tr>`; }
  }
  list.onclick = async event => {
    const button = event.target.closest('.return-btn'); if (!button) return;
    try { await SmartLibraryApi.put(`/borrows/return/${button.dataset.id}`, {}); await load(); }
    catch (error) { alert(error.message || 'Không thể trả sách.'); }
  };
  load();
})();
