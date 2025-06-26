
const API = '';
const user = localStorage.getItem('yah_user');
if(!user) location.href='index.html';
document.getElementById('user').textContent=user;

let saldo=0;
function updateSaldoDisplay(){document.getElementById('saldo').textContent=saldo.toFixed(2);}
fetch(API+'/saldo/'+user).then(r=>r.json()).then(d=>{saldo=d.saldo;updateSaldoDisplay();});

const canvas=document.getElementById('graph');
const ctx=canvas.getContext('2d');
let running=false, multiplier=1, aposta=0, intervalId;

function resetGraph(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  ctx.moveTo(0,canvas.height);
}

function drawPoint(x,y){
  ctx.lineTo(x,y);
  ctx.strokeStyle='#f57c00';
  ctx.stroke();
}

document.getElementById('btn-start').addEventListener('click',()=>{
  if(running) return;
  aposta=parseFloat(document.getElementById('aposta').value);
  if(isNaN(aposta)||aposta<=0) {document.getElementById('msg').textContent='Aposta inválida';return;}
  if(aposta>saldo){document.getElementById('msg').textContent='Saldo insuficiente';return;}
  saldo-=aposta;updateSaldo();
  running=true;multiplier=1;
  document.getElementById('btn-sacar').disabled=false;
  document.getElementById('msg').textContent='';
  resetGraph();
  let t=0;
  intervalId=setInterval(()=>{
    t+=1;
    multiplier+=Math.random()*0.05;
    const x=t; const y=canvas.height-(multiplier*10);
    drawPoint(x,y);
    if(Math.random()<0.03){ // crash
      clearInterval(intervalId);
      running=false;
      document.getElementById('btn-sacar').disabled=true;
      document.getElementById('msg').textContent='Crash! Perdeu.';
    }
  },100);
});

document.getElementById('btn-sacar').addEventListener('click',()=>{
  if(!running) return;
  running=false;
  clearInterval(intervalId);
  const ganho=aposta*multiplier;
  saldo+=ganho;
  updateSaldo();
  document.getElementById('btn-sacar').disabled=true;
  document.getElementById('msg').textContent=`Ganhou ${ganho.toFixed(2)} créditos em ${multiplier.toFixed(2)}x!`;
});

function updateSaldo(){
  updateSaldoDisplay();
  fetch(API+'/saldo/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:user,saldo})});
}
