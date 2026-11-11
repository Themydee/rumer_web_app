import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";

export async function GET(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json(
				{ error: "Authorization token required" },
				{ status: 401 }
			);
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		const userId = payload.userId;

		const { data, error } = await supabaseAdmin
			.from("bank_accounts")
			.select("*")
			.eq("user_id", userId)
			.order("is_primary", { ascending: false })
			.order("created_at", { ascending: true });

		if (error) {
			console.error("List bank accounts error:", error);
			return NextResponse.json(
				{ error: "Failed to fetch bank accounts" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, accounts: data });
	} catch (error) {
		console.error("List bank accounts error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json(
				{ error: "Authorization token required" },
				{ status: 401 }
			);
		}

		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		const userId = payload.userId;
		const body = await request.json();
		const bankName = (body.bankName || "").trim();
		const accountNumber = (body.accountNumber || "").replace(/\D/g, "");
		const accountName = (body.accountName || body.accountHolder || "").trim();

		if (!bankName) {
			return NextResponse.json({ error: "Bank name is required" }, { status: 400 });
		}
		if (accountNumber.length < 10) {
			return NextResponse.json(
				{ error: "Account number must be 10 digits" },
				{ status: 400 }
			);
		}
		if (!accountName) {
			return NextResponse.json(
				{ error: "Account holder name is required" },
				{ status: 400 }
			);
		}

		// First account for this user becomes primary automatically.
		const { count, error: countError } = await supabaseAdmin
			.from("bank_accounts")
			.select("*", { count: "exact", head: true })
			.eq("user_id", userId);

		if (countError) {
			console.error("Bank account count error:", countError);
			return NextResponse.json(
				{ error: "Failed to add bank account" },
				{ status: 500 }
			);
		}

		const isPrimary = (count ?? 0) === 0;

		const { data, error } = await supabaseAdmin
			.from("bank_accounts")
			.insert({
				user_id: userId,
				bank_name: bankName,
				account_number: accountNumber,
				account_name: accountName,
				is_primary: isPrimary,
			})
			.select("*")
			.single();

		if (error) {
			console.error("Add bank account error:", error);
			return NextResponse.json(
				{ error: "Failed to add bank account" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, account: data });
	} catch (error) {
		console.error("Add bank account error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
