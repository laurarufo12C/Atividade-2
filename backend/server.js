const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3306;

// Configuração de middlewares
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Permite receber dados no formato JSON

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
  host: 'benserverplex.ddns.net',
  user: 'alunos',
  password: 'senhaAlunos', // Altere se o seu MySQL tiver senha
  database: 'web_03ma'
});

// Conecta ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

// ========================
// Rotas da API
// ========================

// Rota GET /itens -> retorna todos os registros
app.get('/itens', (req, res) => {
  const query = 'SELECT * FROM laura_itens';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar itens:', err);
      return res.status(500).json({ error: 'Erro ao buscar os itens' });
    }
    res.json(results);
  });
});

// Rota POST /itens -> cadastra um novo item
app.post('/itens', (req, res) => {
  const { nome, descricao, categoria } = req.body;

  if (!nome || !descricao || !categoria) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const query = 'INSERT INTO laura_itens (nome, descricao, categoria) VALUES (?, ?, ?)';
  db.query(query, [nome, descricao, categoria], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar item:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar o item' });
    }
    res.status(201).json({
      message: 'Item cadastrado com sucesso!',
      id: result.insertId
    });
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
