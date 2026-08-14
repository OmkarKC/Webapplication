requireAuth();
renderSessionInfo("sessionInfo");

const LOW_STOCK_THRESHOLD = 5;
const tableBody = document.getElementById("bookTableBody");
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const noResults = document.getElementById("noResults");

const ICONS = {
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>'
};

async function populateGenreFilter() {
  const genres = await GenreStore.getAll();
  genreFilter.innerHTML = '<option value="">All genres</option>';
  genres.forEach(genre => {
    const opt = document.createElement("option");
    opt.value = genre.id;
    opt.textContent = genre.name;
    genreFilter.appendChild(opt);
  });
}

async function renderBooks() {
  try {
    const searchTerm = searchInput.value.trim();
    const selectedGenreId = genreFilter.value;
    const filtered = await BookStore.getAll({ title: searchTerm, genreId: selectedGenreId });

    tableBody.innerHTML = "";
    if (filtered.length === 0) {
      noResults.style.display = "block";
      noResults.textContent = "No books match your search.";
      return;
    }

    noResults.style.display = "none";
    filtered.forEach(book => {
      const isLowStock = book.stock < LOW_STOCK_THRESHOLD;
      const author = book.Author;
      const genre = book.Genre;
      const tr = document.createElement("tr");
      if (isLowStock) tr.classList.add("low-stock");

      tr.innerHTML = `
        <td><img src="${book.coverUrl || 'https://placehold.co/40x56?text=No+Cover'}" alt="${book.title} cover" class="cover-thumb"></td>
        <td>${book.title}</td>
        <td>${author ? author.name : "Unknown"}</td>
        <td><span class="genre-tag">${genre ? genre.name : "Unknown"}</span></td>
        <td><span class="stock-badge ${isLowStock ? 'low' : ''}">${book.stock} ${isLowStock ? "" : ""}</span></td>
        <td class="actions">
          <a href="book-view.html?id=${book.id}" class="text-action">View</a>
          <a href="book-form.html?id=${book.id}" class="text-action">Edit</a>
          <a href="#" class="icon-btn delete-link" data-id="${book.id}" title="Delete">${ICONS.trash}</a>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    document.querySelectorAll(".delete-link").forEach(link => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = e.currentTarget.dataset.id;
        if (!confirm("Are you sure you want to delete this book?")) return;
        try {
          await BookStore.remove(id);
          await renderBooks();
        } catch (error) {
          alert(error.message);
        }
      });
    });
  } catch (error) {
    noResults.style.display = "block";
    noResults.textContent = error.message;
  }
}

searchInput.addEventListener("input", renderBooks);
genreFilter.addEventListener("change", renderBooks);
const searchBtn = document.querySelector(".search-btn");
if (searchBtn) searchBtn.addEventListener("click", renderBooks);

(async function init() {
  await populateGenreFilter();
  await renderBooks();
})();
