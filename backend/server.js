require('dotenv').config();
const express = require('express');
const router = express.Router();
const cors = require('cors');
const nodemailer = require('nodemailer');

//sever used to send emails
const app = express();
app.use(cors());
app.use(express.json());

const corsOptions = {
origin: ['http://localhost:5173', 'https://delon-portfolio-website.vercel.app'],
  methods: 'GET, POST',
  allowedHeaders: 'Content-Type',
};

app.use(cors(corsOptions));

// Configure nodemailer
const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

// POST route for contact form
router.post('/contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body;

   if (!name || !email || !subject || !message) {
    return res.status(400).json({ code: 400, message: "Missing required fields" });
  }

const mail = {
  from: process.env.GMAIL_USER,
  to: "delonansah87@gmail.com",
  replyTo: email,
  subject: `Portfolio Contact: ${subject}`,
  html: `
    <h3>New Contact Request</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong><br/>${message}</p>
  `,
};

  contactEmail.sendMail(mail, (error) => {
     if (error) {
      console.error("Email send error:", error);
      return res.status(500).json({ code: 500, message: "Failed to send message" });
    } else {
      return res.status(200).json({ code: 200, status: "Message Sent" });
    }
  });
})

app.use("/", router);

app.listen(5000, () => {
  console.log('server running on port 5000');
})
