require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

const fs = require("fs");
const path = require("path");

app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    const templatePath = path.join(__dirname, "./templates/emailTemplate.html");
    let emailHtml = fs.readFileSync(templatePath, "utf8");

    emailHtml = emailHtml.replace("{{name}}", name)
                         .replace("{{email}}", email)
                         .replace("{{message}}", message);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL,
        subject: `New Contact Form Submission from ${name}`,
        html: emailHtml,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error sending email", error });
    }
});

  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
