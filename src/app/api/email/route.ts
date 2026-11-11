import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendContactEmail } from "@/components/lib/email";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { type, ...data } = body;

		let result;

		switch (type) {
			case "verification":
				result = await sendVerificationEmail({
					name: data.name,
					email: data.email,
					verificationToken: data.verificationToken,
					baseUrl: data.baseUrl,
				});
				break;

			case "welcome":
				result = await sendWelcomeEmail({
					name: data.name,
					email: data.email,
					dashboardUrl: data.dashboardUrl,
				});
				break;

			case "password-reset":
				result = await sendPasswordResetEmail({
					name: data.name,
					email: data.email,
					resetToken: data.resetToken,
					baseUrl: data.baseUrl,
				});
				break;

			case "contact":
				result = await sendContactEmail({
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					phone: data.phone,
					message: data.message,
				});
				break;

			default:
				return NextResponse.json(
					{ error: "Invalid email type" },
					{ status: 400 }
				);
		}

		if (result?.success) {
			return NextResponse.json({ success: true, data: result.data });
		} else {
			return NextResponse.json(
				{ error: result?.error || "Failed to send email" },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Email API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
