const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const SqlString = require('sqlstring');

/**
 * @param {string} code The code to evaluate
 * @returns {*} The result of the evaluation
 */
function evaluateCode(code) {
  return eval(code); // Alert: Avoid using eval() function
}

// Example usage triggering the alert
evaluateCode("2 + 2");

const app = express();
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'fdsafdsf'
});

connection.connect();
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Use query parameters to avoid SQL injection
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