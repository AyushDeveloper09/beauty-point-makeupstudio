import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Select, MenuItem, Button, Collapse, 
  Card, CardMedia, CardContent, IconButton, Box, Dialog 
} from "@mui/material";
import { ExpandMore, ExpandLess, Delete, Close } from "@mui/icons-material";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

const MAX_FILE_SIZE_MB = 30; // 🔥 File size limit

const MediaFeedback = () => {
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState({ Bridal: [], Side: [], Others: [] });
  const [expanded, setExpanded] = useState({});
  const [selectedMedia, setSelectedMedia] = useState(null);

  // ✅ Handle File Upload with Size Restriction
  const handleUpload = async () => {
    if (!file || !category) return alert("❌ Please select a category and a file.");

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return alert(`❌ File size exceeds ${MAX_FILE_SIZE_MB}MB! Please upload a smaller file.`);
    }

    const fileRef = ref(storage, `media/${category}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    setMedia((prev) => ({
      ...prev,
      [category]: [...prev[category], { url, name: file.name }]
    }));
    setFile(null);

    alert("✅ Media uploaded successfully!");
  };

  // ✅ Fetch Media from Firebase
  useEffect(() => {
    const fetchMedia = async () => {
      ["Bridal", "Side", "Others"].forEach(async (cat) => {
        const listRef = ref(storage, `media/${cat}`);
        const result = await listAll(listRef);
        const urls = await Promise.all(
          result.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return { url, name: item.name };
          })
        );
        setMedia((prev) => ({ ...prev, [cat]: urls }));
      });
    };
    fetchMedia();
  }, []);

  // ✅ Handle File Deletion
  const handleDelete = async (cat, fileName) => {
    const fileRef = ref(storage, `media/${cat}/${fileName}`);
    await deleteObject(fileRef);
    setMedia((prev) => ({
      ...prev,
      [cat]: prev[cat].filter((file) => file.name !== fileName)
    }));
  };

  // ✅ Toggle Collapse
  const toggleExpand = (cat) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "30px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#333" }}>
        📸 Media Management
      </Typography>

      {/* ✅ Category Selection & Upload */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
        <Select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          displayEmpty 
          sx={{ minWidth: 200, bgcolor: "white", borderRadius: "5px" }}
        >
          <MenuItem value="" disabled>Select Category</MenuItem>
          <MenuItem value="Bridal">Bridal Makeup</MenuItem>
          <MenuItem value="Side">Side Makeup</MenuItem>
          <MenuItem value="Others">Others</MenuItem>
        </Select>

        <input 
          type="file" 
          id="file-upload" 
          style={{ display: "none" }} 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <label htmlFor="file-upload">
          <Button variant="contained" color="primary" component="span">
            Choose File
          </Button>
        </label>

        <Button 
          variant="contained" 
          color="success" 
          disabled={!file || !category} 
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Box>

      {/* ✅ Media Categories (Collapsible) */}
      {["Bridal", "Side", "Others"].map((cat) => (
        <Box key={cat} mt={3} width="100%" display="flex" flexDirection="column" alignItems="center">
          <Button 
            onClick={() => toggleExpand(cat)} 
            variant="outlined" 
            sx={{
              width: "80%",
              maxWidth: "600px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              bgcolor: "#f8f8f8",
              "&:hover": { bgcolor: "#f0f0f0" }
            }}
          >
            {cat} Makeup {expanded[cat] ? <ExpandLess /> : <ExpandMore />}
          </Button>

          <Collapse in={expanded[cat]} sx={{ width: "80%", maxWidth: "600px", mt: 1 }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              {media[cat].length === 0 ? (
                <Typography variant="body2" sx={{ color: "gray", mt: 2 }}>
                  No media uploaded in this category.
                </Typography>
              ) : (
                media[cat].map((file, index) => (
                  <Card 
                    key={index} 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      width: "100%", 
                      borderRadius: "10px", 
                      boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", 
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedMedia(file.url)}
                  >
                    {file.url.includes(".mp4") ? (
                      <video src={file.url} width="120" height="80" controls />
                    ) : (
                      <CardMedia 
                        component="img" 
                        image={file.url} 
                        alt="Media" 
                        sx={{ width: "120px", height: "80px", borderRadius: "5px" }}
                      />
                    )}

                    <CardContent sx={{ flex: 1, textAlign: "right", paddingRight: "10px" }}>
                      <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(cat, file.name); }} color="error">
                        <Delete />
                      </IconButton>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Collapse>
        </Box>
      ))}

      {/* ✅ Full-Screen Media Viewer */}
      <Dialog open={Boolean(selectedMedia)} onClose={() => setSelectedMedia(null)} maxWidth="md">
        <IconButton 
          onClick={() => setSelectedMedia(null)} 
          sx={{ position: "absolute", right: 10, top: 10, color: "white" }}
        >
          <Close />
        </IconButton>
        {selectedMedia?.includes(".mp4") ? (
          <video src={selectedMedia} width="100%" controls autoPlay />
        ) : (
          <img src={selectedMedia} alt="Preview" style={{ width: "100%" }} />
        )}
      </Dialog>
    </Container>
  );
};

export default MediaFeedback;
