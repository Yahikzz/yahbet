const express=require('express');
const fs=require('fs');
const cors=require('cors');
const bodyParser=require('body-parser');
const path=require('path');
const app=express();
const PORT=process.env.PORT||3000;

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE=path.join(__dirname,'users.json');

function readUsers(){
 if(!fs.existsSync(USERS_FILE)) return {};
 return JSON.parse(fs.readFileSync(USERS_FILE));
}
function saveUsers(u){fs.writeFileSync(USERS_FILE,JSON.stringify(u,null,2));}

app.post('/register',(req,res)=>{
 const{{username,password}}=req.body;
 if(!username||!password)return res.status(400).json({error:'Dados incompletos'});
 const users=readUsers();
 if(users[username])return res.status(400).json({error:'Usuário já existe'});
 users[username]={password,saldo:1000};
 saveUsers(users);
 res.json({success:true,saldo:1000});
});

app.post('/login',(req,res)=>{
 const{{username,password}}=req.body;
 const users=readUsers();
 if(!users[username]||users[username].password!==password)
   return res.status(400).json({error:'Usuário ou senha incorreta'});
 res.json({success:true,saldo:users[username].saldo});
});

app.post('/saldo/update',(req,res)=>{
 const{{username,saldo}}=req.body;
 const users=readUsers();
 if(!users[username])return res.status(404).json({error:'Usuário não encontrado'});
 users[username].saldo=saldo;
 saveUsers(users);
 res.json({success:true});
});

app.use(express.static(path.join(__dirname,'..')));
app.get('/*',(req,res)=>res.sendFile(path.join(__dirname,'..','index.html')));

app.listen(PORT,()=>console.log('Servidor rodando na porta '+PORT));