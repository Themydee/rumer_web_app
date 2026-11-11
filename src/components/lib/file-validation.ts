/**
 * File validation utilities — magic byte checks to prevent MIME-type spoofing.
 * Usage:
 *   const result = await validateImage(buffer, "image/jpeg");
 *   if (!result.valid) return NextResponse.json({ error: result.error }, { status: 400 });
 */

interface ValidationResult {
	valid: boolean;
	error?: string;
}

/** Magic bytes for common image formats */
const MAGIC_BYTES: Record<string, number[][]> = {
	"image/jpeg": [[0xFF, 0xD8, 0xFF]],
	"image/png": [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
	"image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF (WEBP follows)
	"image/gif": [[0x47, 0x49, 0x46, 0x38]], // GIF8
	"image/svg+xml": [[0x3C, 0x3F, 0x78, 0x6D, 0x6C], [0x3C, 0x73, 0x76, 0x67]], // <?xml or <svg
	"application/pdf": [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

/**
 * Check if buffer starts with expected magic bytes for the claimed MIME type.
 */
export function checkMagicBytes(buffer: Buffer, mimeType: string): boolean {
	const signatures = MAGIC_BYTES[mimeType];
	if (!signatures) return true; // Unknown type — allow (or reject in stricter mode)

	for (const signature of signatures) {
		let match = true;
		for (let i = 0; i < signature.length; i++) {
			if (buffer[i] !== signature[i]) {
				match = false;
				break;
			}
		}
		if (match) return true;
	}
	return false;
}

/**
 * Validate an uploaded file: size, MIME type, and magic bytes.
 * Rejects SVG files for image uploads (XSS risk).
 */
export async function validateFile(
	file: File,
	options: {
		maxSizeMB?: number;
		allowedTypes?: string[];
		allowSvg?: boolean;
	} = {}
): Promise<ValidationResult> {
	const { maxSizeMB = 5, allowedTypes = [], allowSvg = false } = options;

	// Size check
	if (file.size > maxSizeMB * 1024 * 1024) {
		return { valid: false, error: `File must be less than ${maxSizeMB} MB` };
	}

	// Type check
	if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
		return { valid: false, error: `File type not allowed: ${file.type}` };
	}

	// SEC-07: Reject SVG for image uploads (XSS risk via embedded scripts)
	if (!allowSvg && file.type === "image/svg+xml") {
		return { valid: false, error: "SVG files are not allowed" };
	}

	// SEC-07: Validate magic bytes
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	if (!checkMagicBytes(buffer, file.type)) {
		return { valid: false, error: "File content does not match declared type" };
	}

	return { valid: true };
}

/** Pre-configured validators */

export const validateAvatar = (file: File) =>
	validateFile(file, {
		maxSizeMB: 5,
		allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
		allowSvg: false,
	});

export const validateKycDocument = (file: File) =>
	validateFile(file, {
		maxSizeMB: 5,
		allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
		allowSvg: false,
	});

export const validateProductImage = (file: File) =>
	validateFile(file, {
		maxSizeMB: 5,
		allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
		allowSvg: false,
	});
