import React from "react";
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate();

  return (
    <Container style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>📝 Feedback Management</Typography>

      <Grid container spacing={3} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Media Upload Section */}
        <Grid item xs={12}>
          <Card style={{ maxWidth: "400px", margin: "auto" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>📸 Media Upload</Typography>
              <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/admin/feedback/media")}>
                Go to Media Section
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Text Feedback Section */}
        <Grid item xs={12}>
          <Card style={{ maxWidth: "400px", margin: "auto" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>💬 Text Feedback</Typography>
              <Button variant="contained" color="secondary" fullWidth onClick={() => navigate("/admin/feedback/text")}>
                Go to Text Feedback
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Testimonials Section */}
        <Grid item xs={12}>
          <Card style={{ maxWidth: "400px", margin: "auto" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>✅ Testimonials</Typography>
              <Button variant="contained" color="success" fullWidth onClick={() => navigate("/admin/feedback/testimonials")}>
                Go to Testimonials
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Feedback;
