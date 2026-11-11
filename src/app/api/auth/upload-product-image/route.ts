import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/components/lib/supabase/admin";
import { verifyToken } from "@/components/lib/auth-helpers";
import { validateProductImage } from "@/components/lib/file-validation";

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
		const validation = await validateProductImage(file);
		if (!validation.valid) {
			return NextResponse.json(
				{ error: validation.error },
				{ status: 400 }
			);
		}

		const ext = file.name.split(".").pop() || "jpg";
		const timestamp = Date.now();
		const path = `${userId}/product-${timestamp}.${ext}`;

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to product-images bucket (create if not exists)
		const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
		const { error: uploadError } = await supabaseAdmin.storage
			.from("product-images")
			.upload(path, buffer, {
				contentType: file.type,
				upsert: false,
			});

		if (uploadError) {
			// If bucket doesn't exist, try to create it
			if (uploadError.message?.includes("Bucket not found")) {
				const { error: createError } = await supabaseAdmin.storage.createBucket("product-images", {
					public: true,
					fileSizeLimit: 5 * 1024 * 1024,
					allowedMimeTypes: allowed,
				});

				if (createError) {
					console.error("Create bucket error:", createError);
					return NextResponse.json(
						{ error: "Failed to create storage bucket" },
						{ status: 500 }
					);
				}

				// Retry upload
				const { error: retryError } = await supabaseAdmin.storage
					.from("product-images")
					.upload(path, buffer, {
						contentType: file.type,
						upsert: false,
					});

				if (retryError) {
					console.error("Product image upload retry error:", retryError);
					return NextResponse.json(
						{ error: "Failed to upload product image" },
						{ status: 500 }
					);
				}
			} else {
				console.error("Product image upload error:", uploadError);
				return NextResponse.json(
					{ error: "Failed to upload product image" },
					{ status: 500 }
				);
			}
		}

		// Build public URL
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
		const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${path}`;

		return NextResponse.json({ success: true, url: publicUrl });
	} catch (error) {
		console.error("Upload product image error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
