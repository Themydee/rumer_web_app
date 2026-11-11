import * as Yup from "yup";

export const strongRegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name is too long")
    .matches(/^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/, "Enter a valid first name")
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name is too long")
    .matches(/^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/, "Enter a valid last name")
    .required("Last name is required"),

  phoneNo: Yup.string()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/, "Enter a valid phone number")
    .required("Phone number is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email format is invalid")
    .required("Email is required"),

  password: Yup.string()
    .min(12, "Password must be at least 12 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Must contain at least one special character")
    .test("no-common-passwords", "Password is too common", (value) => {
      const commonPasswords = [
        "password",
        "123456",
        "qwerty",
        "admin",
        "welcome",
      ];
      return !commonPasswords.includes(value?.toLowerCase() || "");
    })
    .required("Password is required"),
});

export const emailLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const phoneLoginSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\+?[\d\s-]+$/, "Invalid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const OTPVerificationSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be 6 characters")
    .required("OTP is required"),
});
