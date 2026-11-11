"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/components/hooks";
import { authLogin } from "@/components/set-up/redux/children/auth";
import { getCurrentUser, getToken } from "@/components/lib/supabase/auth";
import { toUserType } from "@/components/lib/user";

/**
 * Loads the logged-in user into Redux after a full page load / refresh.
 * Login only stores the JWT in localStorage and redirects, so the Redux
 * `auth.user` is empty until we hydrate it from /api/auth/me.
 */
export function useBootstrapUser() {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);

	useEffect(() => {
		if (user) return;
		const token = getToken();
		if (!token) return;

		let active = true;
		getCurrentUser().then((u) => {
			if (!active || !u) return;
			dispatch(authLogin({ token, user: toUserType(u) as any }));
		});
		return () => {
			active = false;
		};
	}, [user, dispatch]);
}

export default function AuthBootstrap() {
	useBootstrapUser();
	return null;
}
