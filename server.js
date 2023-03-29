const { response } = require('express');
const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require ('cors');

app.use(express.json())
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
});

const upload = multer({ storage: storage });

app.use(cors())
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'morri'
});
connection.connect((err) => {
  if (err) throw err
  console.log('Banco conectado com sucesso')
});
app.post('/contatos/gravar', upload.single('avatar'), function (req, res) {
  var first_name = req.body.first_name;
  var email = req.body.email;
  var gender = req.body.gender;
  var cep = req.body.cep;
  var logradouro = req.body.logradouro;
  var compelmento = req.body.compelmento;
  var bairro = req.body.bairro;
  var cidade = req.body.cidade;
  var uf = req.body.uf;
  var tpessoa = req.body.tpessoa;

  var sql = `INSERT INTO denovo (first_name, email, gender, cep, logradouro, compelmento, bairro, cidade, uf, tpessoa) VALUES ("${first_name}", "${email}", "${gender}", "${cep}", "${logradouro}", "${compelmento}", "${bairro}", "${cidade}", "${uf}", "${tpessoa}")`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log('Foi pra nuvem');
    res.status(200).send("Adicionado!")
  });
});

app.get('/contatos/:parametro', (req, res) => {
  const parametro = req.params.parametro;

  // Verifica se o parâmetro é um número (id) ou um e-mail
  if (!isNaN(parametro)) {
    // Busca pelo id
    const id = parseInt(parametro);
    const result = connection.query('SELECT first_name, email, gender, cep, logradouro, compelmento, bairro, cidade, uf, t.descricao as tpessoa FROM denovo d inner join tipopessoa t on t.id = d.tpessoa WHERE d.id = ?', [id], (err, rows) => {
      if (err) {
        console.error('Erro ao executar a query: ' + err.stack);
        res.status(500).send('Erro ao buscar contato pelo ID informado.');
        return;
      }
      const contato = rows[0];
      res.status(200).json({
        nome: contato.first_name,
        email: contato.email,
        telefone: contato.gender,
        cep: contato.cep,
        logradouro: contato.logradouro,
        compelmento: contato.compelmento,
        bairro: contato.bairro,
        cidade: contato.cidade,
        uf: contato.uf,
        tpessoa: contato.tpessoa
      });
    });
  } else {
    // Busca pelo email
    const result = connection.query('SELECT first_name, email, gender, cep, logradouro, compelmento, bairro, cidade, uf, t.descricao as tpessoa FROM denovo d inner join tipopessoa t on t.id = d.tpessoa WHERE d.email = ?', [parametro], (err, rows) => {
      if (err) {
        console.error('Erro ao executar a query: ' + err.stack);
        res.status(500).send('Erro ao buscar contato pelo e-mail informado.');
        return;
      }
      const contato = rows[0];
      res.status(200).json({
        nome: contato.first_name,
        email: contato.email,
        telefone: contato.gender,
        cep: contato.cep,
        logradouro: contato.logradouro,
        compelmento: contato.compelmento,
        bairro: contato.bairro,
        cidade: contato.cidade,
        uf: contato.uf,
        tpessoa: contato.tpessoa
      });
    });
  }
});

app.listen(3000, function () {
  console.log('API rodando na porta 3000!');
});