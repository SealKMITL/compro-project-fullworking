import {
    Box,
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
    Button,
  } from "@mui/material";
  import React, { useState, useEffect } from "react";
  
  // Dark theme with black and orange
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#121212", // Black background
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
  
  export default function SongPage() {
    const [songList, setSongList] = useState([]); // Initialize as an empty array for songs
    const [errorMessage, setErrorMessage] = useState("");
  
    useEffect(() => {
        const token = localStorage.getItem("token");
      
        // Debug: Log token to verify
        console.log("Token:", token);
      
        if (!token) {
          // Redirect to login if token is missing
          setErrorMessage("User not authenticated. Redirecting to login...");
          window.location.href = "/login";
          return;
        }
      
        // Fetch songs after ensuring token exists
        fetchSongs(token);
      }, []);
      
  
      const fetchSongs = async (token) => {
        const user_id = localStorage.getItem("user_id");
        
        // Debug: Check if user_id is correctly retrieved
        console.log("user_id:", user_id);  // This should print the actual user_id
      
        if (!user_id) {
          setErrorMessage("User ID is missing. Redirecting to login...");
          window.location.href = "/login";
          return;
        }
      
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
          setSongList(data);  // Update the song list state with fetched songs
        } catch (error) {
          console.error("Error fetching songs:", error);
        }
      };
      
      
      
  
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppBar position="static" sx={{ backgroundColor: "#1e1e1e" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              MusicHUB - Song List
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
          <Typography variant="h4" sx={{ color: "text.secondary", marginBottom: 2 }}>
            Your Songs
          </Typography>
  
          {/* Error Message */}
          {errorMessage && (
            <Box sx={{ color: "red", marginBottom: 2 }}>
              {errorMessage}
            </Box>
          )}
  
          {/* Scrollable Table */}
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 400, // Limit the table height to make it scrollable
              backgroundColor: "background.paper",
              width: "100%",
              maxWidth: "900px",
              overflow: "auto", // Make the table scrollable
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
  