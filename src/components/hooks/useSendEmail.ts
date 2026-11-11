"use client";

import { useState } from "react";

interface UseEmailOptions {
	type: "verification" | "welcome" | "password-reset";
	name?: string;
	email?: string;
	verificationToken?: string;
	resetToken?: string;
	baseUrl?: string;
	dashboardUrl?: string;
}

interface EmailState {
	loading: boolean;
	error: string | null;
	success: boolean;
}

export const useSendEmail = () => {
	const [state, setState] = useState<EmailState>({
		loading: false,
		error: null,
		success: false,
	});

	const sendEmail = async (options: UseEmailOptions) => {
		setState({ loading: true, error: null, success: false });

		try {
			const response = await fetch("/api/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(options),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to send email");
			}

			setState({ loading: false, error: null, success: true });
			return data;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to send email";
			setState({ loading: false, error: errorMessage, success: false });
			throw error;
		}
	};

	const reset = () => {
		setState({ loading: false, error: null, success: false });
	};

	return {
		...state,
		sendEmail,
		reset,
	};
};
