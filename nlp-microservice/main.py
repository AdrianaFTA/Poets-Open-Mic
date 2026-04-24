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
except:
    print("Language model not found. Run: python -m spacy download en_core_web_md")

app = FastAPI()

# Enable CORS for your React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    text = request.content
    
    if not text:
        raise HTTPException(status_code=400, detail="No content provided")

    # 1. Emotional Themes (NRCLex)
    emotion = NRCLex(text)
    top_emotions = emotion.top_emotions
    primary_mood = top_emotions[0][0] if top_emotions else "neutral"

    # 2. Semantic Themes (spaCy)
    doc = nlp(text)
    # Extracts nouns/adjectives as tags, ignoring small "filler" words
    tags = [token.lemma_.lower() for token in doc if token.pos_ in ["NOUN", "ADJ"] and not token.is_stop]

    # 3. Basic Genre Logic
    genre = "Melancholic" if primary_mood in ['sadness', 'fear'] else "Optimistic" if primary_mood in ['joy', 'trust'] else "Descriptive"

    # 4. Rhyme & Structural Analysis (Pronouncing)
    # Extract clean, alphabetic words from the poem
    words = [token.text.lower() for token in doc if token.is_alpha]
    rhyme_count = 0
    
    # Check for rhyming words throughout the poem
    for i in range(len(words)):
        rhymes_for_word = pronouncing.rhymes(words[i])
        # Check if any subsequent word in the poem rhymes with the current word
        for j in range(i + 1, len(words)):
            if words[j] in rhymes_for_word:
                rhyme_count += 1
                break # Move to the next word once a rhyme is found

    # Determine poetic style based on rhyme presence
    poetic_style = "Lyrical" if rhyme_count > 0 else "Free Verse"

    return {
        "genre": genre,
        "primary_emotion": primary_mood,
        "semantic_tags": list(set(tags))[:5],
        "word_count": len(doc),
        "poetic_style": poetic_style,
        "rhyme_matches_found": rhyme_count
    }

if __name__ == "__main__":
    import uvicorn
    # Start the server on port 5000 to match your old setup
    uvicorn.run(app, host="0.0.0.0", port=5000)