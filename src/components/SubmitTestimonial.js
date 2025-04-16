import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

const SubmitTestimonial = () => {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!name || !feedback) {
      alert("Please fill all fields.");
      return;
    }

    try {
      // Submit the testimonial to 'textTestimonials' collection instead of 'pendingTestimonials'
      await addDoc(collection(db, "textTestimonials"), {
        customerName: name,
        feedback,
        approved: false,  // Assuming that all testimonials are pending approval initially
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box sx={{ p: 4, boxShadow: 3, borderRadius: 4, backgroundColor: "#fff" }}>
        {submitted ? (
          <Typography variant="h5" align="center" color="green">
            🎉 Thank you! Your testimonial is submitted for approval.
          </Typography>
        ) : (
          <>
            <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
              Share Your Experience
            </Typography>
            <TextField
              fullWidth
              label="Your Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Your Feedback"
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Box textAlign="center" mt={3}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit Testimonial
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default SubmitTestimonial;
