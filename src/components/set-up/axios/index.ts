import Cookies from "js-cookie";
import { AxiosError, AxiosStatic, InternalAxiosRequestConfig } from "axios";
import { AUTH_TOKEN_KEY, signOut } from "@/components/utils/data";
import { toast } from "react-toastify";

interface ErrorResponseData {
	message?: string;
	// Add other expected error response properties here
}

export default function setupAxios(axios: AxiosStatic, store: any) {
	const jollyCourseCookieTokenAPI = process.env.NEXT_PUBLIC_BACK_URL || "";
	axios.defaults.headers.common["Accept"] = "application/json";
	const jollyCourseCookieToken = Cookies.get(AUTH_TOKEN_KEY);
	axios.interceptors.request.use(
		(config: any) => {
			const { auth } = store.getState(); // Destructure auth from state
			if (auth && auth.token) {
				if (config.headers && config.url.includes(jollyCourseCookieTokenAPI)) {
					config.headers.Authorization = `Bearer ${auth.token}`;
				}
			}
			return config;
		},
		(err: any) => Promise.reject(err),
	);
	axios.interceptors.response.use(
		(response) => response,
		async (error: AxiosError<ErrorResponseData>) => {
			const originalRequest = error.config as
				| (InternalAxiosRequestConfig & { _retry?: boolean })
				| undefined;

			// Skip if no original request (unlikely but possible)
			if (!originalRequest) {
				return Promise.reject(error);
			}

			const { auth } = store.getState();
			const errorData = error.response?.data;
			const status = error.response?.status;

			// Check if unauthenticated
			const isUnauthenticated =
				status === 401 ||
				status === 403 ||
				errorData?.message?.includes("Unauthenticated");

			if (
				jollyCourseCookieToken &&
				isUnauthenticated &&
				!originalRequest._retry
			) {
				signOut();
			}

			return Promise.reject(error);
		},
	);
}
