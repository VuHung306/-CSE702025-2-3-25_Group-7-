// Mock borrowed book list and simple borrow actions.

(() => {
  const borrowedBooks = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Technology',
      quantity: 4
    },
    {
      id: 2,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      category: 'Literature',
      quantity: 3
    },
    {
      id: 3,
      title: 'Atomic Habits',
      author: 'James Clear',
      category: 'Life Skills',
      quantity: 6
    }
  ];

  const borrowList = document.getElementById('borrow-list');
  const borrowDateInput = document.getElementById('borrow-date');
  const returnDateInput = document.getElementById('return-date');
  const confirmButton = document.getElementById('confirm-borrow');
  const cancelButton = document.getElementById('cancel-borrow');
  const message = document.getElementById('borrow-message');

  // Fill the date fields with today's date and expected return date.
  const setDefaultDates = () => {
    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + 14);

    const formatDate = date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}/${month}/${year}`;
    };

    borrowDateInput.value = formatDate(today);
    returnDateInput.value = formatDate(returnDate);
  };

  // Render the current borrowed books into the table.
  const renderBooks = () => {
    borrowList.innerHTML = '';

    if (!borrowedBooks.length) {
      borrowList.innerHTML = '<tr><td colspan="6" class="empty-state">Không có sách nào trong danh sách mượn.</td></tr>';
      return;
    }

    borrowedBooks.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><div class="borrow-cover" aria-hidden="true"></div></td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.category}</td>
        <td>${book.quantity}</td>
        <td><button class="remove-btn" type="button" data-id="${book.id}">Xóa</button></td>
      `;
      borrowList.appendChild(row);
    });
  };

  // Remove a book from the list.
  borrowList.addEventListener('click', event => {
    const button = event.target.closest('.remove-btn');
    if (!button) return;

    const id = Number(button.getAttribute('data-id'));
    const index = borrowedBooks.findIndex(book => book.id === id);

    if (index !== -1) {
      borrowedBooks.splice(index, 1);
      renderBooks();
      message.textContent = 'Đã xóa cuốn sách khỏi danh sách mượn.';
    }
  });

  // Validate before confirming the borrow request.
  confirmButton.addEventListener('click', () => {
    if (!borrowedBooks.length) {
      message.textContent = 'Vui lòng chọn ít nhất một cuốn sách trước khi xác nhận.';
      message.style.color = '#b91c1c';
      return;
    }

    message.textContent = 'Yêu cầu mượn sách đã được gửi thành công.';
    message.style.color = '#166534';
  });

  // Clear the current borrow request.
  cancelButton.addEventListener('click', () => {
    borrowedBooks.length = 0;
    renderBooks();
    message.textContent = 'Đã hủy danh sách mượn.';
    message.style.color = '#b91c1c';
  });

  setDefaultDates();
  renderBooks();
})();
