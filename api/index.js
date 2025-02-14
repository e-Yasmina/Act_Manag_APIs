const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;
const bodyParser = require('body-parser')

// Allow specific origins
const corsOptions = {
  origin: ["http://localhost:3000", "https://e-yasmina.github.io"], // Add your frontend URL here
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json()); // Ensure request body parsing
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for first name and last name
//let users = [];
const users = new Set();

app.get('/', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
});

// Route to create a new user
app.post('/user', (req, res) => {
  console.log("Received body:", req.body); // Add this line
  try {
      const { firstName, lastName} = req.body; // Check if req.body exists
      if (!firstName || !lastName) {
          return res.status(400).json({ error: "Missing required fields" });
      }
      const userKey = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;

        if (users.has(userKey)) {
            return res.status(409).json({ error: "User already exists!", userKey  });
        }

      res.status(201).json({ message: "User created successfully!", userKey  });
      users.set(userKey, { firstName, lastName, score: [], time: [], liveActivity:"" });
      //users.add(userKey);
      //users.push({ firstName, lastName , score: 0 , time: 0});
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

// Route to get a specific user
app.get('/user/:userKey', (req, res) => {
  const { userKey } = req.params; // Extract userKey from URL parameter

  if (!users.has(userKey)) {
      return res.status(404).json({ error: "User not found!" });
  }

  return res.status(200).json(users.get(userKey)); // Return the user object
});


// Route to update the time array of a user
app.put('/user/:userKey/time', (req, res) => {
  const { userKey } = req.params;
  const { activityId, timeSpent } = req.body; // Expecting a single entry

  if (!users.has(userKey)) {
      return res.status(404).json({ error: "User not found!" });
  }

  if (!activityId || !timeSpent) {
      return res.status(400).json({ error: "activityId and timeSpent are required!" });
  }

  const user = users.get(userKey);
  user.time.push({ activityId, timeSpent }); // Storing time entry as an object

  users.set(userKey, user); // Save the updated user object

  return res.status(200).json({ message: "Time updated successfully!", user });
});

// Route to update the score array of a user
app.put('/user/:userKey/score', (req, res) => {
  const { userKey } = req.params;
  const { score } = req.body;

  if (!users.has(userKey)) {
      return res.status(404).json({ error: "User not found!" });
  }

  const user = users.get(userKey);

  if (!Array.isArray(score)) {
      return res.status(400).json({ error: "Score must be an array!" });
  }

  user.score.push(...score);
  users.set(userKey, user); // Ensure the updated user is stored

  return res.status(200).json({ message: "Score updated successfully!", user });
});

app.put('/user/:userKey/activity', (req, res) => {
  const { userKey } = req.params;
  const { liveActivityId } = req.body;

  if (!users.has(userKey)) {
      return res.status(404).json({ error: "User not found!" });
  }

  const user = users.get(userKey);

  user.liveActivity = liveActivityId;
  users.set(userKey, user); // Ensure the updated user is stored

  return res.status(200).json({ message: `Activity ${liveActivityId} is live`, user });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

//Export the app to Vercel
//module.exports = app;
module.exports = (req, res) => {
  app(req, res);
};