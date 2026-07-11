// Mock data and interactive behavior for the books page.

(() => {
  const books = [
    { id: 1, title: 'Lập trình sạch', author: 'Robert C. Martin', category: 'Công nghệ', quantity: 4 },
    { id: 2, title: 'Hobbit', author: 'J.R.R. Tolkien', category: 'Văn học', quantity: 3 },
    { id: 3, title: 'Tư duy nhanh và chậm', author: 'Daniel Kahneman', category: 'Kinh tế', quantity: 2 },
    { id: 4, title: 'Tiếng Anh cho mọi người', author: 'DK', category: 'Ngoại ngữ', quantity: 5 },
    { id: 5, title: 'Vật lý cho người mới bắt đầu', author: 'Mina Singh', category: 'Khoa học', quantity: 3 },
    { id: 6, title: 'Thói quen nguyên tử', author: 'James Clear', category: 'Kỹ năng sống', quantity: 6 },
    { id: 7, title: 'Cơ bản về JavaScript', author: 'Anna Lee', category: 'Công nghệ', quantity: 4 },
    { id: 8, title: 'Kiêu hãnh và định kiến', author: 'Jane Austen', category: 'Văn học', quantity: 2 },
    { id: 9, title: 'Tâm lý học về tiền', author: 'Morgan Housel', category: 'Kinh tế', quantity: 5 },
    { id: 10, title: 'Tiếng Tây Ban Nha cho người mới bắt đầu', author: 'Maria Ruiz', category: 'Ngoại ngữ', quantity: 4 },
    { id: 11, title: 'Sinh học bằng ngôn từ đơn giản', author: 'Liam Patel', category: 'Khoa học', quantity: 2 },
    { id: 12, title: 'Kỹ năng giao tiếp', author: 'Sarah Kim', category: 'Kỹ năng sống', quantity: 6 },
    { id: 13, title: 'Hướng dẫn HTML và CSS', author: 'Chris Brown', category: 'Công nghệ', quantity: 3 },
    { id: 14, title: 'Đại gia Gatsby', author: 'F. Scott Fitzgerald', category: 'Văn học', quantity: 1 },
    { id: 15, title: 'Tài chính dành cho sinh viên', author: 'Olivia Chen', category: 'Kinh tế', quantity: 4 },
    { id: 16, title: 'Học tiếng Pháp dễ dàng', author: 'Noah Martin', category: 'Ngoại ngữ', quantity: 3 },
    { id: 17, title: 'Khám phá không gian', author: 'David Cole', category: 'Khoa học', quantity: 5 },
    { id: 18, title: 'Quản lý thời gian', author: 'Emily Ross', category: 'Kỹ năng sống', quantity: 4 },
    { id: 19, title: 'React cho người mới bắt đầu', author: 'Alicia Stone', category: 'Công nghệ', quantity: 2 },
    { id: 20, title: 'Nhà giả kim', author: 'Paulo Coelho', category: 'Văn học', quantity: 4 },
    { id: 21, title: 'Kinh tế học nhập môn', author: 'Brian White', category: 'Kinh tế', quantity: 6 },
    { id: 22, title: 'Tiếng Nhật thiết yếu', author: 'Haruto Sato', category: 'Ngoại ngữ', quantity: 2 },
    { id: 23, title: 'Hóa học thường ngày', author: 'Grace Taylor', category: 'Khoa học', quantity: 3 },
    { id: 24, title: 'Kỹ năng giải quyết vấn đề', author: 'Mason Hall', category: 'Kỹ năng sống', quantity: 5 }
  ];

  const booksGrid = document.getElementById('books-grid');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('book-search');
  const categoryFilter = document.getElementById('category-filter');
  const sortSelect = document.getElementById('sort-select');
  const pagination = document.getElementById('pagination');

  let currentPage = 1;
  const booksPerPage = 6;

  // Select a category when this page is opened from a category card on the home page.
  const categoryFromUrl = new URLSearchParams(window.location.search).get('category');
  if (categoryFromUrl && Array.from(categoryFilter.options).some(option => option.value === categoryFromUrl)) {
    categoryFilter.value = categoryFromUrl;
  }

  // Render one book card using the existing card structure.
  const createBookCard = book => {
    const card = document.createElement('article');
    card.className = 'book-card';

    card.innerHTML = `
      <div class="book-cover" aria-hidden="true"></div>
      <div class="book-info">
        <h3>${book.title}</h3>
        <p class="book-author">${book.author}</p>
        <p class="book-category">${book.category}</p>
        <p class="book-availability">Còn ${book.quantity} cuốn</p>
      </div>
      <button class="borrow-btn" type="button">Mượn</button>
    `;

    const borrowButton = card.querySelector('.borrow-btn');
    borrowButton.addEventListener('click', () => {
      window.location.href = `borrow.html?id=${book.id}`;
    });

    return card;
  };

  // Filter, sort, and page the book list.
  const getFilteredBooks = () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    let filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchValue);
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const sortValue = sortSelect.value;
    filtered.sort((a, b) => {
      if (sortValue === 'author') {
        return a.author.localeCompare(b.author);
      }
      if (sortValue === 'category') {
        return a.category.localeCompare(b.category);
      }
      return a.title.localeCompare(b.title);
    });

    return filtered;
  };

  // Render the current page of books.
  const renderBooks = () => {
    const filteredBooks = getFilteredBooks();
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const pageBooks = filteredBooks.slice(start, end);

    booksGrid.innerHTML = '';

    if (!pageBooks.length) {
      booksGrid.innerHTML = '<p class="empty-state">Không tìm thấy sách phù hợp.</p>';
      pagination.innerHTML = '';
      return;
    }

    pageBooks.forEach(book => {
      booksGrid.appendChild(createBookCard(book));
    });

    renderPagination(filteredBooks.length);
  };

  // Render the pagination buttons.
  const renderPagination = totalItems => {
    const totalPages = Math.ceil(totalItems / booksPerPage);
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = i;

      if (i === currentPage) {
        button.classList.add('active');
      }

      button.addEventListener('click', () => {
        currentPage = i;
        renderBooks();
      });

      pagination.appendChild(button);
    }
  };

  // Reload the list when the user searches or changes filters.
  const handleFilterChange = () => {
    currentPage = 1;
    renderBooks();
  };

  // Connect the controls to the UI.
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    handleFilterChange();
  });

  searchInput.addEventListener('input', handleFilterChange);
  categoryFilter.addEventListener('change', handleFilterChange);
  sortSelect.addEventListener('change', handleFilterChange);

  renderBooks();
})();
