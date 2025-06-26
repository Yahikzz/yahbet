/* === Tigrinho (slot 3×3, carta especial) === */
(() => {
  const grid = document.getElementById("slot");
  const apostaInput = document.getElementById("valorTigri");
  const btnGirar = document.getElementById("btnTigri");
  const saldoSpan = document.getElementById("saldoTigri");
  const msg = document.getElementById("msgTigri");
  const icons = ["🍒","🍋","🍇","🍉","⭐"];
  let saldo = parseFloat(localStorage.getItem("yahbet_saldo")||"1000");

  function upSaldo(){saldoSpan.textContent=saldo.toFixed(2);localStorage.setItem("yahbet_saldo",saldo);}
  upSaldo();

  function gerarMatriz(){
    const m=[];for(let r=0;r<3;r++){m[r]=[];for(let c=0;c<3;c++){
      m[r][c]=icons[Math.floor(Math.random()*icons.length)];
    }}
    return m;
  }
  function temCarta(){return Math.random()<0.20;}

  btnGirar.onclick=()=>{
    const ap=parseFloat(apostaInput.value);
    if(isNaN(ap)||ap<0.5||ap>saldo)return alert("Aposta inválida");
    saldo-=ap;upSaldo();msg.textContent="";
    const m=gerarMatriz();
    grid.innerHTML=m.flat().map(i=>`<span class="ico">${i}</span>`).join("");
    let mult=0;
    const linhas=[...m, // horizontais
      [m[0][0],m[1][1],m[2][2]],
      [m[0][2],m[1][1],m[2][0]]];
    linhas.forEach(l=>{
      if(l.every(x=>x===l[0]))mult=3;
    });
    if([...m[0],...m[1],...m[2]].every(x=>x===m[0][0]))mult=9;
    if(temCarta()){mult*=2;if(mult===0)mult=2;alert("🐯 TIGRINHO SOLTOU A CARTA!");}
    if(mult){
      const ganho=ap*mult;
      saldo+=ganho;upSaldo();
      msg.textContent=`✅ Ganhou R$ ${ganho.toFixed(2)} ( ${mult}× )`;
    }else msg.textContent="❌ Nada dessa vez.";
  };
})();
