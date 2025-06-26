/* === Crash (gráfico verde “quadrado”) === */
(() => {
  const saldoSpan = document.getElementById("saldo");
  const apostaInput = document.getElementById("valorAposta");
  const btnStart  = document.getElementById("btnStart");
  const btnSacar  = document.getElementById("btnSacar");
  const multiplicadorSpan = document.getElementById("multiplicador");
  const canvas   = document.getElementById("grafico");
  const ctx      = canvas.getContext("2d");
  let saldo = parseFloat(localStorage.getItem("yahbet_saldo") || "1000");
  let aposta = 0, multi = 1, rodando = false, barras = [];

  function desenharGrafico() {
    canvas.width  = canvas.clientWidth;
    canvas.height = 200;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#16c60c";
    const larguraBarra = 10;
    barras.forEach((m, i) => {
      const h = Math.min(m * 4, canvas.height);
      ctx.fillRect(i * larguraBarra, canvas.height - h, larguraBarra - 1, h);
    });
  }

  function atualizarSaldo() {
    saldoSpan.textContent = saldo.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    localStorage.setItem("yahbet_saldo", saldo);
  }

  btnStart.onclick = () => {
    aposta = parseFloat(apostaInput.value);
    if (isNaN(aposta) || aposta < 0.5 || aposta > saldo) return alert("Aposta inválida.");
    saldo -= aposta;
    atualizarSaldo();
    rodando = true;
    btnStart.disabled = true;
    btnSacar.disabled = false;
    multiplicadorSpan.textContent = "1.00×";
    barras = [];
    multi = 1;
    const loop = setInterval(() => {
      /* Probabilidade de crash:
         - Nunca <1.5
         - 5 % entre 1.5–2
         - 10 % entre 2–5
         - 20 % >5
      */
      let prob = 0;
      if (multi >= 1.5 && multi < 2) prob = 0.05;
      else if (multi >= 2 && multi < 5) prob = 0.10;
      else if (multi >= 5) prob = 0.20;

      if (Math.random() < prob) {
        clearInterval(loop);
        rodando = false;
        btnStart.disabled = false;
        btnSacar.disabled = true;
        alert("💥 CRASH! Você perdeu.");
        return;
      }
      multi += 0.05 + Math.random() * 0.10;
      barras.push(multi);
      multiplicadorSpan.textContent = multi.toFixed(2) + "×";
      desenharGrafico();
    }, 120);
    btnSacar.onclick = () => {
      if (!rodando) return;
      clearInterval(loop);
      rodando = false;
      const ganho = aposta * multi;
      saldo += ganho;
      atualizarSaldo();
      btnStart.disabled = false;
      btnSacar.disabled = true;
      alert(`✅ Você sacou em ${multi.toFixed(2)}× e ganhou R$ ${ganho.toFixed(2)}`);
    };
  };
  atualizarSaldo();
})();
