const express = require('express'); // Import express
const cors = require('cors'); // Import cors for cross-origin resource sharing
require("./db/config"); // Import database configuration
const app = express(); // Create express app
const User = require("./db/User"); // Import User model
const Product = require("./db/Product"); // Import Product model
app.use(express.json()); // Middleware to parse JSON data
app.use(cors()); // Enable CORS for all routes
app.post("/signup", async (req,resp)=>{
  let user = new User(req.body); // Create a new user instance with request body
  let result = await user.save(); // Save user to database
  resp.send(result); // Send response
  //resp.send("API is working fine"); // Send response
})
app.listen(5000); // Listen on port 5000