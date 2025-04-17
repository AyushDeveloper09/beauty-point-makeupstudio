export const sendBillingEmail = async (billingData) => {
    const { customerName, emailid, services, total, discount, date } = billingData;
  
    const emailTemplateParams = {
      customer_name: customerName,
      customer_email: emailid,  // Use emailid here
      services: services.map((service) => `${service.name} - ₹${service.price}`).join(", "), // You can adjust this format
      total: total,
      discount: discount,
      date: date,
    };
  
    try {
      const response = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_BILLING_TEMPLATE_ID,
        emailTemplateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      console.log("Billing Email Sent Successfully:", response);
    } catch (error) {
      console.error("Failed to send billing email:", error);
    }
  };
  