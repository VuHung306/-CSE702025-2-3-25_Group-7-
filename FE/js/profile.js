(() => {
  const account = SmartLibraryApi.currentUser();
  if (!account) { window.location.href = 'login.html'; return; }

  const user = {
    fullName: `${account.firstname || ''} ${account.lastname || ''}`.trim() || account.username,
    studentId: account.username,
    email: account.email || '', phone: account.phone || '',
    faculty: 'Chưa cập nhật', className: 'Chưa cập nhật'
  };
  const set = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };
  const renderProfile = () => {
    set('sidebar-name', user.fullName); set('profile-full-name', user.fullName);
    set('profile-student-id', user.studentId); set('profile-email', user.email); set('profile-phone', user.phone);
    set('profile-faculty', user.faculty); set('profile-class', user.className);
    set('sidebar-student', user.studentId); set('sidebar-email', user.email); set('sidebar-phone', user.phone);
    const avatar = document.querySelector('.profile-avatar');
    if (avatar) avatar.textContent = user.fullName.charAt(0).toUpperCase();
  };
  const format = value => value ? new Date(value).toLocaleDateString('vi-VN') : '-';
  const renderBorrows = async () => {
    const active = document.getElementById('borrowed-books-body');
    const history = document.getElementById('borrow-history-body');
    try {
      const records = (await SmartLibraryApi.get('/borrows/')).filter(item => item.user && item.user.id === account.id);
      active.innerHTML = ''; history.innerHTML = '';
      records.filter(item => !item.status).forEach(item => {
        const overdue = new Date(item.duedate) < new Date();
        active.innerHTML += `<tr><td><div class="book-cover"></div></td><td>${item.book.name}</td><td>${format(item.borrowtime)}</td><td>${format(item.duedate)}</td><td><span class="status-badge ${overdue ? 'overdue' : 'on-time'}">${overdue ? 'Quá hạn' : 'Đúng hạn'}</span></td></tr>`;
      });
      records.filter(item => item.status).forEach(item => {
        history.innerHTML += `<tr><td>${item.book.name}</td><td>${format(item.borrowtime)}</td><td>${format(item.returntime)}</td><td><span class="status-badge completed">Đã trả</span></td></tr>`;
      });
    } catch (_) { active.innerHTML = '<tr><td colspan="5">Không tải được lịch sử mượn sách.</td></tr>'; }
  };
  const modal = document.getElementById('edit-profile-modal');
  const form = document.getElementById('profile-edit-form');
  document.getElementById('edit-profile-btn').onclick = () => {
    form.elements.fullName.value = user.fullName; form.elements.studentId.value = user.studentId;
    form.elements.email.value = user.email; form.elements.phone.value = user.phone;
    form.elements.faculty.value = user.faculty; form.elements.className.value = user.className;
    modal.style.display = 'grid';
  };
  document.getElementById('modal-cancel').onclick = () => { modal.style.display = 'none'; };
  form.onsubmit = event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    Object.assign(user, values);
    const names = user.fullName.trim().split(/\s+/);
    account.firstname = names.shift() || ''; account.lastname = names.join(' ');
    account.email = user.email; account.phone = user.phone;
    SmartLibraryApi.setCurrentUser(account);
    renderProfile(); modal.style.display = 'none';
    document.getElementById('profile-message').textContent = 'Đã cập nhật thông tin hiển thị.';
  };
  renderProfile(); renderBorrows();
})();
