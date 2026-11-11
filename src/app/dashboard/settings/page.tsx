"use client";
import React, { useEffect, useState } from "react";
import { Camera, CheckCircle2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/components/hooks";
import { authLogin, updateProfile } from "@/components/set-up/redux/children/auth";
import { toUserType, getKycTier } from "@/components/lib/user";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "../DashboardLayout";
import NotificationPreferences from "@/components/reusables/NotificationPreferences";

// ── Tab definitions ──────────────────────────────────────────────────────────
const SETTINGS_TABS = [
	"Profile",
	"Security",
	"Business Configuration",
	"Preferences",
	"Contract Setup",
	"Settlement Accounts",
	"Team",
] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number];

// ── Profile photo section ────────────────────────────────────────────────────
const ProfilePhotoSection = ({
	avatarUrl,
	initials,
}: {
	avatarUrl: string | null;
	initials: string;
}) => {
	const dispatch = useAppDispatch();
	const { profile } = useAppSelector((state) => state.auth);
	const [preview, setPreview] = useState<string | null>(avatarUrl);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setError("");
		// Show instant preview
		const reader = new FileReader();
		reader.onloadend = () => setPreview(reader.result as string);
		reader.readAsDataURL(file);

		// Upload to server
		setUploading(true);
		try {
			const token = localStorage.getItem("rumer_auth_token");
			if (!token) {
				setError("Not authenticated");
				setPreview(avatarUrl);
				return;
			}
			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("/api/auth/upload-avatar", {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
				body: formData,
			});

			const data = await res.json();
			if (!res.ok) {
				setError(data.error || "Upload failed");
				setPreview(avatarUrl); // revert preview
				return;
			}

			// Re-fetch user so user.profile_picture and profile are both up-to-date
			const meRes = await fetch("/api/auth/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (meRes.ok) {
				const meData = await meRes.json();
				const freshUser = meData.user;
				if (freshUser) {
					dispatch(authLogin({
						token,
						user: toUserType(freshUser),
					}));
					if (freshUser.profile) {
						dispatch(updateProfile({ profile: freshUser.profile }));
					}
				}
			}
		} catch {
			setError("Upload failed");
			setPreview(avatarUrl);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 pb-8 mb-8 border-b border-gray-100">
			<div className="flex-1 min-w-0">
				<h3 className="text-lg font-semibold text-gray-900 mb-1">Profile photo</h3>
				<p className="text-sm text-gray-500 mb-4">
					This image will be displayed on your profile
				</p>
				<label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-green-300 text-green-700 text-sm font-medium cursor-pointer hover:bg-green-50 transition-colors">
					<Camera size={16} />
					{uploading ? "Uploading..." : "Change Photo"}
					<input
						type="file"
						accept="image/jpeg,image/png,image/webp,image/gif"
						className="hidden"
						onChange={handleFileChange}
						disabled={uploading}
					/>
				</label>
				{error && <p className="mt-2 text-xs text-red-600">{error}</p>}
			</div>
			<div className="relative flex-shrink-0">
				{preview ? (
					<img
						src={preview}
						alt="Profile"
						className="w-28 h-28 rounded-full object-cover"
					/>
				) : (
					<div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-4xl font-bold text-gray-700">
						{initials}
					</div>
				)}
				<div className="absolute bottom-1 right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
					<CheckCircle2 size={14} className="text-white" />
				</div>
			</div>
		</div>
	);
};

