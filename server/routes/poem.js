const API_URL = "http://localhost:3000/api/poems";

export async function createPoem(poem, token) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(poem),
  });
  return response.json();
}

export async function classifyPoem(text) {
  const response = await fetch("http://localhost:3000/api/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return response.json();
}