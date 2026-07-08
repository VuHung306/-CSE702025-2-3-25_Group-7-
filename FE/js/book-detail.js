// Mock data and simple interactions for the Book Detail page.

(() => {
  const books = [
    {
      id: 1,
      title: 'Lập trình sạch',
      author: 'Robert C. Martin',
      category: 'Công nghệ',
      publisher: 'Prentice Hall',
      year: 2008,
      isbn: '978-0132350884',
      language: 'Tiếng Anh',
      pages: 464,
      quantity: 4,
      status: 'Có sẵn',
      description: 'Hướng dẫn thực tế để viết mã dễ đọc, dễ bảo trì và đạt chất lượng cao. Cuốn sách này rất phù hợp cho người mới bắt đầu muốn cải thiện thói quen lập trình của mình.',
      shelf: 'A-12',
      related: [2, 7, 13, 19]
    },
    {
      id: 2,
      title: 'Hobbit',
      author: 'J.R.R. Tolkien',
      category: 'Văn học',
      publisher: 'George Allen & Unwin',
      year: 1937,
      isbn: '978-0261102217',
      language: 'Tiếng Anh',
      pages: 310,
      quantity: 3,
      status: 'Có sẵn',
      description: 'Một câu chuyện phiêu lưu đầy bí ẩn, lòng dũng cảm và thần thoại. Đây là một trong những cuốn sách được yêu thích nhất ở mọi lứa tuổi.',
      shelf: 'B-07',
      related: [1, 8, 14, 20]
    },
    {
      id: 3,
      title: 'Tư duy nhanh và chậm',
      author: 'Daniel Kahneman',
      category: 'Kinh tế',
      publisher: 'Farrar, Straus and Giroux',
      year: 2011,
      isbn: '978-0374533557',
      language: 'Tiếng Anh',
      pages: 499,
      quantity: 2,
      status: 'Đang được mượn',
      description: 'Một góc nhìn sâu sắc về cách bộ não đưa ra quyết định. Người đọc sẽ hiểu rõ hơn về sự khác biệt giữa tư duy nhanh và tư duy chậm.',
      shelf: 'C-03',
      related: [9, 15, 21, 3]
    },
    {
      id: 4,
      title: 'Tiếng Anh cho mọi người',
      author: 'DK',
      category: 'Ngoại ngữ',
      publisher: 'DK Publishing',
      year: 2016,
      isbn: '978-1465453529',
      language: 'Tiếng Anh',
      pages: 320,
      quantity: 5,
      status: 'Có sẵn',
      description: 'Một hướng dẫn đơn giản và trực quan để học tiếng Anh từng bước với nhiều ví dụ và bài tập thực hành.',
      shelf: 'D-04',
      related: [10, 16, 4, 22]
    },
    {
      id: 5,
      title: 'Vật lý cho người mới bắt đầu',
      author: 'Mina Singh',
      category: 'Khoa học',
      publisher: 'Bright Press',
      year: 2020,
      isbn: '978-1234567890',
      language: 'Tiếng Anh',
      pages: 240,
      quantity: 3,
      status: 'Có sẵn',
      description: 'Một giới thiệu dễ tiếp cận cho các khái niệm vật lý cơ bản bằng cách giải thích đơn giản và có ví dụ minh họa.',
      shelf: 'E-02',
      related: [17, 23, 5, 11]
    },
    {
      id: 6,
      title: 'Thói quen nguyên tử',
      author: 'James Clear',
      category: 'Kỹ năng sống',
      publisher: 'Avery',
      year: 2018,
      isbn: '978-0735211292',
      language: 'Tiếng Anh',
      pages: 320,
      quantity: 6,
      status: 'Có sẵn',
      description: 'Một cuốn sách thực tế về cách xây dựng thói quen hữu ích và bỏ những thói quen không tốt bằng cách đơn giản và gần gũ.',
      shelf: 'F-09',
      related: [12, 18, 6, 24]
    }
  ];

  const sampleBookId = 1;
  const currentBook = books.find(book => book.id === sampleBookId) || books[0];

  const title = document.getElementById('book-detail-title');
  const author = document.getElementById('book-author');
  const category = document.getElementById('book-category');
  const publisher = document.getElementById('book-publisher');
  const year = document.getElementById('book-year');
  const isbn = document.getElementById('book-isbn');
  const language = document.getElementById('book-language');
  const pages = document.getElementById('book-pages');
  const quantity = document.getElementById('book-quantity');
  const status = document.getElementById('book-status');
  const description = document.getElementById('book-description');
  const borrowBtn = document.getElementById('borrow-btn');
  const favoriteBtn = document.getElementById('favorite-btn');
  const backBtn = document.getElementById('back-btn');
  const message = document.getElementById('action-message');
  const relatedBooks = document.getElementById('related-books');

  // Fill the main information area with mock data.
  const renderBookDetails = () => {
    title.textContent = currentBook.title;
    author.textContent = currentBook.author;
    category.textContent = currentBook.category;
    publisher.textContent = currentBook.publisher;
    year.textContent = currentBook.year;
    isbn.textContent = currentBook.isbn;
    language.textContent = currentBook.language;
    pages.textContent = currentBook.pages;
    quantity.textContent = `${currentBook.quantity} cuốn`;
    status.textContent = currentBook.status;
    description.textContent = currentBook.description;

    document.getElementById('table-category').textContent = currentBook.category;
    document.getElementById('table-publisher').textContent = currentBook.publisher;
    document.getElementById('table-year').textContent = currentBook.year;
    document.getElementById('table-language').textContent = currentBook.language;
    document.getElementById('table-pages').textContent = currentBook.pages;
    document.getElementById('table-isbn').textContent = currentBook.isbn;
    document.getElementById('table-shelf').textContent = currentBook.shelf;
  };

  // Render related books using the existing card structure.
  const renderRelatedBooks = () => {
    relatedBooks.innerHTML = '';

    currentBook.related.forEach(relatedId => {
      const relatedBook = books.find(book => book.id === relatedId);
      if (!relatedBook) return;

      const card = document.createElement('article');
      card.className = 'book-card';
      card.innerHTML = `
        <div class="book-cover" aria-hidden="true"></div>
        <div class="book-info">
          <h3>${relatedBook.title}</h3>
          <p class="book-author">${relatedBook.author}</p>
          <p class="book-category">${relatedBook.category}</p>
          <p class="book-availability">Còn ${relatedBook.quantity} cuốn</p>
        </div>
        <button class="borrow-btn" type="button">Mượn</button>
      `;

      relatedBooks.appendChild(card);
    });
  };

  // Show a success message when the borrow button is clicked.
  borrowBtn.addEventListener('click', () => {
    message.textContent = 'Yêu cầu mượn sách đã được gửi thành công.';
  });

  // Toggle the favorite button state.
  let isFavorite = false;

  favoriteBtn.addEventListener('click', () => {
    isFavorite = !isFavorite;
    favoriteBtn.textContent = isFavorite ? 'Đã thêm vào yêu thích' : 'Thêm vào yêu thích';
    favoriteBtn.style.background = isFavorite ? '#dcfce7' : '#fef3c7';
    favoriteBtn.style.color = isFavorite ? '#166534' : '#92400e';
    message.textContent = isFavorite ? 'Đã thêm vào danh sách yêu thích.' : 'Đã xóa khỏi danh sách yêu thích.';
  });

  // Return to the books page.
  backBtn.addEventListener('click', () => {
    window.location.href = 'books.html';
  });

  renderBookDetails();
  renderRelatedBooks();
})();
