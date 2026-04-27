import requests
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report

# 1. SETUP: Your API details
URL = "http://127.0.0.1:5000/classify" # Update this if your port is different

# 2. THE DATASET: 5 Happy, 5 Sad (Famous Poems)
test_data = [
    {"text": "I wandered lonely as a cloud That floats on high o'er vales and hills", "label": "happy"}, # Wordsworth
    {"text": "The summer day is bright and long, And the world is full of song.", "label": "happy"},
    {"text": "How do I love thee? Let me count the ways.", "label": "happy"}, # Browning
    {"text": "Hope is the thing with feathers that perches in the soul.", "label": "happy"}, # Dickinson
    {"text": "The sun was shining on the sea, Shining with all his might.", "label": "happy"}, # Carroll
    {"text": "Do not go gentle into that good night... Rage, rage against the dying of the light.", "label": "sad"}, # Thomas
    {"text": "I have outwalked the furthest city light. I have looked down the saddest city lane.", "label": "sad"}, # Frost
    {"text": "For the moon never beams without bringing me dreams Of the beautiful Annabel Lee.", "label": "sad"}, # Poe
    {"text": "Alone, alone, all, all alone, Alone on a wide wide sea!", "label": "sad"}, # Coleridge
    {"text": "Ah, what can ail thee, wretched wight, Alone and palely loitering?", "label": "sad"} # Keats
]

y_true = []
y_pred = []

print("Starting Evaluation...")

# 3. RUN EVALUATION
for item in test_data:
    try:
        # Send to your NLP service
        response = requests.post(URL, json={"text": item["text"]})
        prediction = response.json()['label'].lower() # Adjust key if your API returns 'sentiment' instead of 'label'
        
        y_true.append(item["label"])
        y_pred.append(prediction)
        print(f"Poem: {item['text'][:30]}... | True: {item['label']} | Pred: {prediction}")
    except Exception as e:
        print(f"Error connecting to API: {e}")

# 4. GENERATE CONFUSION MATRIX
labels = ["happy", "sad"]
cm = confusion_matrix(y_true, y_pred, labels=labels)

plt.figure(figsize=(8,6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
plt.title('Confusion Matrix: Poets Open Mic Sentiment Analysis')
plt.ylabel('Actual Label')
plt.xlabel('Predicted Label')
plt.savefig('confusion_matrix.png') # This saves the image for your report
print("\nEvaluation Complete! 'confusion_matrix.png' has been generated.")

# 5. PRINT STATISTICS
print("\nClassification Report:")
print(classification_report(y_true, y_pred, target_names=labels))