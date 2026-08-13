requireAuth();
renderSessionInfo("sessionInfo");
const tableBody = document.getElementById("authorTableBody");
const ICONS = { trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>' };

async function renderAuthors() {
  try {
    const authors = await AuthorStore.getAll();
    tableBody.innerHTML = "";
    if (!authors.length) {
      tableBody.innerHTML = `<tr><td colspan="3" class="no-results">No authors yet.</td></tr>`;
      return;
    }
    authors.forEach(author => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${author.name}</td><td>${author.bio ? author.bio : "<em>No biography</em>"}</td><td class="actions"><a href="author-form.html?id=${author.id}" class="text-action">Edit</a><a href="#" class="icon-btn delete-link" data-id="${author.id}" title="Delete">${ICONS.trash}</a></td>`;
      tableBody.appendChild(tr);
    });
    document.querySelectorAll(".delete-link").forEach(link => link.addEventListener("click", async e => {
      e.preventDefault();
      if (!confirm("Are you sure you want to delete this author?")) return;
      try { await AuthorStore.remove(e.currentTarget.dataset.id); await renderAuthors(); }
      catch (error) { alert(error.message); }
    }));
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="3" class="no-results">${error.message}</td></tr>`;
  }
}
renderAuthors();
