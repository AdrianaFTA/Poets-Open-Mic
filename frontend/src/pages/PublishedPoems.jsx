import React, { useEffect, useState } from "react";

export default function PublishedPoems() {
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    // We fetch from 5001 because that's where the DB is
    fetch("http://localhost:5001/api/poems")
      .then((res) => res.json())
      .then((data) => setPoems(data))
      .catch((err) => console.error("Error fetching gallery:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-white">
      <h1 className="text-4xl font-black text-center mb-12 text-purple-500">The Global Mic</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {poems.map((poem) => (
          <div key={poem.id} className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-purple-300 mb-2">{poem.title}</h3>
            <p className="text-gray-400 italic whitespace-pre-wrap mb-4">"{poem.content}"</p>
            <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase">By {poem.username}</span>
              <span className="bg-purple-900/40 text-purple-400 px-2 py-1 rounded text-[10px] font-bold">
                {poem.genre || "General"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}