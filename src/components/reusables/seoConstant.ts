// constants/seo.ts

interface SEOConfig {
	title: string;
	description: string;
	url: string;
	keywords: string[];
	ogImage?: string;
	ogType?: string;
	twitterCard?: string;
}

interface SEODatabase {
	[key: string]: SEOConfig;
}

// Core website information
export const SITE = {
	name: "Rumer",
	tagline: "Livestock Traceability & Digital Trading Platform",
	url: "https://www.rumer.ng", // Canonical domain — all SEO signals resolve to www.rumer.ng only
	defaultOGImage: "/images/og-image.png",
	twitterHandle: "@RumerHQ",
};

// Common descriptions focused on the Tech Ecosystem
const DESCRIPTIONS = {
	default: `${SITE.name} is a cutting-edge tech platform facilitating livestock traceability and secure trading. We bridge the gap between data-driven provenance and global market access.`,
	home: `Rumer: The digital infrastructure for livestock. Facilitating transparent trading, real-time traceability, and verified provenance for the modern agricultural value chain.`,
	about: `About ${SITE.name} - We are an AgriTech pioneer dedicated to digitizing livestock identity and streamlining trade through advanced traceability solutions.`,
	traceability: `Livestock Traceability at ${SITE.name} - Tracking animal history from birth to market. Enhance consumer trust and food safety with verified digital identities.`,
	trading: `Secure Livestock Trading on ${SITE.name} - A transparent marketplace connecting verified sellers with global buyers. Secure payments and verified logistics.`,
	technology: `The Rumer Stack - Leveraging data analytics and digital identifiers to provide a single source of truth for livestock supply chains.`,
	marketplace: `Browse verified livestock listings on ${SITE.name}. Every animal is traced, every seller is verified, and every trade is secured.`,
	impact: `Transforming Agriculture - How ${SITE.name} is empowering local farmers and ensuring food security through digital innovation and market inclusion.`,
	blog: `Rumer Insights - Expert analysis on AgriTech trends, livestock data management, and the future of agricultural trade.`,
	faq: `Frequently Asked Questions - Learn how the Rumer platform works for buyers, sellers, and logistics partners.`,
};

// Keyword clusters for an AgriTech Platform
const KEYWORDS = {
	brand: [
		"Rumer",
		"Rumer Tech",
		"Rumer Platform",
		"Rumer Traceability",
		"Rumer Livestock Trade",
	],
	core_tech: [
		"Livestock traceability platform",
		"Animal provenance tracking",
		"AgriTech solutions Nigeria",
		"Digital livestock identity",
		"Livestock supply chain transparency",
		"Farm-to-table data",
	],
	trading_marketplace: [
		"Secure livestock trading",
		"Buy livestock online verified",
		"Livestock marketplace platform",
		"Verified livestock sellers",
		"Agricultural trade infrastructure",
	],
	industry_terms: [
		"Agricultural digital transformation",
		"Smart farming technology",
		"Livestock data analytics",
		"Food safety traceability",
		"Sustainable agriculture tech",
	],
	user_roles: [
		"Platform for livestock buyers",
		"Digital tools for farmers",
		"Livestock investment tech",
		"Logistics for livestock trade",
	],
};

export const SEO_CONFIG: SEODatabase = {
	default: {
		title: `${SITE.name} | ${SITE.tagline}`,
		description: DESCRIPTIONS.default,
		url: SITE.url,
		keywords: [
			...KEYWORDS.brand,
			...KEYWORDS.core_tech,
			...KEYWORDS.industry_terms,
		],
		ogImage: SITE.defaultOGImage,
		ogType: "website",
		twitterCard: "summary_large_image",
	},
	home: {
		title: `${SITE.name} | Digitizing the Livestock Value Chain`,
		description: DESCRIPTIONS.home,
		url: `${SITE.url}/`,
		keywords: [
			...KEYWORDS.brand,
			...KEYWORDS.core_tech,
			...KEYWORDS.trading_marketplace,
			"AgriTech homepage",
			"Livestock innovation",
		],
		ogImage: "/images/og-rumer-home.jpg",
	},
	traceability: {
		title: `Livestock Traceability & Provenance | ${SITE.name}`,
		description: DESCRIPTIONS.traceability,
		url: `${SITE.url}/traceability`,
		keywords: [
			"animal tracking software",
			"livestock provenance",
			"digital ear tags",
			"livestock health records",
			"supply chain transparency",
		],
		ogImage: "/images/og-rumer-traceability.jpg",
	},
	trading: {
		title: `Secure Livestock Trading Marketplace | ${SITE.name}`,
		description: DESCRIPTIONS.trading,
		url: `${SITE.url}/trade`,
		keywords: [
			"secure livestock marketplace",
			"verified cattle trade",
			"escrow for agriculture",
			"livestock auction online",
		],
		ogImage: "/images/og-rumer-trading.jpg",
	},
};

/**
 * Helper function to generate page-specific metadata
 */
export const generatePageMetadata = (
	page: string,
	additional?: Partial<SEOConfig>,
): SEOConfig => {
	const baseConfig = SEO_CONFIG[page] || SEO_CONFIG.default;
	return {
		...baseConfig,
		...additional,
		title: additional?.title
			? `${additional.title} | ${SITE.name}`
			: baseConfig.title,
	};
};

/**
 * Generates Next.js page Metadata with SEO aligned to the canonical rumer.ng domain.
 *
 * - canonical always points to https://rumer.ng<path> regardless of which subdomain served the request
 * - robots.index is enabled ONLY on rumer.ng; other subdomains are noindexed (keep working, never rank)
 * - openGraph/twitter URLs are absolute so they resolve correctly on every host
 */
export const generateMetadataForPath = (
	path: string,
	config: {
		title?: string;
		description?: string;
		keywords?: string[];
		ogImage?: string;
		ogType?: string;
		twitterCard?: string;
		type?: "website" | "article";
	},
	host?: string | null,
) => {
	const canonicalDomain = SITE.url;
	const isCanonicalHost = !host || host === "www.rumer.ng";
	const canonical = `${canonicalDomain}${path === "/" ? "" : path}`;
	const baseConfig = SEO_CONFIG.default;
	const ogImage = config.ogImage || SITE.defaultOGImage;
	const absoluteOgImage = ogImage.startsWith("http")
		? ogImage
		: `${canonicalDomain}${ogImage}`;

	return {
		metadataBase: new URL(canonicalDomain),
		title: config.title || baseConfig.title,
		description: config.description || baseConfig.description,
		keywords: config.keywords || baseConfig.keywords,
		alternates: {
			canonical,
		},
		robots: isCanonicalHost
			? { index: true, follow: true }
			: { index: false, follow: false },
		openGraph: {
			title: config.title || baseConfig.title,
			description: config.description || baseConfig.description,
			url: canonical,
			siteName: SITE.name,
			type: config.ogType || "website",
			images: [{ url: absoluteOgImage, width: 1200, height: 630, alt: SITE.name }],
		},
		twitter: {
			card: config.twitterCard || "summary_large_image",
			title: config.title || baseConfig.title,
			description: config.description || baseConfig.description,
			images: [absoluteOgImage],
		},
	};
};
