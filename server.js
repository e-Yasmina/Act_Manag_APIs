const express = require('express');
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
//app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// In-memory storage for first name and last name
let users = [];


app.get('/', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
});

// Route to store a user's first name and last name
app.post('/user', (req, res) => {
  const { firstName, lastName } = req.body;

  // if (!firstName || !lastName) {
  //   return res.status(400).json({ error: 'First name and last name are required' });
  // }
  const newUser = { firstName, lastName };
  users.push(newUser);

  res.status(201).json(newUser);
});

// Route to get the stored users
app.get('/users', (req, res) => {
  //res.status(200).json(users);
  if (users.length === 0) {
    return res.status(200).json('No student loged in yet.s');
  }else{
    return res.status(200).json(users);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the app to Vercel
module.exports = app;
