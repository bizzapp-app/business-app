// ===== Sample Users =====
let users = JSON.parse(localStorage.getItem("users")) || [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "cashier", password: "cash123", role: "cashier" }
];

let stock = JSON.parse(localStorage.getItem("stock")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

// ===== Save to Storage =====
function saveData() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("stock", JSON.stringify(stock));
  localStorage.setItem("sales", JSON.stringify(sales));
}

// ===== LOGIN =====
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("loginError");

  let user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    if (user.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "pos.html";
    }
  } else {
    error.textContent = "Invalid username or password!";
  }
}

// ===== SESSION CHECK =====
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const path = window.location.pathname;

  if (!user && !path.endsWith("login.html") && !path.endsWith("index.html")) {
    window.location.href = "login.html";
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }

  if (user) {
    if (user.role === "admin" && path.endsWith("admin.html")) loadAdmin();
    if (user.role === "cashier" && path.endsWith("pos.html")) loadPOS();
  }
});

// ===== ADMIN FUNCTIONS =====
function addStock() {
  const name = document.getElementById("itemName").value;
  const price = parseFloat(document.getElementById("itemPrice").value);
  const qty = parseInt(document.getElementById("itemStock").value);

  if (name && price > 0 && qty > 0) {
    stock.push({ name, price, qty });
    saveData();
    loadAdmin();
  }
}

function addEmployee() {
  const username = document.getElementById("empUser").value;
  const password = document.getElementById("empPass").value;
  if (username && password) {
    users.push({ username, password, role: "cashier" });
    saveData();
    loadAdmin();
  }
}

function loadAdmin() {
  document.getElementById("stockList").innerHTML = stock.map((item, i) =>
    `<li>${item.name} - $${item.price} (x${item.qty})</li>`).join("");

  document.getElementById("employeeList").innerHTML = users
    .filter(u => u.role === "cashier")
    .map(u => `<li>${u.username}</li>`).join("");
}

function viewReports() {
  let total = sales.reduce((sum, s) => sum + s.total, 0);
  document.getElementById("reports").innerHTML = `
    <h3>Total Sales: $${total.toFixed(2)}</h3>
    <ul>${sales.map(s => `<li>${s.items.join(", ")} - $${s.total.toFixed(2)}</li>`).join("")}</ul>
  `;
}

// ===== POS FUNCTIONS =====
let cart = [];

function loadPOS() {
  document.getElementById("productList").innerHTML = stock.map((item, i) =>
    `<li>${item.name} - $${item.price} (x${item.qty})
     <button onclick="addToCart(${i})">Add</button></li>`).join("");
  updateCart();
}

function addToCart(index) {
  let item = stock[index];
  if (item.qty > 0) {
    cart.push(item);
    stock[index].qty -= 1;
    updateCart();
  } else {
    alert("Out of stock!");
  }
}

function updateCart() {
  let total = cart.reduce((sum, i) => sum + i.price, 0);
  document.getElementById("cartList").innerHTML = cart.map(i =>
    `<li>${i.name} - $${i.price}</li>`).join("");
  document.getElementById("cartTotal").textContent = total.toFixed(2);
}

function checkout() {
  if (cart.length === 0) return;

  let total = cart.reduce((sum, i) => sum + i.price, 0);
  let items = cart.map(i => i.name);
  sales.push({ items, total, date: new Date().toLocaleString() });
  saveData();

  document.getElementById("receipt").textContent =
    `Receipt\n${items.join(", ")}\nTotal: $${total.toFixed(2)}\nDate: ${new Date().toLocaleString()}`;

  cart = [];
  updateCart();
  loadPOS();
}


