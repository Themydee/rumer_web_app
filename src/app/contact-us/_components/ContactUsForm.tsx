"use client";
import { FormikProvider, useFormik, Form } from "formik";
import { ImSpinner2 } from "react-icons/im";
import { contactSchema } from "@/components/Models/FormInput";

// Define the form values interface
interface ContactFormValues {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	message: string;
}

// Initial values for the form
const initialValues: ContactFormValues = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	message: "",
};

// Validation schema using Yup

const ContactUsForm = () => {
	// Initialize Formik
	const formik = useFormik({
		initialValues,
		validationSchema: contactSchema,
		onSubmit: async (values) => {
			//   submitContactMutation.mutate(values);
		},
	});

	// Helper function to get error message for a field
	const getFieldError = (fieldName: keyof ContactFormValues) => {
		const touched = formik.touched[fieldName];
		const error = formik.errors[fieldName];
		return touched && error ? error : null;
	};

	// Helper function to get input classes with error state
	const getInputClasses = (fieldName: keyof ContactFormValues) => {
		const baseClasses =
			"w-full px-5 py-4 bg-gray-100 rounded-xl focus:outline-none transition";
		const errorClasses = getFieldError(fieldName)
			? "focus:ring-2 focus:ring-red-500/50 border border-red-300"
			: "focus:ring-2 focus:ring-[#D4A574]/50";
		return `${baseClasses} ${errorClasses}`;
	};

	return (
		<FormikProvider value={formik}>
			<Form className='space-y-6'>
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-[#3C2818] text-sm font-medium mb-2'>
							First Name
						</label>
						<input
							type='text'
							placeholder='e.g. John'
							className={getInputClasses("firstName")}
							{...formik.getFieldProps("firstName")}
						/>
						{getFieldError("firstName") && (
							<p className='mt-1 text-sm text-red-500'>
								{getFieldError("firstName")}
							</p>
						)}
					</div>

					<div>
						<label className='block text-[#3C2818] text-sm font-medium mb-2'>
							Last Name
						</label>
						<input
							type='text'
							placeholder='e.g. Francisco'
							className={getInputClasses("lastName")}
							{...formik.getFieldProps("lastName")}
						/>
						{getFieldError("lastName") && (
							<p className='mt-1 text-sm text-red-500'>
								{getFieldError("lastName")}
							</p>
						)}
					</div>
				</div>

				<div>
					<label className='block text-[#3C2818] text-sm font-medium mb-2'>
						Email
					</label>
					<input
						type='email'
						placeholder='e.g. john.frans@gmail.com'
						className={getInputClasses("email")}
						{...formik.getFieldProps("email")}
					/>
					{getFieldError("email") && (
						<p className='mt-1 text-sm text-red-500'>
							{getFieldError("email")}
						</p>
					)}
				</div>

				<div>
					<label className='block text-[#3C2818] text-sm font-medium mb-2'>
						Phone Number
					</label>
					<input
						type='tel'
						placeholder='Enter Phone Number'
						className={getInputClasses("phone")}
						{...formik.getFieldProps("phone")}
					/>
					{getFieldError("phone") && (
						<p className='mt-1 text-sm text-red-500'>
							{getFieldError("phone")}
						</p>
					)}
				</div>

				<div>
					<label className='block text-[#3C2818] text-sm font-medium mb-2'>
						How can we help you?
					</label>
					<textarea
						rows={5}
						placeholder='Enter How can we help you?'
						className={`${getInputClasses("message")} resize-none`}
						{...formik.getFieldProps("message")}
					/>
					{getFieldError("message") && (
						<p className='mt-1 text-sm text-red-500'>
							{getFieldError("message")}
						</p>
					)}
					<div className='mt-1 text-xs text-gray-500 text-right'>
						{formik.values.message.length}/1000 characters
					</div>
				</div>

				<button
					type='submit'
					className='w-full py-5 bg-[#D4A574] hover:bg-[#C19A6B] text-white font-bold text-lg lg:text-xl rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-xl flex items-center justify-center gap-2'
				>
					Submit
				</button>
			</Form>
		</FormikProvider>
	);
};

export default ContactUsForm;
