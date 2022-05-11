const nodeMailer=require("nodemailer");
const sendEmail=async(emailId, data, subject) =>{
  var trasnporter = nodeMailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: process.env.MAILID,
      pass: process.env.MAILPASS,
    },
  });
  var mailOptions = {
    from: process.env.MAILID,
    to: emailId,
    subject: subject,
    text: data,
  };
  trasnporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Error");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
}
module.exports=sendEmail;