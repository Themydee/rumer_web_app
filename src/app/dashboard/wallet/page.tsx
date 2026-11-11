"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
	ArrowLeft,
	ChevronDown,
	Download,
	Eye,
	MoreHorizontal,
	Receipt,
	Search,
	Settings,
	Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/components/hooks";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "../DashboardLayout";
import { getBankAccounts, addBankAccount } from "@/components/lib/supabase/auth";
import type { BankAccount } from "@/components/lib/supabase/database.types";

// ── Static data ──────────────────────────────────────────────────────────────
const BANKS = [
	"Access Bank",
	"Citibank Nigeria",
	"Ecobank Nigeria",
	"Fidelity Bank Nigeria",
	"First Bank of Nigeria",
	"First City Monument Bank",
	"GTCO (GTBank)",
	"Heritage Bank",
	"Keystone Bank",
	"Opay",
	"Polaris Bank",
	"Providus Bank",
	"Stanbic IBTC Bank",
	"Standard Chartered Bank",
	"Sterling Bank",
	"SunTrust Bank",
	"Titan Trust Bank",
	"Union Bank of Nigeria",
	"United Bank for Africa (UBA)",
	"Unity Bank",
	"Wema Bank",
	"Zenith Bank",
];

interface BankAccountVM {
	id: string;
	name: string;
	last4: string;
	isPrimary: boolean;
}

function toVM(acc: BankAccount): BankAccountVM {
	const digits = acc.account_number.replace(/\D/g, "");
	return {
		id: acc.id,
		name: acc.bank_name,
		last4: digits.slice(-4).padStart(4, "0"),
		isPrimary: acc.is_primary,
	};
}

const TRANSACTION_TYPES = ["Credit", "Withdrawal", "Escrow Hold", "Refund", "Fee"] as const;

const TIME_FILTERS = [
	{ value: "all", label: "All Time" },
	{ value: "7d", label: "Last 7 Days" },
	{ value: "30d", label: "Last 30 Days" },
	{ value: "90d", label: "Last 90 Days" },
] as const;

const TRANSACTIONS: Array<{
	id: string;
	type: string;
	typeColor: string;
	desc: string;
	sub: string;
	price: string;
	status: string;
	statusColor: string;
	date: string;
	createdAt: string;
}> = [];

// ── Helper components ────────────────────────────────────────────────────────
const ActionButton = ({ icon: Icon, label, onClick, active }: { icon: any; label: string; onClick?: () => void; active?: boolean }) => (
	<button
		onClick={onClick}
		className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
			active
				? "bg-[#063d2e] text-white border-[#063d2e]"
				: "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
		}`}
	>
		<Icon size={16} />
		{label}
	</button>
);

const PillTab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
	<button
		onClick={onClick}
		className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
			active ? "bg-[#063d2e] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
		}`}
	>
		{label}
	</button>
);

// ── Balance cards ────────────────────────────────────────────────────────────
const BalanceCards = () => (
	<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
		<div className="bg-gradient-to-br from-[#063d2e] to-[#0a5c44] rounded-2xl p-6 text-white relative overflow-hidden">
			<p className="text-sm text-green-200 mb-1">Total Wallet Balance</p>
			<p className="text-3xl font-bold">₦0.00</p>
			<p className="text-xs text-green-200 mt-2">✓ Your funds are secured and insured.</p>
			<div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
				<Eye size={18} />
			</div>
		</div>
		<div className="bg-white border border-gray-100 rounded-2xl p-6">
			<div className="flex items-center justify-between mb-1">
				<p className="text-sm text-gray-500">Available Balance</p>
				<div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
					<Eye size={14} className="text-emerald-600" />
				</div>
			</div>
			<div className="flex items-baseline gap-2">
				<p className="text-3xl font-bold">₦0.00</p>
			</div>
			<p className="text-xs text-gray-400 mt-1">Ready to withdraw or use for purchases</p>
			<div className="mt-3 flex items-center gap-2">
				<div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
					<div className="h-full bg-emerald-400 rounded-full" style={{ width: "0%" }} />
				</div>
				<span className="text-xs text-gray-400">0%</span>
			</div>
		</div>
		<div className="bg-white border border-gray-100 rounded-2xl p-6">
			<div className="flex items-center justify-between mb-1">
				<p className="text-sm text-gray-500">In Escrow</p>
				<div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
					<Receipt size={14} className="text-amber-600" />
				</div>
			</div>
			<div className="flex items-baseline gap-2">
				<p className="text-3xl font-bold">₦0.00</p>
			</div>
			<p className="text-xs text-gray-400 mt-1">Funds held for ongoing transactions</p>
			<div className="mt-3 flex items-center gap-2">
				<div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
					<div className="h-full bg-amber-400 rounded-full" style={{ width: "0%" }} />
				</div>
				<span className="text-xs text-gray-400">0%</span>
			</div>
		</div>
	</div>
);

