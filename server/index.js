import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { metaphone } from 'natural';
import { syllable } from 'syllable';

dotenv.config();

import authRouter from './routes/auth.js';
import classificationRouter from './routes/classify.js';
import poemsRouter from './routes/poems.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Helper: Check if two words rhyme
const checkRhyme = (word1, word2) => {
    // We compare the metaphone (sound) of the words
    return metaphone.compare(word1, word2); 
};

// New Route for Analysis
app.post("/analyze", (req, res) => {
    const { content } = req.body;
    const lines = content.split('\n').filter(line => line.trim() !== "");
    
    let analysis = {
        rhymes: [],
        breakSuggestions: []
    };

    lines.forEach((line, index) => {
        // 1. Line Break Logic: Check syllable count
        if (syllable(line) > 12) {
            analysis.breakSuggestions.push(`Line ${index + 1} is a bit long. Try a break after 10 syllables.`);
        }

        // 2. Rhyme Logic: Compare last word of this line with the next line
        if (index < lines.length - 1) {
            const word1 = lines[index].trim().split(" ").pop();
            const word2 = lines[index + 1].trim().split(" ").pop();
            
            if (checkRhyme(word1, word2)) {
                analysis.rhymes.push(`Line ${index + 1} and ${index + 2} rhyme! (${word1}/${word2})`);
            }
        }
    });

    res.json(analysis);
});

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Poet's Open Mic API",
      version: '1.0.0',
      description: 'API documentation for poetry NLP and management',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./server/routes/*.js'], // matches route files
};

const specs = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/poems", poemsRouter);
app.use("/classify", classificationRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Poet's Open Mic API is running. View docs at /api-docs");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Docs: http://localhost:${PORT}/api-docs`);
});
