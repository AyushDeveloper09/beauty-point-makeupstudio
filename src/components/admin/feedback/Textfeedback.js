import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Card, CardContent, TextField, Button, Collapse, 
  IconButton, List, ListItem, ListItemText, Box 
} from "@mui/material";
import { ExpandMore, ExpandLess, Delete } from "@mui/icons-material";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const TextFeedback = () => {
  const [customerName, setCustomerName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // ✅ Fetch Feedbacks from Firestore
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const querySnapshot = await getDocs(collection(db, "textFeedback"));
      const feedbacks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedbackList(feedbacks);
    };
    fetchFeedbacks();
  }, []);

  // ✅ Handle Feedback Submission
  const handleUpload = async () => {
    if (!customerName || !feedback) return alert("❌ Please fill out all fields.");

    const docRef = await addDoc(collection(db, "textFeedback"), {
      customerName,
      feedback,
    });

    setFeedbackList([...feedbackList, { id: docRef.id, customerName, feedback }]);
    setCustomerName("");
    setFeedback("");

    alert("✅ Feedback added successfully!");
  };

  // ✅ Handle Feedback Deletion
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "textFeedback", id));
    setFeedbackList(feedbackList.filter((item) => item.id !== id));
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "30px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#333" }}>
        💬 Customer Feedback Management
      </Typography>

      {/* ✅ Feedback Form */}
      <Card sx={{ maxWidth: 500, margin: "auto", padding: 3, boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>📌 Add Feedback</Typography>
          <TextField 
            label="Customer Name" 
            variant="outlined" 
            fullWidth 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)} 
            sx={{ mb: 2 }}
          />
          <TextField 
            label="Feedback" 
            variant="outlined" 
            fullWidth 
            multiline 
            rows={3} 
            value={feedback} 
            onChange={(e) => setFeedback(e.target.value)} 
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleUpload}>
            Upload Feedback
          </Button>
        </CardContent>
      </Card>

      {/* ✅ Feedback List (Collapsible) */}
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
          {expanded ? <ExpandLess /> : <ExpandMore />} View Feedbacks
        </Button>

        <Collapse in={expanded} sx={{ width: "80%", maxWidth: "500px", mt: 2 }}>
          <List sx={{ bgcolor: "white", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
            {feedbackList.length === 0 ? (
              <Typography variant="body2" sx={{ textAlign: "center", color: "gray", p: 2 }}>
                No feedbacks available.
              </Typography>
            ) : (
              feedbackList.map((item) => (
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

export default TextFeedback;
