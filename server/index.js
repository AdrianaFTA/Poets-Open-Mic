const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Loads environment variables

// Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth.cjs");
const poemRoutes = require("./routes/poems.js");
const classifyRoutes = require("./routes/classify.cjs");

app.use("/api/auth", authRoutes);
app.use("/api/poems", poemRoutes);
app.use("/api/classify", classifyRoutes);

// Health check endpoint
app.get("/", (req, res) => {
    res.send("Poet's Open Mic API is running");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});