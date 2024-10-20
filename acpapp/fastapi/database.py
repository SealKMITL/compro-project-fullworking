from databases import Database
from typing import Optional

POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "db"

DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'

database = Database(DATABASE_URL)

async def connect_db():
    await database.connect()
    print("Database connected")

async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")

# Add check_db_connection function to test the database connection
async def check_db_connection():
    try:
        query = "SELECT 1"
        result = await database.fetch_one(query)
        print(f"DB connection working: {result}")
    except Exception as e:
        print(f"Database connection error: {str(e)}")

# ========================== USERS ==========================

# Function to insert a new user into the users table
async def insert_user(username: str, password_hash: str, email: str):
    query = """
    INSERT INTO users (username, password_hash, email)
    VALUES (:username, :password_hash, :email)
    RETURNING user_id, username, password_hash, email, created_at
    """
    values = {"username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

# Function to select a user by user_id from the users table
async def get_user(username: str):
    query = "SELECT * FROM users WHERE username = :username"
    return await database.fetch_one(query=query, values={"username": username})

# Function to select a user by email from the users table
async def get_user_by_email(email: str):
    query = "SELECT * FROM users WHERE email = :email"
    return await database.fetch_one(query=query, values={"email": email})

# Function to update a user in the users table
async def update_user(user_id: int, username: str, password_hash: str, email: str):
    query = """
    UPDATE users
    SET username = :username, password_hash = :password_hash, email = :email
    WHERE user_id = :user_id
    RETURNING user_id, username, password_hash, email, created_at
    """
    values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

# Function to delete a user from the users table
async def delete_user(user_id: int):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# ========================== SONGS ==========================

# Function to insert a new song into the songs table
async def insert_song(user_id: int, songname: str, songtype: str, language: str, keyword: str, added_at: str):
    query = """
    INSERT INTO songs (user_id, songname, songtype, language, keyword, added_at)
    VALUES (:user_id, :songname, :songtype, :language, :keyword, :added_at)
    RETURNING id, user_id, songname, songtype, language, keyword, added_at
    """
    values = {
        "user_id": user_id,
        "songname": songname,
        "songtype": songtype,
        "language": language,
        "keyword": keyword,
        "added_at": added_at
    }
    return await database.fetch_one(query=query, values=values)

# Function to get a song by its ID
async def get_song(song_id: int):
    query = "SELECT * FROM songs WHERE id = :id"
    return await database.fetch_one(query=query, values={"id": song_id})

# Function to get all songs for a specific user
async def get_songs_by_user(user_id: int):
    query = "SELECT * FROM songs WHERE user_id = :user_id"
    return await database.fetch_all(query=query, values={"user_id": user_id})

# Function to update a song in the songs table
async def update_song(song_id: int, user_id: int, songname: str, songtype: str, language: str, keyword: str):
    query = """
    UPDATE songs
    SET songname = :songname, songtype = :songtype, language = :language, keyword = :keyword
    WHERE id = :song_id AND user_id = :user_id
    RETURNING id, user_id, songname, songtype, language, keyword, added_at
    """
    values = {
        "song_id": song_id,
        "user_id": user_id,
        "songname": songname,
        "songtype": songtype,
        "language": language,
        "keyword": keyword
    }
    return await database.fetch_one(query=query, values=values)

# Function to delete a song by its name and user_id
async def delete_song_by_name(songname: str, user_id: int):
    query = "DELETE FROM songs WHERE songname = :songname AND user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"songname": songname, "user_id": user_id})

# ========================== USER LOGS ==========================

async def log_user_action(user_id: int, action_type: str, details: str):
    query = """
    INSERT INTO user_logs (user_id, action_type, timestamp, details)
    VALUES (:user_id, :action_type, NOW(), :details)
    """
    values = {
        "user_id": user_id,
        "action_type": action_type,
        "details": details
    }
    await database.execute(query=query, values=values)

# ========================== BUG LOGS ==========================

# Function to insert a bug report into the bugs table
async def log_bug(user_id: Optional[int], bug_type: str, details: str):
    query = """
    INSERT INTO bug (user_id, bug_type, timestamp, details)
    VALUES (:user_id, :bug_type, NOW(), :details)
    """
    values = {
        "user_id": user_id,  # Can be None
        "bug_type": bug_type,
        "details": details
    }
    await database.execute(query=query, values=values)
