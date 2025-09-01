// Check login
const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
  alert("Please login first");
  window.location.href = "index.html";
}

// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// Load data
let sales = JSON.parse(localStorage.getItem("sales")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// ===== Add Sale =====
function addSale() {
  const name = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("productPrice").value);

  if (name && price) {
    sales.push({ product: name, price });
    localStorage.setItem("sales", JSON.stringify(sales));
    displaySales();
    updateSummary();
    renderCharts();
  }
}

// ===== Add Expense =====
function addExpense() {
  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);

  if (name && amount) {
    expenses.push({ name, amount });
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
    updateSummary();
    renderCharts();
  }
}

// ===== Display Sales & Expenses =====
function displaySales() {
  document.getElementById("salesList").innerHTML = sales.map(s => `<li>${s.product} - $${s.price}</li>`).join("");
}
function displayExpenses() {
  document.getElementById("expensesList").innerHTML = expenses.map(e => `<li>${e.name} - $${e.amount}</li>`).join("");
}

// ===== Update Summary =====
function updateSummary() {
  const totalSales = sales.reduce((a, b) => a + b.price, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const netProfit = totalSales - totalExpenses;

  document.getElementById("totalSales").innerText = totalSales;
  document.getElementById("totalExpenses").innerText = totalExpenses;
  document.getElementById("netProfit").innerText = netProfit;
}

// ===== Charts =====
let salesChart, expensesChart, profitChart;

function renderCharts() {
  const salesLabels = sales.map(s => s.product);
  const salesData = sales.map(s => s.price);

  const expenseLabels = expenses.map(e => e.name);
  const expenseData = expenses.map(e => e.amount);

  let totalSales = salesData.reduce((a, b) => a + b, 0);
  let totalExpenses = expenseData.reduce((a, b) => a + b, 0);
  let netProfit = totalSales - totalExpenses;

  if (salesChart) salesChart.destroy();
  if (expensesChart) expensesChart.destroy();
  if (profitChart) profitChart.destroy();

  salesChart = new Chart(document.getElementById("salesChart"), {
    type: "bar",
    data: { labels: salesLabels, datasets: [{ data: salesData, backgroundColor: "#4cafef" }] }
  });

  expensesChart = new Chart(document.getElementById("expensesChart"), {
    type: "doughnut",
    data: { labels: expenseLabels, datasets: [{ data: expenseData, backgroundColor: ["#ff6384","#36a2eb","#4bc0c0","#ff9f40"] }] }
  });

  profitChart = new Chart(document.getElementById("profitChart"), {
    type: "pie",
    data: { labels: ["Profit", "Expenses"], datasets: [{ data: [netProfit > 0 ? netProfit : 0, totalExpenses], backgroundColor: ["#00c897","#e63946"] }] }
  });
}

// Initialize
displaySales();
displayExpenses();
updateSummary();
renderCharts();


// ====================== STOCK MANAGEMENT ======================
let stock = JSON.parse(localStorage.getItem("stock")) || [];

// Render stock table
function renderStock() {
  const tbody = document.querySelector("#stockTable tbody");
  tbody.innerHTML = "";
  stock.forEach((item, index) => {
    const row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>
          <button onclick="editStock(${index})">✏️ Edit</button>
          <button onclick="deleteStock(${index})">🗑️ Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}
renderStock();

// Add / Update Stock
document.getElementById("stockForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("itemName").value;
  const price = parseFloat(document.getElementById("itemPrice").value);
  const qty = parseInt(document.getElementById("itemQuantity").value);

  // Check if item exists → Update
  const existing = stock.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
  if (existing >= 0) {
    stock[existing].price = price;
    stock[existing].quantity = qty;
  } else {
    stock.push({ name, price, quantity: qty });
  }

  localStorage.setItem("stock", JSON.stringify(stock));
  renderStock();
  this.reset();
});

// Edit Stock
window.editStock = function(index) {
  const item = stock[index];
  document.getElementById("itemName").value = item.name;
  document.getElementById("itemPrice").value = item.price;
  document.getElementById("itemQuantity").value = item.quantity;
};

// Delete Stock
window.deleteStock = function(index) {
  if (confirm("Are you sure you want to delete this item?")) {
    stock.splice(index, 1);
    localStorage.setItem("stock", JSON.stringify(stock));
    renderStock();
  }
};

// ====================== SALES MANAGEMENT ======================
let sales = JSON.parse(localStorage.getItem("sales")) || [];

// Render Sales
function renderSales() {
  const tbody = document.querySelector("#salesTable tbody");
  tbody.innerHTML = "";
  sales.forEach((s, index) => {
    const row = `
      <tr>
        <td>${s.product}</td>
        <td>${s.price}</td>
        <td>${s.employee}</td>
        <td>${s.date}</td>
        <td>
          <button onclick="deleteSale(${index})">🗑️ Void</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}
renderSales();

// Delete Sale
window.deleteSale = function(index) {
  if (confirm("Are you sure you want to void this sale?")) {
    sales.splice(index, 1);
    localStorage.setItem("sales", JSON.stringify(sales));
    renderSales();
  }
};



// ========== SELLING PRODUCTS (Employee) ==========
function loadSellItems() {
  const select = document.getElementById("sellItem");
  select.innerHTML = "";
  stock.forEach(item => {
    if (item.quantity > 0) {
      select.innerHTML += `<option value="${item.name}">${item.name} (Available: ${item.quantity})</option>`;
    }
  });
}
loadSellItems();

// Handle sale
document.getElementById("sellForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const itemName = document.getElementById("sellItem").value;
  const qty = parseInt(document.getElementById("sellQty").value);
  const employee = localStorage.getItem("loggedInUser") || "Unknown";

  const itemIndex = stock.findIndex(i => i.name === itemName);
  if (itemIndex === -1) {
    alert("Item not found in stock!");
    return;
  }

  if (qty <= 0 || qty > stock[itemIndex].quantity) {
    alert("Invalid quantity!");
    return;
  }

  // Deduct from stock
  stock[itemIndex].quantity -= qty;

  // Record sale
  const sale = {
    product: itemName,
    price: stock[itemIndex].price * qty,
    employee: employee,
    date: new Date().toLocaleString()
  };
  sales.push(sale);

  // Save
  localStorage.setItem("stock", JSON.stringify(stock));
  localStorage.setItem("sales", JSON.stringify(sales));

  // Refresh
  renderStock();
  renderSales();
  loadSellItems();

  this.reset();
  alert(`✅ ${qty} ${itemName}(s) sold by ${employee}!`);
});


// ===== DASHBOARD OVERVIEW =====
function updateOverview() {
  // Total stock value
  let stockValue = stock.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Today's sales
  const today = new Date().toDateString();
  let todaySales = sales
    .filter(s => new Date(s.date).toDateString() === today)
    .reduce((sum, s) => sum + s.price, 0);

  // Top-selling item
  let productCount = {};
  sales.forEach(s => {
    productCount[s.product] = (productCount[s.product] || 0) + 1;
  });
  let topItem = Object.keys(productCount).length
    ? Object.keys(productCount).reduce((a, b) => productCount[a] > productCount[b] ? a : b)
    : "N/A";

  // Employees logged in (track via localStorage)
  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  let loggedCount = employees.filter(e => e.loggedIn).length;

  // Display
  document.getElementById("stockValue").textContent = "KES " + stockValue.toFixed(2);
  document.getElementById("salesToday").textContent = "KES " + todaySales.toFixed(2);
  document.getElementById("topItem").textContent = topItem;
  document.getElementById("loggedEmployees").textContent = loggedCount;
}

// Run overview after every update
function refreshAll() {
  renderStock();
  renderSales();
  loadSellItems();
  updateOverview();
}
refreshAll();

