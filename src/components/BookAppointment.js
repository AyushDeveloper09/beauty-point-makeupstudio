import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const servicesList = [
  "Bridal Makeup", "Party Makeup", "Threading", "Haircut", "Facial", "Waxing",
  "Hair Spa", "Hair Coloring", "Body Polishing", "Manicure", "Pedicure" , "Special Offer"
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM"
];

const BookAppointment = () => {
  const [appointment, setAppointment] = useState({
    date: dayjs(),
    time: "",
    customerName: "",
    customerPhone: "",
    services: "",
    emailid: "", // ✅ Use lowercase consistently
  });

  const handleChange = (field, value) => {
    setAppointment((prev) => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { date, time, customerName, customerPhone, services, emailid } = appointment;

    if (!date || !time || !customerName || !services || !customerPhone || !emailid) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(emailid)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        date: date.format("DD/MM/YYYY"),
        time: dayjs(time, "hh:mm A").format("hh:mm A"),
        customerName,
        customerPhone,
        services,
        emailid, // ✅ Match Firestore format
        status: "pending",
      });

      alert("Appointment booked successfully!");

      setAppointment({
        date: dayjs(),
        time: "",
        customerName: "",
        customerPhone: "",
        services: "",
        emailid: "",
      });
    } catch (error) {
      console.error("❌ Error adding document:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="appointment-container">
        <Card className="appointment-card">
          <CardContent>
            <Typography variant="h5" className="title">
              Book an Appointment
            </Typography>

            <form onSubmit={handleSubmit} className="appointment-form">
              <DesktopDatePicker
                label="Select Date"
                format="DD/MM/YYYY"
                value={appointment.date}
                onChange={(newDate) => handleChange("date", dayjs(newDate))}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />

              <TextField
                label="Full Name"
                fullWidth
                required
                value={appointment.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
              />

              <TextField
                label="Phone Number"
                fullWidth
                required
                type="tel"
                inputProps={{ pattern: "[0-9]{10}" }}
                placeholder="Enter 10-digit phone number"
                value={appointment.customerPhone}
                onChange={(e) => handleChange("customerPhone", e.target.value)}
              />

              <TextField
                label="Email ID"
                fullWidth
                required
                type="email"
                value={appointment.emailid}
                onChange={(e) => handleChange("emailid", e.target.value)}
              />

              <Autocomplete
                options={servicesList}
                renderInput={(params) => (
                  <TextField {...params} label="Service Required" fullWidth required />
                )}
                value={appointment.services}
                onChange={(event, newValue) => handleChange("services", newValue)}
              />

              <FormControl fullWidth required>
                <InputLabel>Select Time</InputLabel>
                <Select
                  value={appointment.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                >
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Book Appointment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </LocalizationProvider>
  );
};

export default BookAppointment;
