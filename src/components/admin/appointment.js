import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import sendConfirmationEmail from "./sendConfirmationEmail";

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

      const now = dayjs().tz("Asia/Kolkata");

      appointmentsData = appointmentsData.filter((appointment) => {
        if (!appointment.date || !appointment.time) return false;

        const formattedTime = dayjs(appointment.time, ["hh:mm A", "h:mm A"]).format("HH:mm");
        const fullDateTimeString = `${appointment.date} ${formattedTime}`;
        const appointmentDateTime = dayjs.tz(fullDateTimeString, "DD/MM/YYYY HH:mm", "Asia/Kolkata");

        return appointmentDateTime.isValid() && appointmentDateTime.isAfter(now);
      });

      setAppointments([...appointmentsData]);
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

  const handleConfirm = async (appointment) => {
    if (appointment.emailid) {
      try {
        await sendConfirmationEmail(
          appointment.customerName,
          appointment.emailid,
          appointment.services,
          appointment.date,
          appointment.time
        );
        console.log("✅ Email sent successfully");

        // 🔄 Persist confirmation in Firestore
        await updateDoc(doc(db, "appointments", appointment.id), {
          status: "confirmed",
        });

        // ✅ Show success alert
        alert("✅ Mail sent!");
      } catch (error) {
        console.error("❌ Email sending failed:", error);
        alert("Failed to send confirmation email.");
      }
    } else {
      console.warn("⚠️ No email provided, skipping email sending.");
    }
  };

  return (
    <Container>
      <h2>📅 Booked Appointments</h2>
      {appointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        appointments.map((appointment) => (
          <Card
            key={appointment.id}
            className="appointment-card"
            style={{ marginBottom: "10px", padding: "10px" }}
          >
            <CardContent>
              <Typography variant="h6">👤 {appointment.customerName}</Typography>
              <Typography>📅 Date: {appointment.date}</Typography>
              <Typography>⏰ Time: {appointment.time}</Typography>
              <Typography>💇‍♀️ Service: {appointment.services}</Typography>
              <Typography>📞 Contact: {appointment.customerPhone}</Typography>
              {appointment.emailid ? (
                <Typography>📧 Email: {appointment.emailid}</Typography>
              ) : (
                <Typography color="error">⚠️ No email provided</Typography>
              )}

              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(appointment.id)}
                >
                  Cancel Appointment
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleConfirm(appointment)}
                  disabled={appointment.status === "confirmed"}
                >
                  {appointment.status === "confirmed" ? "✅ Confirmed" : "Confirm"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Appointment;
