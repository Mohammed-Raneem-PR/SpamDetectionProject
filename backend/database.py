import os
import sqlite3
from pathlib import Path

DATABASE = os.getenv(
    "DATABASE_PATH",
    str(Path(__file__).resolve().parent / "spam_detection.db"),
)
def get_connection():
    return sqlite3.connect(DATABASE)

def create_database():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tweets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            tweet TEXT,
            city TEXT,
            prediction TEXT,
            confidence REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            owner_user_id INTEGER
        )
    """)

    # Existing installations may already have a tweets table.  Add ownership
    # without losing the tweets that are already stored in it.
    columns = {row[1] for row in cursor.execute("PRAGMA table_info(tweets)")}
    if "owner_user_id" not in columns:
        cursor.execute("ALTER TABLE tweets ADD COLUMN owner_user_id INTEGER")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS prediction_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            prediction TEXT NOT NULL,
            confidence REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""

        CREATE TABLE IF NOT EXISTS reviews (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT,

            rating INTEGER,

            review TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )

    """)

    conn.commit()
    conn.close()


def save_tweet(title, tweet, city, prediction, confidence, owner_user_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO tweets
        (title, tweet, city, prediction, confidence, owner_user_id)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (title, tweet, city, prediction, confidence, owner_user_id))

    conn.commit()
    conn.close()


def get_all_tweets(owner_user_id=None):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    if owner_user_id is None:
        cursor.execute("SELECT * FROM tweets ORDER BY id DESC")
    else:
        cursor.execute(
            "SELECT * FROM tweets WHERE owner_user_id = ? ORDER BY id DESC",
            (owner_user_id,)
        )

    rows = cursor.fetchall()

    conn.close()

    return rows


def save_prediction(user_id, message, prediction, confidence):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO prediction_history
        (user_id, message, prediction, confidence) VALUES (?, ?, ?, ?)""",
        (user_id, message, prediction, confidence),
    )
    prediction_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return prediction_id


def get_prediction_history(user_id, limit=10):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(
        """SELECT id, message, prediction, confidence, created_at
        FROM prediction_history WHERE user_id = ?
        ORDER BY id DESC LIMIT ?""",
        (user_id, limit),
    )
    rows = cursor.fetchall()
    conn.close()
    return rows
def create_users_table():

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            full_name TEXT,

            username TEXT UNIQUE,

            email TEXT,

            password TEXT,

            phone TEXT,

            city TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
    """)

    conn.commit()
    conn.close()


def ensure_demo_user():
    """Create predictable user accounts and demo tweets for demonstrations."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    seed_users = [
        ("Demo User", "demo_user", "demo.user@example.com", "demo123", "9999999999", "Bangalore"),
        ("Demo Account", "demo_123", "demo@123.com", "demo@123", "9876543210", "Bangalore"),
        ("John Doe", "John", "user@gmail.com", "78931399", "9876543211", "New York"),
        ("Joe", "Joe", "ranee@gmail.com", "123123", "9876543212", "London"),
        ("Raneem", "ran", "raneem@gmail.com", "123", "9876543213", "Bangalore"),
    ]

    cursor.executemany(
        """
        INSERT OR IGNORE INTO users
        (full_name, username, email, password, phone, city)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        seed_users,
    )

    # Also seed initial demo tweets if table is empty
    count = cursor.execute("SELECT COUNT(*) FROM tweets").fetchone()[0]
    if count == 0:
        seed_tweets = [
            ("Campus AI Symposium 2026", "Excited to invite all computer science scholars to our seminar on machine learning robustness tomorrow morning!", "Bangalore", "Ham", 99.2, 1),
            ("Robotics Challenge Registration", "Annual Inter-College Robotics Challenge registration is now open. Register here: https://docs.google.com/forms/d/e/robotics", "Bangalore", "Ham", 98.7, 1),
            ("Exclusive Crypto Giveaway", "URGENT: Claim free 2.5 ETH giveaway immediately! Connect your wallet at bit.ly/claim-crypto-free", "New York", "Spam", 99.8, 1),
            ("Department Hackathon", "Join our 24-hour coding sprint this weekend at the main campus lab. Free entry and food!", "London", "Ham", 97.5, 1),
            ("Lottery Prize Notification", "Congratulations! You have won $500,000 in European Lottery. Send processing fee via Western Union.", "Tokyo", "Spam", 99.1, 1),
            ("Coffee & Code Meetup", "Great weather in Indiranagar today. Anyone up for a coffee and discussing transformer models?", "Bangalore", "Ham", 100.0, 1),
        ]
        cursor.executemany(
            """
            INSERT INTO tweets
            (title, tweet, city, prediction, confidence, owner_user_id)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            seed_tweets,
        )

    conn.commit()
    conn.close()
def register_user(
    full_name,
    username,
    email,
    password,
    phone,
    city
):

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""

        INSERT INTO users

        (
        full_name,
        username,
        email,
        password,
        phone,
        city
        )

        VALUES(?,?,?,?,?,?)

    """,(

        full_name,
        username,
        email,
        password,
        phone,
        city

    ))

    conn.commit()
    conn.close()
