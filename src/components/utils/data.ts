import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { authLogout } from "@/components/set-up/redux/children/auth";
import store from "@/components/set-up/redux/store";

export const AUTH_TOKEN_KEY = "RUMER_LOGIN_ACCESS";
export const RUMER_AUTH_TOKEN = "rumer_auth_token";

export const signOut = () => {
	Cookies.remove(AUTH_TOKEN_KEY);
	Cookies.remove("token");
	Cookies.remove("refreshToken");
	if (typeof window !== "undefined") {
		localStorage.removeItem(RUMER_AUTH_TOKEN);
	}
	store.dispatch(authLogout());
	toast.success("Logged out successfully!");
	window.location.pathname = "/login";
};
