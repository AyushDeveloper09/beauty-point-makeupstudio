import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent, Typography, Container, Button } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "appointments"), (snapshot) => {
      let appointmentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("🔥 Firestore Raw Data:", JSON.stringify(appointmentsData, null, 2));

      const now = dayjs().tz("Asia/Kolkata"); // Get system time in the correct timezone

      appointmentsData = appointmentsData.filter((appointment) => {
        if (!appointment.date || !appointment.time) return false;

        // Ensure time is in 24-hour format
        const formattedTime = dayjs(appointment.time, ["hh:mm A", "h:mm A"]).format("HH:mm");
        const fullDateTimeString = `${appointment.date} ${formattedTime}`;

        console.log(`⏰ Parsed Time: ${formattedTime}`);

        // Correctly set timezone for appointment date & time
        const appointmentDateTime = dayjs.tz(fullDateTimeString, "DD/MM/YYYY HH:mm", "Asia/Kolkata");

        console.log(
          `🕒 Checking: ${fullDateTimeString} -> Parsed: ${appointmentDateTime.format(
            "DD/MM/YYYY HH:mm"
          )} | Valid? ${appointmentDateTime.isValid()} | Now: ${now.format("DD/MM/YYYY HH:mm")} | After Now? ${appointmentDateTime.isAfter(now)}`
        );

        return appointmentDateTime.isValid() && appointmentDateTime.isAfter(now);
      });

      console.log("✅ Filtered Appointments:", appointmentsData);
      setAppointments([...appointmentsData]); // Ensure React updates state
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "appointments", id));
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== id)
      );
    } catch (error) {
      console.error("❌ Error deleting appointment:", error);
    }
  };

  return (
    <Container>
      <h2>📅 Booked Appointments</h2>
      {appointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        appointments.map((appointment) => (
          <Card key={appointment.id} className="appointment-card" style={{ marginBottom: "10px", padding: "10px" }}>
            <CardContent>
              <Typography variant="h6">👤 {appointment.customerName}</Typography>
              <Typography>📅 Date: {appointment.date}</Typography>
              <Typography>⏰ Time: {appointment.time}</Typography>
              <Typography>💇‍♀️ Service: {appointment.services}</Typography>
              <Typography>📞 Contact: {appointment.customerPhone}</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(appointment.id)}
                style={{ marginTop: "10px" }}
              >
                Cancel Appointment
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Appointment;
