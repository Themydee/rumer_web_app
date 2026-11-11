import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "www.rumer.ng";
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
const APEX_HOST = "rumer.ng";

export function middleware(request: NextRequest) {
	const { pathname, search } = request.nextUrl;
	const host = request.headers.get("host") || "";

	// Normalize the host to lowercase, stripping any port.
	const hostname = host.split(":")[0].toLowerCase();

	const isLocalDev =
		hostname === "localhost" ||
		hostname.endsWith(".localhost") ||
		hostname === "127.0.0.1";

	// Consolidate apex -> www (www.rumer.ng is canonical).
	if (hostname === APEX_HOST) {
		const url = new URL(`${CANONICAL_ORIGIN}${pathname}${search}`);
		return NextResponse.redirect(url, 301);
	}

	// Serve canonical host and local development as-is.
	if (isLocalDev || hostname === CANONICAL_HOST) {
		return NextResponse.next();
	}

	// Any other subdomain/host stays live but must never be indexed.
	const response = NextResponse.next();
	response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
	return response;
}

export const config = {
	matcher: [
		/*
		 * Run on all paths except static assets, middleware/preflight, and API routes.
		 */
		"/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/).*)",
	],
};