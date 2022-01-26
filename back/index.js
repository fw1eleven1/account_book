const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dbconfig = require('./config/database.js')
const connection = mysql.createConnection(dbconfig);

const app = express();

app.set('port', 5000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('OK');
})

app.get('/account', (req, res) => {
  const date = req.query.date;
  connection.query('SELECT date, SUM(credit) AS credit, SUM(debit) AS debit FROM account WHERE DATE_FORMAT(date, "%Y-%m") = ? GROUP BY date', [date], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
})

app.get('/account/:date', (req, res) => {
  const date = req.params.date;
  connection.query('SELECT * FROM account WHERE DATE_FORMAT(date, "%Y-%m-%d") = ?', [date], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows)
  })
})

app.post('/account/save', (req, res) => {
  const data = req.body;
  const type = data.type;
  connection.query(`INSERT INTO account (date, ${type}, description) values (?, ?, ?)`, [data.date, data.amount, data.description], (err, results) => {
    if (err) throw err;
    res.status(200).send('OK');
  })
})

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
    // res.send(rows);
  });
})

app.listen(app.get('port'), () => {
  console.log('server running on port ' + app.get('port'));
  
})
