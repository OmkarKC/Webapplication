requireAuth();
renderSessionInfo("sessionInfo");
const params = new URLSearchParams(window.location.search);
const authorId = params.get("id");
const isEdit = Boolean(authorId);
const form = document.getElementById("authorForm");

async function loadExisting() {
  if (!isEdit) return;
  try {
    const author = await AuthorStore.getById(authorId);
    document.getElementById("formTitle").textContent = "Edit Author";
    document.getElementById("name").value = author.name;
    document.getElementById("bio").value = author.bio || "";
  } catch (error) { showErrors([{ message: error.message }], "errorBox"); }
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const authorData = { name: document.getElementById("name").value.trim(), bio: document.getElementById("bio").value.trim() };
  try {
    if (isEdit) await AuthorStore.update(authorId, authorData); else await AuthorStore.add(authorData);
    window.location.href = "author-list.html";
  } catch (error) { showErrors([{ message: error.message }], "errorBox"); }
});
loadExisting();
