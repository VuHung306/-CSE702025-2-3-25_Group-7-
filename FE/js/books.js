(() => {
  const grid = document.getElementById('books-grid');
  const search = document.getElementById('book-search');
  const form = document.getElementById('search-form');
  const category = document.getElementById('category-filter');
  const sort = document.getElementById('sort-select');
  let books = [];

  const render = () => {
    const keyword = search.value.trim().toLowerCase();
    const result = books.filter(book => !keyword || `${book.name} ${book.author} ${book.publisher || ''}`.toLowerCase().includes(keyword))
      .sort((a, b) => (sort.value === 'author' ? a.author : a.name).localeCompare(sort.value === 'author' ? b.author : b.name));
    grid.innerHTML = result.length ? '' : '<p class="empty-state">Chưa có sách phù hợp.</p>';
    result.forEach(book => {
      const card = document.createElement('article');
      card.className = 'book-card';
      card.innerHTML = `<div class="book-cover"></div><div class="book-info"><h3>${book.name}</h3><p class="book-author">${book.author}</p><p class="book-category">${book.publisher || 'Chưa cập nhật NXB'}</p><p class="book-availability">${book.status ? 'Có sẵn' : 'Đang được mượn'}</p></div><button class="borrow-btn" type="button">Mượn</button>`;
      card.querySelector('.borrow-btn').onclick = () => {
        localStorage.setItem('smartlibrary-borrow-cart', JSON.stringify([book]));
        window.location.href = `borrow.html?id=${book.id}`;
      };
      grid.appendChild(card);
    });
  };
  async function load() {
    try { books = await SmartLibraryApi.get('/books/'); render(); }
    catch (error) { grid.innerHTML = `<p class="empty-state">Không tải được dữ liệu: ${error.message}</p>`; }
  }
  form.addEventListener('submit', e => { e.preventDefault(); render(); });
  search.addEventListener('input', render); sort.addEventListener('change', render); category.addEventListener('change', render);
  load();
})();
