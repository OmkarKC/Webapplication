requireAuth();
renderSessionInfo("sessionInfo");

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");
const detailContainer = document.getElementById("bookDetail");

async function loadBook() {
  try {
    const book = await BookStore.getById(bookId);
    const author = book.Author;
    const genre = book.Genre;
    const isLowStock = book.stock < 5;

    detailContainer.innerHTML = `
      <div class="detail-grid">
        <img src="${book.coverUrl || 'https://placehold.co/220x300?text=No+Cover'}" alt="${book.title} cover" class="detail-cover">
        <div class="detail-info">
          <h1>${book.title}</h1>
          <p><strong>Author:</strong> ${author ? author.name : "Unknown"}</p>
          <p><strong>Genre:</strong> <span class="genre-tag">${genre ? genre.name : "Unknown"}</span></p>
          <p><strong>Stock:</strong> <span class="stock-badge ${isLowStock ? 'low' : ''}">${book.stock} ${isLowStock ? "⚠️ Low stock" : ""}</span></p>
          <div class="detail-actions">
            <a href="book-form.html?id=${book.id}" class="add-btn">Edit Book</a>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    detailContainer.innerHTML = `<p class="no-results">${error.message}</p>`;
  }
}

loadBook();
