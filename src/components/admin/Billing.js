import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

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
    emailid: "",
    services: [],
    discount: 0,
    total: 0,
  });

  const [previousBills, setPreviousBills] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "bills"), orderBy("timestamp", "desc"))
    );
    setPreviousBills(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const cleanupOldBills = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "bills"), orderBy("timestamp", "desc"))
    );
    const bills = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (bills.length > 120) {
      const excessBills = bills.slice(120);
      excessBills.forEach(async (bill) => {
        await deleteDoc(doc(db, "bills", bill.id));
      });
    }
  };

  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleServiceAdd = (service) => {
    setBill((prev) => {
      const existingService = prev.services.find(
        (s) => s.name === service.name
      );

      let updatedServices;
      if (existingService) {
        updatedServices = prev.services.map((s) =>
          s.name === service.name
            ? { ...s, quantity: s.quantity + 1 }
            : s
        );
      } else {
        updatedServices = [...prev.services, { ...service, quantity: 1 }];
      }

      const updatedTotal =
        updatedServices.reduce((sum, s) => sum + s.price * s.quantity, 0) -
        prev.discount;

      return { ...prev, services: updatedServices, total: updatedTotal };
    });
  };

  const handleServiceRemove = (service) => {
    setBill((prev) => {
      const existingService = prev.services.find(
        (s) => s.name === service.name
      );

      let updatedServices;
      if (existingService.quantity > 1) {
        updatedServices = prev.services.map((s) =>
          s.name === service.name
            ? { ...s, quantity: s.quantity - 1 }
            : s
        );
      } else {
        updatedServices = prev.services.filter(
          (s) => s.name !== service.name
        );
      }

      const updatedTotal =
        updatedServices.reduce((sum, s) => sum + s.price * s.quantity, 0) -
        prev.discount;

      return { ...prev, services: updatedServices, total: updatedTotal };
    });
  };

  const handleDiscountChange = (e) => {
    const discount = parseInt(e.target.value) || 0;
    setBill((prev) => ({
      ...prev,
      discount,
      total:
        prev.services.reduce((sum, s) => sum + s.price * s.quantity, 0) -
        discount,
    }));
  };

  const handleGenerateBill = async () => {
    if (!bill.customerName.trim() || !bill.customerPhone.trim() || !bill.emailid.trim()) {
      alert("⚠️ Customer name, phone number, and email are required!");
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
        emailid: "",
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

  const renderBillPreview = (bill) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        style={{
          padding: 20,
          width: "80%",
          maxWidth: 600,
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <IconButton
          style={{ position: "absolute", top: 10, right: 10 }}
          onClick={() => setSelectedBill(null)}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" align="center">
          Beauty Point Makeup Studio
        </Typography>
        <Typography variant="subtitle1" align="center">
          Contact: 6390600533
        </Typography>
        <hr />
        <Typography>
          <strong>Customer:</strong> {bill.customerName}
        </Typography>
        <Typography>
          <strong>Phone:</strong> {bill.customerPhone}
        </Typography>
        <Typography>
          <strong>Email:</strong> {bill.emailid}
        </Typography>
        <Typography>
          <strong>Date:</strong>{" "}
          {bill.timestamp?.toDate().toLocaleDateString()}
        </Typography>
        <hr />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bill.services.map((service, i) => (
              <TableRow key={i}>
                <TableCell>{service.name}</TableCell>
                <TableCell>₹{service.price}</TableCell>
                <TableCell>{service.quantity}</TableCell>
                <TableCell>₹{service.price * service.quantity}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>
                <strong>Discount</strong>
              </TableCell>
              <TableCell>₹{bill.discount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                <strong>Total</strong>
              </TableCell>
              <TableCell>
                <strong>₹{bill.total}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Button variant="outlined" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </Paper>
    </div>
  );

  return (
    <>
      <Card
        style={{
          maxWidth: 700,
          margin: "auto",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <CardContent>
          <Typography variant="h5">
            🧾 BeautyPoint Makeup Studio - Billing
          </Typography>

          <TextField
            label="Customer Name"
            fullWidth
            required
            value={bill.customerName}
            onChange={(e) =>
              setBill({ ...bill, customerName: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Phone Number"
            fullWidth
            required
            value={bill.customerPhone}
            onChange={(e) =>
              setBill({ ...bill, customerPhone: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Email ID"
            fullWidth
            required
            value={bill.emailid}
            onChange={(e) =>
              setBill({ ...bill, emailid: e.target.value })
            }
            margin="normal"
          />

          <Typography variant="h6">Select Services</Typography>
          {serviceCategories.map((category, index) => (
            <Accordion
              key={index}
              expanded={expandedCategory === category.category}
              onChange={() => handleCategoryClick(category.category)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{category.category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {category.services.map((service, sIndex) => (
                  <div
                    key={sIndex}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                    }}
                  >
                    <Typography>
                      {service.name} - ₹{service.price}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleServiceAdd(service)}
                    >
                      Add <AddCircleIcon />
                    </Button>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}

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
                      <IconButton
                        color="secondary"
                        onClick={() => handleServiceRemove(service)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TextField
            label="Discount (₹)"
            type="number"
            fullWidth
            value={bill.discount}
            onChange={handleDiscountChange}
            margin="normal"
          />
          <Typography variant="h5">Total: ₹{bill.total}</Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "10px" }}
            onClick={handleGenerateBill}
          >
            Generate Bill
          </Button>
        </CardContent>
      </Card>

      <Card
        style={{
          maxWidth: 700,
          margin: "20px auto",
          padding: "20px",
        }}
      >
        <CardContent>
          <Typography variant="h6">📄 Previous Bills</Typography>
          {previousBills.length === 0 && (
            <Typography>No previous bills found.</Typography>
          )}
          {previousBills.map((bill, index) => (
            <Card key={index} style={{ margin: "10px 0", padding: "10px" }}>
              <Typography variant="subtitle1">
                <strong>{bill.customerName}</strong> | {bill.customerPhone}
              </Typography>
              <Typography variant="body2">
                Total: ₹{bill.total} | Date:{" "}
                {bill.timestamp?.toDate().toLocaleDateString()}
              </Typography>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => setSelectedBill(bill)}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={() => {
                    setSelectedBill(bill);
                    setTimeout(() => window.print(), 500);
                  }}
                >
                  Print
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this bill?"
                      )
                    ) {
                      await deleteDoc(doc(db, "bills", bill.id));
                      fetchBills();
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {selectedBill && renderBillPreview(selectedBill)}
    </>
  );
};

export default Billing;
