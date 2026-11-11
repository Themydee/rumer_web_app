export { resend, EMAIL_CONFIG } from "./resend-client";
export {
	sendEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
	sendPasswordResetEmail,
	sendOtpEmail,
	sendPasswordResetOtpEmail,
	sendContactEmail,
	sendNotificationEmail,
} from "./send-email";
export {
	verificationEmailTemplate,
	welcomeEmailTemplate,
	passwordResetEmailTemplate,
	otpEmailTemplate,
	passwordResetOtpEmailTemplate,
	notificationEmailTemplate,
} from "./templates";
