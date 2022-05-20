import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.EMAIL);

export default async function sendEmail({
  from = "ibrahim@gmail.com",
  to = "user@gmail.com",
  subject,
  html,
}) {
  try {
    await sgMail.send(msg);
    ({
      from,
      to,
      subject,
      html,
    });
  } catch (e) {
    console.error(e, "error");
  }
}
