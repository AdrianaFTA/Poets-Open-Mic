import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth.js';
import classificationRouter from './routes/classify.js';
import poemsRouter from './routes/poems.js';


// Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/poems", poemsRouter);
app.use("/classify", classificationRouter);

// Health check endpoint
app.get("/", (req, res) => {
    res.send("Poet's Open Mic API is running");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});