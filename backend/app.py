from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import joblib
from fastapi.middleware.cors import CORSMiddleware
import random
from fastapi import Body
from database import get_connection


from database import (
    
    create_database,
    save_tweet,
    get_all_tweets,
    create_users_table,
    register_user,
    login_user,
    get_dashboard_stats,
    get_analytics,
    update_profile,
    delete_tweet,
    get_all_users,

delete_user
)

app = FastAPI(title="Spam Detection API")
otp_store = {}

create_database()
create_users_table()
class OTPRequest(BaseModel):
    phone: str
class UpdateProfile(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    city: str

@app.post("/send-otp")
def send_otp(data: OTPRequest):

    otp = str(random.randint(100000, 999999))

    otp_store[data.phone] = otp

    print("\n==============================")
    print("Demo OTP:", otp)
    print("Phone:", data.phone)
    print("==============================\n")

    return {
        "message": "OTP Sent Successfully"
    }
class VerifyOTP(BaseModel):
    phone: str
    otp: str


@app.post("/verify-otp")
def verify_otp(data: VerifyOTP):

    if otp_store.get(data.phone) == data.otp:

        del otp_store[data.phone]

        return {
            "verified": True
        }

    return {
        "verified": False
    }
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Model
model = joblib.load("../model/spam_model.pkl")
vectorizer = joblib.load("../model/vectorizer.pkl")


from pydantic import BaseModel

# Used by Detect Spam page
class DetectMessage(BaseModel):
    text: str


# Used by Post Tweet page
class Message(BaseModel):
    username: str
    title: str
    text: str
    city: str
class User(BaseModel):
    full_name: str
    username: str
    email: str
    password: str
    phone: str
    city: str

class Login(BaseModel):
    username: str
    password: str

@app.get("/")
def home():
    return {"message": "Spam Detection API is running!"}
@app.post("/register")
def register(data: User):

    register_user(
        data.full_name,
        data.username,
        data.email,
        data.password,
        data.phone,
        data.city
    )

    return {
        "message": "User Registered Successfully"
    }
@app.post("/login")
def login(data: Login):

    user = login_user(
        data.username,
        data.password
    )

    if user:

        return {
    "success": True,
    "message": "Login Successful",
    "id": user[0],
    "full_name": user[1],
    "username": user[2],
    "email": user[3],
    "phone": user[5],
    "city": user[6],
    "joined": user[7]
}

    return {
        "success": False,
        "message": "Invalid Username or Password"
    }
# -----------------------------
# Predict Single Tweet
# -----------------------------
@app.post("/predict")
def predict(data: DetectMessage):

    vector = vectorizer.transform([data.text])

    prediction = model.predict(vector)[0]
    probability = model.predict_proba(vector)[0]

    label = "Spam" if prediction == 1 else "Ham"
    confidence = round(max(probability) * 100, 2)

    return {
        "prediction": label,
        "confidence": confidence
    }
@app.post("/post-tweet")
def post_tweet(data: Message):

    vector = vectorizer.transform([data.text])

    prediction = model.predict(vector)[0]
    probability = model.predict_proba(vector)[0]

    label = "Spam" if prediction == 1 else "Ham"
    confidence = round(max(probability) * 100, 2)

    save_tweet(
        data.username,
        data.title,
        data.text,
        data.city,
        label,
        confidence
    )

    return {
        "message": "Tweet Posted Successfully",
        "prediction": label,
        "confidence": confidence
    }


# -----------------------------
# Get All Tweets
# -----------------------------
@app.get("/tweets")
def get_tweets():

    rows = get_all_tweets()

    data = []

    for row in rows:
        data.append({
            "id": row[0],
            "title": row[1],
            "tweet": row[2],
            "city": row[3],
            "prediction": row[4],
            "confidence": row[5],
            "date": row[6]
        })

    return data


# -----------------------------
# Predict Text File
# -----------------------------
@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):

    content = await file.read()
    text = content.decode("utf-8").replace("\r\n", "\n")

    if "\n\n" in text:
        messages = [
            paragraph.strip()
            for paragraph in text.split("\n\n")
            if paragraph.strip()
        ]
    else:
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
@app.get("/dashboard")
def dashboard():

    return get_dashboard_stats()
@app.get("/analytics")
def analytics():

    return get_analytics()
@app.put("/profile")
def update_user(data: UpdateProfile):

    update_profile(
        data.id,
        data.full_name,
        data.email,
        data.phone,
        data.city
    )

    return {
        "message": "Profile Updated Successfully"
    }
@app.delete("/tweets/{tweet_id}")
def remove_tweet(tweet_id: int):

    delete_tweet(tweet_id)

    return {
        "message": "Tweet Deleted Successfully"
    }
@app.get("/users")
def users():

    rows = get_all_users()

    data = []

    for row in rows:

        data.append({
            "id": row[0],
            "full_name": row[1],
            "username": row[2],
            "email": row[3],
            "phone": row[4],
            "city": row[5],
            "joined": row[6]
        })

    return data
@app.delete("/users/{user_id}")
def remove_user(user_id: int):

    delete_user(user_id)

    return {
        "message": "User Deleted Successfully"
    }
@app.post("/reviews")
def add_review(data: dict = Body(...)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO reviews (username, rating, review)
        VALUES (?, ?, ?)
        """,
        (
            data["username"],
            data["rating"],
            data["review"],
        ),
    )

    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": "Review Submitted Successfully"
    }
@app.get("/reviews")
def get_reviews():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM reviews
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    reviews = []

    for row in rows:
        reviews.append({
            "id": row[0],
            "username": row[1],
            "rating": row[2],
            "review": row[3],
            "created_at": row[4],
        })

    return reviews
@app.delete("/reviews/{review_id}")
def delete_review(review_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM reviews WHERE id=?",
        (review_id,)
    )

    conn.commit()

    conn.close()

    return {
        "message": "Review Deleted Successfully"
    }