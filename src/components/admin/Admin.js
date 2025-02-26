import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Typography, Box, TextField, Card, CardContent } from "@mui/material";

const ADMIN_PASSWORD = "ayush123"; // 🔑 Password Set to "ayush123"

const Admin = () => {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAdminAuthenticated") === "true"
  );

  const handleLogin = () => {
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("isAdminAuthenticated", "true"); // ✅ Store session
    } else {
      alert("❌ Incorrect Password! Try again.");
    }
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: "bold" }}>
        💄 Beauty Point Makeup Studio Admin Panel
      </Typography>

      {isAuthenticated ? (
        <>
          {/* ✅ Admin Panel Buttons inside Separate Cards */}
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Card style={{ width: "300px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Button fullWidth variant="contained" color="primary" component={Link} to="/admin/appointment">
                  📅 View Appointments
                </Button>
              </CardContent>
            </Card>

            <Card style={{ width: "300px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Button fullWidth variant="contained" color="secondary" component={Link} to="/admin/billing">
                  💵 Create Bill
                </Button>
              </CardContent>
            </Card>

            <Card style={{ width: "300px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Button fullWidth variant="contained" color="success" component={Link} to="/admin/feedback">
                  📝 Feedback Section
                </Button>
              </CardContent>
            </Card>
          </Box>
        </>
      ) : (
        <>
          {/* ✅ Login Section inside a Card */}
          <Card style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", boxShadow: "0px 4px 8px rgba(0,0,0,0.2)" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>🔑 Enter Admin Password</Typography>
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                style={{ margin: "10px 0" }}
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                style={{ marginTop: "10px" }}
              >
                Login
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Admin;
