from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Spam Detection API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("../model/spam_model.pkl")
vectorizer = joblib.load("../model/vectorizer.pkl")

class Message(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "Spam Detection API is running!"}

@app.post("/predict")
def predict(data: Message):
    vector = vectorizer.transform([data.text])
    prediction = model.predict(vector)[0]
    probability = model.predict_proba(vector)[0]

    return {
        "prediction": "Spam" if prediction == 1 else "Ham",
        "confidence": round(max(probability) * 100, 2)
    }
@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8").replace("\r\n", "\n")

    if "\n\n" in text:

        # Split by paragraphs

        messages = [

            paragraph.strip()

            for paragraph in text.split("\n\n")

            if paragraph.strip()

        ]

    else:

        # Split by individual lines

        messages = [

            line.strip()

            for line in text.split("\n")

            if line.strip()

        ]

    results = []
    spam_count = 0
    ham_count = 0

    for message in messages:
        vector = vectorizer.transform([message])

        prediction = model.predict(vector)[0]
        probability = model.predict_proba(vector)[0]

        label = "Spam" if prediction == 1 else "Ham"

        confidence = round(max(probability) * 100, 2)

        if label == "Spam":
            spam_count += 1
        else:
            ham_count += 1

        results.append({
            "message": message,
            "prediction": label,
            "confidence": confidence
        })

    return {
        "total": len(messages),
        "spam": spam_count,
        "ham": ham_count,
        "results": results
    }