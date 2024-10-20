import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import FunctionsIcon from "@mui/icons-material/Functions";
import PersonIcon from "@mui/icons-material/Person";
import useBearStore from "@/store/useBearStore";

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);

  // Logout function
  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem("token");
    
    // Redirect to the login page
    router.push("/login");
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#ff5e15" }}>
        <Toolbar>
          <Link href={"/"}>
            <FunctionsIcon sx={{ color: "#ffffff" }} fontSize="large" />
          </Link>
          <Typography
            variant="body1"
            sx={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#ffffff",
              padding: "0 10px",
              fontFamily: "Prompt",
            }}>
            {appName}
          </Typography>
          <NavigationLink href="/page1" label="Page1" />
          <div style={{ flexGrow: 1 }} />
          {/* Logout Button */}
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ color: "#ffffff" }} // Style the logout button
          >
            Logout
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              router.push("/page2");
            }}
            sx={{ color: "#ffffff" }} // Style the button
          >
            <PersonIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
};

const NavigationLink = ({ href, label }) => {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#fff",
          padding: "0 10px", // Add padding on left and right
        }}>
        {label}
      </Typography>{" "}
    </Link>
  );
};

export default NavigationLayout;
