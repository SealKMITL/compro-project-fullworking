import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CssBaseline,
} from "@mui/material";
import Link from "next/link"; // Use Next.js's Link for navigation

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation check to ensure all fields are filled
    if (!loginEmail || !loginPassword) {
      setSnackbarMessage("All fields are required.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setLoading(false);
      return; // Exit the function if validation fails
    }

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token); // Store the token
      localStorage.setItem("user_id", data.user_id); // Store the id


      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Redirect to main page after successful login
      window.location.href = "/mainpage"; 
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Grid
        container
        spacing={2}
        style={{
          height: "100vh",
          width: "100vw",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
          margin: 0,
          padding: 0,
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "#ff8c00",
            textAlign: "center",
            marginBottom: 2,
          }}
        >
          MusicHUB
        </Typography>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={6}
            style={{
              padding: "30px",
              backgroundColor: "#1e1e1e",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h5" gutterBottom style={{ color: "#ff8c00" }}>
              Login
            </Typography>
            <form onSubmit={handleLoginSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                InputLabelProps={{ style: { color: "#ff8c00" } }}
                InputProps={{
                  style: { color: "#ffffff", backgroundColor: "#333" },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                InputLabelProps={{ style: { color: "#ff8c00" } }}
                InputProps={{
                  style: { color: "#ffffff", backgroundColor: "#333" },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                style={{
                  marginTop: "16px",
                  backgroundColor: "#ff8c00",
                  color: "#ffffff",
                }}
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <Typography
              variant="body2"
              style={{ color: "#ffffff", marginTop: "16px", textAlign: "center" }}
            >
              Don’t have an account? 
              <Link href="/register" passHref>
                <Button style={{ color: "#ff8c00", textDecoration: "none", marginLeft: "5px" }}>
                  Register here
                </Button>
              </Link>
            </Typography>
          </Paper>
        </Grid>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </>
  );
}