// ── Linked bank accounts ─────────────────────────────────────────────────────
const LinkedBankAccounts = ({
	accounts,
	loading,
	onAddAccount,
}: {
	accounts: BankAccountVM[];
	loading?: boolean;
	onAddAccount: () => void;
}) => (
	<div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
		<div className="flex items-center justify-between mb-4">
			<h3 className="font-semibold text-gray-900">Linked Bank Accounts</h3>
			<button onClick={onAddAccount} className="text-sm text-[#063d2e] font-medium hover:underline">
				+ Add Account
			</button>
		</div>
		{loading ? (
			<p className="text-sm text-gray-400 py-3">Loading accounts...</p>
		) : accounts.length === 0 ? (
			<p className="text-sm text-gray-400 py-3">No bank accounts linked yet.</p>
		) : (
			accounts.map((acc) => (
				<div key={acc.id} className="flex items-center justify-between py-3 border-t border-gray-50 first:border-0">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
							<Wallet size={14} className="text-emerald-600" />
						</div>
						<div>
							<p className="font-medium text-gray-900 text-sm">{acc.name}</p>
							<p className="text-xs text-gray-500">Account Ending in ****{acc.last4}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						{acc.isPrimary && (
							<span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium">Primary</span>
						)}
						<button className="text-gray-400 hover:text-gray-600">
							<MoreHorizontal size={18} />
						</button>
					</div>
				</div>
			))
		)}
	</div>
);

