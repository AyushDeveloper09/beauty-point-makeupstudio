import React, { useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { TextField, Button, Card, CardContent, Typography, Grid, Divider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const servicesList = [
  {
    category: "Bleach",
    services: [
      { name: "Face & Neck", price: 249 },
      { name: "Full Arms", price: 399 },
      { name: "Full Legs", price: 399 },
      { name: "Full Back/Front", price: 499 },
      { name: "Full Body", price: 1999 },
      { name: "Full Neck Blues Line", price: 499 },
    ],
  },
  {
    category: "D-Tan",
    services: [
      { name: "Face & Neck", price: 450 },
      { name: "Full Arms", price: 950 },
      { name: "Full Legs", price: 950 },
      { name: "Full Back/Front", price: 850 },
      { name: "Full Neck Blues Line", price: 600 },
      { name: "Full Body", price: 3000 },
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
    generatedBill: null,
  });

  const handleServiceAdd = (service) => {
    setBill((prev) => {
      if (prev.services.some((s) => s.name === service.name)) return prev;
      const updatedServices = [...prev.services, service];
      const updatedTotal = updatedServices.reduce((sum, s) => sum + s.price, 0) - prev.discount;
      return { ...prev, services: updatedServices, total: updatedTotal };
    });
  };

  const handleServiceRemove = (service) => {
    setBill((prev) => {
      const updatedServices = prev.services.filter((s) => s.name !== service.name);
      const updatedTotal = updatedServices.reduce((sum, s) => sum + s.price, 0) - prev.discount;
      return { ...prev, services: updatedServices, total: updatedTotal };
    });
  };

  const handleDiscountChange = (e) => {
    const discount = Number(e.target.value) || 0;
    setBill((prev) => ({
      ...prev,
      discount,
      total: prev.services.reduce((sum, s) => sum + s.price, 0) - discount,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bill.customerName.trim() || !bill.customerPhone.trim()) {
      alert("⚠️ Customer name and phone number are required!");
      return;
    }
    if (bill.services.length === 0) {
      alert("⚠️ Please select at least one service!");
      return;
    }

    try {
      await addDoc(collection(db, "bills"), bill);
      alert("✅ Bill generated successfully!");
      setBill((prev) => ({
        ...prev,
        generatedBill: { ...prev },
      }));
    } catch (error) {
      console.error("❌ Error saving bill:", error);
      alert("❌ Failed to generate bill. Please try again.");
    }
  };

  return (
    <Card className="billing-card" style={{ maxWidth: 500, margin: "auto", padding: "20px", marginTop: "20px" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          🧾 BeautyPoint Makeup Studio - Bill
        </Typography>

        {!bill.generatedBill ? (
          <>
            <TextField
              label="Customer Name"
              fullWidth
              required
              value={bill.customerName}
              onChange={(e) => setBill({ ...bill, customerName: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Phone Number"
              fullWidth
              required
              value={bill.customerPhone}
              onChange={(e) => setBill({ ...bill, customerPhone: e.target.value })}
              margin="normal"
            />

            <Typography variant="h6" gutterBottom>
              Select Services:
            </Typography>
            {servicesList.map((category) => (
              <Accordion key={category.category}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">{category.category}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {category.services.map((service) => (
                    <Grid container key={service.name} spacing={1} alignItems="center">
                      <Grid item xs={6}>
                        <Typography>{service.name} - ₹{service.price}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Button variant="contained" color="primary" onClick={() => handleServiceAdd(service)}>
                          Add
                        </Button>
                      </Grid>
                      <Grid item xs={3}>
                        <Button variant="contained" color="secondary" onClick={() => handleServiceRemove(service)}>
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}

            <TextField
              label="Discount"
              fullWidth
              type="number"
              value={bill.discount}
              onChange={handleDiscountChange}
              margin="normal"
            />

            <Typography variant="h6" gutterBottom>
              Selected Services:
            </Typography>
            {bill.services.map((service, index) => (
              <Grid container key={index} justifyContent="space-between">
                <Grid item>{service.name}</Grid>
                <Grid item>₹{service.price}</Grid>
              </Grid>
            ))}

            <Divider style={{ margin: "10px 0" }} />
            <Typography variant="h6" gutterBottom>
              Total: ₹{bill.total}
            </Typography>

            <Button variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }} onClick={handleSubmit}>
              Generate Bill
            </Button>
          </>
        ) : (
          <Card style={{ padding: "15px", marginTop: "20px" }}>
            <Typography variant="h6" align="center">
              BeautyPoint Makeup Studio
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <Typography>Customer Name: {bill.generatedBill.customerName}</Typography>
            <Typography>Phone: {bill.generatedBill.customerPhone}</Typography>
            <Typography>Customer ID: {bill.generatedBill.customerId}</Typography>
            <Divider style={{ margin: "10px 0" }} />
            {bill.generatedBill.services.map((service, index) => (
              <Grid container key={index} justifyContent="space-between">
                <Grid item>{service.name}</Grid>
                <Grid item>₹{service.price}</Grid>
              </Grid>
            ))}
            <Divider style={{ margin: "10px 0" }} />
            <Typography>Discount: ₹{bill.generatedBill.discount}</Typography>
            <Typography variant="h6">Total: ₹{bill.generatedBill.total}</Typography>
            <Button onClick={() => window.print()} variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }}>
              Print Bill
            </Button>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default Billing;
