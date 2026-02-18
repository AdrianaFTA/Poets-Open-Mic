const API_URL = 'http://localhost:5001/api/poems';
const NLP_URL = 'http://localhost:5000/classify';

// Fetch all poems from the database
export const getPoems = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

// Create a new poem with AI classification
export const saveDraftPoem = (poem, token) =>
  fetch("http://localhost:5000/api/poems/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(poem),
  }).then(res => res.json());

export const publishPoem = (poem, token) =>
  fetch("http://localhost:5000/api/poems/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(poem),
  }).then(res => res.json());

export const updatePoem = (id, poem, token) =>
  fetch(`http://localhost:5000/api/poems/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(poem),
  }).then(res => res.json());
