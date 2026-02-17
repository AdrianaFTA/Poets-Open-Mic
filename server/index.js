import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

import authRouter from './routes/auth.js';
import classificationRouter from './routes/classify.js';
import poemsRouter from './routes/poems.js';

const app = express();
const PORT = process.env.PORT || 5001;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Poet's Open Mic API",
      version: '1.0.0',
      description: 'API documentation for poetry NLP and management',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./server/routes/*.js'], // simpler + safer
};

const specs = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRouter);
app.use("/api/poems", poemsRouter);
app.use("/classify", classificationRouter);

app.get("/", (req, res) => {
  res.send("Poet's Open Mic API is running. View docs at /api-docs");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
