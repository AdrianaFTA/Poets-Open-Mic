import React, { useState } from "react";
import { createPoem, classifyPoem } from "../services/poemService";

export default function Editor() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");

  const handleSave = async () => {
    const res = await createPoem({ title, content }, token);
    console.log(res);
  };

  const handleClassify = async () => {
    const res = await classifyPoem(content);
    setResult(res);
  };

  return (
    <div className="p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Poem title"
        className="border p-2 w-full mb-2"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your poem here..."
        className="border p-2 w-full h-40"
      />

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white p-2 mt-2 mr-2"
      >
        Save Poem
      </button>

      <button
        onClick={handleClassify}
        className="bg-purple-500 text-white p-2 mt-2"
      >
        Classify Poem
      </button>

      {result && (
        <div className="mt-4 p-2 bg-gray-100 border">
          <p>
            <strong>Form:</strong> {result.form}
          </p>
          <p>
            <strong>Theme:</strong> {result.theme}
          </p>
        </div>
      )}
    </div>
  );
}