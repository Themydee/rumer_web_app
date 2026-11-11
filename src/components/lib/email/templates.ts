interface VerificationEmailProps {
	name: string;
	verificationUrl: string;
	expiresIn?: string;
}

export const verificationEmailTemplate = ({
	name,
	verificationUrl,
	expiresIn = "24 hours",
}: VerificationEmailProps): string => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Rumer</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      width: 64px;
      height: 64px;
      background-color: #014834;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .logo-text {
      color: white;
      font-size: 28px;
      font-weight: bold;
    }
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #6b7280;
      margin-bottom: 32px;
    }
    .content {
      background-color: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .message {
      color: #374151;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background-color: #014834;
      color: white;
      padding: 14px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
    }
    .button:hover {
      background-color: #013628;
    }
    .divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 24px 0;
    }
    .note {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      color: #9ca3af;
      font-size: 12px;
    }
    .link-fallback {
      word-break: break-all;
      color: #014834;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-text">R</span>
      </div>
      <h1 class="title">Verify Your Email</h1>
      <p class="subtitle">Complete your account registration</p>
    </div>
    
    <div class="content">
      <p class="message">Hi ${name},</p>
      <p class="message">
        Thank you for signing up for Rumer! Please verify your email address to 
        complete your registration and access all features.
      </p>
      
      <div class="button-container">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      
      <hr class="divider">
      
      <p class="note">
        <strong>This link expires in ${expiresIn}.</strong><br><br>
        If you didn't create an account with Rumer, please ignore this email or 
        contact our support team if you have any concerns.
      </p>
      
      <p class="note" style="margin-top: 16px;">
        Having trouble? Copy and paste this URL into your browser:<br>
        <span class="link-fallback">${verificationUrl}</span>
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Rumer. All rights reserved.</p>
      <p>Livestock Traceability Platform</p>
    </div>
  </div>
</body>
</html>
`;
};

interface WelcomeEmailProps {
	name: string;
	dashboardUrl?: string;
}

export const welcomeEmailTemplate = ({
	name,
	dashboardUrl = "https://rumer.ng/dashboard",
}: WelcomeEmailProps): string => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Rumer</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      width: 64px;
      height: 64px;
      background-color: #014834;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .logo-text {
      color: white;
      font-size: 28px;
      font-weight: bold;
    }
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #6b7280;
      margin-bottom: 32px;
    }
    .content {
      background-color: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .message {
      color: #374151;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background-color: #014834;
      color: white;
      padding: 14px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
    }
    .features {
      background-color: #f9fafb;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .feature-icon {
      width: 24px;
      height: 24px;
      background-color: #014834;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .feature-text {
      color: #374151;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      color: #9ca3af;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-text">R</span>
      </div>
      <h1 class="title">Welcome to Rumer!</h1>
      <p class="subtitle">Your account has been created successfully</p>
    </div>
    
    <div class="content">
      <p class="message">Hi ${name},</p>
      <p class="message">
        Welcome to Rumer! We're excited to have you on board. Your account is now 
        ready and you can start exploring our livestock traceability platform.
      </p>
      
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span class="feature-text">Track your livestock inventory in real-time</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span class="feature-text">Connect with buyers and sellers across Nigeria</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span class="feature-text">Access detailed analytics and reports</span>
        </div>
      </div>
      
      <div class="button-container">
        <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
      </div>
      
      <p class="message" style="font-size: 14px; color: #6b7280;">
        If you have any questions, feel free to reach out to our support team at 
        <a href="mailto:support@rumer.ng" style="color: #014834;">support@rumer.ng</a>
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Rumer. All rights reserved.</p>
      <p>Livestock Traceability Platform</p>
    </div>
  </div>
</body>
</html>
`;
};

interface PasswordResetEmailProps {
	name: string;
	resetUrl: string;
	expiresIn?: string;
}

interface OtpEmailProps {
	name: string;
	otp: string;
	expiresIn?: string;
}

