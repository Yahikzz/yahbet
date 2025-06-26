const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, "users.json");

function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE));
  } catch {
    return {};
  }
}

function saveUsers(data) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
  } catch {}
}

app.use(bodyParser.json());

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Dados incompletos" });

  const users = readUsers();
  if (users[username]) return res.status(400).json({ error: "Usuário já existe" });

  users[username] = { password, saldo: 1000 };
  saveUsers(users);
  res.json({ success: true, saldo: 1000 });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  if (!users[username] || users[username].password !== password)
    return res.status(400).json({ error: "Usuário ou senha incorreta" });

  res.json({ success: true, saldo: users[username].saldo });
});

app.post("/saldo/update", (req, res) => {
  const { username, saldo } = req.body;
  const users = readUsers();
  if (!users[username]) return res.status(404).json({ error: "Usuário não encontrado" });

  users[username].saldo = saldo;
  saveUsers(users);
  res.json({ success: true });
});

app.get("/health", (req, res) => res.send("OK"));

const CLIENT_DIR = path.join(__dirname, "..");
app.use(express.static(CLIENT_DIR));

app.get("*", (req, res) => res.sendFile(path.join(CLIENT_DIR, "index.html")));

app.listen(PORT, () => {
  console.log(`Servidor YahBet rodando na porta ${PORT}`);
});
