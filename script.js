const users = JSON.parse(localStorage.getItem("users")) || [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "cashier", password: "cashier123", role: "cashier" }
];

document.getElementById("loginForm")?.addEventListener("submit", function(e){
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let user = users.find(u => u.username === username && u.password === password);

  if(user){
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    if(user.role === "admin"){
      window.location.href = "admin.html";
    } else {
      window.location.href = "pos.html";
    }
  } else {
    alert("Invalid login");
  }
});

function logout(){
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
