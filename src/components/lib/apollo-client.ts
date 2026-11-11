import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	InMemoryCache,
	Observable,
} from "@apollo/client";
import { WP_URL } from "../utils/endpoint";
import { getGraphqlFallbackData } from "./graphql-fallback";

const isWordPressConfigured =
	Boolean(WP_URL) &&
	WP_URL !== "http://localhost:3000" &&
	WP_URL !== "undefined" &&
	!WP_URL.includes("localhost:3000");

// When WordPress is not configured, resolve GraphQL queries in-process instead of
// looping back over HTTP to /api/graphql-fallback during SSR (which fails on
// Vercel preview deployments or before the server is listening).
const fallbackLink = new ApolloLink(
	(operation) =>
		new Observable((observer) => {
			observer.next({ data: getGraphqlFallbackData(operation.operationName) });
			observer.complete();
		}),
);

const httpLink = new HttpLink({
	uri: `${WP_URL}/graphql`,
	headers: {
		"Cache-Control": "no-cache",
		Pragma: "no-cache",
	},
});

const client = new ApolloClient({
	link: isWordPressConfigured ? httpLink : fallbackLink,
	cache: new InMemoryCache(),
	defaultOptions: {
		query: {
			fetchPolicy: "no-cache",
			errorPolicy: "all",
		},
	},
});

export default client;
