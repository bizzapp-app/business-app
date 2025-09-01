// ====== USER DATA ======
let users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "cashier1", password: "1234", role: "staff" }
];

// ====== STORAGE ======
let stock = JSON.parse(localStorage.getItem("stock")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
let receipts = JSON.parse(localStorage.getItem("receipts")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// ====== LOGIN ======
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        if (user.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "pos.html";
        }
      } else {
        document.getElementById("loginMessage").textContent = "Invalid login!";
      }
    });
  }

  // Admin page functions
  if (window.location.pathname.includes("admin.html")) {
    renderStock();
    renderReceipts();
    renderSalesSummary();
    document.getElementById("stockForm").addEventListener("submit", addStock);
  }

  // POS page functions
  if (window.location.pathname.includes("pos.html")) {
    renderPosItems();
    renderMyReceipts();
  }
});

// ====== LOGOUT ======
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ====== ADMIN FUNCTIONS ======
function addStock(e) {
  e.preventDefault();
  let itemName = document.getElementById("itemName").value;
  let itemPrice = parseFloat(document.getElementById("itemPrice").value);
  let itemQty = parseInt(document.getElementById("itemQty").value);

  stock.push({ name: itemName, price: itemPrice, qty: itemQty });
  localStorage.setItem("stock", JSON.stringify(stock));
  renderStock();
  e.target.reset();
}

function renderStock() {
  let container = document.getElementById("stockList");
  if (!container) return;
  container.innerHTML = "";
  stock.forEach((item, index) => {
    container.innerHTML += `
      <p>${item.name} - KES ${item.price} (Qty: ${item.qty})
      <button onclick="deleteStock(${index})">Delete</button></p>
    `;
  });
}

function deleteStock(index) {
  stock.splice(index, 1);
  localStorage.setItem("stock", JSON.stringify(stock));
  renderStock();
}

function renderSalesSummary() {
  let container = document.getElementById("salesSummary");
  if (!container) return;
  let totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  container.innerHTML = `<p>Total Sales: KES ${totalSales}</p>`;
}

function renderReceipts() {
  let container = document.getElementById("receiptList");
  if (!container) return;
  container.innerHTML = "";
  receipts.forEach((r, i) => {
    container.innerHTML += `<p>Receipt #${i+1} - ${r.user} - KES ${r.total}
      <button onclick="voidReceipt(${i})">Void</button></p>`;
  });
}

function voidReceipt(i) {
  receipts.splice(i, 1);
  localStorage.setItem("receipts", JSON.stringify(receipts));
  renderReceipts();
}

// ====== POS FUNCTIONS ======
let cart = [];

function renderPosItems() {
  let container = document.getElementById("posItems");
  if (!container) return;
  container.innerHTML = "";
  stock.forEach((item, index) => {
    container.innerHTML += `
      <p>${item.name} - KES ${item.price} (Qty: ${item.qty})
      <button onclick="addToCart(${index})">Add</button></p>
    `;
  });
}

function addToCart(index) {
  let item = stock[index];
  if (item.qty > 0) {
    cart.push({ ...item, index });
    item.qty--;
    localStorage.setItem("stock", JSON.stringify(stock));
    renderPosItems();
    renderCart();
  } else {
    alert("Out of stock!");
  }
}

function renderCart() {
  let container = document.getElementById("cart");
  container.innerHTML = "";
  cart.forEach((item, i) => {
    container.innerHTML += `<p>${item.name} - KES ${item.price}</p>`;
  });
}

function checkout() {
  if (cart.length === 0) return alert("Cart is empty!");
  let total = cart.reduce((sum, i) => sum + i.price, 0);
  let receipt = { user: currentUser.username, items: cart, total, date: new Date() };
  receipts.push(receipt);
  sales.push({ user: currentUser.username, total, date: new Date() });
  localStorage.setItem("receipts", JSON.stringify(receipts));
  localStorage.setItem("sales", JSON.stringify(sales));
  cart = [];
  renderCart();
  renderMyReceipts();
  alert("Checkout successful! Receipt generated.");
}

function renderMyReceipts() {
  let container = document.getElementById("myReceipts");
  if (!container) return;
  container.innerHTML = "";
  receipts.filter(r => r.user === currentUser.username).forEach((r, i) => {
    container.innerHTML += `<p>Receipt #${i+1} - KES ${r.total}</p>`;
  });
}