def login_user(username, password):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT * FROM users
        WHERE username = ?
        AND password = ?
        """,
        (username, password)
    )

    user = cursor.fetchone()

    conn.close()

    return user
def get_dashboard_stats(owner_user_id=None):

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    tweet_filter = "" if owner_user_id is None else " WHERE owner_user_id = ?"
    filter_params = () if owner_user_id is None else (owner_user_id,)

    cursor.execute(f"SELECT COUNT(*) FROM tweets{tweet_filter}", filter_params)
    total_tweets = cursor.fetchone()[0]

    prediction_filter = " WHERE prediction='Spam'" if owner_user_id is None else " WHERE prediction='Spam' AND owner_user_id = ?"
    cursor.execute(f"SELECT COUNT(*) FROM tweets{prediction_filter}", filter_params)
    spam = cursor.fetchone()[0]

    prediction_filter = " WHERE prediction='Ham'" if owner_user_id is None else " WHERE prediction='Ham' AND owner_user_id = ?"
    cursor.execute(f"SELECT COUNT(*) FROM tweets{prediction_filter}", filter_params)
    ham = cursor.fetchone()[0]

    conn.close()

    return {
        "total_users": total_users,
        "total_tweets": total_tweets,
        "spam": spam,
        "ham": ham
    }
def get_analytics(owner_user_id=None):

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    tweet_filter = "" if owner_user_id is None else " AND owner_user_id = ?"
    filter_params = () if owner_user_id is None else (owner_user_id,)

    cursor.execute(f"SELECT COUNT(*) FROM tweets WHERE prediction='Spam'{tweet_filter}", filter_params)
    spam = cursor.fetchone()[0]

    cursor.execute(f"SELECT COUNT(*) FROM tweets WHERE prediction='Ham'{tweet_filter}", filter_params)
    ham = cursor.fetchone()[0]

    where_filter = "" if owner_user_id is None else " WHERE owner_user_id = ?"
    cursor.execute(f"SELECT COUNT(*) FROM tweets{where_filter}", filter_params)
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM users")
    users = cursor.fetchone()[0]

    conn.close()

    return {
        "spam": spam,
        "ham": ham,
        "total": total,
        "users": users
    }
def update_profile(
    id,
    full_name,
    email,
    phone,
    city
):

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users

        SET
            full_name=?,
            email=?,
            phone=?,
            city=?

        WHERE id=?

    """,(

        full_name,
        email,
        phone,
        city,
        id

    ))

    conn.commit()
    conn.close()
def delete_tweet(tweet_id, owner_user_id=None):

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    if owner_user_id is None:
        cursor.execute("DELETE FROM tweets WHERE id=?", (tweet_id,))
    else:
        cursor.execute(
            "DELETE FROM tweets WHERE id=? AND owner_user_id=?",
            (tweet_id, owner_user_id)
        )

    conn.commit()
    conn.close()
def get_all_users():

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            full_name,
            username,
            email,
            phone,
            city,
            created_at
        FROM users
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    return rows
def delete_user(user_id):

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM users WHERE id=?",
        (user_id,)
    )

    conn.commit()
    conn.close()
