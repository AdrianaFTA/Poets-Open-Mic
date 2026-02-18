import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import pkg from 'natural';
const { metaphone } = pkg;
import { syllable } from 'syllable';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

import authRouter from './routes/auth.js';
import classificationRouter from './routes/classify.js';
import poemsRouter from './routes/poems.js';



// --- MIDDLEWARE ---

// First, I'm setting up CORS. I'm putting this at the very top 
// so the "permission slip" is checked before any routes are touched.
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:true
}));

// Next, I need to make sure the server can read JSON data 
// coming from your Register and Write pages.
app.use(express.json());

// --- POETRY HELPERS ---

// I'm keeping your rhyme logic here. It uses the sound of the word 
// rather than the spelling, which is much smarter for poetry.
const checkRhyme = (word1, word2) => {
    return metaphone.compare(word1, word2); 
};

// --- ROUTES ---

// I've placed the analysis route here. I like that it processes 
// the poem line-by-line to give instant feedback on length and rhyme.
app.post("/analyze", (req, res) => {
    const { content } = req.body;
    if (!content) return res.json({ rhymes: [], breakSuggestions: [] });

    const lines = content.split('\n').filter(line => line.trim() !== "");
    
    let analysis = {
        rhymes: [],
        breakSuggestions: []
    };

    lines.forEach((line, index) => {
        // 1. Line Break Logic: I'm flagging any line over 12 syllables
        // to help the poet maintain a readable rhythm.
        if (syllable(line) > 12) {
            analysis.breakSuggestions.push(`Line ${index + 1} is a bit long. Try a break.`);
        }

        // 2. Rhyme Logic: I'm checking the end-rhymes of consecutive lines.
        if (index < lines.length - 1) {
            const word1 = lines[index].trim().split(" ").pop().replace(/[^\w]/g, '');
            const word2 = lines[index + 1].trim().split(" ").pop().replace(/[^\w]/g, '');
            
            if (checkRhyme(word1, word2)) {
                analysis.rhymes.push(`Lines ${index + 1} & ${index + 2} rhyme! (${word1}/${word2})`);
            }
        }
    });

    res.json(analysis);
});

// --- DOCUMENTATION ---

// I'm setting up Swagger here so you have a clean UI 
// to test your API endpoints at /api-docs.
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Poet's Open Mic API",
      version: '1.0.0',
      description: 'API documentation for poetry NLP and management',
    },
    servers: [{ url: `http://localhost:${5001}` }],
  },
  apis: ['./routes/*.js'], // I made sure this path matches your folder structure
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// --- API ENDPOINTS ---

// I'm grouping your main features under their specific routers.
app.use("/api/auth", authRouter);
app.use("/api/poems", poemsRouter);
app.use("/classify", classificationRouter);

// A simple landing page so we know the server is awake.
app.get("/", (req, res) => {
  res.send("Poet's Open Mic API is running. View docs at /api-docs");
});

// --- SERVER START ---

// Finally, I'm starting the engine!
const FINAL_PORT = 5001; 

app.listen(FINAL_PORT, () => {
  console.log(`Main Server is finally running on http://localhost:${FINAL_PORT}`);
});