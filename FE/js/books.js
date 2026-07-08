// Mock data and interactive behavior for the books page.

(() => {
  const books = [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', quantity: 4 },
    { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Literature', quantity: 3 },
    { id: 3, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Economics', quantity: 2 },
    { id: 4, title: 'English for Everyone', author: 'DK', category: 'Foreign Languages', quantity: 5 },
    { id: 5, title: 'Physics for Beginners', author: 'Mina Singh', category: 'Science', quantity: 3 },
    { id: 6, title: 'Atomic Habits', author: 'James Clear', category: 'Life Skills', quantity: 6 },
    { id: 7, title: 'JavaScript Basics', author: 'Anna Lee', category: 'Technology', quantity: 4 },
    { id: 8, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Literature', quantity: 2 },
    { id: 9, title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Economics', quantity: 5 },
    { id: 10, title: 'Spanish for Beginners', author: 'Maria Ruiz', category: 'Foreign Languages', quantity: 4 },
    { id: 11, title: 'Biology in Simple Words', author: 'Liam Patel', category: 'Science', quantity: 2 },
    { id: 12, title: 'Communication Skills', author: 'Sarah Kim', category: 'Life Skills', quantity: 6 },
    { id: 13, title: 'HTML and CSS Guide', author: 'Chris Brown', category: 'Technology', quantity: 3 },
    { id: 14, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Literature', quantity: 1 },
    { id: 15, title: 'Finance for Students', author: 'Olivia Chen', category: 'Economics', quantity: 4 },
    { id: 16, title: 'French Learning Made Easy', author: 'Noah Martin', category: 'Foreign Languages', quantity: 3 },
    { id: 17, title: 'Space Exploration', author: 'David Cole', category: 'Science', quantity: 5 },
    { id: 18, title: 'Time Management', author: 'Emily Ross', category: 'Life Skills', quantity: 4 },
    { id: 19, title: 'React for Beginners', author: 'Alicia Stone', category: 'Technology', quantity: 2 },
    { id: 20, title: 'The Alchemist', author: 'Paulo Coelho', category: 'Literature', quantity: 4 },
    { id: 21, title: 'Economics 101', author: 'Brian White', category: 'Economics', quantity: 6 },
    { id: 22, title: 'Japanese Essentials', author: 'Haruto Sato', category: 'Foreign Languages', quantity: 2 },
    { id: 23, title: 'Everyday Chemistry', author: 'Grace Taylor', category: 'Science', quantity: 3 },
    { id: 24, title: 'Problem Solving Skills', author: 'Mason Hall', category: 'Life Skills', quantity: 5 }
  ];

  const booksGrid = document.getElementById('books-grid');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('book-search');
  const categoryFilter = document.getElementById('category-filter');
  const sortSelect = document.getElementById('sort-select');
  const pagination = document.getElementById('pagination');

  let currentPage = 1;
  const booksPerPage = 6;

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
