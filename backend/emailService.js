const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use a specific SMTP server
  auth: {
    user: 'xtianxd0130@gmail.com', // Replace with your email
    pass: 'ibdyfbgxoilpjmsf' // Use an app password if using Gmail
  }
});

// Function to check if email setup works
const verifyEmailSetup = async () => {
    try {
      await transporter.verify();
      console.log('✅ Email setup is working correctly.');
    } catch (error) {
      console.error('❌ Email setup failed. Please check your configuration.', error);
    }
  };

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"Your Business Name" <your-email@example.com>',
      to,
      subject,
      text
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Run email setup verification on startup
verifyEmailSetup();

module.exports = { sendEmail };
