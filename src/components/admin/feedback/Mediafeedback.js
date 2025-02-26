import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Select, MenuItem, Button, Collapse, 
  Card, CardMedia, CardContent, IconButton, Box, Dialog 
} from "@mui/material";
import { ExpandMore, ExpandLess, Delete, Close } from "@mui/icons-material";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB limit

const MediaFeedback = () => {
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState({ Bridal: [], Side: [], Others: [] });
  const [expanded, setExpanded] = useState({});
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Handle file selection with file size and type check
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert("❌ File size exceeds 30MB. Please upload a smaller file.");
        return;
      }
      console.log("Selected file type:", selectedFile.type);
      setFile(selectedFile);
    }
  };

  // Upload file with metadata and store full file path for deletion
  const handleUpload = async () => {
    if (!file || !category) {
      alert("❌ Please select a category and a file.");
      return;
    }

    try {
      console.log("Uploading file:", file.name, "to category:", category);
      const filePath = `media/${category}/${Date.now()}_${file.name}`;
      const fileRef = ref(storage, filePath);
      
      // Set metadata with the file's MIME type
      const metadata = {
        contentType: file.type,
      };

      await uploadBytes(fileRef, file, metadata);
      console.log("Upload successful, fetching file URL...");
      const url = await getDownloadURL(fileRef);
      console.log("File URL:", url);

      // Update media state using full filePath
      setMedia((prev) => ({
        ...prev,
        [category]: [...prev[category], { url, filePath }],
      }));

      setFile(null);
      alert("✅ Media uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Upload failed. Check console for errors.");
    }
  };

  // Fetch media for each category from Firebase Storage
  const fetchMedia = async () => {
    try {
      ["Bridal", "Side", "Others"].forEach(async (cat) => {
        const listRef = ref(storage, `media/${cat}`);
        const result = await listAll(listRef);
        const files = await Promise.all(
          result.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return { url, filePath: item.fullPath };
          })
        );
        setMedia((prev) => ({ ...prev, [cat]: files }));
      });
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Delete file using its full file path
  const handleDelete = async (cat, filePath) => {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      setMedia((prev) => ({
        ...prev,
        [cat]: prev[cat].filter((file) => file.filePath !== filePath)
      }));
      alert("🗑️ Media deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("❌ Deletion failed. Check console.");
    }
  };

  // Toggle collapse for media categories
  const toggleExpand = (cat) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "30px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#333" }}>
        📸 Media Management
      </Typography>

      {/* Category Selection & Upload */}
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
          accept="image/*"
          onChange={handleFileChange} 
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

      {/* Media Categories (Collapsible) */}
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
                  >
                    <CardMedia 
                      component="img" 
                      image={file.url} 
                      alt="Media" 
                      sx={{ width: "120px", height: "80px", borderRadius: "5px", cursor: "pointer" }} 
                      onClick={() => setSelectedMedia(file.url)}
                    />
                    <CardContent sx={{ flex: 1, textAlign: "right", paddingRight: "10px" }}>
                      <IconButton 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDelete(cat, file.filePath); 
                        }} 
                        color="error"
                      >
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

      {/* Full-Screen Media Preview */}
      <Dialog open={!!selectedMedia} onClose={() => setSelectedMedia(null)}>
        <Box sx={{ padding: "20px", position: "relative" }}>
          <IconButton onClick={() => setSelectedMedia(null)} sx={{ position: "absolute", top: 10, right: 10 }}>
            <Close />
          </IconButton>
          <img 
            src={selectedMedia} 
            alt="Preview" 
            style={{ width: "100%", maxHeight: "90vh", objectFit: "contain" }} 
          />
        </Box>
      </Dialog>
    </Container>
  );
};

export default MediaFeedback;
