(() => {
  const bookId = Number(new URLSearchParams(window.location.search).get('id'));
  const cover = document.getElementById('book-cover');
  const title = document.getElementById('book-detail-title');
  const author = document.getElementById('book-author');
  const category = document.getElementById('book-category');
  const publisher = document.getElementById('book-publisher');
  const year = document.getElementById('book-year');
  const isbn = document.getElementById('book-isbn');
  const status = document.getElementById('book-status');
  const description = document.getElementById('book-description');
  const borrowBtn = document.getElementById('borrow-btn');
  const favoriteBtn = document.getElementById('favorite-btn');
  const backBtn = document.getElementById('back-btn');
  const message = document.getElementById('action-message');
  let currentBook;

  const favorites = () => JSON.parse(localStorage.getItem('smartlibrary-favorite-book-ids') || '[]');
  const saveFavorites = ids => localStorage.setItem('smartlibrary-favorite-book-ids', JSON.stringify(ids));
  const updateFavoriteButton = () => {
    const isFavorite = favorites().includes(currentBook.id);
    favoriteBtn.textContent = isFavorite ? 'Đã thêm vào yêu thích' : 'Thêm vào yêu thích';
    favoriteBtn.classList.toggle('is-favorite', isFavorite);
  };

  function renderBook() {
    const typeNames = (currentBook.types || []).map(type => type.name).join(', ') || 'Chưa phân loại';
    document.title = `SmartLibrary | ${currentBook.name}`;
    title.textContent = currentBook.name;
    author.textContent = currentBook.author;
    category.textContent = typeNames;
    publisher.textContent = currentBook.publisher || '-';
    year.textContent = currentBook.release_day ? currentBook.release_day.slice(0, 4) : '-';
    isbn.textContent = currentBook.isbn || '-';
    status.textContent = currentBook.status ? 'Có sẵn' : 'Đang được mượn';
    description.textContent = currentBook.description || 'Sách chưa có mô tả.';
    cover.innerHTML = currentBook.image
      ? `<img src="${currentBook.image}" alt="Bìa ${currentBook.name}">`
      : '';
    cover.classList.toggle('has-image', Boolean(currentBook.image));
    updateFavoriteButton();
  }

  async function loadBook() {
    try {
      const books = await SmartLibraryApi.get('/books/');
      currentBook = books.find(book => book.id === bookId);
      if (!currentBook) throw new Error('Không tìm thấy sách.');
      renderBook();
    } catch (error) {
      title.textContent = 'Không thể tải thông tin sách';
      message.textContent = error.message || 'Vui lòng thử lại sau.';
      message.style.color = '#b91c1c';
      borrowBtn.disabled = true;
      favoriteBtn.disabled = true;
    }
  }

  borrowBtn.addEventListener('click', () => {
    if (!currentBook) return;
    if (!SmartLibraryApi.currentUser()) {
      window.location.href = 'login.html';
      return;
    }
    if (!currentBook.status) {
      message.textContent = 'Sách hiện đang được mượn.';
      return;
    }
    localStorage.setItem('smartlibrary-borrow-cart', JSON.stringify([currentBook]));
    window.location.href = `borrow.html?id=${currentBook.id}`;
  });

  favoriteBtn.addEventListener('click', () => {
    if (!currentBook) return;
    const ids = favorites();
    const index = ids.indexOf(currentBook.id);
    if (index >= 0) {
      ids.splice(index, 1);
      message.textContent = 'Đã xóa khỏi danh sách yêu thích.';
    } else {
      ids.push(currentBook.id);
      message.textContent = 'Đã thêm vào danh sách yêu thích.';
    }
    saveFavorites(ids);
    updateFavoriteButton();
  });
  backBtn.addEventListener('click', () => { window.location.href = 'books.html'; });
  loadBook();
})();
