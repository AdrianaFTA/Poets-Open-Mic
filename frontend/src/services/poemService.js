
const NLP_URL = 'http://localhost:5001/classify';

const API_URL = 'http://localhost:5000/api/poems';

// Fetch all poems
export const getPoems = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

// This replaces "createPoem" - it saves a draft
export const saveDraftPoem = (poem, token) =>
  fetch(`${API_URL}/draft`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(poem),
  }).then(res => res.json());

// This publishes a poem
export const publishPoem = (poem, token) =>
  fetch(`${API_URL}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(poem),
  }).then(res => res.json());

// This updates an existing poem (draft or published)
export const updatePoem = (id, poem, token) =>
  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(poem),
  }).then(res => res.json());


export const classifyPoem = async (content) => {
  try {
    const response = await fetch("http://127.0.0.1:5001/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content }) 
    });
    
    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("AI Service Error:", error);
    return null;
  }
};

  export const getUserPoems = async (token) => {
    const response = await fetch(`${API_URL}/user`, { 
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
};

export const deletePoem = (id, token) =>
  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());