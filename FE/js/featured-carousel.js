(() => {
  const track = document.getElementById('featured-books-track');
  const previousButton = document.querySelector('[data-carousel="previous"]');
  const nextButton = document.querySelector('[data-carousel="next"]');

  if (!track || !previousButton || !nextButton) return;

  const featuredBookIds = [1, 2, 6, 3, 4, 5];
  track.querySelectorAll('.book-actions a').forEach((link, index) => {
    link.href = `pages/book-detail.html?id=${featuredBookIds[index]}`;
  });

  const featuredBooks = [
    ['Lập trình sạch', 'Robert C. Martin · Công nghệ'],
    ['Hobbit', 'J.R.R. Tolkien · Văn học'],
    ['Thói quen nguyên tử', 'James Clear · Kỹ năng sống'],
    ['Tư duy nhanh và chậm', 'Daniel Kahneman · Kinh tế'],
    ['Tiếng Anh cho mọi người', 'DK · Ngoại ngữ'],
    ['Vật lý cho người mới bắt đầu', 'Mina Singh · Khoa học']
  ];

  track.querySelectorAll('.book-card').forEach((card, index) => {
    const [title, meta] = featuredBooks[index] || [];
    if (title) card.querySelector('h3').textContent = title;
    if (meta) card.querySelector('.meta').textContent = meta;
  });

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
  updateControls();
})();
