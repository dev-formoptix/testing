const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');

function evaluateCode(code) {
  return eval(code);
}

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: 'fdsafdsf'
});

connection.connect();

app.use(bodyParser.json());

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

app.post('/login', limiter, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const values = [username, password];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      res.send('Login successful');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
