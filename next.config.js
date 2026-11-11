/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
		// unoptimized: true,
	},
	turbopack: {},
	async redirects() {
		return [
			{
				source: "/about-us",
				destination: "/about",
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