export const otpEmailTemplate = ({
	name,
	otp,
	expiresIn = "10 minutes",
}: OtpEmailProps): string => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Rumer</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      width: 64px;
      height: 64px;
      background-color: #014834;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .logo-text {
      color: white;
      font-size: 28px;
      font-weight: bold;
    }
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #6b7280;
      margin-bottom: 32px;
    }
    .content {
      background-color: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .message {
      color: #374151;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .otp-box {
      text-align: center;
      background-color: #f0fdf9;
      border: 2px solid #014834;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #014834;
    }
    .note {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      color: #9ca3af;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-text">R</span>
      </div>
      <h1 class="title">Verify Your Email</h1>
      <p class="subtitle">Complete your account registration</p>
    </div>
    
    <div class="content">
      <p class="message">Hi ${name},</p>
      <p class="message">
        Thank you for signing up for Rumer! Use the verification code below to 
        complete your email verification.
      </p>
      
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      
      <p class="note">
        <strong>This code expires in ${expiresIn}.</strong><br><br>
        If you didn't create an account with Rumer, please ignore this email.
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Rumer. All rights reserved.</p>
      <p>Livestock Traceability Platform</p>
    </div>
  </div>
</body>
</html>
`;
};

interface PasswordResetOtpEmailProps {
	name: string;
	otp: string;
	expiresIn?: string;
}

export const passwordResetOtpEmailTemplate = ({
	name,
	otp,
	expiresIn = "10 minutes",
}: PasswordResetOtpEmailProps): string => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Rumer</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      width: 64px;
      height: 64px;
      background-color: #014834;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .logo-text {
      color: white;
      font-size: 28px;
      font-weight: bold;
    }
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #6b7280;
      margin-bottom: 32px;
    }
    .content {
      background-color: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .message {
      color: #374151;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .otp-box {
      text-align: center;
      background-color: #f0fdf9;
      border: 2px solid #014834;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #014834;
    }
    .note {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      color: #9ca3af;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-text">R</span>
      </div>
      <h1 class="title">Reset Your Password</h1>
      <p class="subtitle">We received a password reset request</p>
    </div>
    
    <div class="content">
      <p class="message">Hi ${name},</p>
      <p class="message">
        We received a request to reset your password. Use the code below to 
        set a new password for your account.
      </p>
      
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      
      <p class="note">
        <strong>This code expires in ${expiresIn}.</strong><br><br>
        If you didn't request a password reset, please ignore this email.
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Rumer. All rights reserved.</p>
      <p>Livestock Traceability Platform</p>
    </div>
  </div>
</body>
</html>
`;
};

export const passwordResetEmailTemplate = ({
	name,
	resetUrl,
	expiresIn = "1 hour",
}: PasswordResetEmailProps): string => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Rumer</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      width: 64px;
      height: 64px;
      background-color: #014834;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .logo-text {
      color: white;
      font-size: 28px;
      font-weight: bold;
    }
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #6b7280;
      margin-bottom: 32px;
    }
    .content {
      background-color: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .message {
      color: #374151;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background-color: #014834;
      color: white;
      padding: 14px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
    }
    .divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 24px 0;
    }
    .note {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      color: #9ca3af;
      font-size: 12px;
    }
    .link-fallback {
      word-break: break-all;
      color: #014834;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-text">R</span>
      </div>
      <h1 class="title">Reset Your Password</h1>
      <p class="subtitle">We received a password reset request</p>
    </div>
    
    <div class="content">
      <p class="message">Hi ${name},</p>
      <p class="message">
        We received a request to reset your password. Click the button below to 
        create a new password for your account.
      </p>
      
      <div class="button-container">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <hr class="divider">
      
      <p class="note">
        <strong>This link expires in ${expiresIn}.</strong><br><br>
        If you didn't request a password reset, please ignore this email. Your 
        password will remain unchanged.
      </p>
      
      <p class="note" style="margin-top: 16px;">
        Having trouble? Copy and paste this URL into your browser:<br>
        <span class="link-fallback">${resetUrl}</span>
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Rumer. All rights reserved.</p>
      <p>Livestock Traceability Platform</p>
    </div>
  </div>
</body>
</html>
`;
};

interface NotificationEmailTemplateProps {
	name: string;
	title: string;
	message: string;
	type: string;
	actionUrl?: string;
	actionLabel?: string;
}

const TYPE_ICON: Record<string, string> = {
	success: "✅",
	error: "⚠️",
	warning: "⚠️",
	info: "🔔",
};

export const notificationEmailTemplate = ({
	name,
	title,
	message,
	type = "info",
	actionUrl,
	actionLabel,
}: NotificationEmailTemplateProps): string => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
          <tr>
            <td style="background: linear-gradient(135deg, #063d2e 0%, #0a5c44 100%); padding: 28px 32px; text-align: center;">
              <h1 style="margin: 0 0 6px; font-size: 22px; color: #ffffff;">${TYPE_ICON[type] || "🔔"} ${title}</h1>
              <p style="margin: 0; color: #9ec3b2; font-size: 14px;">Rumer Livestock Traceability Platform</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 8px; color: #111827; font-size: 14px;">Hi ${name},</p>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 15px; line-height: 1.6;">${message}</p>
              ${actionUrl ? `
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td style="border-radius: 10px; background-color: #014834;">
                    <a href="${actionUrl}" style="display: inline-block; padding: 12px 28px; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none;">${actionLabel || "View Details"}</a>
                  </td>
                </tr>
              </table>
              ` : ""}
              <p style="margin: 24px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">You're receiving this because it's an important update about your Rumer account. You can adjust your notification preferences from your dashboard.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; border-top: 1px solid #f3f4f6; text-align: center; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rumer. All rights reserved.</p>
              <p style="margin: 4px 0 0;">Livestock Traceability Platform</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
