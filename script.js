// script.js - login & session handling

// Seed default users (if none)
if (!localStorage.getItem('users')) {
  const users = [
    { username: 'admin', password: '1234', role: 'admin', loggedIn: false },
    { username: 'brian', password: '1234', role: 'employee', loggedIn: false }
  ];
  localStorage.setItem('users', JSON.stringify(users));
}

// login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const found = users.find(x => x.username === u && x.password === p);
    const errorEl = document.getElementById('loginError');

    if (found) {
      // mark the user as loggedIn (for overview)
      users.forEach(x => { if (x.username === found.username) x.loggedIn = true; });
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('loggedInUser', JSON.stringify(found));
      errorEl.textContent = '';
      window.location.href = 'dashboard.html';
    } else {
      errorEl.textContent = 'Invalid username or password';
    }
  });
}


