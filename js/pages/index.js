import { getCurrentUser, login, redirectToRoleHome } from "../modules/auth.js";
import { getUsers } from "../modules/data.js";
import { escapeHtml, setStatusMessage } from "../modules/ui.js";

function groupUsers(users) {
  return {
    student: users.filter((user) => user.role === "student"),
    teacher: users.filter((user) => user.role === "teacher"),
    admin: users.filter((user) => user.role === "admin")
  };
}

function renderAccountCards(users) {
  const container = document.getElementById("demoAccounts");
  const groups = groupUsers(users);

  container.innerHTML = Object.entries(groups)
    .map(
      ([role, members]) => `
        <section class="account-group">
          <div class="section-heading">
            <h3>${escapeHtml(role)} access</h3>
            <span>${members.length} demo account(s)</span>
          </div>
          <div class="account-grid">
            ${members
              .map(
                (user) => `
                  <button class="account-card" data-email="${escapeHtml(user.email)}" data-password="${escapeHtml(
                    user.password
                  )}">
                    <strong>${escapeHtml(user.name)}</strong>
                    <span>${escapeHtml(user.email)}</span>
                    <small>Password: ${escapeHtml(user.password)}</small>
                    <small>${escapeHtml(user.classGroup || user.role)}</small>
                  </button>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");

  container.querySelectorAll(".account-card").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById("email").value = button.dataset.email;
      document.getElementById("password").value = button.dataset.password;
      setStatusMessage("loginMessage", "Demo credentials filled. Submit to enter the workspace.");
    });
  });
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const submitButton = document.getElementById("loginButton");
  submitButton.disabled = true;

  try {
    const user = await login(email, password);
    if (!user) {
      setStatusMessage("loginMessage", "Invalid email or password. Use one of the demo accounts.", "error");
      return;
    }

    redirectToRoleHome(user);
  } catch (error) {
    console.error(error);
    setStatusMessage("loginMessage", "Unable to sign in. Check that the app is loaded via localhost.", "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function init() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    redirectToRoleHome(currentUser);
    return;
  }

  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  const users = await getUsers();
  renderAccountCards(users);
}

init();
