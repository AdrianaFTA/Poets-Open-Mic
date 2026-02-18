import React, { useState, useEffect } from "react";
import { createPoem, updatePoem, classifyPoem, saveDraftPoem, publishPoem } from "../services/poemService";
import { useParams, useNavigate } from "react-router-dom";
import SpeechToText from "../components/SpeechToText";

export default function Editor() {
  const { id } = useParams(); // For editing existing draft
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  // Load existing draft if editing
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/poems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
        })
        .catch(err => console.error(err));
    }
  }, [id, token]);

  const handleClassify = async () => {
    const res = await classifyPoem(content);
    setResult(res);
  };

  const handleSaveDraft = async () => {
    try {
      if (id) {
        await updatePoem(id, { title, content, status: "draft" }, token);
      } else {
        await saveDraftPoem({ title, content }, token);
      }
      setSaveMessage("Draft saved!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async () => {
    try {
      if (id) {
        await updatePoem(id, { title, content, status: "published" }, token);
      } else {
        await publishPoem({ title, content }, token);
      }
      setSaveMessage("Poem published!");
      setTimeout(() => setSaveMessage(""), 3000);
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl mb-4">{id ? "Edit Poem" : "Write a Poem"}</h2>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Poem title"
        className="border p-2 w-full mb-2 bg-gray-800 text-white"
      />

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write poem here..."
        className="border p-2 w-full h-40 bg-gray-800 text-white"
      />

      <SpeechToText onResult={spokenText => setContent(prev => prev + "\n" + spokenText)} />

      <div className="flex gap-2 mt-2">
        <button onClick={handleClassify} className="bg-purple-600 p-2 rounded">
          Classify Poem
        </button>
        <button onClick={handleSaveDraft} className="bg-blue-600 p-2 rounded">
          Save Draft
        </button>
        <button onClick={handlePublish} className="bg-green-600 p-2 rounded">
          Publish
        </button>
      </div>

      {saveMessage && <p className="mt-2 text-green-400 font-bold">{saveMessage}</p>}

      {result && (
        <div className="mt-4 p-4 bg-gray-800 border border-purple-500 rounded">
          <p><strong>AI Detected Genre:</strong> {result.genre}</p>
          <p><strong>Word Count:</strong> {result.word_count}</p>
          <p className="text-xs text-gray-400 mt-1 italic">{result.message}</p>
        </div>
      )}
    </div>
  );
}
