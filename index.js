const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');

/**
 * @param {string} code The code to evaluate
 * @returns {*} The result of the evaluation
 */
function evaluateCode(code) {
  return eval(code); // Alert: Avoid using eval() function
}

const app = express();


// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'fdsafdsf'
});

// Connect to MySQL database
connection.connect();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Set up rate limiter: maximum of five requests per minute
const limiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute
});

// Apply rate limiter to all requests
app.use(limiter);

// Endpoint to authenticate user
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // GOOD: use query parameters to prevent SQL injection
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  // Execute the SQL query with query parameters
  connection.query(query, [username, password], (err, results) => {
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