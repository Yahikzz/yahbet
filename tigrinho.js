
const API='';
const user=localStorage.getItem('yah_user');
if(!user) location.href='index.html';
document.getElementById('user').textContent=user;

let saldo=0;function upd(){document.getElementById('saldo').textContent=saldo.toFixed(2);}
fetch(API+'/saldo/'+user).then(r=>r.json()).then(d=>{saldo=d.saldo;upd();});

const slot=document.getElementById('slot');
document.getElementById('btn-spin').addEventListener('click',()=>{
  const aposta=parseFloat(document.getElementById('aposta').value);
  if(isNaN(aposta)||aposta<=0){msg('Aposta inválida');return;}
  if(aposta>saldo){msg('Saldo insuficiente');return;}
  saldo-=aposta;updateSaldo();
  const fruits=['🍒','🍋','🍊','🍉','🍇','⭐'];
  let spins=20;
  const spinInterval=setInterval(()=>{
    const res=[fruitsRand(),fruitsRand(),fruitsRand()];
    slot.textContent=res.join(' ');
    spins--;
    if(spins===0){
      clearInterval(spinInterval);
      let ganho=0;
      if(res[0]===res[1]&&res[1]===res[2]) ganho=aposta*5;
      else if(res[0]===res[1]||res[1]===res[2]||res[0]===res[2]) ganho=aposta*2;
      if(ganho>0){saldo+=ganho;msg(`Você ganhou ${ganho.toFixed(2)} créditos!`);}
      else{msg('Não foi dessa vez.');}
      updateSaldo();
    }
  },100);
});
function fruitsRand(){const fr=['🍒','🍋','🍊','🍉','🍇','⭐'];return fr[Math.floor(Math.random()*fr.length)];}
function msg(t){document.getElementById('msg').textContent=t;}
function updateSaldo(){upd();fetch(API+'/saldo/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:user,saldo})});}
