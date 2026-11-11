import { Profile, BankAccount, Product } from "./database.types";

interface AuthResponse {
	success: boolean;
	error?: string;
	token?: string;
	userId?: string;
	message?: string;
	user?: {
		id: string;
		email: string;
		isEmailVerified: boolean;
		profile: Profile | null;
	};
}

// Store token in localStorage
function setToken(token: string) {
	if (typeof window !== "undefined") {
		localStorage.setItem("rumer_auth_token", token);
	}
}

// Get token from localStorage
export function getToken(): string | null {
	if (typeof window !== "undefined") {
		return localStorage.getItem("rumer_auth_token");
	}
	return null;
}

// Remove token from localStorage
function removeToken() {
	if (typeof window !== "undefined") {
		localStorage.removeItem("rumer_auth_token");
	}
}

// Sign up with email and password
export async function signUp(
	email: string,
	password: string,
	firstName: string,
	lastName: string,
	phone?: string
): Promise<AuthResponse> {
	try {
		const response = await fetch("/api/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password, firstName, lastName, phone }),
		});

		const data = await response.json();

		if (!response.ok) {
			return { success: false, error: data.error || "Signup failed" };
		}

		if (data.token) {
			setToken(data.token);
		}

		return {
			success: true,
			token: data.token,
			userId: data.userId,
			message: data.message,
		};
	} catch (error) {
		return { success: false, error: "Network error" };
	}
}

// Sign in with email and password
export async function signIn(
	email: string,
	password: string
): Promise<AuthResponse> {
	try {
		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (!response.ok) {
			return { success: false, error: data.error || "Login failed" };
		}

		if (data.token) {
			setToken(data.token);
		}

		return {
			success: true,
			token: data.token,
			user: data.user,
		};
	} catch (error) {
		return { success: false, error: "Network error" };
	}
}

// Sign out
export async function signOut(): Promise<void> {
	try {
		const token = getToken();
		if (token) {
			await fetch("/api/auth/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
		}
	} finally {
		removeToken();
	}
}

// Get current user
export async function getCurrentUser(): Promise<{
	id: string;
	email: string;
	isEmailVerified: boolean;
	profile: Profile | null;
} | null> {
	try {
		const token = getToken();
		if (!token) return null;

		const response = await fetch("/api/auth/me", {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (response.status === 401) {
			removeToken();
			return null;
		}

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return data.user;
	} catch {
		return null;
	}
}

// Verify email with OTP
export async function verifyEmail(
	code: string,
	email: string
): Promise<AuthResponse> {
	try {
		const response = await fetch("/api/auth/verify-email", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ code, email }),
		});

		const data = await response.json();

		if (!response.ok) {
			return { success: false, error: data.error || "Verification failed" };
		}

		if (data.token) {
			setToken(data.token);
		}

		return { success: true, token: data.token, message: data.message };
	} catch (error) {
		return { success: false, error: "Network error" };
	}
}

// Resend verification code
export async function resendVerificationCode(
	email: string
): Promise<AuthResponse> {
	try {
		const response = await fetch("/api/auth/resend-code", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email }),
		});

		const data = await response.json();

		if (!response.ok) {
			return { success: false, error: data.error || "Failed to resend code" };
		}

		return { success: true, message: data.message };
	} catch (error) {
		return { success: false, error: "Network error" };
	}
}

// Forgot password - send reset code
export async function forgotPassword(email: string): Promise<AuthResponse> {
	try {
		const response = await fetch("/api/auth/forgot-password", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email }),
		});

		const data = await response.json();

		if (!response.ok) {
			return { success: false, error: data.error || "Failed to send reset code" };
		}

		return { success: true, message: data.message };
	} catch (error) {
		return { success: false, error: "Network error" };
	}
}

// Reset password with code
export async function resetPassword(
	email: string,
	code: string,
	newPassword: string
): Promise<AuthResponse> {
	try {
		const response = await fetch("/api/auth/reset-password", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, code, newPassword }),
		});

		const data = await response.json();

		if (!response.ok) {
			return { success: false, error: data.error || "Password reset failed" };
		}

		if (data.token) {
			setToken(data.token);
		}

		return { success: true, token: data.token, message: data.message };
	} catch (error) {
		return { success: false, error: "Network error" };
	}
}

// Change password (requires current password)
export async function changePassword(
	currentPassword: string,
	newPassword: string
): Promise<AuthResponse> {
	try {
		const token = getToken();
		if (!token) {
			return { success: false, error: "Not authenticated" };
		}

		const response = await fetch("/api/auth/change-password", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ currentPassword, newPassword }),
		});

		const data = await response.json();

		if (!response.ok) {
			return { success: false, error: data.error || "Password change failed" };
		}

		return { success: true, message: data.message };
	} catch (error) {
		return { success: false, error: "Network error" };
	}
}

// Fetch current user's linked bank accounts
export async function getBankAccounts(): Promise<{
	success: boolean;
	accounts?: BankAccount[];
	error?: string;
}> {
	try {
		const token = getToken();
		if (!token) return { success: false, error: "Not authenticated" };

		const response = await fetch("/api/bank-accounts", {
			headers: { Authorization: `Bearer ${token}` },
		});

		const data = await response.json();
		if (!response.ok) {
			return { success: false, error: data.error || "Failed to load accounts" };
		}

		return { success: true, accounts: data.accounts };
	} catch {
		return { success: false, error: "Network error" };
	}
}

// Add a bank account to the current user's profile
export async function addBankAccount(input: {
	bankName: string;
	accountNumber: string;
	accountName: string;
}): Promise<{ success: boolean; account?: BankAccount; error?: string }> {
	try {
		const token = getToken();
		if (!token) return { success: false, error: "Not authenticated" };

		const response = await fetch("/api/bank-accounts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(input),
		});

		const data = await response.json();
		if (!response.ok) {
			return { success: false, error: data.error || "Failed to add account" };
		}

		return { success: true, account: data.account };
	} catch {
		return { success: false, error: "Network error" };
	}
}

// Create a new product
export async function createProduct(input: {
	productType: string;
	listingType?: string;
	productName: string;
	livestockType?: string;
	cutType?: string;
	processedCutType?: string;
	age?: string;
	unitSize?: string;
	unitMeasure?: string;
	storageType?: string;
	hsCode?: string;
	basePrice: string;
	description?: string;
}): Promise<{ success: boolean; product?: Product; error?: string }> {
	try {
		const token = getToken();
		if (!token) return { success: false, error: "Not authenticated" };

		const response = await fetch("/api/products", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(input),
		});

		const data = await response.json();
		if (!response.ok) {
			return { success: false, error: data.error || "Failed to create product" };
		}

		return { success: true, product: data.product };
	} catch {
		return { success: false, error: "Network error" };
	}
}

// Fetch current user's products
export async function getProducts(status?: string): Promise<{
	success: boolean;
	products?: Product[];
	error?: string;
}> {
	try {
		const token = getToken();
		if (!token) return { success: false, error: "Not authenticated" };

		const url = status ? `/api/products?status=${status}` : "/api/products";
		const response = await fetch(url, {
			headers: { Authorization: `Bearer ${token}` },
		});

		const data = await response.json();
		if (!response.ok) {
			return { success: false, error: data.error || "Failed to load products" };
		}

		return { success: true, products: data.products };
	} catch {
		return { success: false, error: "Network error" };
	}
}
