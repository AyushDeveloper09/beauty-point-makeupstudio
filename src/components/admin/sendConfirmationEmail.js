import emailjs from "@emailjs/browser";

const sendConfirmationEmail = (name, email, service, date, time) => {
  return emailjs.send(
    process.env.REACT_APP_EMAILJS_SERVICE_ID,
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    {
      customer_name: name,
      email: email,
      service: service,
      date: date,
      time: time,
    },
    process.env.REACT_APP_EMAILJS_PUBLIC_KEY
  );
};

export default sendConfirmationEmail;
