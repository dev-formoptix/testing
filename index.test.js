const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const { rateLimit } = require('express-rate-limit');

const app = express();

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'passwordd',
  database: 'fdsafdsf'
});

// Connect to MySQL database
connection.connect();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Create rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

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


// Write test case for POST /login endpoint
describe('POST /login', () => {
  it('should return "Login successful" with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'validusername', password: 'validpassword' });
      
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Login successful');
  });

  it('should return "Invalid username or password" with invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'invalidusername', password: 'invalidpassword' });
      
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Invalid username or password');
  });
});

// Close the connection to the MySQL database
afterAll(() => {
  connection.end();
});