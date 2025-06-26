
const API_URL = '';

let currentUser = null;
let currentSaldo = 0;

const loginSection = document.getElementById('login-section');
const casinoSection = document.getElementById('casino-section');
const userNameSpan = document.getElementById('user-name');
const userSaldoSpan = document.getElementById('user-saldo');
const gameArea = document.getElementById('game-area');
const casinoName = document.getElementById('casino-name');

document.getElementById('btn-login').addEventListener('click', login);
document.getElementById('btn-register').addEventListener('click', register);
document.getElementById('btn-logout').addEventListener('click', logout);
document.getElementById('menu').addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const game = e.target.getAttribute('data-game');
    loadSpecial(game);
  }
});

let clickCount = 0;
casinoName.addEventListener('click', () => {
  clickCount++;
  if (clickCount === 5) {
    const code = prompt('Digite o código secreto:');
    if (code === 'ADMCDYAH2771') {
      currentSaldo += 1000;
      alert('Código válido! Você ganhou 1000 créditos!');
      updateSaldo();
    } else {
      alert('Código inválido.');
    }
    clickCount = 0;
  }
});

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) return showMsg('msg-login', 'Preencha usuário e senha');

  fetch(API_URL + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) return showMsg('msg-login', data.error);
      currentUser = username;
      currentSaldo = data.saldo;
      localStorage.setItem('yah_user', currentUser);
      loginSection.style.display = 'none';
      casinoSection.style.display = 'block';
      userNameSpan.textContent = currentUser;
      updateSaldo();
    });
}

function register() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) return showMsg('msg-login', 'Preencha usuário e senha');

  fetch(API_URL + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) return showMsg('msg-login', data.error);
      alert('Usuário cadastrado! Faça login.');
    });
}

function logout() {
  localStorage.removeItem('yah_user');
  currentUser = null;
  currentSaldo = 0;
  loginSection.style.display = 'block';
  casinoSection.style.display = 'none';
  gameArea.innerHTML = '';
}

function showMsg(id, msg) {
  document.getElementById(id).textContent = msg;
}

function updateSaldo() {
  userSaldoSpan.textContent = currentSaldo.toFixed(2);
  fetch(API_URL + '/saldo/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: currentUser, saldo: currentSaldo }),
  });
}

function loadSpecial(page) {
  switch(page) {
    case 'pix':
      loadPix();
      break;
    case 'saque':
      loadSaque();
      break;
  }
}

function loadPix() {
  gameArea.innerHTML = `
    <h3>Depósito Pix</h3>
    <p>Chave Pix: <b>seuemail@pix.com</b></p>
    <input type="number" id="pix-valor" placeholder="Valor a adicionar" min="1">
    <button id="btn-pix-enviar">Adicionar Créditos</button>
    <p id="msg-pix"></p>
  `;
  const btnEnviar=document.getElementById('btn-pix-enviar');
  btnEnviar.addEventListener('click',()=>{
    const val=parseFloat(document.getElementById('pix-valor').value);
    if(isNaN(val)||val<=0) return document.getElementById('msg-pix').textContent='Valor inválido';
    currentSaldo+=val;
    updateSaldo();
    document.getElementById('msg-pix').textContent=`${val.toFixed(2)} créditos adicionados!`;
  });
}

function loadSaque() {
  gameArea.innerHTML = `
    <h3>Saque</h3>
    <p>Saldo disponível: ${currentSaldo.toFixed(2)} créditos</p>
    <p>Envie email para <b>finance@yahbet.com</b> com seu usuário e valor.</p>
  `;
}
