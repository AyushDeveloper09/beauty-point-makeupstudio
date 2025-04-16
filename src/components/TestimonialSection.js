import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(
          collection(db, "textTestimonials"), // Use the same collection
          where("approved", "==", true)       // Only fetch approved testimonials
        );
        const snapshot = await getDocs(q);
        setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#fdf5f5" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ color: "#8B0000", fontWeight: "bold" }}
      >
        ❤️ What Our Customers Say
      </Typography>

      <Grid container spacing={3} justifyContent="center" style={{ marginTop: "20px" }}>
        {testimonials.map((testimonial) => (
          <Grid item xs={12} sm={6} md={4} key={testimonial.id}>
            <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {testimonial.customerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {testimonial.feedback}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/submit-testimonial")}
          sx={{ borderRadius: "20px", padding: "10px 30px", fontWeight: "bold" }}
        >
          ✍️ Give Your Own Testimonial
        </Button>
      </div>
    </div>
  );
};

export default TestimonialSection;
