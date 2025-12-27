import { createTransport } from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailOptions: EmailOptions): Promise<void> => {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    requireTLS: process.env.SMTP_REQUIRES_TLS === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: emailOptions.to,
    subject: emailOptions.subject,
    html: emailOptions.html,
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${token}`;

  const subject = "Verify Your Email Address - QuickAid";

  const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email - QuickAid</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to QuickAid!</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Hi there!</p>
              <p>Thank you for signing up with QuickAid. To complete your registration and start using our healthcare platform, please verify your email address by clicking the button below:</p>

              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>

              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p style="background-color: #e5e7eb; padding: 10px; border-radius: 4px; word-break: break-all;">
                ${verificationUrl}
              </p>

              <p><strong>This verification link will expire in 24 hours.</strong></p>

              <p>If you didn't create an account with QuickAid, you can safely ignore this email.</p>

              <p>Best regards,<br>The QuickAid Team</p>
            </div>
            <div class="footer">
              <p>© 2025 QuickAid. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

  await sendEmail({
    to: email,
    subject,
    html,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`;

  const subject = "Reset Your Password - QuickAid";

  const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password - QuickAid</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset - QuickAid</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>Hi there!</p>
              <p>We received a request to reset your password for your QuickAid account. Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p style="background-color: #e5e7eb; padding: 10px; border-radius: 4px; word-break: break-all;">
                ${resetUrl}
              </p>
              <p><strong>This password reset link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              <p>Best regards,<br>The QuickAid Team</p>
            </div>
            <div class="footer">
              <p>© 2025 QuickAid. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

  await sendEmail({
    to: email,
    subject,
    html,
  });
};
