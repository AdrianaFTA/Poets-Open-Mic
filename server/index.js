const express = require("express");
const cors = require("cors");
require("dotenv").config();

//express app
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

//routes
const authRoutes = require("./routes/auth");
const poemRoutes = require("./routes/poems");
const classifyRoutes = require("./routes/classify");

app.use("/api/auth", authRoutes);
app.use("/api/poems", poemRoutes);
app.use("/api/classify", classifyRoutes);

//health check endpoint
app.get("/", (req, res) => {
    res.send("Poet's Open Mic API is running");
});

//start server
app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${3000}`);
});