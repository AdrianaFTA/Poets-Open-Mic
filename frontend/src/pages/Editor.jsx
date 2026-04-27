import React, { useState, useEffect } from "react";
import { updatePoem, classifyPoem, saveDraftPoem, publishPoem } from "../services/poemService";
import { useParams, useNavigate } from "react-router-dom";
import SpeechToText from "../components/SpeechToText";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // If an ID exists in the URL, I'm reaching out to the backend 
    // to pull your existing masterpiece so you can keep working on it.
    if (id && token) {
      fetch(`http://localhost:5000/api/poems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
        })
        .catch(err => console.error("I couldn't load the poem:", err));
    }
  }, [id, token]);

  const handleClassify = async () => {
    // I'm sending your text to the AI service to see what 
    // genre and word count it detects for you.
    const res = await classifyPoem(content);
    setResult(res);
  };

  const handleSaveDraft = async () => {
    // I'm checking if this is a new poem or an update. 
    // Either way, I'll mark it as a 'draft' so it stays private.
    try {
      if (id) {
        await updatePoem(id, { title, content, status: "draft" }, token);
      } else {
        await saveDraftPoem({ title, content }, token);
      }
      setSaveMessage("Draft saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("I failed to save the draft:", err);
    }
  };

  const handlePublish = async () => {
    // Once you're ready to go public, I change the status to 'published' 
    // and send you straight to your profile to see the result.
    try {
      if (id) {
        await updatePoem(id, { title, content, status: "published" }, token);
      } else {
        await publishPoem({ title, content }, token);
      }
      navigate("/profile");
    } catch (err) {
      console.error("I failed to publish the poem:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        
        {/* Header Section: I've aligned your Title and Speech tool nicely */}
        <div className="flex justify-between items-end border-b border-gray-800 pb-4">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-widest text-purple-500 font-bold mb-2 block">Poem Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give it a name..."
              className="bg-transparent text-4xl font-light w-full outline-none placeholder-gray-700"
            />
          </div>
          <SpeechToText onResult={text => setContent(prev => prev + " " + text)} />
        </div>

        {/* Main Editor: I've made this tall (h-[600px]) so you can truly focus on the flow */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Let the words flow here..."
          className="w-full h-[600px] bg-[#1a1a1a] p-10 text-xl leading-relaxed rounded-3xl border border-gray-800 focus:border-purple-900 outline-none transition-all resize-none shadow-2xl"
        />

        {/* Action Bar: I've separated 'Analysis' from 'Saving' to keep the UI clean */}
        <div className="flex flex-wrap items-center justify-between gap-6 bg-[#1a1a1a] p-4 rounded-full px-8 border border-gray-800 shadow-lg">
          <button 
            onClick={handleClassify} 
            className="text-purple-400 hover:text-purple-300 uppercase text-xs tracking-[0.2em] font-black transition"
          >
            ✦ Run AI Analysis
          </button>

          <div className="flex items-center gap-6">
            {saveMessage && <span className="text-green-500 text-sm animate-fade-in">{saveMessage}</span>}
            <button 
              onClick={handleSaveDraft} 
              className="px-6 py-2 text-gray-400 hover:text-white transition text-sm font-medium"
            >
              Save Draft
            </button>
            <button 
              onClick={handlePublish} 
              className="bg-purple-600 hover:bg-purple-500 px-10 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] active:scale-95"
            >
              Publish Poem
            </button>
          </div>
        </div>

        {/* AI Insight Card: I've made this look like a sleek terminal output */}
        {result && (
  <div className="mt-4 p-8 bg-[#1a1a1a] rounded-3xl border border-purple-900/30 shadow-2xl animate-slide-up">
    <h3 className="text-purple-500 font-bold mb-4 uppercase text-xs tracking-widest">Analysis Result</h3>
    
    {/* Use a grid to show 4 stats in a row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      
      {/* 1. Mood (from Python's primary_emotion) */}
      <div>
        <span className="text-gray-500 text-xs block mb-1">Primary Mood</span>
        <p className="text-2xl font-light text-purple-300 capitalize">
          {result.primary_emotion || "Neutral"}
        </p>
      </div>

      {/* 2. Poetic Style (from Python's poetic_style) */}
      <div>
        <span className="text-gray-500 text-xs block mb-1">Poetic Style</span>
        <p className="text-2xl font-light">{result.poetic_style || "Free Verse"}</p>
      </div>

      {/* 3. Rhymes (from Python's rhyme_matches_found) */}
      <div>
        <span className="text-gray-500 text-xs block mb-1">Rhyme Matches</span>
        <p className="text-2xl font-light">{result.rhyme_matches_found || 0}</p>
      </div>

      {/* 4. Semantic Tags (Keywords extracted by spaCy) */}
      <div>
        <span className="text-gray-500 text-xs block mb-1">Keywords</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {result.semantic_tags && result.semantic_tags.length > 0 ? (
            result.semantic_tags.map((tag, index) => (
              <span key={index} className="text-[10px] bg-purple-900/30 px-2 py-1 rounded-full border border-purple-500/20 text-purple-200">
                #{tag}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-600">None detected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )} 
      </div>
    </div>
  );
}