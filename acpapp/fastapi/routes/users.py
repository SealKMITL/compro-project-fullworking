from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional
from jose import JWTError, jwt
from database import (
    insert_user,
    get_user,
    get_user_by_email,
    log_user_action,
    log_bug,
    check_db_connection  # Import the database connection checker
)
import bcrypt

# Token and Authentication setup
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Function to get the current user based on the token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return {"user_id": user_id}

# Define the router
router = APIRouter()

# Pydantic models
class UserCreate(BaseModel):
    username: str
    password: str
    email: str

class User(BaseModel):
    user_id: int
    username: str
    email: str
    created_at: Optional[str]

class UserLogin(BaseModel):
    email: str
    password: str

# Token generation function
def create_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Endpoint to create a new user
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
    try:
        print("Starting user creation")  # Debugging

        # Check database connection
        await check_db_connection()  # Ensure database is connected

        # Hash the password
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print(f"Hashed password: {hashed_password}")  # Debugging

        # Check if the username or email already exists
        existing_user = await get_user(user.username)
        if existing_user:
            print("Username already exists")  # Debugging
            raise HTTPException(status_code=400, detail="Username already exists")

        existing_email = await get_user_by_email(user.email)
        if existing_email:
            print("Email already exists")  # Debugging
            raise HTTPException(status_code=400, detail="Email already exists")

        # Insert the user into the database
        result = await insert_user(user.username, hashed_password, user.email)
        print(f"User created: {result}")  # Debugging
        if result is None:
            raise HTTPException(status_code=400, detail="Error creating user")

        # Log user registration
        await log_user_action(result["user_id"], "register", f"User registered: {user.username}")
        print("User registration logged")  # Debugging

        return result

    except HTTPException as http_exc:
        # Log the bug if the email or username exists
        if http_exc.detail in ["Username already exists", "Email already exists"]:
            await log_bug(user_id=None, bug_type="user_creation", details=http_exc.detail)
        raise http_exc  # Re-raise the HTTP exception with the existing message
    except Exception as e:
        # Log bug if an error occurs during user creation
        print(f"Error occurred during user creation: {str(e)}")  # Debugging
        await log_bug(user_id=None, bug_type="user_creation", details=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

# Endpoint for user login
@router.post("/users/login")
async def login_user(user: UserLogin):
    try:
        print("Starting user login")  # Debugging

        # Fetch user from the database
        db_user = await get_user_by_email(user.email)
        print(f"Fetched user: {db_user}")  # Debugging

        if db_user is None or not bcrypt.checkpw(user.password.encode('utf-8'), db_user["password_hash"].encode('utf-8')):
            print("Invalid credentials")  # Debugging
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Generate the token
        access_token = create_token({"user_id": db_user["user_id"]})
        print(f"Generated token: {access_token}")  # Debugging

        # Log user login
        await log_user_action(db_user["user_id"], "login", f"User logged in: {db_user['username']}")
        print("User login logged")  # Debugging

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": db_user["user_id"],
            "username": db_user["username"],
            "email": db_user["email"],
            "created_at": db_user["created_at"],
        }

    except Exception as e:
        # Log bug if an error occurs during user login
        print(f"Error occurred during user login: {str(e)}")  # Debugging
        await log_bug(user_id=None, bug_type="user_login", details=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
