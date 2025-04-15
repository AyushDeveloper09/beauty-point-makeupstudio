import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { TextField, Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// Service Categories with Services
const serviceCategories = [
  {
    category: "Bleach",
    services: [
      { name: "Face & Neck Bleach", price: 249 },
      { name: "Full Arms Bleach", price: 399 },
    ],
  },
  {
    category: "D-Tan",
    services: [
      { name: "Face & Neck D-Tan", price: 450 },
      { name: "Full Arms D-Tan", price: 950 },
    ],
  },
];

const Billing = () => {
  const [bill, setBill] = useState({
    customerId: uuidv4(),
    customerName: "",
    customerPhone: "",
    services: [],
    discount: 0,
    total: 0,
  });

  const [previousBills, setPreviousBills] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  // Fetch Previous Bills
  const fetchBills = async () => {
    const querySnapshot = await getDocs(query(collection(db, "bills"), orderBy("timestamp", "desc")));
    setPreviousBills(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Keep Only Last 120 Bills
  const cleanupOldBills = async () => {
    const querySnapshot = await getDocs(query(collection(db, "bills"), orderBy("timestamp", "desc")));
    const bills = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (bills.length > 120) {
      const excessBills = bills.slice(120);
      excessBills.forEach(async (bill) => {
        await deleteDoc(doc(db, "bills", bill.id));
      });
    }
  };

  // Toggle Category Expansion
  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Add Service
  const handleServiceAdd = (service) => {
    setBill((prev) => {
      const existingService = prev.services.find((s) => s.name === service.name);

      let updatedServices;
      if (existingService) {
        updatedServices = prev.services.map((s) =>
          s.name === service.name ? { ...s, quantity: s.quantity + 1 } : s
        );
      } else {
        updatedServices = [...prev.services, { ...service, quantity: 1 }];
      }

      const updatedTotal = updatedServices.reduce((sum, s) => sum + s.price * s.quantity, 0) - prev.discount;

      return { ...prev, services: updatedServices, total: updatedTotal };
    });
  };

  // Remove Service
  const handleServiceRemove = (service) => {
    setBill((prev) => {
      const existingService = prev.services.find((s) => s.name === service.name);

      let updatedServices;
      if (existingService.quantity > 1) {
        updatedServices = prev.services.map((s) =>
          s.name === service.name ? { ...s, quantity: s.quantity - 1 } : s
        );
      } else {
        updatedServices = prev.services.filter((s) => s.name !== service.name);
      }

      const updatedTotal = updatedServices.reduce((sum, s) => sum + s.price * s.quantity, 0) - prev.discount;

      return { ...prev, services: updatedServices, total: updatedTotal };
    });
  };

  // Handle Discount Change
  const handleDiscountChange = (e) => {
    const discount = parseInt(e.target.value) || 0;
    setBill((prev) => ({
      ...prev,
      discount,
      total: prev.services.reduce((sum, s) => sum + s.price * s.quantity, 0) - discount,
    }));
  };

  // Generate Bill
  const handleGenerateBill = async () => {
    if (!bill.customerName.trim() || !bill.customerPhone.trim()) {
      alert("⚠️ Customer name and phone number are required!");
      return;
    }
    if (bill.services.length === 0) {
      alert("⚠️ Please select at least one service!");
      return;
    }

    try {
      const newBill = { ...bill, timestamp: serverTimestamp() };
      await addDoc(collection(db, "bills"), newBill);
      
      fetchBills();
      cleanupOldBills();

      setBill({
        customerId: uuidv4(),
        customerName: "",
        customerPhone: "",
        services: [],
        discount: 0,
        total: 0,
      });

      alert("✅ Bill generated successfully!");
    } catch (error) {
      console.error("Firestore Error:", error);
      alert("❌ Failed to generate bill. Please try again.");
    }
  };

  return (
    <Card style={{ maxWidth: 700, margin: "auto", padding: "20px", marginTop: "20px" }}>
      <CardContent>
        <Typography variant="h5">🧾 BeautyPoint Makeup Studio - Billing</Typography>

        <TextField label="Customer Name" fullWidth required value={bill.customerName} onChange={(e) => setBill({ ...bill, customerName: e.target.value })} margin="normal" />
        <TextField label="Phone Number" fullWidth required value={bill.customerPhone} onChange={(e) => setBill({ ...bill, customerPhone: e.target.value })} margin="normal" />

        {/* Collapsible Service Categories */}
        <Typography variant="h6">Select Services</Typography>
        {serviceCategories.map((category, index) => (
          <Accordion key={index} expanded={expandedCategory === category.category} onChange={() => handleCategoryClick(category.category)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{category.category}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {category.services.map((service, sIndex) => (
                <div key={sIndex} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                  <Typography>{service.name} - ₹{service.price}</Typography>
                  <Button variant="contained" onClick={() => handleServiceAdd(service)}>
                    Add <AddCircleIcon />
                  </Button>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Added Services Table */}
        <Typography variant="h6">Services Added</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {bill.services.map((service, index) => (
                <TableRow key={index}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>₹{service.price}</TableCell>
                  <TableCell>Qty: {service.quantity}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleServiceRemove(service)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TextField label="Discount (₹)" type="number" fullWidth value={bill.discount} onChange={handleDiscountChange} margin="normal" />
        <Typography variant="h5">Total: ₹{bill.total}</Typography>

        <Button variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }} onClick={handleGenerateBill}>
          Generate Bill
        </Button>
      </CardContent>
    </Card>
  );
};

export default Billing;
