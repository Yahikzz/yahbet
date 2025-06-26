
const API_URL='';
let currentUser=null,currentSaldo=0;
const loginSection=document.getElementById('login-section');
const casinoSection=document.getElementById('casino-section');
const userNameSpan=document.getElementById('user-name');
const userSaldoSpan=document.getElementById('user-saldo');
const gameArea=document.getElementById('game-area');
const casinoName=document.getElementById('casino-name');

document.getElementById('btn-login').onclick=login;
document.getElementById('btn-register').onclick=register;
document.getElementById('btn-logout').onclick=()=>location.reload();
document.getElementById('menu').addEventListener('click',e=>{ if(e.target.tagName==='BUTTON') loadGame(e.target.dataset.game);});

let clickCount=0;
casinoName.onclick=()=>{ clickCount++; if(clickCount===5){ const c=prompt('Código:'); if(c==='ADMCDYAH2771'){ currentSaldo+=1000; updateSaldo(); alert('+1000 R$'); } clickCount=0;}};

function formatMoney(v){const a=Math.abs(v);const s=v<0?'-':'';if(a>=1e9)return s+(a/1e9).toFixed(2)+'B';if(a>=1e6)return s+(a/1e6).toFixed(2)+'M';if(a>=1e3)return s+(a/1e3).toFixed(2)+'K';return s+a.toFixed(2);}
function updateSaldo(){userSaldoSpan.textContent='R$ '+formatMoney(currentSaldo); fetch('/saldo/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:currentUser,saldo:currentSaldo})});}

function login(){const u=document.getElementById('username').value.trim();const p=document.getElementById('password').value.trim();
 fetch('/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})})
 .then(r=>r.json()).then(d=>{ if(d.error)return alert(d.error); currentUser=u;currentSaldo=d.saldo;loginSection.style.display='none';casinoSection.style.display='block';userNameSpan.textContent=currentUser;updateSaldo();loadGame('crash');});
}
function register(){const u=document.getElementById('username').value.trim();const p=document.getElementById('password').value.trim();
 fetch('/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})})
 .then(r=>r.json()).then(d=>{ d.error?alert(d.error):alert('Cadastrado');});
}

function loadGame(g){switch(g){case 'crash':loadCrash();break;case 'double':loadDouble();break;case 'miner':loadMiner();break;case 'tigrinho':loadTigrinho();break;case 'pix':loadPix();break;}}

function loadCrash(){
 gameArea.innerHTML='<h3>Crash</h3><p>Saldo: R$ '+formatMoney(currentSaldo)+'</p><input id="bet" type="number" step="0.5" min="0.5" placeholder="Aposta"><button id="start">Iniciar</button> <button id="cashout" disabled>Sacar</button><p id="info"></p><div class="graph" id="graph"></div><h2 id="multi">1.00x</h2>';
 const betInput=document.getElementById('bet'),start=document.getElementById('start'),cash=document.getElementById('cashout'),info=document.getElementById('info'),graph=document.getElementById('graph'),multiEl=document.getElementById('multi');
 let running=false,multi=1,bet=0,step=0,interval;
 start.onclick=()=>{ if(running)return; bet=parseFloat(betInput.value); if(isNaN(bet)||bet<0.5)return info.textContent='Aposta inválida'; if(bet>currentSaldo)return info.textContent='Saldo insuficiente';
 currentSaldo-=bet;updateSaldo();running=true;start.disabled=true;cash.disabled=false;graph.innerHTML='';multi=1;step=0;info.textContent='';
 interval=setInterval(()=>{ multi+=(multi<2?0.02:(multi<5?0.05:0.1)); multiEl.textContent=multi.toFixed(2)+'x'; const bar=document.createElement('div');bar.className='bar';bar.style.left=(step*4)+'px';bar.style.height=Math.min(100,multi*10)+'%'; graph.appendChild(bar); step++; const chance=multi<2?0:(multi<5?0.02:0.05); if(Math.random()<chance){ clearInterval(interval);info.textContent='CRASH em '+multi.toFixed(2)+'x';running=false;cash.disabled=true;start.disabled=false;}},100);
 };
 cash.onclick=()=>{ if(!running)return; clearInterval(interval); const ganho=bet*multi; currentSaldo+=ganho;updateSaldo();info.textContent='Sacou '+multi.toFixed(2)+'x = R$ '+formatMoney(ganho);running=false;cash.disabled=true;start.disabled=false;};
}

function loadDouble(){
 gameArea.innerHTML='<h3>Double</h3><p>Saldo: R$ '+formatMoney(currentSaldo)+'</p><input id="bet" type="number" min="0.5" step="0.5" placeholder="Aposta"><select id="color"><option value="preto">Preto(2x)</option><option value="vermelho">Vermelho(2x)</option><option value="branco">Branco(14x)</option></select><button id="play">Jogar</button><p id="res"></p><div id="strip" style="display:flex;overflow:hidden;width:360px;margin:auto;"></div>';
 const strip=document.getElementById('strip'),betInput=document.getElementById('bet'),colorSel=document.getElementById('color'),playBtn=document.getElementById('play'),res=document.getElementById('res');
 const seq=[],cols=['preto','vermelho']; for(let i=0;i<15;i++)seq.push(cols[i%2]); seq[Math.floor(Math.random()*15)]='branco';
 strip.innerHTML=''; seq.forEach(c=>{ const d=document.createElement('div');d.style.width='120px';d.style.height='50px';d.style.display='flex';d.style.alignItems='center';d.style.justifyContent='center';d.style.background=c==='branco'?'white':c;d.style.color=c==='branco'?'black':'white';d.textContent=c.toUpperCase();strip.appendChild(d);});
 playBtn.onclick=()=>{
   const bet=parseFloat(betInput.value); if(isNaN(bet)||bet<0.5)return res.textContent='Aposta inválida'; if(bet>currentSaldo)return res.textContent='Saldo insuf.';
   currentSaldo-=bet;updateSaldo();strip.style.transition='transform 3s cubic-bezier(0.34,1.56,0.64,1)'; const off=-Math.floor(Math.random()*15)*120;strip.style.transform='translateX('+off+'px)';
   setTimeout(()=>{ const idx=Math.abs(off/120); const color=seq[idx]; let ganho=0;if(color===colorSel.value)ganho=bet*(color==='branco'?14:2); if(ganho>0){{currentSaldo+=ganho;updateSaldo();}} res.textContent='Caiu '+color.toUpperCase()+(ganho>0?' Ganhou R$ '+formatMoney(ganho):' Perdeu'); strip.style.transition='none';strip.style.transform='translateX(0)';},3100);
 };
}

function loadMiner(){
 gameArea.innerHTML='<h3>Miner</h3><p>Saldo: R$ '+formatMoney(currentSaldo)+'</p><input id="bet" type="number" min="0.5" step="0.5" placeholder="Aposta"><button id="start">Começar</button> <button id="retirar" disabled>Retirar</button><p id="info"></p><div id="grid" style="display:grid;grid-template-columns:repeat(5,60px);gap:5px;justify-content:center;"></div>';
 const betInput=document.getElementById('bet'),start=document.getElementById('start'),ret=document.getElementById('retirar'),info=document.getElementById('info'),grid=document.getElementById('grid');
 let bombs=[],bet=0,mult=0.3,playing=false;
 function reveal(card,idx){
  if(!playing||card.dataset.rev) return;
  card.dataset.rev=1;
  if(bombs.includes(idx)){ card.textContent='💣'; card.style.background='#b71c1c'; info.textContent='Bomba! Perdeu.'; playing=false; ret.disabled=true; }
  else{ card.textContent='💎'; card.style.background='#1976d2'; const ganho=bet*mult; currentSaldo+=ganho; updateSaldo(); bet*=2; mult*=2; info.textContent='Multiplicador: '+(mult/0.3).toFixed(2)+'x'; }
 }
 start.onclick=()=>{
  bet=parseFloat(betInput.value); if(isNaN(bet)||bet<0.5)return info.textContent='Aposta inválida'; if(bet>currentSaldo)return info.textContent='Saldo insuf.';
  currentSaldo-=bet; updateSaldo(); bombs=[]; while(bombs.length<2){ const r=Math.floor(Math.random()*25); if(!bombs.includes(r))bombs.push(r);} grid.innerHTML='';
  for(let i=0;i<25;i++){ const c=document.createElement('div'); c.style.width='60px';c.style.height='80px';c.style.background='#424242';c.style.display='flex';c.style.alignItems='center';c.style.justifyContent='center';c.style.cursor='pointer';c.textContent='❓'; c.onclick=()=>reveal(c,i); grid.appendChild(c);} mult=0.3; playing=true; ret.disabled=false; info.textContent='Multiplicador: 1x';
 };
 ret.onclick=()=>{ if(!playing)return; currentSaldo+=bet*mult; updateSaldo(); info.textContent='Retirou R$ '+formatMoney(bet*mult); playing=false; ret.disabled=true; };
}

function loadTigrinho(){
 gameArea.innerHTML='<h3>Tigrinho</h3><p>Saldo: R$ '+formatMoney(currentSaldo)+'</p><input id="bet" type="number" min="0.5" step="0.5" placeholder="Aposta"><button id="spin">Girar</button><p id="info"></p><div id="slots" style="font-size:2.5em;display:grid;grid-template-columns:repeat(3,80px);grid-template-rows:repeat(3,80px);gap:4px;justify-content:center;"></div>';
 const fruits=['🍒','🍋','🍉','⭐','🍇','🔔'],card='🃏';
 const betInput=document.getElementById('bet'),spin=document.getElementById('spin'),info=document.getElementById('info'),slots=document.getElementById('slots');
 spin.onclick=()=>{
  const bet=parseFloat(betInput.value); if(isNaN(bet)||bet<0.5)return info.textContent='Aposta inválida'; if(bet>currentSaldo)return info.textContent='Saldo insuf.';
  currentSaldo-=bet; updateSaldo(); slots.innerHTML=''; const grid=[]; let cartaCount=0;
  for(let i=0;i<9;i++){ const s=Math.random()<0.2?card:fruits[Math.floor(Math.random()*fruits.length)]; if(s===card)cartaCount++; grid.push(s);}
  grid.forEach(s=>{ const d=document.createElement('div'); d.textContent=s; slots.appendChild(d);});
  const lines=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]];
  let ganho=0;
  lines.forEach(l=>{ const[a,b,c]=l; if(grid[a]===grid[b]&&grid[b]===grid[c]&&grid[a]!==card) ganho+=bet*3;});
  if(grid.every((v,i,arr)=>v===arr[0])) ganho+=bet*9;
  ganho*=Math.pow(2,cartaCount);
  if(ganho>0){ currentSaldo+=ganho; updateSaldo(); info.textContent='TIGRINHO SOLTOU CARTA! Ganhou R$ '+formatMoney(ganho); }
  else info.textContent='Nada dessa vez';
 };
}

function loadPix(){ gameArea.innerHTML='<h3>Pix manual</h3><p>Chave: seuemail@pix.com</p><input id="v" type="number" min="1"><button id="add">Adicionar</button>'; document.getElementById('add').onclick=()=>{const v=parseFloat(document.getElementById('v').value); if(!isNaN(v)&&v>0){currentSaldo+=v; updateSaldo(); alert('Saldo +R$ '+formatMoney(v));}};}
