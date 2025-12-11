import express from 'express'; 
const router = express.Router();

const NLP_SERVICE_URL = 'http://localhost:5000';


router.post("/poems", async (req, res) => {
    // content from client request
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: "Poem content is required for classification." });
    }

    try {
        // forwards content to NLP Microservice /classify endpoint
        const response = await fetch(`${NLP_SERVICE_URL}/classify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });

        //check if microservicr responding
        if (!response.ok) {
            // error message from microservice
            const errorData = await response.json();
            return res.status(response.status).json({ 
                message: "Microservice error", 
                details: errorData.error || errorData.message 
            });
        }

        // classification result 
        const classificationResult = await response.json();

        //result back to the client
        res.json({
            message: "Classification successful",
            result: classificationResult,
        });

    } catch (err) {
        console.error("CLASSIFY ROUTE ERROR: Failed to communicate with NLP Microservice.", err);
        //microservice not working 
        res.status(500).json({ 
            message: "Internal server error: Could not reach NLP service." 
        });
    }
});

export default router;