import {
  Box,
  Button,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import React, { useEffect } from "react";

// Common theme (same as used in Login and Register pages)
const blackOrangeTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff8c00', // Orange for primary buttons
    },
    background: {
      default: "#121212", // Black background
      paper: "#1e1e1e",   // Dark grey for boxes
    },
    text: {
      primary: "#ffffff",  
      secondary: "#ff8c00", // Orange text for emphasis
    },
  },
});

export default function MainPage() {
  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if not authenticated
      window.location.href = "/login"; 
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem("token");
    
    // Redirect to the login page
    window.location.href = "/login";
  };

  return (
    <ThemeProvider theme={blackOrangeTheme}>
      <CssBaseline /> {/* Global dark mode styles */}

      {/* Taskbar */}
      <AppBar position="static" sx={{ backgroundColor: '#1e1e1e' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#ff8c00" }}>
            MusicHUB
          </Typography>

          {/* Logout Button */}
          <Button color="inherit" onClick={handleLogout} sx={{ color: "#ff8c00" }}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          backgroundColor: "background.default", // Black background
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Image above the center box */}
        <img
          src="https://i.postimg.cc/Kj6cpmbC/png-transparent-musical-note-logo-songwriter-musician-musical-note-musical-composition-logo-musician.png"
          alt="Fire Music Note"
          style={{
            width: '100%',
            maxWidth: '400px',
            marginBottom: '20px' // Adds space between image and the box below
          }}
        />

        {/* Center Box */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4, // Space between buttons
            backgroundColor: 'background.paper', // Dark grey box
            padding: '20px',
            borderRadius: 2,
            boxShadow: 3,
            justifyContent: 'center',
            width: '100%',
            maxWidth: '800px',
          }}
        >
          {/* Buttons */}
          <Button 
            variant="contained" 
            href="/addsong"
            sx={{ 
              padding: 2, 
              width: '100%', 
              fontSize: 18, 
              backgroundColor: 'primary.main', // Orange background
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#ff9c33', // Slightly lighter on hover
              },
            }}
          >
            Add Song
          </Button>

          <Button 
            variant="contained" 
            href="/removesong"
            sx={{ 
              padding: 2, 
              width: '100%', 
              fontSize: 18, 
              backgroundColor: 'primary.main', // Orange background
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#ff9c33', // Slightly lighter on hover
              },
            }}
          >
            Remove Song
          </Button>

          <Button 
            variant="contained" 
            href="/findsong"
            sx={{ 
              padding: 2, 
              width: '100%', 
              fontSize: 18, 
              backgroundColor: 'primary.main', // Orange background
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#ff9c33', // Slightly lighter on hover
              },
            }}
          >
            Find Song
          </Button>

          {/* New Song Button */}
          <Button 
            variant="contained" 
            href="/song"
            sx={{ 
              padding: 2, 
              width: '100%', 
              fontSize: 18, 
              backgroundColor: 'primary.main', // Orange background
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#ff9c33', // Slightly lighter on hover
              },
            }}
          >
            Song
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
