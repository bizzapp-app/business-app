const stock = JSON.parse(localStorage.getItem("stock")) || [];
const sales = JSON.parse(localStorage.getItem("sales")) || [];
let cart = [];

function renderProducts(){
  let list = document.getElementById("productList");
  list.innerHTML = "";
  stock.forEach((item,i)=>{
    list.innerHTML += `<li>${item.name} - $${item.price} (${item.qty} left) 
    <button onclick="addToCart(${i})">Add</button></li>`;
  });
}

function addToCart(i){
  let item = stock[i];
  if(item.qty > 0){
    cart.push({...item, qty:1});
    updateCart();
  } else {
    alert("Out of stock!");
  }
}

function updateCart(){
  let list = document.getElementById("cartList");
  let total = 0;
  list.innerHTML = "";
  cart.forEach((item,i)=>{
    total += item.price * item.qty;
    list.innerHTML += `<li>${item.name} - $${item.price} 
    <button onclick="removeFromCart(${i})">Remove</button></li>`;
  });
  document.getElementById("cartTotal").innerText = total;
}

function removeFromCart(i){ cart.splice(i,1); updateCart(); }

function checkout(){
  if(cart.length === 0){ alert("Cart is empty"); return; }
  let total = cart.reduce((sum,item)=> sum+item.price,0);
  sales.push({cart, total, date:new Date().toLocaleString()});
  localStorage.setItem("sales", JSON.stringify(sales));
  cart.forEach(c=>{
    let s = stock.find(s=>s.name===c.name);
    if(s) s.qty -= 1;
  });
  localStorage.setItem("stock", JSON.stringify(stock));
  document.getElementById("receipt").innerHTML = `<p>Receipt<br>${new Date().toLocaleString()}<br>Total: $${total}</p>`;
  cart = [];
  updateCart();
  renderProducts();
}

function printReceipt(){
  let receiptContent = document.getElementById("receipt").innerHTML;
  let win = window.open('', '', 'height=600,width=400');
  win.document.write('<pre>'+receiptContent+'</pre>');
  win.print();
}

// Initialize
renderProducts();
