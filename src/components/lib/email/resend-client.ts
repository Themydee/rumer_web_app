import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
	console.warn("RESEND_API_KEY is not set. Email functionality will be disabled.");
}

export const resend = new Resend(resendApiKey || "re_placeholder");

export const EMAIL_CONFIG = {
	from: process.env.EMAIL_FROM || "Rumer <noreply@rumer.ng>",
 ReplyTo: process.env.EMAIL_REPLY_TO || "support@rumer.ng",
};
