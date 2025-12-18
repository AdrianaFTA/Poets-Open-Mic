const API_URL = 'http://localhost:5001/api/poems';
const NLP_URL = 'http://localhost:5000/analyze';

// Fetch all poems from the database
export const getPoems = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

// Create a new poem with AI classification
export const createPoem = async (poemData) => {
    // 1. First, send the poem text to the NLP microservice for a genre/mood check
    const nlpResponse = await fetch(NLP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: poemData.content }),
    });
    const nlpData = await nlpResponse.json();

    // 2. Add the AI-detected genre to your poem data
    const finalPoemData = {
        ...poemData,
        genre: nlpData.category || 'Uncategorized'
    };

    // 3. Save the final poem to your PostgreSQL database
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPoemData),
    });
    return response.json();
};
export const classifyPoem = async (text) => {
    const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    return response.json();
};