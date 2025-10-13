import nodemailer from 'nodemailer';

// Gmail SMTP configuration (backup email solution)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
  },
});

export const sendGmailEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) => {
  try {
    console.log('Sending email via Gmail:', {
      from: process.env.GMAIL_USER,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject
    });

    const result = await transporter.sendMail({
      from: `"Memora" <${process.env.GMAIL_USER}>`,
      to,
      subject: `[Memora] ${subject}`,
      html,
      text,
      replyTo: process.env.GMAIL_USER,
    });

    console.log('Gmail email sent successfully:', {
      messageId: result.messageId,
      to: Array.isArray(to) ? to.join(', ') : to
    });

    return { success: true, id: result.messageId };
  } catch (error) {
    console.error('Failed to send Gmail email:', error);
    return { success: false, error };
  }
};
