const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;


// Allow specific origins
const corsOptions = {
  origin: ["http://localhost:3000", "https://e-yasmina.github.io"], // Add your frontend URL here
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json()); // Ensure request body parsing
app.use(express.urlencoded({ extended: true })); 

// In-memory storage for first name and last name
let users = [];


app.get('/', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
});

// Route to store a user's first name and last name
// app.post('/user', (req, res) => {
//   const { firstName, lastName } = req.body;
//   // if (!firstName || !lastName) {
//   //   return res.status(400).json({ error: 'First name and last name are required' });
//   // }
//   const newUser = { firstName, lastName };
//   users.push(newUser);

//   res.status(201).json(newUser);
// });
app.post('/user', (req, res) => {
  console.log("Received body:", req.body); // Add this line

  try {
      const { firstName, lastName } = req.body; // Check if req.body exists
      if (!firstName || !lastName) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: error.message });
  }
});


// Route to get the stored users
app.get('/users', (req, res) => {
  //res.status(200).json(users);
  if (users.length === 0) {
    return res.status(200).json("No student logged in yet.");
  }else{
    return res.status(200).json(users);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the app to Vercel
module.exports = app;
