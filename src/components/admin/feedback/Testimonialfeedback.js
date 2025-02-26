import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Card, CardContent, Button, Collapse, 
  IconButton, List, ListItem, ListItemText, Box 
} from "@mui/material";
import { ExpandMore, ExpandLess, Delete, Check, Close } from "@mui/icons-material";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const TestimonialsFeedback = () => {
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // ✅ Fetch Testimonials from Firestore
  useEffect(() => {
    const fetchTestimonials = async () => {
      const pendingSnap = await getDocs(collection(db, "pendingTestimonials"));
      const approvedSnap = await getDocs(collection(db, "approvedTestimonials"));

      setPendingTestimonials(pendingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setApprovedTestimonials(approvedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchTestimonials();
  }, []);

  // ✅ Approve Testimonial
  const handleApprove = async (testimonial) => {
    await addDoc(collection(db, "approvedTestimonials"), {
      customerName: testimonial.customerName,
      feedback: testimonial.feedback,
    });
    await deleteDoc(doc(db, "pendingTestimonials", testimonial.id));
    
    setPendingTestimonials(pendingTestimonials.filter((item) => item.id !== testimonial.id));
    setApprovedTestimonials([...approvedTestimonials, testimonial]);

    alert("✅ Testimonial approved!");
  };

  // ✅ Reject Testimonial
  const handleReject = async (id) => {
    await deleteDoc(doc(db, "pendingTestimonials", id));
    setPendingTestimonials(pendingTestimonials.filter((item) => item.id !== id));
    alert("❌ Testimonial rejected!");
  };

  // ✅ Delete Approved Testimonial
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "approvedTestimonials", id));
    setApprovedTestimonials(approvedTestimonials.filter((item) => item.id !== id));
    alert("🗑️ Testimonial deleted!");
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "30px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#333" }}>
        ✅ Manage Testimonials
      </Typography>

      {/* ✅ Pending Testimonials */}
      <Box mt={4}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>Pending Testimonials</Typography>
        {pendingTestimonials.length === 0 ? (
          <Typography variant="body2" sx={{ color: "gray" }}>No pending testimonials.</Typography>
        ) : (
          pendingTestimonials.map((item) => (
            <Card key={item.id} sx={{ maxWidth: 500, margin: "auto", mb: 2, padding: 2, borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography variant="h6">{item.customerName}</Typography>
                <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>{item.feedback}</Typography>
                <Button variant="contained" color="success" startIcon={<Check />} onClick={() => handleApprove(item)} sx={{ mr: 1 }}>
                  Approve
                </Button>
                <Button variant="contained" color="error" startIcon={<Close />} onClick={() => handleReject(item.id)}>
                  Reject
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* ✅ Approved Testimonials (Collapsible) */}
      <Box mt={4}>
        <Button 
          onClick={() => setExpanded(!expanded)} 
          variant="outlined" 
          sx={{
            width: "80%",
            maxWidth: "500px",
            fontWeight: "bold",
            bgcolor: "#f8f8f8",
            "&:hover": { bgcolor: "#f0f0f0" }
          }}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />} View Approved Testimonials
        </Button>

        <Collapse in={expanded} sx={{ width: "80%", maxWidth: "500px", mt: 2 }}>
          <List sx={{ bgcolor: "white", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
            {approvedTestimonials.length === 0 ? (
              <Typography variant="body2" sx={{ textAlign: "center", color: "gray", p: 2 }}>
                No approved testimonials.
              </Typography>
            ) : (
              approvedTestimonials.map((item) => (
                <ListItem key={item.id} sx={{ borderBottom: "1px solid #ddd" }}>
                  <ListItemText 
                    primary={item.customerName} 
                    secondary={item.feedback} 
                    sx={{ wordWrap: "break-word" }} 
                  />
                  <IconButton onClick={() => handleDelete(item.id)} color="error">
                    <Delete />
                  </IconButton>
                </ListItem>
              ))
            )}
          </List>
        </Collapse>
      </Box>
    </Container>
  );
};

export default TestimonialsFeedback;
