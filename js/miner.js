/* === Miner (5×5, 2 bombas, diamantes dobram) === */
(() => {
  const grid   = document.getElementById("grid");
  const saldoSpan   = document.getElementById("saldoMiner");
  const apostaInput = document.getElementById("valorMiner");
  const btnNova     = document.getElementById("btnNova");
  const btnRetirar  = document.getElementById("btnRetirar");
  let saldo = parseFloat(localStorage.getItem("yahbet_saldo") || "1000");
  let cartas = [], aberto = false, multi = 0.30, aposta = 0;

  function atualizarSaldo() {
    saldoSpan.textContent = saldo.toFixed(2);
    localStorage.setItem("yahbet_saldo", saldo);
  }

  function criarCartas() {
    grid.innerHTML = "";
    cartas = Array(25).fill("diamond");
    /* sortear 2 bombas */
    while (cartas.filter(c => c === "bomb").length < 2) {
      const pos = Math.floor(Math.random() * 25);
      cartas[pos] = "bomb";
    }
    cartas.forEach((_, i) => {
      const div = document.createElement("div");
      div.className = "carta";
      div.onclick = () => revelar(i, div);
      grid.appendChild(div);
    });
    aberto = true;
    multi = 0.30;
    btnRetirar.disabled = false;
  }

  function revelar(i, div) {
    if (!aberto || div.classList.contains("aberta")) return;
    div.classList.add("aberta");
    if (cartas[i] === "bomb") {
      div.textContent = "💣";
      aberto = false;
      btnRetirar.disabled = true;
      alert("💥 Bomba! Você perdeu a aposta.");
    } else {
      div.textContent = "💎";
      saldo += aposta * multi;
      apostar(0); // já descontou antes
      multi *= 2;
    }
    atualizarSaldo();
  }

  function apostar(flag) {
    if (flag) {
      aposta = parseFloat(apostaInput.value);
      if (isNaN(aposta) || aposta < 0.5 || aposta > saldo) return alert("Aposta inválida.");
      saldo -= aposta;
    }
  }

  btnNova.onclick = () => {
    apostar(1);
    criarCartas();
  };

  btnRetirar.onclick = () => {
    if (!aberto) return;
    const ganho = aposta * (multi / 0.30);
    saldo += ganho;
    atualizarSaldo();
    aberto = false;
    btnRetirar.disabled = true;
    alert(`✅ Você retirou R$ ${ganho.toFixed(2)} (mult ${multi.toFixed(2)}×)`);
  };

  atualizarSaldo();
})();
