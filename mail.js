import mailgun from "mailgun-js"
// import sgMail from "@sendgrid/mail";
// sgMail.setApiKey(process.env.EMAIL);

// export default async function sendEmail({
//   from = "ibrahim@twitter-clone.com",
//   to,
//   subject,
//   html,
// }) {
//   try {
//     await sgMail.send({
//       from,
//       to,
//       subject,
//       html,
//     });
//   } catch (e) {
//     console.error(e, "error");
//   }
// }


const DOMAIN = 'twitter2022.herokuapp.com';
const mg = mailgun({apiKey: process.env.EMAIL, domain: DOMAIN});
export default sendEmail({from="ibrahim@twitter.com" , to, subject, html}){

const data = {
	from,
	to ,
	subject,
	text : html
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});
}