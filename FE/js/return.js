// Mock borrowed books and simple return actions.

(() => {
  const borrowedBooks = [
    {
      id: 1,
      title: 'Clean Code',
      borrowDate: '01/07/2026',
      dueDate: '15/07/2026',
      status: 'On Time'
    },
    {
      id: 2,
      title: 'The Hobbit',
      borrowDate: '28/06/2026',
      dueDate: '12/07/2026',
      status: 'Overdue'
    },
    {
      id: 3,
      title: 'Atomic Habits',
      borrowDate: '03/07/2026',
      dueDate: '17/07/2026',
      status: 'On Time'
    }
  ];

  const borrowedList = document.getElementById('borrowed-list');
  const totalBorrowed = document.getElementById('total-borrowed');
  const totalOverdue = document.getElementById('total-overdue');

  // Render the borrowed books list.
  const renderBooks = () => {
    borrowedList.innerHTML = '';

    if (!borrowedBooks.length) {
      borrowedList.innerHTML = '<tr><td colspan="6" class="empty-state">No borrowed books.</td></tr>';
      updateSummary();
      return;
    }

    borrowedBooks.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><div class="return-cover" aria-hidden="true"></div></td>
        <td>${book.title}</td>
        <td>${book.borrowDate}</td>
        <td>${book.dueDate}</td>
        <td><span class="${book.status === 'Overdue' ? 'status-overdue' : 'status-on-time'}">${book.status}</span></td>
        <td><button class="return-btn" type="button" data-id="${book.id}">Trả</button></td>
      `;
      borrowedList.appendChild(row);
    });

    updateSummary();
  };

  // Update the summary values.
  const updateSummary = () => {
    totalBorrowed.textContent = borrowedBooks.length;
    totalOverdue.textContent = borrowedBooks.filter(book => book.status === 'Overdue').length;
  };

  // Remove a book from the list when the return button is clicked.
  borrowedList.addEventListener('click', event => {
    const button = event.target.closest('.return-btn');
    if (!button) return;

    const id = Number(button.getAttribute('data-id'));
    const index = borrowedBooks.findIndex(book => book.id === id);

    if (index !== -1) {
      borrowedBooks.splice(index, 1);
      renderBooks();
      alert('Sách đã được trả thành công!');
    }
  });

  renderBooks();
})();
