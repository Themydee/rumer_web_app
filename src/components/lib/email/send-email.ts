import { resend, EMAIL_CONFIG } from "./resend-client";
import {
	verificationEmailTemplate,
	welcomeEmailTemplate,
	passwordResetEmailTemplate,
	otpEmailTemplate,
	passwordResetOtpEmailTemplate,
	notificationEmailTemplate,
} from "./templates";

interface SendEmailOptions {
	to: string | string[];
	subject: string;
	html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
	try {
		const { data, error } = await resend.emails.send({
			from: EMAIL_CONFIG.from,
			to: Array.isArray(to) ? to : [to],
			subject,
			html,
		});

		if (error) {
			console.error("Resend error:", error);
			return { success: false, error: error.message };
		}

		return { success: true, data };
	} catch (error) {
		console.error("Email send error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send email",
		};
	}
};

interface SendVerificationEmailProps {
	name: string;
	email: string;
	verificationToken: string;
	baseUrl?: string;
}

export const sendVerificationEmail = async ({
	name,
	email,
	verificationToken,
	baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}: SendVerificationEmailProps) => {
	const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

	return sendEmail({
		to: email,
		subject: "Verify Your Email Address - Rumer",
		html: verificationEmailTemplate({
			name,
			verificationUrl,
			expiresIn: "24 hours",
		}),
	});
};

interface SendWelcomeEmailProps {
	name: string;
	email: string;
	dashboardUrl?: string;
}

export const sendWelcomeEmail = async ({
	name,
	email,
	dashboardUrl,
}: SendWelcomeEmailProps) => {
	return sendEmail({
		to: email,
		subject: "Welcome to Rumer!",
		html: welcomeEmailTemplate({ name, dashboardUrl }),
	});
};

interface SendPasswordResetEmailProps {
	name: string;
	email: string;
	resetToken: string;
	baseUrl?: string;
}

export const sendPasswordResetEmail = async ({
	name,
	email,
	resetToken,
	baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}: SendPasswordResetEmailProps) => {
	const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

	return sendEmail({
		to: email,
		subject: "Reset Your Password - Rumer",
		html: passwordResetEmailTemplate({
			name,
			resetUrl,
			expiresIn: "1 hour",
		}),
	});
};

interface SendOtpEmailProps {
	name: string;
	email: string;
	otp: string;
}

export const sendOtpEmail = async ({
	name,
	email,
	otp,
}: SendOtpEmailProps) => {
	return sendEmail({
		to: email,
		subject: "Verify Your Email - Rumer",
		html: otpEmailTemplate({ name, otp, expiresIn: "10 minutes" }),
	});
};

interface SendPasswordResetOtpEmailProps {
	name: string;
	email: string;
	otp: string;
}

export const sendPasswordResetOtpEmail = async ({
	name,
	email,
	otp,
}: SendPasswordResetOtpEmailProps) => {
	return sendEmail({
		to: email,
		subject: "Reset Your Password - Rumer",
		html: passwordResetOtpEmailTemplate({ name, otp, expiresIn: "10 minutes" }),
	});
};

interface SendNotificationEmailProps {
	name: string;
	email: string;
	title: string;
	message: string;
	type?: string;
	link?: string | null;
	actionLabel?: string;
}

export const sendNotificationEmail = async ({
	name,
	email,
	title,
	message,
	type = "info",
	link,
	actionLabel,
}: SendNotificationEmailProps) => {
	return sendEmail({
		to: email,
		subject: `${title} - Rumer`,
		html: notificationEmailTemplate({
			name,
			title,
			message,
			type,
			actionUrl: link || undefined,
			actionLabel,
		}),
	});
};

interface SendContactEmailProps {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	message: string;
}

export const sendContactEmail = async ({
	firstName,
	lastName,
	email,
	phone,
	message,
}: SendContactEmailProps) => {
	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #014834;">New Contact Form Submission</h2>
			<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
				<tr>
					<td style="padding: 8px 0; font-weight: bold; color: #374151; width: 140px;">Name:</td>
					<td style="padding: 8px 0; color: #111827;">${firstName} ${lastName}</td>
				</tr>
				<tr>
					<td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
					<td style="padding: 8px 0; color: #111827;"><a href="mailto:${email}">${email}</a></td>
				</tr>
				${phone ? `<tr>
					<td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
					<td style="padding: 8px 0; color: #111827;">${phone}</td>
				</tr>` : ""}
				<tr>
					<td style="padding: 8px 0; font-weight: bold; color: #374151; vertical-align: top;">Message:</td>
					<td style="padding: 8px 0; color: #111827; white-space: pre-wrap;">${message}</td>
				</tr>
			</table>
			<hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
			<p style="color: #6b7280; font-size: 12px;">This message was sent via the Rumer contact form.</p>
		</div>
	`;

	return sendEmail({
		to: "support@rumer.ng",
		subject: `Contact Form: ${firstName} ${lastName}`,
		html,
	});
};
