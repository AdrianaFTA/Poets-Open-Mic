from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nrclex import NRCLex
import spacy
import pronouncing 

# Load the NLP model
# If this fails, run: python -m spacy download en_core_web_md
try:
    nlp = spacy.load("en_core_web_md")
    print("SUCCESS: Medium NLP model loaded.")
except:
    nlp = spacy.load("en_core_web_sm")
    print("WARNING: Falling back to small model.")

app = FastAPI()

# Enable CORS for your React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PoemRequest(BaseModel):
    content: str

@app.get("/")
def health_check():
    return {"status": "Python NLP Microservice is active"}

@app.post("/classify")
async def analyze_poetry(request: PoemRequest):
    content = request.content
    
    if not content:
        raise HTTPException(status_code=400, detail="No content provided")

    # 1. Emotional Themes
    emotion = NRCLex(content)
    
    # Try to get frequencies using either common attribute name
    freq = getattr(emotion, 'affect_freq', getattr(emotion, 'affect_frequencies', {}))
    
    # Filter out neutral/anticipation to get a 'stronger' mood
    active_emotions = {k: v for k, v in freq.items() if k not in ['neutral', 'anticipation']}
    
    # Find the emotion with the highest score
    if active_emotions and any(active_emotions.values()):
        primary_mood = max(active_emotions, key=active_emotions.get)
    else:
        primary_mood = "neutral"

    # 2. Semantic Themes
    doc = nlp(content)
    print(f"Tokens found: {[t.text for t in doc]}") # Add this to debug
    tags = [token.lemma_.lower() for token in doc if token.pos_ in ["NOUN", "ADJ"] and not token.is_stop]

    # 3. Genre Logic
    genre = "Melancholic" if primary_mood in ['sadness', 'fear'] else "Optimistic" if primary_mood in ['joy', 'trust'] else "Descriptive"

    # 4. Rhyme Analysis
    words = [token.text.lower() for token in doc if token.is_alpha]
    rhyme_count = 0
    for i in range(len(words)):
        rhymes_for_word = pronouncing.rhymes(words[i])
        for j in range(i + 1, len(words)):
            if words[j] in rhymes_for_word:
                rhyme_count += 1
                break 

    poetic_style = "Lyrical" if rhyme_count > 0 else "Free Verse"

    return {
        "genre": genre,
        "primary_emotion": primary_mood,
        "semantic_tags": list(set(tags))[:5],
        "word_count": len(doc),
        "poetic_style": poetic_style,
        "rhyme_matches_found": rhyme_count
    }