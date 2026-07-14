(() => {
  const grid = document.getElementById('books-grid');
  const search = document.getElementById('book-search');
  const form = document.getElementById('search-form');
  const category = document.getElementById('category-filter');
  const sort = document.getElementById('sort-select');
  const pagination = document.getElementById('pagination');
  const pageSize = 15;
  const hiddenCategoryNames = new Set([
    'Technology', 'Literature', 'Economics',
    'Foreign Languages', 'Science', 'Life Skills'
  ]);
  let books = [];
  let currentPage = 1;

  function syncCategoryToUrl() {
    const url = new URL(window.location.href);
    const selectedOption = category.options[category.selectedIndex];
    if (category.value === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', selectedOption.text);
    window.history.replaceState({}, '', url);
  }

  function renderPagination(totalPages, hasBooks) {
    pagination.innerHTML = '';
    if (!hasBooks || totalPages <= 1) return;
    for (let page = 1; page <= totalPages; page += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = page;
      button.classList.toggle('active', page === currentPage);
      button.onclick = () => {
        currentPage = page;
        render();
        document.getElementById('books-grid-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      pagination.appendChild(button);
    }
  }

  function render() {
    const keyword = search.value.trim().toLowerCase();
    const selectedType = category.value;
    const result = books
      .filter(book => {
        const matchesKeyword = !keyword || `${book.name} ${book.author} ${book.publisher || ''}`.toLowerCase().includes(keyword);
        return matchesKeyword && (selectedType === 'all' || (book.types || []).some(type => String(type.id) === selectedType));
      })
      .sort((a, b) => (sort.value === 'author' ? a.author : a.name).localeCompare(sort.value === 'author' ? b.author : b.name));

    const totalPages = Math.max(1, Math.ceil(result.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    const pageBooks = result.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    grid.innerHTML = result.length ? '' : '<p class="empty-state">Không có sách phù hợp.</p>';
    pageBooks.forEach(book => {
      const typeNames = (book.types || []).map(type => type.name).join(', ') || 'Chưa phân loại';
      const card = document.createElement('article');
      card.className = 'book-card';
      const cover = book.image ? `<img class="book-cover" src="${book.image}" alt="Bìa ${book.name}">` : '<div class="book-cover"></div>';
      card.innerHTML = `${cover}<div class="book-info"><h3>${book.name}</h3><p class="book-author">${book.author}</p><p class="book-category">${typeNames}</p><p class="book-availability">${book.status ? 'Có sẵn' : 'Đang được mượn'}</p></div><button class="borrow-btn" type="button">Mượn</button>`;
      card.querySelector('.borrow-btn').onclick = () => {
        localStorage.setItem('smartlibrary-borrow-cart', JSON.stringify([book]));
        window.location.href = `borrow.html?id=${book.id}`;
      };
      grid.appendChild(card);
    });
    renderPagination(totalPages, result.length > 0);
  }

  async function load() {
    try {
      const [loadedBooks, types] = await Promise.all([
        SmartLibraryApi.get('/books/'), SmartLibraryApi.get('/types/')
      ]);
      books = loadedBooks;
      const usedTypeIds = new Set(loadedBooks.flatMap(book => (book.types || []).map(type => type.id)));
      const visibleTypes = types.filter(type => !hiddenCategoryNames.has(type.name) && usedTypeIds.has(type.id));
      category.innerHTML = '<option value="all">Tất cả thể loại</option>' + visibleTypes.map(type => `<option value="${type.id}">${type.name}</option>`).join('');
      const categoryFromUrl = new URLSearchParams(window.location.search).get('category');
      const matchingType = visibleTypes.find(type => type.name === categoryFromUrl);
      if (matchingType) category.value = String(matchingType.id);
      render();
    } catch (error) {
      grid.innerHTML = `<p class="empty-state">Không tải được dữ liệu: ${error.message}</p>`;
    }
  }

  const resetPageAndRender = () => { currentPage = 1; render(); };
  form.addEventListener('submit', event => { event.preventDefault(); resetPageAndRender(); });
  search.addEventListener('input', resetPageAndRender);
  sort.addEventListener('change', resetPageAndRender);
  category.addEventListener('change', () => { syncCategoryToUrl(); resetPageAndRender(); });
  load();
})();
