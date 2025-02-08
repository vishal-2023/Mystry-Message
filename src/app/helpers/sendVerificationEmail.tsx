import nodemailer from 'nodemailer';
import { ApiResponse } from '@/types/ApiResponse';

// Construct the HTML content for the email manually
const createVerificationEmailHtml = (username: string, verifycode: string): string => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { padding: 20px; }
          .header { font-size: 20px; font-weight: bold; }
          .content { margin-top: 20px; }
          .footer { margin-top: 30px; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            Hello ${username},
          </div>
          <div class="content">
            <p>Your verification code is:</p>
            <h3>${verifycode}</h3>
            <p>Please use this code to verify your email address.</p>
          </div>
          <div class="footer">
            <p>Thank you for using Mystery-App!</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const sendVerificationEmail = async (email: string, username: string, verifycode: string): Promise<ApiResponse> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Use the manually created HTML email content
    const emailHtml = createVerificationEmailHtml(username, verifycode);

    const options = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Verification Code from Mystery-App',
      html: emailHtml,
    };

    await transporter.sendMail(options);

    return {
      success: true,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.log(error,"email err")
    return {
      success: false,
      message: 'Failed to send verification email',
    };
  }
};

export default sendVerificationEmail;
