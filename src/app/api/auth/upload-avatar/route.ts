import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";
import { validateAvatar } from "@/components/lib/file-validation";

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

		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json(
				{ error: "No file provided" },
				{ status: 400 }
			);
		}

		// SEC-07: Validate file content (magic bytes) — not just MIME type
		const validation = await validateAvatar(file);
		if (!validation.valid) {
			return NextResponse.json(
				{ error: validation.error },
				{ status: 400 }
			);
		}

		const ext = file.name.split(".").pop() || "jpg";
		const path = `${userId}/avatar.${ext}`;

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upsert into the avatars bucket
		const { error: uploadError } = await supabaseAdmin.storage
			.from("avatars")
			.upload(path, buffer, {
				contentType: file.type,
				upsert: true,
			});

		if (uploadError) {
			console.error("Avatar upload error:", uploadError);
			return NextResponse.json(
				{ error: "Failed to upload avatar" },
				{ status: 500 }
			);
		}

		// Build public URL
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
		const publicUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${path}`;

		// Update the profile with the new avatar URL
		const { error: updateError } = await supabaseAdmin
			.from("profiles")
			.update({ avatar_url: publicUrl } as any)
			.eq("id", userId);

		if (updateError) {
			console.error("Profile update error after avatar upload:", updateError);
			// Upload succeeded but profile update failed — still return the URL
		}

		return NextResponse.json({ success: true, url: publicUrl });
	} catch (error) {
		console.error("Upload avatar error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
