(() => {
  const grid = document.getElementById('books-grid');
  const search = document.getElementById('book-search');
  const form = document.getElementById('search-form');
  const category = document.getElementById('category-filter');
  const sort = document.getElementById('sort-select');
  const hiddenCategoryNames = new Set([
    'Technology', 'Literature', 'Economics',
    'Foreign Languages', 'Science', 'Life Skills'
  ]);
  let books = [];

  function syncCategoryToUrl() {
    const url = new URL(window.location.href);
    const selectedOption = category.options[category.selectedIndex];

    if (category.value === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', selectedOption.text);
    }

    window.history.replaceState({}, '', url);
  }

  function render() {
    const keyword = search.value.trim().toLowerCase();
    const selectedType = category.value;
    const result = books
      .filter(book => {
        const matchesKeyword = !keyword || `${book.name} ${book.author} ${book.publisher || ''}`.toLowerCase().includes(keyword);
        const matchesType = selectedType === 'all' || (book.types || []).some(type => String(type.id) === selectedType);
        return matchesKeyword && matchesType;
      })
      .sort((a, b) => (sort.value === 'author' ? a.author : a.name).localeCompare(sort.value === 'author' ? b.author : b.name));

    grid.innerHTML = result.length ? '' : '<p class="empty-state">Không có sách phù hợp.</p>';
    result.forEach(book => {
      const typeNames = (book.types || []).map(type => type.name).join(', ') || 'Chưa phân loại';
      const card = document.createElement('article');
      card.className = 'book-card';
      card.innerHTML = `<div class="book-cover"></div><div class="book-info"><h3>${book.name}</h3><p class="book-author">${book.author}</p><p class="book-category">${typeNames}</p><p class="book-availability">${book.status ? 'Có sẵn' : 'Đang được mượn'}</p></div><button class="borrow-btn" type="button">Mượn</button>`;
      card.querySelector('.borrow-btn').onclick = () => {
        localStorage.setItem('smartlibrary-borrow-cart', JSON.stringify([book]));
        window.location.href = `borrow.html?id=${book.id}`;
      };
      grid.appendChild(card);
    });
  }

  async function load() {
    try {
      const [loadedBooks, types] = await Promise.all([
        SmartLibraryApi.get('/books/'), SmartLibraryApi.get('/types/')
      ]);
      books = loadedBooks;
      const usedTypeIds = new Set(
        loadedBooks.flatMap(book => (book.types || []).map(type => type.id))
      );
      const visibleTypes = types.filter(type =>
        !hiddenCategoryNames.has(type.name) && usedTypeIds.has(type.id)
      );
      category.innerHTML = '<option value="all">Tất cả thể loại</option>' + visibleTypes.map(type => `<option value="${type.id}">${type.name}</option>`).join('');
      const categoryFromUrl = new URLSearchParams(window.location.search).get('category');
      const matchingType = visibleTypes.find(type => type.name === categoryFromUrl);
      if (matchingType) category.value = String(matchingType.id);
      render();
    } catch (error) {
      grid.innerHTML = `<p class="empty-state">Không tải được dữ liệu: ${error.message}</p>`;
    }
  }

  form.addEventListener('submit', event => { event.preventDefault(); render(); });
  search.addEventListener('input', render);
  sort.addEventListener('change', render);
  category.addEventListener('change', () => {
    syncCategoryToUrl();
    render();
  });
  load();
})();