// ── Personal information form ────────────────────────────────────────────────
const PersonalInformationForm = () => {
	const dispatch = useAppDispatch();
	const { user, profile } = useAppSelector((state) => state.auth);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [original, setOriginal] = useState({ firstName: "", lastName: "", username: "" });
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

	const email = user?.email ?? "";

	// Hydrate from Redux on mount
	useEffect(() => {
		const handle = (profile?.username || email.split("@")[0]) ?? "";
		const fn = user?.first_name ?? "";
		const ln = user?.last_name ?? "";
		const uname = handle ? `@${handle}` : "";
		setFirstName(fn);
		setLastName(ln);
		setUsername(uname);
		setOriginal({ firstName: fn, lastName: ln, username: uname });
	}, [user, profile, email]);

	// Live username availability check (debounced)
	useEffect(() => {
		const raw = username.replace(/^@/, "").trim();
		const originalRaw = original.username.replace(/^@/, "").trim();
		if (raw.length === 0 || raw === originalRaw) {
			setUsernameAvailable(null);
			return;
		}
		setUsernameAvailable(null);
		const timer = setTimeout(async () => {
			try {
				const token = localStorage.getItem("rumer_auth_token");
				const res = await fetch(
					`/api/auth/check-username?username=${encodeURIComponent(raw)}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				const data = await res.json();
				setUsernameAvailable(data.available);
			} catch {
				setUsernameAvailable(null);
			}
		}, 600);
		return () => clearTimeout(timer);
	}, [username, original.username]);

	const role = "Trader";

	// Detect unsaved changes vs. the hydrated original values
	const isDirty =
		firstName.trim() !== original.firstName ||
		lastName.trim() !== original.lastName ||
		username !== original.username;
	const canSave = isDirty && !saving && usernameAvailable !== false;

	const handleSave = async () => {
		if (!canSave) return;
		setSaving(true);
		setSaved(false);
		setSaveError("");
		try {
			const token = localStorage.getItem("rumer_auth_token");
			const res = await fetch("/api/auth/update-profile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					first_name: firstName.trim(),
					last_name: lastName.trim(),
					username: username.replace(/^@/, "").trim(),
				}),
			});
			const data = await res.json();
			if (res.ok) {
				setSaved(true);
				// Mark as clean so the button returns to disabled state
				setOriginal({
					firstName: firstName.trim(),
					lastName: lastName.trim(),
					username,
				});
				// Keep Redux profile in sync
				if (data.profile) {
					dispatch(updateProfile({ profile: data.profile }));
				}
			} else {
				setSaveError(data.error || "Failed to save changes");
			}
		} catch {
			setSaveError("Failed to save changes");
		} finally {
			setSaving(false);
			setTimeout(() => setSaved(false), 3000);
		}
	};

	return (
		<div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
			{/* Left column: heading + save */}
			<div className="flex-shrink-0 lg:w-56">
				<h3 className="text-lg font-semibold text-gray-900 mb-1">
					Personal Information
				</h3>
				<p className="text-sm text-gray-500 mb-6">
					Update your personal details here.
				</p>

				{saveError && <p className="mb-4 text-sm text-red-600">{saveError}</p>}

				<button
					onClick={handleSave}
					disabled={!canSave}
					className={`px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${
						canSave
							? "bg-[#063d2e] text-white hover:bg-[#0a5c44] cursor-pointer"
							: "bg-gray-200 text-gray-400 cursor-not-allowed"
					}`}
				>
					{saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
				</button>
			</div>

			{/* Right column: form fields */}
			<div className="flex-1 min-w-0">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
					{/* First name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							First name
						</label>
						<input
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="Enter first name"
							className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#063d2e] focus:border-transparent"
						/>
					</div>
					{/* Last name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Last name
						</label>
						<input
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							placeholder="Enter last name"
							className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#063d2e] focus:border-transparent"
						/>
					</div>
				</div>

				{/* Email (disabled) */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Email address
					</label>
					<input
						type="email"
						value={email}
						disabled
						className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
					/>
				</div>

				{/* Username */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Username
					</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="@username"
						className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#063d2e] focus:border-transparent"
					/>
					{usernameAvailable === true && (
						<p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
							<CheckCircle2 size={12} />
							This username is available
						</p>
					)}
					{usernameAvailable === false && (
						<p className="mt-1.5 text-xs text-red-600">
							This username is already taken
						</p>
					)}
				</div>

				{/* Role (readonly) */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Role
					</label>
					<input
						type="text"
						value={role}
						disabled
						className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
					/>
				</div>

				{/* KYC Tier Overview */}
				<div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-2">
							<Shield className="w-5 h-5 text-[#063d2e]" />
							<span className="font-semibold text-gray-900">Verification Level</span>
						</div>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#063d2e]/10 text-[#063d2e] uppercase">
							{getKycTier(user).replace("_", " ")}
						</span>
					</div>
					<p className="text-xs text-gray-600 mb-4">
						{getKycTier(user) === "tier_0" && "Basic Account: Can browse and onboard animals to inventory. Payments and marketplace sales are locked."}
						{getKycTier(user) === "tier_1" && "Verified Individual: BVN and ID verified. Can list animals on marketplace and join cooperatives."}
						{getKycTier(user) === "tier_2" && "Cooperative Level: CAC and constitution verified. Unlocks aggregated order payouts and member distribution."}
						{getKycTier(user) === "tier_3" && "Registered Business: Full unrestricted trading, enterprise direct payments, and export supply eligibility."}
					</p>
					<div className="flex flex-wrap gap-2">
						{getKycTier(user) === "tier_0" && (
							<a
								href="/kyc"
								className="px-4 py-2 bg-[#063d2e] text-white rounded-xl text-xs font-medium hover:bg-[#0a5c44] transition"
							>
								Upgrade to Tier 1 (Verify ID)
							</a>
						)}
						{getKycTier(user) === "tier_1" && (
							<>
								<a
									href="/cooperative-verification"
									className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition"
								>
									Verify Cooperative (Tier 2)
								</a>
								<a
									href="/business-verification"
									className="px-3 py-1.5 bg-[#063d2e] text-white rounded-lg text-xs font-medium hover:bg-[#0a5c44] transition"
								>
									Verify Business (Tier 3)
								</a>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

// ── Main settings page ───────────────────────────────────────────────────────
const SettingsPage = () => {
	const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");
	const router = useRouter();
	const { user, profile } = useAppSelector((state) => state.auth);

	const userName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<AuthGuard>
			<DashboardLayout>
				<div className="px-4 py-6 sm:px-8 max-w-5xl">
					{/* Breadcrumb */}
					<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
						<button
							onClick={() => router.back()}
							className="flex items-center gap-1 text-gray-600 hover:text-gray-900 cursor-pointer"
						>
							Go Back
						</button>
						<span>/</span>
						<button
							onClick={() => router.push("/dashboard")}
							className="text-gray-600 hover:text-gray-900 cursor-pointer"
						>
							Dashboard
						</button>
						<span>/</span>
						<span className="text-gray-900 font-medium">Settings</span>
					</div>

					{/* Title */}
					<h1 className="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
					<p className="text-gray-500 mb-8">
						Take a look at your policies and the new policy to see what is covered
					</p>

					{/* Tabs */}
					<div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
						{SETTINGS_TABS.map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
									activeTab === tab
										? "border-gray-900 text-gray-900"
										: "border-transparent text-gray-500 hover:text-gray-700"
								}`}
							>
								{tab}
							</button>
						))}
					</div>

					{/* Tab content */}
					{activeTab === "Profile" && (
						<div className="bg-white border border-gray-100 rounded-2xl p-8">
							<ProfilePhotoSection avatarUrl={user?.profile_picture ?? null} initials={initials || "U"} />
							<PersonalInformationForm />
						</div>
					)}

					{activeTab === "Preferences" && (
						<div className="bg-white border border-gray-100 rounded-2xl p-8">
							<NotificationPreferences />
						</div>
					)}

					{activeTab !== "Profile" && activeTab !== "Preferences" && (
						<div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400">
							{activeTab} settings coming soon.
						</div>
					)}
				</div>
			</DashboardLayout>
		</AuthGuard>
	);
};

export default SettingsPage;
