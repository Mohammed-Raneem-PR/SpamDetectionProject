import sqlite3

DATABASE = "spam_detection.db"
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


def save_tweet(title, tweet, city, prediction, confidence):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO tweets
        (title, tweet, city, prediction, confidence)
        VALUES (?, ?, ?, ?, ?)
    """, (title, tweet, city, prediction, confidence))

    conn.commit()
    conn.close()


def get_all_tweets():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM tweets
        ORDER BY id DESC
    """)

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
def get_dashboard_stats():

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM tweets")
    total_tweets = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM tweets WHERE prediction='Spam'")
    spam = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM tweets WHERE prediction='Ham'")
    ham = cursor.fetchone()[0]

    conn.close()

    return {
        "total_users": total_users,
        "total_tweets": total_tweets,
        "spam": spam,
        "ham": ham
    }
def get_analytics():

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM tweets WHERE prediction='Spam'")
    spam = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM tweets WHERE prediction='Ham'")
    ham = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM tweets")
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
def delete_tweet(tweet_id):

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM tweets WHERE id=?",
        (tweet_id,)
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