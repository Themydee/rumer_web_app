import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://www.rumer.ng";

	const publicRoutes = [
		"",
		"about",
		"buyer",
		"partner",
		"third-party-service-providers",
		"contact-us",
		"contact",
		"story",
		"producer",
		"trader",
		"processor",
		"login",
		"signup",
	];

	const routes = publicRoutes.map((route) => ({
		url: `${baseUrl}/${route}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: route === "" ? 1.0 : 0.8,
	}));

	return routes;
}