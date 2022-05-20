import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.EMAIL);

export default async function sendEmail({
  from = "ibrahim@twitter-clone.com",
  to,
  subject,
  html,
}) {
  try {
    await sgMail.send({
      from,
      to,
      subject,
      html,
    });
  } catch (e) {
    console.error(e, "error");
  }
}
