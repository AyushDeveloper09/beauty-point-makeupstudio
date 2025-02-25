import React from "react";
import { Link } from "react-router-dom";
import { Container, Button, Typography, Box } from "@mui/material";

const Admin = () => {
  return (
    <Container style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        🛠 Admin Panel
      </Typography>
      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/admin/appointment" // ✅ Match route in App.js
        >
          View Appointment
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          component={Link} 
          to="/admin/billing"
        >
          Create Bill
        </Button>
      </Box>
    </Container>
  );
};

export default Admin;
