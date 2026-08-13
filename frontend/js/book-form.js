requireAuth();
renderSessionInfo("sessionInfo");

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");
const isEdit = Boolean(bookId);
const form = document.getElementById("bookForm");
const authorSelect = document.getElementById("author");
const genreSelect = document.getElementById("genre");
const coverInput = document.getElementById("cover");
const coverPreview = document.getElementById("coverPreview");
let selectedCoverFile = null;

async function populateDropdowns() {
  const [authors, genres] = await Promise.all([AuthorStore.getAll(), GenreStore.getAll()]);
  authorSelect.innerHTML = '<option value="">Select author</option>';
  genreSelect.innerHTML = '<option value="">Select genre</option>';

  authors.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.name;
    authorSelect.appendChild(opt);
  });
  genres.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.name;
    genreSelect.appendChild(opt);
  });
}

async function loadExistingBook() {
  if (!isEdit) return;
  try {
    const book = await BookStore.getById(bookId);
    document.getElementById("formTitle").textContent = "Edit Book";
    document.getElementById("title").value = book.title;
    authorSelect.value = book.authorId;
    genreSelect.value = book.genreId;
    document.getElementById("stock").value = book.stock;

    if (book.coverUrl) {
      coverPreview.src = book.coverUrl;
      coverPreview.style.display = "block";
    }
  } catch (error) {
    showErrors([{ message: error.message }], "errorBox");
  }
}

coverInput.addEventListener("change", () => {
  const file = coverInput.files[0];
  selectedCoverFile = file || null;
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    selectedCoverFile = null;
    coverInput.value = "";
    showErrors([{ message: "Cover image must be a real image file." }], "errorBox");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    coverPreview.src = reader.result;
    coverPreview.style.display = "block";
  };
  reader.readAsDataURL(file);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bookData = {
    title: document.getElementById("title").value.trim(),
    authorId: authorSelect.value ? Number(authorSelect.value) : "",
    genreId: genreSelect.value ? Number(genreSelect.value) : "",
    stock: document.getElementById("stock").value,
    coverFile: selectedCoverFile
  };

  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton) submitButton.disabled = true;

  try {
    if (isEdit) await BookStore.update(bookId, bookData);
    else await BookStore.add(bookData);
    window.location.href = "book-list.html";
  } catch (error) {
    showErrors([{ message: error.message }], "errorBox");
    if (submitButton) submitButton.disabled = false;
  }
});

(async function init() {
  try {
    await populateDropdowns();
    await loadExistingBook();
  } catch (error) {
    showErrors([{ message: error.message }], "errorBox");
  }
})();
