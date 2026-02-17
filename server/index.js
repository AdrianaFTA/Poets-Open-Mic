import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

import authRouter from './routes/auth.js';
import classificationRouter from './routes/classify.js';
import poemsRouter from './routes/poems.js';

// Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Poet's Open Mic API",
            version: '1.0.0',
            description: 'API documentation for my poetry NLP and management',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Local server',
            },
        ],
    },
    // Path to the API docs (this looks into your routes folder for comments)
    apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(swaggerOptions);
// -----------------------------

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/poems", poemsRouter);
app.use("/classify", classificationRouter);

// Health check endpoint
app.get("/", (req, res) => {
    res.send("Poet's Open Mic API is running. View docs at /api-docs");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});