// ── Transaction history ──────────────────────────────────────────────────────
const TransactionHistory = () => {
	const [typeFilter, setTypeFilter] = useState<string>("all");
	const [timeFilter, setTimeFilter] = useState<string>("all");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const pageSize = 5;

	const filtered = useMemo(() => {
		const now = Date.now();
		const dayMs = 86400000;
		const days = timeFilter === "7d" ? 7 : timeFilter === "30d" ? 30 : timeFilter === "90d" ? 90 : Infinity;
		const cutoff = days === Infinity ? -Infinity : now - days * dayMs;
		const q = search.trim().toLowerCase();

		return TRANSACTIONS.filter((t) => {
			if (typeFilter !== "all" && t.type !== typeFilter) return false;
			if (timeFilter !== "all" && new Date(t.createdAt).getTime() < cutoff) return false;
			if (q) {
				const haystack = `${t.id} ${t.type} ${t.desc} ${t.sub}`.toLowerCase();
				if (!haystack.includes(q)) return false;
			}
			return true;
		});
	}, [typeFilter, timeFilter, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	// Reset to first page whenever the result set changes
	useEffect(() => {
		setPage(1);
	}, [typeFilter, timeFilter, search]);

	return (
		<div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
			<div className="p-6">
				<h3 className="font-semibold text-gray-900 mb-4">Transaction History</h3>

				<div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-3 mb-4">
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
						<div className="relative">
							<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search transactions"
								className="pl-9 pr-3 py-2 border border-gray-250 rounded-lg text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-[#063d2e]"
							/>
						</div>
						<div className="relative">
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value)}
								className="appearance-none pl-3 pr-8 py-2 border border-gray-250 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#063d2e]"
							>
								<option value="all">All Types</option>
								{TRANSACTION_TYPES.map((t) => (
									<option key={t} value={t}>{t}</option>
								))}
							</select>
							<ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
						</div>
					</div>
					<div className="relative">
						<select
							value={timeFilter}
							onChange={(e) => setTimeFilter(e.target.value)}
							className="appearance-none pl-3 pr-8 py-2 border border-gray-250 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#063d2e]"
						>
							{TIME_FILTERS.map((t) => (
								<option key={t.value} value={t.value}>{t.label}</option>
							))}
						</select>
						<ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm min-w-[800px]">
						<thead>
							<tr className="border-b border-gray-100">
								<th className="pb-3 text-left">
									<div className="w-5 h-5 rounded border-2 border-[#063d2e] bg-[#063d2e] flex items-center justify-center">
										<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
									</div>
								</th>
								<th className="pb-3 text-left font-medium text-gray-500">Transaction ID</th>
								<th className="pb-3 text-left font-medium text-gray-500">Type</th>
								<th className="pb-3 text-left font-medium text-gray-500">Description</th>
								<th className="pb-3 text-left font-medium text-gray-500">Price</th>
								<th className="pb-3 text-left font-medium text-gray-500">Status</th>
								<th className="pb-3 text-left font-medium text-gray-500">Date Created</th>
								<th className="pb-3 text-left font-medium text-gray-500">Action</th>
							</tr>
						</thead>
						<tbody>
							{pageItems.length === 0 ? (
								<tr>
									<td colSpan={8} className="py-10 text-center text-gray-400">
										No transactions found.
									</td>
								</tr>
							) : (
								pageItems.map((txn, i) => (
									<tr key={`${txn.id}-${i}`} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
										<td className="py-3">
											<div className="w-5 h-5 rounded border-2 border-gray-200" />
										</td>
										<td className="py-3">
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
												<span className="font-medium text-gray-900">{txn.id}</span>
											</div>
										</td>
										<td className="py-3">
											<span className={`text-sm font-medium ${txn.typeColor}`}>
												{txn.type === "Credit" && "↓ "}
												{txn.type === "Withdrawal" && "↑ "}
												{txn.type}
											</span>
										</td>
										<td className="py-3">
											<p className="font-medium text-gray-900">{txn.desc}</p>
											<p className="text-xs text-gray-400">{txn.sub}</p>
										</td>
										<td className="py-3 font-medium text-gray-900">{txn.price}</td>
										<td className="py-3">
											<span className={`text-xs font-medium px-2 py-1 rounded-full ${txn.statusColor}`}>
												{txn.status}
											</span>
										</td>
										<td className="py-3 text-gray-500">{txn.date}</td>
										<td className="py-3">
											<button className="text-gray-400 hover:text-gray-600">
												<MoreHorizontal size={18} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
					<p className="text-xs text-gray-400">
						Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
						{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
					</p>
					<div className="flex items-center gap-1">
						<button
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={currentPage <= 1}
							className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
						>
							&lt;
						</button>
						{Array.from({ length: totalPages }, (_, n) => n + 1).map((n) => (
							<button
								key={n}
								onClick={() => setPage(n)}
								className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${
									n === currentPage ? "bg-[#063d2e] text-white" : "text-gray-600 hover:bg-gray-100"
								}`}
							>
								{n}
							</button>
						))}
						<button
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage >= totalPages}
							className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
						>
							&gt;
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

// ── Add Bank Account (inline) ────────────────────────────────────────────────
const AddBankAccountInline = ({
	onBack,
	onSubmit,
}: {
	onBack: () => void;
	onSubmit: (input: {
		bankName: string;
		accountNumber: string;
		accountName: string;
	}) => Promise<{ success: boolean; error?: string }>;
}) => {
	const [bankName, setBankName] = useState("");
	const [accountNumber, setAccountNumber] = useState("");
	const [accountHolder, setAccountHolder] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async () => {
		setError("");
		if (!bankName) {
			setError("Please select a bank.");
			return;
		}
		if (accountNumber.length < 10) {
			setError("Account number must be 10 digits.");
			return;
		}
		if (!accountHolder.trim()) {
			setError("Please enter the account holder name.");
			return;
		}

		setSubmitting(true);
		const res = await onSubmit({
			bankName,
			accountNumber,
			accountName: accountHolder.trim(),
		});
		setSubmitting(false);

		if (!res.success) {
			setError(res.error || "Failed to add account.");
			return;
		}
		onBack();
	};

	return (
		<div>
			<button onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-900">
				<ArrowLeft size={20} />
			</button>
			<h3 className="text-xl font-bold text-gray-900 mb-1">Add Bank Account</h3>
			<p className="text-gray-500 mb-6 text-sm">Bank Account for Payments</p>

			<div className="space-y-4 max-w-lg">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Name</label>
					<div className="relative">
						<select
							value={bankName}
							onChange={(e) => setBankName(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-gray-50 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#063d2e] focus:border-transparent"
						>
							<option value="">Select Bank Name</option>
							{BANKS.map((b) => (
								<option key={b} value={b}>{b}</option>
							))}
						</select>
						<ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between mb-1.5">
						<label className="text-sm font-medium text-gray-700">Account Number</label>
						<span className="text-xs text-gray-400">{accountNumber.length}/10 digits</span>
					</div>
					<input
						type="text"
						value={accountNumber}
						onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
						placeholder="Enter Account Number"
						className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#063d2e] focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1.5">Account Holder Name</label>
					<input
						type="text"
						value={accountHolder}
						onChange={(e) => setAccountHolder(e.target.value)}
						placeholder="Enter Account Holder Name"
						className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#063d2e] focus:border-transparent"
					/>
				</div>

				{error && <p className="text-sm text-red-600">{error}</p>}

				<button
					onClick={handleSubmit}
					disabled={submitting}
					className="w-full py-3 rounded-xl bg-[#063d2e] text-white font-semibold hover:bg-[#0a5c44] transition-colors mt-2 disabled:opacity-60"
				>
					{submitting ? "Saving..." : "Add Bank Account"}
				</button>
			</div>
		</div>
	);
};

// ── Overview view ────────────────────────────────────────────────────────────
const WalletOverview = () => {
	const [activePill, setActivePill] = useState<"withdraw" | "manage" | "history" | "export">("history");
	const [showAddForm, setShowAddForm] = useState(false);
	const [accounts, setAccounts] = useState<BankAccountVM[]>([]);
	const [loadingAccounts, setLoadingAccounts] = useState(true);

	const loadAccounts = async () => {
		setLoadingAccounts(true);
		const res = await getBankAccounts();
		if (res.success) {
			setAccounts((res.accounts ?? []).map(toVM));
		}
		setLoadingAccounts(false);
	};

	useEffect(() => {
		loadAccounts();
	}, []);

	const handleAddAccount = async (input: {
		bankName: string;
		accountNumber: string;
		accountName: string;
	}) => {
		const res = await addBankAccount(input);
		if (!res.success) {
			return { success: false, error: res.error };
		}
		await loadAccounts();
		return { success: true };
	};

	return (
		<div>
			<BalanceCards />

			<div className="flex flex-wrap gap-3 mb-6">
				<ActionButton icon={Download} label="Withdraw Funds" active={activePill === "withdraw"} onClick={() => { setActivePill("withdraw"); setShowAddForm(false); }} />
				<ActionButton icon={Settings} label="Manage Bank Accounts" active={activePill === "manage"} onClick={() => { setActivePill("manage"); setShowAddForm(false); }} />
				<ActionButton icon={Receipt} label="Transaction History" active={activePill === "history"} onClick={() => { setActivePill("history"); setShowAddForm(false); }} />
				<ActionButton icon={Download} label="Export Statement" active={activePill === "export"} onClick={() => { setActivePill("export"); setShowAddForm(false); }} />
			</div>

			{activePill === "withdraw" && (
				<div className="bg-white border border-gray-100 rounded-2xl p-6">
					<WithdrawFundsInline accounts={accounts} onBack={() => setActivePill("history")} />
				</div>
			)}
			{activePill === "manage" && !showAddForm && (
				<LinkedBankAccounts
					accounts={accounts}
					loading={loadingAccounts}
					onAddAccount={() => setShowAddForm(true)}
				/>
			)}
			{activePill === "manage" && showAddForm && (
				<div className="bg-white border border-gray-100 rounded-2xl p-6">
					<AddBankAccountInline
						onBack={() => setShowAddForm(false)}
						onSubmit={handleAddAccount}
					/>
				</div>
			)}
			{activePill === "history" && <TransactionHistory />}
			{activePill === "export" && (
				<div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-500">
					Export statement coming soon.
				</div>
			)}
		</div>
	);
};

// ── Withdraw Funds (inline) ──────────────────────────────────────────────────
const WithdrawFundsInline = ({
	accounts,
	onBack,
}: {
	accounts: BankAccountVM[];
	onBack: () => void;
}) => {
	const [step, setStep] = useState<"form" | "confirm">("form");
	const [amount, setAmount] = useState("");
	const [selectedAccount, setSelectedAccount] = useState("");

	const maskedAmount = amount ? `₦${Number(amount.replace(/\D/g, "")).toLocaleString()}.00` : "";
	const selected = accounts.find((a) => a.id === selectedAccount);

	return (
		<div>
			<button onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-900">
				<ArrowLeft size={20} />
			</button>
			<h3 className="text-xl font-bold text-gray-900 mb-1">Withdraw Funds</h3>

			{step === "form" ? (
				<>
					<p className="text-gray-500 mb-6 text-sm">Bank Account for Payments</p>
					<div className="space-y-4 max-w-lg">
						<div>
						<div className="flex items-center justify-between mb-1.5">
							<label className="text-sm font-medium text-gray-700">Amount</label>
							<span className="text-xs text-gray-500">Available: ₦0.00</span>
						</div>
							<div className="relative">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₦</span>
								<input
									type="text"
									value={amount}
									onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
									placeholder="Enter Amount"
									className="w-full pl-8 pr-16 py-3 rounded-xl border border-gray-250 bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#063d2e] focus:border-transparent"
								/>
								<span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">(NGN)</span>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">Select Bank Account</label>
							<div className="relative">
								<select
									value={selectedAccount}
									onChange={(e) => setSelectedAccount(e.target.value)}
									className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-gray-50 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#063d2e] focus:border-transparent"
								>
									<option value="">Select Bank Account</option>
									{accounts.map((acc) => (
										<option key={acc.id} value={acc.id.toString()}>
											{acc.name} - ****{acc.last4}
										</option>
									))}
								</select>
								<ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
							</div>
						</div>

						<button
							onClick={() => setStep("confirm")}
							className="w-full py-3 rounded-xl bg-[#063d2e] text-white font-semibold hover:bg-[#0a5c44] transition-colors mt-2"
						>
							Continue
						</button>
					</div>
				</>
			) : (
				<>
					<div className="mt-6 space-y-4 max-w-lg">
						<div className="flex items-center justify-between py-4 border-b border-gray-100">
							<span className="text-gray-500">Amount</span>
							<span className="font-semibold text-gray-900">{maskedAmount}</span>
						</div>
						<div className="flex items-center justify-between py-4 border-b border-gray-100">
							<span className="text-gray-500">To</span>
							<span className="font-semibold text-gray-900">{selected?.name ?? "—"}</span>
						</div>
						<div className="flex items-center justify-between py-4 border-b border-gray-100">
							<span className="text-gray-500">Account</span>
							<span className="font-semibold text-gray-900">
								•••• {selected?.last4 ?? "----"}
							</span>
						</div>
					</div>

					<div className="flex gap-4 mt-6 max-w-lg">
						<button
							onClick={() => setStep("form")}
							className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
						>
							Back
						</button>
						<button className="flex-1 py-3 rounded-xl bg-[#063d2e] text-white font-semibold hover:bg-[#0a5c44] transition-colors">
							Continue
						</button>
					</div>
				</>
			)}
		</div>
	);
};

// ── Main page ────────────────────────────────────────────────────────────────
const WalletPage = () => {
	const router = useRouter();
	const { user } = useAppSelector((state) => state.auth);

	return (
		<AuthGuard>
			<DashboardLayout>
				<div className="px-4 py-6 sm:px-8">
					{/* Breadcrumb */}
					<div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
						<button
							onClick={() => router.back()}
							className="flex items-center gap-1 text-gray-600 hover:text-gray-900 cursor-pointer"
						>
							<ArrowLeft size={14} />
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
						<span className="text-gray-900 font-medium">Wallet</span>
					</div>

					{/* Title */}
					<h1 className="text-3xl font-bold text-gray-900 mb-1">Wallets</h1>
					<p className="text-gray-500 mb-8">Manage your earnings and withdrawals</p>

					<WalletOverview />
				</div>
			</DashboardLayout>
		</AuthGuard>
	);
};

export default WalletPage;
