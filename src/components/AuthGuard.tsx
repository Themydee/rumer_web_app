"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/components/lib/supabase/auth";

/**
 * Blocks rendering of protected content when there is no session token
 * (e.g. after logout + browser back). Redirects to /login.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [allowed, setAllowed] = useState(false);

	useEffect(() => {
		if (!getToken()) {
			router.replace("/login");
		} else {
			setAllowed(true);
		}
	}, [router]);

	if (!allowed) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white">
				<div className="w-10 h-10 border-4 border-gray-200 border-t-[#014834] rounded-full animate-spin" />
			</div>
		);
	}

	return <>{children}</>;
}
