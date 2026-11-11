import * as Yup from "yup";

export const contactSchema = Yup.object({
	firstName: Yup.string()
		.required("First name is required")
		.min(2, "First name must be at least 2 characters")
		.max(50, "First name is too long"),
	lastName: Yup.string()
		.required("Last name is required")
		.min(2, "Last name must be at least 2 characters")
		.max(50, "Last name is too long"),
	email: Yup.string()
		.required("Email is required")
		.email("Please enter a valid email address"),
	phone: Yup.string()
		.required("Phone number is required")
		.matches(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
		.min(10, "Phone number must be at least 10 digits")
		.max(15, "Phone number is too long"),
	message: Yup.string()
		.required("Message is required")
		.min(10, "Message must be at least 10 characters")
		.max(1000, "Message is too long"),
});
