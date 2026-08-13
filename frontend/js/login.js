if (getSession() && getToken()) {
  window.location.href = "book-list.html";
}

const loginForm = document.getElementById("loginForm");
const errorBox = document.getElementById("errorBox");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const submitButton = loginForm.querySelector("button[type='submit']");
  if (submitButton) submitButton.disabled = true;

  const result = await login(username, password);
  if (!result.success) {
    errorBox.style.display = "block";
    errorBox.textContent = result.message;
    if (submitButton) submitButton.disabled = false;
    return;
  }

  window.location.href = "book-list.html";
});
