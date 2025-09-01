// ==================== LOGIN ====================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "admin123") {
      localStorage.setItem("user", "admin");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid login");
    }
  });
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// ==================== NAVIGATION ====================
function showSection(id) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ==================== STOCK ====================
let stock = JSON.parse(localStorage.getItem("stock")) || [];
const addStockForm = document.getElementById("addStockForm");

if (addStockForm) {
  addStockForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let item = {
      name: document.getElementById("itemName").value,
      price: parseFloat(document.getElementById("itemPrice").value),
      qty: parseInt(document.getElementById("itemQty").value)
    };
    stock.push(item);
    localStorage.setItem("stock", JSON.stringify(stock));
    renderStock();
    addStockForm.reset();
  });
}

function renderStock() {
  const table = document.getElementById("stockTable");
  if (!table) return;
  table.innerHTML = "<tr><th>Item</th><th>Price</th><th>Qty</th></tr>";
  stock.forEach(i => {
    table.innerHTML += `<tr><td>${i.name}</td><td>${i.price}</td><td>${i.qty}</td></tr>`;
  });
}
renderStock();

// ==================== EXPENSES ====================
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const addExpenseForm = document.getElementById("addExpenseForm");

if (addExpenseForm) {
  addExpenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let expense = {
      name: document.getElementById("expenseName").value,
      amount: parseFloat(document.getElementById("expenseAmount").value)
    };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    addExpenseForm.reset();
  });
}

function renderExpenses() {
  const table = document.getElementById("expenseTable");
  if (!table) return;
  table.innerHTML = "<tr><th>Expense</th><th>Amount</th></tr>";
  expenses.forEach(e => {
    table.innerHTML += `<tr><td>${e.name}</td><td>${e.amount}</td></tr>`;
  });
}
renderExpenses();
