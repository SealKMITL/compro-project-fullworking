import {
  Box,
  Button,
  TextField,
  MenuItem,
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
  Select,
  InputLabel,
  FormControl,
  AppBar,
  Toolbar,
} from "@mui/material";
import React, { useState, useEffect } from "react";

// Dark theme with black and orange
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#000000", // Black background
      paper: "#1e1e1e",   // Dark grey box color for containers
    },
    primary: {
      main: '#ff8c00', // Orange for primary accents (buttons, labels)
    },
    text: {
      primary: "#ffffff",  // White text
      secondary: "#ff8c00", // Orange text for emphasis
    },
  },
});

// Define allowed genres and languages
const allowedGenres = [
  "Pop",
  "Hip Hop",
  "R&B",
  "Dance",
  "Classic Rock",
];

const allowedLanguages = [
  "Mandarin Chinese",
  "English",
  "Spanish",
  "Portuguese",
  "Russian",
  "Hindi",
  "Japanese",
  "Arabic",
  "French",
  "Thai",
];

export default function FindSongPage() {
  const [songName, setSongName] = useState("");
  const [songType, setSongType] = useState("");
  const [language, setLanguage] = useState("");
  const [songList, setSongList] = useState([]); // Store songs fetched from backend
  const [topSongs, setTopSongs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [noSongsFound, setNoSongsFound] = useState(false); // Track if no songs are found

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!token || !user_id) {
      // Redirect to login if not authenticated
      window.location.href = "/login"; 
      return;
    }

    // Fetch songs from the backend
    fetchSongs(token, user_id);
  }, []);

  // Function to fetch songs from the backend
  const fetchSongs = async (token, user_id) => {
    try {
      const response = await fetch(`/api/songs?user_id=${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Token for authentication
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch songs from the server.");
      }

      const data = await response.json();
      setSongList(data); // Update the state with the fetched songs
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const handleFindSong = () => {
    // Filtering logic based on user input
    const filteredSongs = songList.filter((song) =>
      (!songName || song.songname.toLowerCase().includes(songName.toLowerCase())) &&
      (!songType || song.songtype === songType) &&
      (!language || song.language === language)
    );

    if (filteredSongs.length === 0) {
      setNoSongsFound(true); // Set to true if no songs found
      setTopSongs([]); // Clear the topSongs state
    } else {
      setNoSongsFound(false); // Reset if songs are found
      // Select top 3 matching songs
      const randomTopSongs = filteredSongs
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setTopSongs(randomTopSongs);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1e1e1e' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MusicHUB
          </Typography>
          <Button color="inherit" href="/mainpage" sx={{ color: '#ff8c00' }}>
            Back to Main Page
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          backgroundColor: "background.default",
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Find Song Input Form */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: "background.paper",
            padding: 4,
            borderRadius: 2,
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {/* Title */}
          <Typography variant="h5" gutterBottom sx={{ color: "text.secondary" }}>
            Find Song
          </Typography>

          {/* Error Message */}
          {errorMessage && (
            <Box sx={{ color: "red", marginBottom: 2 }}>
              {errorMessage}
            </Box>
          )}

          {/* Song Name Input */}
          <FormControl variant="outlined" fullWidth>
            <InputLabel sx={{ color: 'text.secondary' }} shrink>Song Name</InputLabel>
            <TextField
              label="Song Name"
              variant="outlined"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              fullWidth
              InputProps={{ style: { color: '#ffffff', backgroundColor: '#333' } }}
            />
          </FormControl>

          {/* Dropdown for Genre (Song Type) Selection */}
          <FormControl variant="outlined" fullWidth>
            <InputLabel sx={{ color: 'text.secondary' }} shrink>Song Type (Genre)</InputLabel>
            <Select
              value={songType}
              onChange={(e) => setSongType(e.target.value)}
              sx={{ backgroundColor: '#333', color: '#fff' }}
              label="Song Type (Genre)"
            >
              {allowedGenres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Dropdown for Language Selection */}
          <FormControl variant="outlined" fullWidth>
            <InputLabel sx={{ color: 'text.secondary' }} shrink>Language</InputLabel>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{ backgroundColor: '#333', color: '#fff' }}
              label="Language"
            >
              {allowedLanguages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            onClick={handleFindSong}
            fullWidth
            sx={{ backgroundColor: 'primary.main', color: '#ffffff' }}
          >
            Find Song
          </Button>
        </Box>

        {/* If no songs are found */}
        {noSongsFound && (
          <Typography variant="h6" sx={{ color: "#ff8c00", marginTop: 4 }}>
            No songs found.
          </Typography>
        )}

        {/* Top 3 Songs Table (Only show if songs are found) */}
        {topSongs.length > 0 && (
          <TableContainer component={Paper} sx={{ marginTop: 4, backgroundColor: "background.paper", width: '100%', maxWidth: '900px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#ff8c00' }}>Song Name</TableCell>
                  <TableCell sx={{ color: '#ff8c00' }}>Song Type (Genre)</TableCell>
                  <TableCell sx={{ color: '#ff8c00' }}>Language</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topSongs.map((song, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: '#ffffff' }}>{song.songname}</TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>{song.songtype}</TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>{song.language}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </ThemeProvider>
  );
}
