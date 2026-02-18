const express = require("express");
const natural = require('natural');
const cors = require('cors');




//express app
const app = express();
app.use(cors());
app.use(express.json()); // This allows the NLP service to read JSON data
const PORT = process.env.NLP_PORT || 5000;

// NLP classifier
const classifier = new natural.BayesClassifier();
// traing data
classifier.addDocument('The sun shines bright and the birds sing a sweet song.', 'Optimistic');
classifier.addDocument('Dark clouds gather, a somber day approaches.', 'Melancholic');
classifier.addDocument('I sit in silence and watch the cars pass by.', 'Neutral');
classifier.addDocument('My heart aches for a love lost long ago.', 'Romantic');
classifier.addDocument('A sonnet about the weather and the sea.', 'Descriptive');

classifier.train();
console.log("NLP Classifier has been trained.");


//health check endpoint
app.get("/", (req, res) => {
    res.send("Poet's Open Mic API is running");
});

// POST classify endpoint
app.post('/classify', (req, res) =>{
    const {content} = req.body;
    if(!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Valid poem content.'});
        }
        try {
            // genre
            const genre = classifier.classify(content);

            //feature extraction (word count)
            const tokenizer = new natural.WordTokenizer();
            const tokens = tokenizer.tokenize(content);
            const wordCount = tokens.length;

            res.json({
                genre: genre,
                word_count: wordCount,
                message: "Classification performed successfully."
            });
        } catch (error) {
            console.error("NLP CLASSIFICATION ERROR:", error);
            res.status(500).json({ error:"Failed to process text content"});
        }
    });
     app.listen(PORT, () =>{
        console.log(`NLP microservice is running ${PORT}`);
     });

