import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent, Typography, Container, Button } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "appointments"), (snapshot) => {
      let appointmentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("🔥 Firestore Raw Data:", JSON.stringify(appointmentsData, null, 2));

      if (appointmentsData.length > 0) {
        console.log("📅 Sample Date from Firestore:", appointmentsData[0].date);
      }

      const now = dayjs(); // Current time

      appointmentsData = appointmentsData.filter((appointment) => {
        if (!appointment.date || !appointment.time) return false;

        // Standardize time format before parsing
        const formattedTime = dayjs(appointment.time, ["hh:mm A", "h:mm A"]).format("HH:mm");
        const fullDateTimeString = `${appointment.date} ${formattedTime}`;

        console.log(`⏰ Parsed Time: ${formattedTime}`);

        // Ensure correct date format for parsing
        const appointmentDateTime = dayjs(fullDateTimeString, [
          "DD/MM/YYYY HH:mm",
          "MM/DD/YYYY HH:mm",
          "DD/MM/YY HH:mm",
        ]);

        console.log(
          `🕒 Checking: ${fullDateTimeString} -> Parsed: ${appointmentDateTime.format(
            "DD/MM/YYYY HH:mm"
          )} | Valid? ${appointmentDateTime.isValid()} | After Now? ${appointmentDateTime.isSameOrAfter(now)}`
        );

        return appointmentDateTime.isValid() && appointmentDateTime.isSameOrAfter(now);
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
