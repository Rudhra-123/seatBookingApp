const express = require("express");
const { sequelize } = require("./configs/db"); // Ensure you are importing sequelize, not connect
const routes = require("./src/controllers/Route");
// const routes = require("./src/controllers/Route");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const router = require("./src/controllers/User");

dotenv.config({});

// const auth = require("./auth/auth");
// const jwt = require('jsonwebtoken');

const app = express();

// Middleware for parsing JSON and URL-encoded payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(morgan("tiny"));
app.use(cors());

// Root route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the Seat Booking API");
});
// app.get('/protected', auth, (req, res) => {
//   res.json({ message: 'Welcome to the protected route!', user: req.user });
// });
// Register routes for the application
app.use("/api", routes);
app.use("/user", router);
// Define the port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, async () => {
  try {
    // Test database connection before starting the server
    await sequelize.authenticate(); // Sequelize method to test DB connection
    console.log("Database connected successfully.");

    // Sync models with the database
    await sequelize.sync(); // Sync models (create tables if they don't exist)
    console.log("Database synced successfully.");

    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
});
