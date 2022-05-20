import nodemailer from "nodemailer";

let mail;

export async function mailInit() {
  let testAccount = await nodemailer.createTestAccount();
  mail = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'lenora.sanford10@ethereal.email',
      pass: 'ZN12MsKQAKfM5D6Pf2'
    }
  });
}

export async function sendEmail({
  from = "ibrahim@gmail.com",
  to = "user@gmail.com",
  subject,
  html,
}) {
  try {
    await mail.sendMail({
      from,
      to,
      subject,
      html,
    });
  } catch (e) {
    console.error(e, "error");
  }
}
