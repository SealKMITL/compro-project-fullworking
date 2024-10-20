from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from database import (
    insert_song,
    get_song,
    get_songs_by_user,
    update_song,
    delete_song_by_name,
    log_user_action,
    log_bug
)
from routes.users import get_current_user  # Import the function here

router = APIRouter()

# Pydantic models
class SongCreate(BaseModel):
    songname: str
    songtype: str
    language: str
    keyword: str

class SongUpdate(BaseModel):
    songname: Optional[str]
    songtype: Optional[str]
    language: Optional[str]
    keyword: Optional[str]

class SongResponse(BaseModel):
    id: int
    user_id: int
    songname: str
    songtype: str
    language: str
    keyword: str
    added_at: str

# Endpoint to add a new song (POST)
@router.post("/songs/create", response_model=SongResponse)
async def create_song(song: SongCreate, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["user_id"]
        added_at = datetime.utcnow()

        new_song = await insert_song(user_id, song.songname, song.songtype, song.language, song.keyword, added_at)

        if new_song is None:
            raise HTTPException(status_code=400, detail="Error creating song")

        # Log the user action
        await log_user_action(user_id, "create_song", f"Created song: {song.songname}")

        return {
            "id": new_song["id"],
            "user_id": user_id,
            "songname": song.songname,
            "songtype": song.songtype,
            "language": song.language,
            "keyword": song.keyword,
            "added_at": added_at.isoformat()
        }

    except Exception as e:
        # Log bug if an error occurs during song creation
        await log_bug(user_id=current_user["user_id"], bug_type="song_creation", details=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

# Endpoint to delete a song (DELETE)
@router.delete("/songs/remove")
async def remove_song(songname: str, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["user_id"]

        deleted_song = await delete_song_by_name(songname, user_id)

        if deleted_song is None:
            raise HTTPException(status_code=404, detail="Song not found")

        # Log the user action
        await log_user_action(user_id, "remove_song", f"Removed song: {songname}")

        return {"detail": f"Song '{songname}' removed successfully"}

    except Exception as e:
        # Log bug if an error occurs during song deletion
        await log_bug(user_id=current_user["user_id"], bug_type="song_deletion", details=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

# Endpoint to get songs for a user by user_id
@router.get("/songs", response_model=List[SongResponse])
async def read_songs(user_id: int):
    print(f"Fetching songs for user_id: {user_id}")  # Debugging log
    songs = await get_songs_by_user(user_id)  # Fetch songs from the database
    
    if not songs:
        raise HTTPException(status_code=404, detail="No songs found for this user")
    
    # Format added_at field as ISO string
    formatted_songs = []
    for song in songs:
        song_dict = dict(song)
        song_dict['added_at'] = song_dict['added_at'].isoformat()  # Convert to ISO string
        formatted_songs.append(song_dict)

    return formatted_songs
