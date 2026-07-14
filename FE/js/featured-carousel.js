(() => {
  const track = document.getElementById('featured-books-track');
  const previousButton = document.querySelector('[data-carousel="previous"]');
  const nextButton = document.querySelector('[data-carousel="next"]');
  if (!track || !previousButton || !nextButton) return;

  const updateControls = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    previousButton.disabled = track.scrollLeft <= 1;
    nextButton.disabled = track.scrollLeft >= maxScroll - 1;
  };
  const scrollCarousel = direction => track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' });

  previousButton.addEventListener('click', () => scrollCarousel(-1));
  nextButton.addEventListener('click', () => scrollCarousel(1));
  track.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);

  async function loadFeaturedBooks() {
    try {
      const [books, borrows] = await Promise.all([
        SmartLibraryApi.get('/books/'),
        SmartLibraryApi.get('/borrows/')
      ]);
      const borrowCounts = new Map();
      borrows.forEach(borrow => {
        const bookId = borrow.book?.id;
        if (bookId != null) {
          borrowCounts.set(bookId, (borrowCounts.get(bookId) || 0) + (borrow.quantity || 1));
        }
      });

      const featuredBooks = books
        .filter(book => borrowCounts.has(book.id))
        .sort((first, second) => borrowCounts.get(second.id) - borrowCounts.get(first.id))
        .slice(0, 12);

      track.innerHTML = '';
      if (!featuredBooks.length) {
        track.innerHTML = '<p class="empty-state">Chưa có lượt mượn để xếp hạng sách nổi bật.</p>';
        updateControls();
        return;
      }

      featuredBooks.forEach(book => {
        const typeNames = (book.types || []).map(type => type.name).join(', ') || 'Chưa phân loại';
        const cover = book.image
          ? `<img class="book-cover featured-cover-image" src="${book.image}" alt="Bìa ${book.name}">`
          : '<div class="book-cover" aria-hidden="true"></div>';
        const card = document.createElement('article');
        card.className = 'book-card';
        card.innerHTML = `${cover}<h3>${book.name}</h3><p class="meta">${book.author} · ${typeNames}</p><p class="meta">${borrowCounts.get(book.id)} lượt mượn</p><div class="book-actions"><a href="pages/book-detail.html?id=${book.id}">Xem chi tiết</a></div>`;
        track.appendChild(card);
      });
      updateControls();
    } catch (error) {
      track.innerHTML = '<p class="empty-state">Không thể tải sách nổi bật.</p>';
      updateControls();
    }
  }

  loadFeaturedBooks();
})();
