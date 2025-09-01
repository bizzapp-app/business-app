// Load Data
let stock = JSON.parse(localStorage.getItem("stock")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  users = users.map(u => u.username === currentUser.username ? { ...u, loggedIn: false } : u);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

// ===== STOCK =====
function renderStock() {
  const table = document.getElementById("stockTable");
  table.innerHTML = "<tr><th>Item</th><th>Qty</th><th>Price</th><th>Action</th></tr>";
  stock.forEach((item, i) => {
    table.innerHTML += `<tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>KES ${item.price}</td>
      <td><button onclick="deleteStock(${i})">❌</button></td>
    </tr>`;
  });
  localStorage.setItem("stock", JSON.stringify(stock));
  loadSaleItems();
  updateOverview();
}

document.getElementById("stockForm").addEventListener("submit", e => {
  e.preventDefault();
  let name = document.getElementById("itemName").value;
  let qty = parseInt(document.getElementById("itemQty").value);
  let price = parseFloat(document.getElementById("itemPrice").value);

  let existing = stock.find(s => s.name === name);
  if (existing) {
    existing.quantity += qty;
    existing.price = price;
  } else {
    stock.push({ name, quantity: qty, price });
  }
  renderStock();
});

function deleteStock(i) {
  stock.splice(i, 1);
  renderStock();
}

// ===== SALES =====
function loadSaleItems() {
  let dropdown = document.getElementById("saleItem");
  dropdown.innerHTML = "";
  stock.forEach((s, i) => {
    dropdown.innerHTML += `<option value="${i}">${s.name} (KES ${s.price})</option>`;
  });
}

document.getElementById("salesForm").addEventListener("submit", e => {
  e.preventDefault();
  let i = document.getElementById("saleItem").value;
  if (stock[i].quantity > 0) {
    stock[i].quantity--;
    sales.push({ product: stock[i].name, price: stock[i].price, employee: currentUser.username, date: new Date() });
    renderStock();
    renderSales();
  }
});

function renderSales() {
  const table = document.getElementById("salesTable");
  table.innerHTML = "<tr><th>Product</th><th>Price</th><th>Employee</th><th>Date</th></tr>";
  sales.forEach(s => {
    table.innerHTML += `<tr>
      <td>${s.product}</td>
      <td>KES ${s.price}</td>
      <td>${s.employee}</td>
      <td>${new Date(s.date).toLocaleString()}</td>
    </tr>`;
  });
  localStorage.setItem("sales", JSON.stringify(sales));
  updateOverview();
}

// ===== EXPENSES =====
document.getElementById("expenseForm").addEventListener("submit", e => {
  e.preventDefault();
  let name = document.getElementById("expenseName").value;
  let amount = parseFloat(document.getElementById("expenseAmount").value);
  expenses.push({ name, amount, date: new Date() });
  renderExpenses();
});

function renderExpenses() {
  const table = document.getElementById("expenseTable");
  table.innerHTML = "<tr><th>Name</th><th>Amount</th><th>Date</th></tr>";
  expenses.forEach(e => {
    table.innerHTML += `<tr>
      <td>${e.name}</td>
      <td>KES ${e.amount}</td>
      <td>${new Date(e.date).toLocaleString()}</td>
    </tr>`;
  });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateOverview();
}

// ===== OVERVIEW =====
function updateOverview() {
  let stockValue = stock.reduce((sum, s) => sum + s.price * s.quantity, 0);
  let today = new Date().toDateString();
  let todaySales = sales.filter(s => new Date(s.date).toDateString() === today)
    .reduce((sum, s) => sum + s.price, 0);
  let productCount = {};
  sales.forEach(s => productCount[s.product] = (productCount[s.product] || 0) + 1);
  let topItem = Object.keys(productCount).length ? Object.keys(productCount).reduce((a, b) => productCount[a] > productCount[b] ? a : b) : "N/A";
  let loggedEmployees = users.filter(u => u.loggedIn).length;

  document.getElementById("overview").innerHTML = `
    <p><strong>Total Stock Value:</strong> KES ${stockValue}</p>
    <p><strong>Total Sales Today:</strong> KES ${todaySales}</p>
    <p><strong>Top Item:</strong> ${topItem}</p>
    <p><strong>Employees Logged In:</strong> ${loggedEmployees}</p>
  `;
}

// Init
renderStock();
renderSales();
renderExpenses();
