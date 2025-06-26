
const API='';
const user=localStorage.getItem('yah_user');
if(!user) location.href='index.html';
document.getElementById('user').textContent=user;

let saldo=0;function upd(){document.getElementById('saldo').textContent=saldo.toFixed(2);}
fetch(API+'/saldo/'+user).then(r=>r.json()).then(d=>{saldo=d.saldo;upd();});
const roleta=document.getElementById('roleta');
document.getElementById('btn-rodar').addEventListener('click',()=>{
  const aposta=parseFloat(document.getElementById('aposta').value);
  const cor=document.getElementById('cor').value;
  if(isNaN(aposta)||aposta<=0){msg('Aposta inválida');return;}
  if(aposta>saldo){msg('Saldo insuficiente');return;}
  saldo-=aposta;updateSaldo();msg('Girando...');
  // animação
  roleta.style.transition='transform 3s ease-out';
  const rota=360*6+Math.random()*360;
  roleta.style.transform=`rotate(${rota}deg)`;
  setTimeout(()=>{
    const cores=['vermelho','preto','branco'];
    const resultado=cores[Math.floor(Math.random()*cores.length)];
    let ganho=0;
    if(resultado===cor){ganho=resultado==='branco'?aposta*14:aposta*2;}
    if(ganho>0){saldo+=ganho;msg(`Saiu ${resultado}! Você ganhou ${ganho.toFixed(2)} créditos!`);}
    else{msg(`Saiu ${resultado}. Você perdeu.`);}
    updateSaldo();
  },3100);
});
function msg(t){document.getElementById('msg').textContent=t;}
function updateSaldo(){upd();fetch(API+'/saldo/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:user,saldo})});}
