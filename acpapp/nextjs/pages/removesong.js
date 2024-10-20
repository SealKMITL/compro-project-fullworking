import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
} from "@mui/material";
import React, { useState, useEffect } from "react";

// Dark theme with black and orange
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000", // Black background
      paper: "#1e1e1e", // Dark grey box color for containers
    },
    primary: {
      main: "#ff8c00", // Orange for primary accents (buttons, labels)
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "#ff8c00", // Orange text for emphasis
    },
  },
});

export default function RemoveSongPage() {
  const [songNameToRemove, setSongNameToRemove] = useState("");
  const [songList, setSongList] = useState([]); // Initialize as an empty array for songs
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Retrieve token and user_id from localStorage
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    // Debug: Log token and user_id
    console.log("Token:", token); // Check if token exists
    console.log("User ID:", user_id); // Check if user_id exists

    if (!token || !user_id) {
      // Redirect to login if token or user_id is missing
      setErrorMessage("User not authenticated. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    // Fetch songs after ensuring token and user_id exist
    fetchSongs(token, user_id);
  }, []);

  // Function to fetch songs for the user
  const fetchSongs = async (token, user_id) => {
    try {
      const response = await fetch(`/api/songs?user_id=${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch songs.");
      }

      const data = await response.json();
      setSongList(data); // Update the song list state with fetched songs
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const handleRemoveSong = async () => {
    // Retrieve token and user_id from localStorage
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!token || !user_id) {
      setErrorMessage("User not authenticated. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    // Validate input
    if (!songNameToRemove) {
      setErrorMessage("Please enter a song name to remove.");
      return;
    }

    try {
      const response = await fetch(`/api/songs/remove?songname=${songNameToRemove}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.detail || "Failed to remove song");
      }

      // Remove the song from the list after successful removal
      setSongList(songList.filter((song) => song.songname !== songNameToRemove));

      // Clear the input field and error message
      setSongNameToRemove("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error removing song:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: "#1e1e1e" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MusicApp
          </Typography>
          <Button color="inherit" href="/mainpage" sx={{ color: "#ff8c00" }}>
            Back to Main Page
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "background.default",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: "background.paper",
            padding: 4,
            borderRadius: 2,
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: "text.secondary" }}>
            Remove Song
          </Typography>

          {errorMessage && (
            <Box sx={{ color: "red", marginBottom: 2 }}>
              {errorMessage}
            </Box>
          )}

          {/* Input for Song Name to Remove */}
          <TextField
            label="Song Name"
            variant="outlined"
            value={songNameToRemove}
            onChange={(e) => setSongNameToRemove(e.target.value)}
            fullWidth
            InputProps={{ style: { color: "#fff", backgroundColor: "#333" } }} // Matches input background color
          />

          <Button
            variant="contained"
            onClick={handleRemoveSong}
            fullWidth
            sx={{ backgroundColor: "primary.main", color: "#ffffff" }}
          >
            Remove Song
          </Button>
        </Box>

        {/* Scrollable Song List Table */}
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 4,
            backgroundColor: "background.paper",
            width: "100%",
            maxWidth: "900px",
            maxHeight: 400, // Scrollable table
            overflow: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#ff8c00" }}>Song Name</TableCell>
                <TableCell sx={{ color: "#ff8c00" }}>Song Type (Genre)</TableCell>
                <TableCell sx={{ color: "#ff8c00" }}>Language</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {songList && songList.length > 0 ? (
                songList.map((song, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "#ffffff" }}>{song.songname}</TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>{song.songtype}</TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>{song.language}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ color: "#ff8c00", textAlign: 'center' }}>
                    No songs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
}
