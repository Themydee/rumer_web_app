import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { WP_URL } from "../utils/endpoint";

const isWordPressConfigured = WP_URL && 
	WP_URL !== "http://localhost:3000" && 
	WP_URL !== "undefined" &&
	!WP_URL.includes("localhost:3000");

const BASE_URI = isWordPressConfigured ? `${WP_URL}/graphql` : "/api/graphql-fallback";

// Node's global fetch cannot resolve relative URLs, so the URI must be absolute
// when the query runs on the server (SSR). In the browser the relative URL is
// resolved automatically.
function resolveUri(): string {
	if (typeof window !== "undefined") return BASE_URI;
	if (BASE_URI.startsWith("http")) return BASE_URI;
	const origin =
		process.env.NEXT_PUBLIC_FRONT_URL ||
		process.env.NEXT_PUBLIC_WORDPRESS_URL ||
		"http://localhost:3000";
	return `${origin}${BASE_URI}`;
}

const client = new ApolloClient({
	link: new HttpLink({
		uri: resolveUri,
		headers: {
			"Cache-Control": "no-cache",
			Pragma: "no-cache",
		},
	}),
	cache: new InMemoryCache(),
	defaultOptions: {
		query: {
			fetchPolicy: "no-cache",
			errorPolicy: "all",
		},
	},
});

export default client;
