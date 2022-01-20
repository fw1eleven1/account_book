const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dbconfig = require('./config/database.js')
const connection = mysql.createConnection(dbconfig);

const app = express();

app.set('port', 5000);

app.use(cors());

app.get('/', (req, res) => {
  res.send('OK');
})

app.get('/account', (req, res) => {
  const date = req.query.date;
  connection.query('SELECT * FROM account WHERE DATE_FORMAT(date, "%Y-%m") = ?', [date], (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
})

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, rows, fields) => {
    if (err) throw err;
    console.log(rows);
    res.json(rows);
    // res.send(rows);
  });
})

app.listen(app.get('port'), () => {
  console.log('server running on port ' + app.get('port'));
  
})
