const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
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

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'fdsafdsf'
});

// Connect to MySQL database
connection.connect();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to authenticate user
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Vulnerable SQL query susceptible to SQL injection
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  // Execute the SQL query
  connection.query(query, (err, results) => {
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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});