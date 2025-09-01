const stock = JSON.parse(localStorage.getItem("stock")) || [];
const employees = JSON.parse(localStorage.getItem("users")) || [];
const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const sales = JSON.parse(localStorage.getItem("sales")) || [];

function saveData(){
  localStorage.setItem("stock", JSON.stringify(stock));
  localStorage.setItem("users", JSON.stringify(employees));
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("sales", JSON.stringify(sales));
}

function addStock(){
  let name = document.getElementById("itemName").value;
  let price = parseFloat(document.getElementById("itemPrice").value);
  let qty = parseInt(document.getElementById("itemStock").value);
  stock.push({name, price, qty});
  saveData();
  renderStock();
}

function renderStock(){
  let list = document.getElementById("stockList");
  list.innerHTML = "";
  stock.forEach((item,i)=>{
    list.innerHTML += `<li>${item.name} - $${item.price} (${item.qty}) 
    <button onclick="deleteStock(${i})">Delete</button></li>`;
  });
}
function deleteStock(i){ stock.splice(i,1); saveData(); renderStock(); }

function addEmployee(){
  let name = document.getElementById("empName").value;
  let username = document.getElementById("empUser").value;
  let password = document.getElementById("empPass").value;
  employees.push({username,password,role:"cashier",name});
  saveData();
  renderEmployees();
}
function renderEmployees(){
  let list = document.getElementById("employeeList");
  list.innerHTML = "";
  employees.filter(e=>e.role==="cashier").forEach((emp,i)=>{
    list.innerHTML += `<li>${emp.name} (${emp.username})</li>`;
  });
}

function addExpense(){
  let name = document.getElementById("expenseName").value;
  let amount = parseFloat(document.getElementById("expenseAmount").value);
  expenses.push({name, amount});
  saveData();
  renderExpenses();
}
function renderExpenses(){
  let list = document.getElementById("expenseList");
  list.innerHTML = "";
  expenses.forEach((exp,i)=>{
    list.innerHTML += `<li>${exp.name} - $${exp.amount}</li>`;
  });
}

function renderSalesSummary(){
  let summary = document.getElementById("salesSummary");
  let total = sales.reduce((sum,s)=> sum + s.total, 0);
  summary.innerHTML = `<p>Total Sales: $${total}</p>`;
}

// Initialize
renderStock();
renderEmployees();
renderExpenses();
renderSalesSummary();
