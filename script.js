// Dummy users (Admin + Employees)
const users = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "employee1", password: "1234", role: "employee" },
  { username: "employee2", password: "1234", role: "employee" }
];

// Handle Login
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password!");
  }
});
