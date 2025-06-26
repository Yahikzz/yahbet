/* === Double (roleta 15 quadrados) === */
(() => {
  const faixa    = document.getElementById("faixa");
  const apostaIn = document.getElementById("valorDouble");
  const corSel   = document.getElementById("corSel");
  const saldoSp  = document.getElementById("saldoDouble");
  const btnJogar = document.getElementById("btnDouble");
  const resultEl = document.getElementById("resultadoDouble");
  let saldo = parseFloat(localStorage.getItem("yahbet_saldo") || "1000");

  const seq = ["preto","vermelho"].flatMap(c=>[c,""]).slice(0,15); // 7 p, 7 v + 1 branco
  seq[ Math.floor(Math.random()*15) ] = "branco";

  seq.forEach(c=>{
    const d=document.createElement("div");
    d.className="quad "+(c||"preto");
    d.dataset.cor=c||"preto";
    faixa.appendChild(d);
  });

  function saldoUp(){saldoSp.textContent=saldo.toFixed(2);localStorage.setItem("yahbet_saldo",saldo);}
  saldoUp();

  btnJogar.onclick=()=>{
    const ap=parseFloat(apostaIn.value);
    if(isNaN(ap)||ap<0.5||ap>saldo)return alert("Aposta inválida");
    saldo-=ap;saldoUp();resultEl.textContent="";
    faixa.style.transition="none";faixa.style.transform="translateX(0)";
    setTimeout(()=>{ // animação roll
      const stop=Math.floor(Math.random()*15);
      const offset=stop*60+Math.random()*30+3000;
      faixa.style.transition="transform 3s cubic-bezier(.25,.84,.42,1)";
      faixa.style.transform=`translateX(-${offset}px)`;
      setTimeout(()=>{
        const cor=seq[stop]||"preto";
        let ganho=0;
        if(cor===corSel.value){
          ganho=ap*(cor==="branco"?14:2);
          saldo+=ganho;
          saldoUp();
        }
        resultEl.textContent=ganho?`✅ Saiu ${cor}! Ganhou R$ ${ganho.toFixed(2)}`:`❌ Saiu ${cor}. Perdeu.`;
      },3100);
    },50);
  };
})();
