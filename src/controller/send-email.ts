const nodemailer = require('nodemailer');

export async function sendEmail(to, subject, body) {
  try {
    // Create a transporter object using SMTP
    const transporter = nodemailer.createTransport({
      host: 'mail.aalmis.com',
      port: 465,
      secure: true,
      auth: {
        user: 'no-reply@aalmis.com',
        pass: 'Ko7VfjMISQM5',
      },
    });

    // Define the email content
    const mailOptions = {
      from: 'no-reply@aalmis.com', // Sender email address
      to: to, // Recipient email address
      subject: subject, // Email subject
      text: body, // Plain text body
    };

    // Send the email with defined transport object
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}
