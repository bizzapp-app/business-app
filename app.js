// Default users (stored in localStorage)
if (!localStorage.getItem("users")) {
  const defaultUsers = [
    { username: "admin", password: "1234", role: "admin", loggedIn: false },
    { username: "staff1", password: "1234", role: "employee", loggedIn: false }
  ];
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// Login Form
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  let users = JSON.parse(localStorage.getItem("users"));

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    user.loggedIn = true;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("loginError").textContent = "Invalid credentials!";
  }
});
