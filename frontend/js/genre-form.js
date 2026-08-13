requireAuth();
renderSessionInfo("sessionInfo");
const params = new URLSearchParams(window.location.search);
const genreId = params.get("id");
const isEdit = Boolean(genreId);
const form = document.getElementById("genreForm");

async function loadExisting() {
  if (!isEdit) return;
  try {
    const genre = await GenreStore.getById(genreId);
    document.getElementById("formTitle").textContent = "Edit Genre";
    document.getElementById("name").value = genre.name;
  } catch (error) { showErrors([{ message: error.message }], "errorBox"); }
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const genreData = { name: document.getElementById("name").value.trim() };
  try {
    if (isEdit) await GenreStore.update(genreId, genreData); else await GenreStore.add(genreData);
    window.location.href = "genre-list.html";
  } catch (error) { showErrors([{ message: error.message }], "errorBox"); }
});
loadExisting();
