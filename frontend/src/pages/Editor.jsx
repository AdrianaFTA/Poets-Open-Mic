import React, { useState } from "react";
import { createPoem, classifyPoem } from "../services/poemService";
import SpeechToText from "../components/SpeechToText";


export default function Editor() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(null); // Stores { genre, word_count }
  const [saveMessage, setSaveMessage] = useState(""); 
  const token = localStorage.getItem("token");

  const handleClassify = async () => {
    // Calls port 5000
    const res = await classifyPoem(content);
    setResult(res); 
  };

  const handleSave = async () => {
    // Combine the user input with the AI results to save to port 5001
    const poemData = {
      title,
      content,
      genre: result ? result.genre : "Unclassified", // Matches DB column
      word_count: result ? result.word_count : 0,    // Matches DB column
      user_id: 1 // Using the testauthor ID you verified
    };

    const res = await createPoem(poemData, token);
    if (res) {
      setSaveMessage("Poem saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl mb-4">Write a Poem</h2>
      
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Poem title"
        className="border p-2 w-full mb-2 bg-gray-800 text-white"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write poem here..."
        className="border p-2 w-full h-40 bg-gray-800 text-white"
      />
      <SpeechToText
  onResult={(spokenText) =>
    setContent((prev) => prev + "\n " + spokenText)
  }
/>

      <div className="flex gap-2 mt-2">
        <button onClick={handleClassify} className="bg-purple-600 p-2 rounded">
          Classify Poem
        </button>
        <button onClick={handleSave} className="bg-blue-600 p-2 rounded">
          Save Poem
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {saveMessage && (
        <p className="mt-2 text-green-400 font-bold">{saveMessage}</p>
      )}

      {/* AI RESULTS DISPLAY */}
      {result && (
        <div className="mt-4 p-4 bg-gray-800 border border-purple-500 rounded">
          <p><strong>AI Detected Genre:</strong> {result.genre}</p>
          <p><strong>Word Count:</strong> {result.word_count}</p>
          <p className="text-xs text-gray-400 mt-1 italic">
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
}