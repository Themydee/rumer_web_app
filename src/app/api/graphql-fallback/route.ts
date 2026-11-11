import { NextResponse } from "next/server";
import { getGraphqlFallbackData } from "@/components/lib/graphql-fallback";

// Local GraphQL fallback used when no WordPress endpoint is configured
// (NEXT_PUBLIC_WORDPRESS_URL unset or points at localhost). Returns valid but empty
// data so server-rendered pages don't crash when CMS content is unavailable.
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const data = getGraphqlFallbackData(body?.operationName);
		return NextResponse.json({ data });
	} catch {
		return NextResponse.json({ data: {} });
	}
}
