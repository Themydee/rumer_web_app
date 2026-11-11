import {
	EmailShareButton,
	FacebookMessengerShareButton,
	FacebookShareButton,
	GabShareButton,
	HatenaShareButton,
	InstapaperShareButton,
	LineShareButton,
	LinkedinShareButton,
	LivejournalShareButton,
	MailruShareButton,
	OKShareButton,
	PinterestShareButton,
	PocketShareButton,
	RedditShareButton,
	TelegramShareButton,
	TumblrShareButton,
	TwitterShareButton,
	ViberShareButton,
	VKShareButton,
	WhatsappShareButton,
	WorkplaceShareButton,
} from "react-share";

import {
	EmailIcon,
	FacebookIcon as FacebookIcon2,
	FacebookMessengerIcon,
	GabIcon,
	HatenaIcon,
	InstapaperIcon,
	LineIcon,
	LinkedinIcon,
	LivejournalIcon,
	MailruIcon,
	OKIcon,
	PinterestIcon,
	PocketIcon,
	RedditIcon,
	TelegramIcon,
	TumblrIcon,
	TwitterIcon as TwitterIcon2,
	ViberIcon,
	VKIcon,
	WeiboIcon,
	WhatsappIcon,
	WorkplaceIcon,
	XIcon,
} from "react-share";

import {
	FaFacebookF,
	FaInstagram,
	FaLinkedin,
	FaShareAlt,
	FaTwitter,
	FaYoutube,
} from "react-icons/fa";
import {
	agricHens,
	backgroundGroupImg,
	Chicken,
	Cow,
	cow1,
	curvyImg,
	curvyImg2,
	curvyImg3,
	farmInput1,
	FoodMarket,
	goat1,
	groupInventoryImg,
	hen1,
	hens,
	ipadGirl,
	lambs,
	meat,
	more1,
	partnerImg,
	retailsPack1,
	sellerImg,
	sellerImg2,
	sellerImg3,
	sellerImg4,
	sellerImg5,
	traderImg,
	Turkey,
	turkey1,
	wholesales1,
} from "../../../public";
import {
	LikeIcon,
	SaveIcon,
	SvgCubeIcon,
	SvgDecisionIcon,
	SvgEthicsIcon,
	SvgMapIcon,
	SvgMaterialIcon,
	SvgPathsIcon,
	SvgShieldIcon,
} from "./SVGIcons";
import { MdAddCircle } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import {
	ShieldCheck,
	ShoppingCart,
	Sparkles,
	Truck,
	TrendingUp,
	Zap,
	DollarSign,
} from "lucide-react";
import { IconType } from "react-icons";
import { StaticImageData } from "next/image";

export interface AgricultureBenefit {
	title?: string;
	subtitle: string;
	color: string;
	icon?: IconType;
	iconColor?: string;
}

export interface AgricultureTab {
	id: string;
	label: string;
	badge: string;
	title: string;
	backgroundColor: string;
	description: string;
	cta: string;
	link?: string;
	heroImage?: StaticImageData | string;
	bgHeroImg?: StaticImageData | string;
	curvyImg?: StaticImageData | string;
	benefits: AgricultureBenefit[];
	bg: string;
}

export const dummyVideos = [
	{
		id: "1",
		title: "Introduction to React",
		description:
			"Learn the basics of React in this comprehensive tutorial for beginners.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // React Tutorial by Web Dev Simplified
	},
	{
		id: "2",
		title: "JavaScript Crash Course",
		description:
			"A complete JavaScript crash course to get you started with programming.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // JavaScript Crash Course by Traversy Media
	},
	{
		id: "3",
		title: "CSS Flexbox Tutorial",
		description:
			"Learn CSS Flexbox in this complete tutorial with practical examples.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Flexbox Tutorial by Kevin Powell
	},
	{
		id: "4",
		title: "Python for Beginners",
		description: "Full Python programming course for absolute beginners.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Python Tutorial by freeCodeCamp
	},
	{
		id: "5",
		title: "Git and GitHub Tutorial",
		description:
			"Complete Git and GitHub tutorial for version control beginners.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Git Tutorial by freeCodeCamp
	},
	{
		id: "6",
		title: "TypeScript Full Course",
		description:
			"Learn TypeScript from scratch in this comprehensive tutorial.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // TypeScript Tutorial by Academind
	},
	{
		id: "7",
		title: "Node.js Crash Course",
		description:
			"Learn Node.js fundamentals in this beginner-friendly tutorial.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Node.js Tutorial by Traversy Media
	},
	{
		id: "8",
		title: "Vue.js Tutorial",
		description:
			"Introduction to Vue.js framework for building web applications.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Vue.js Tutorial by freeCodeCamp
	},
	{
		id: "9",
		title: "MongoDB in 1 Hour",
		description: "Learn MongoDB database basics in this quick tutorial.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // MongoDB Tutorial by Web Dev Simplified
	},
	{
		id: "10",
		title: "Docker Tutorial",
		description:
			"Complete Docker tutorial for beginners with practical examples.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Docker Tutorial by TechWorld with Nana
	},
	{
		id: "11",
		title: "REST API Concepts",
		description: "Learn REST API concepts and how to build them.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // REST API Tutorial by Web Dev Simplified
	},
	{
		id: "12",
		title: "GraphQL Tutorial",
		description: "Introduction to GraphQL for API development.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // GraphQL Tutorial by Web Dev Simplified
	},
	{
		id: "13",
		title: "Machine Learning Basics",
		description: "Introduction to machine learning concepts for beginners.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // ML Tutorial by freeCodeCamp
	},
	{
		id: "14",
		title: "Data Structures Explained",
		description: "Learn fundamental data structures in computer science.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Data Structures by freeCodeCamp
	},
	{
		id: "15",
		title: "Algorithms Tutorial",
		description: "Introduction to algorithms with practical examples.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Algorithms by freeCodeCamp
	},
	{
		id: "16",
		title: "Responsive Web Design",
		description:
			"Learn how to create responsive websites that work on all devices.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Responsive Design by Kevin Powell
	},
	{
		id: "17",
		title: "UI/UX Design Principles",
		description: "Fundamental principles of UI/UX design for developers.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // UI/UX by AJ&Smart
	},
	{
		id: "18",
		title: "Flutter Tutorial",
		description: "Build cross-platform apps with Flutter framework.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Flutter by Academind
	},
	{
		id: "19",
		title: "Swift for Beginners",
		description: "Learn Swift programming language for iOS development.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Swift by CodeWithChris
	},
	{
		id: "20",
		title: "Kotlin Android Tutorial",
		description: "Build Android apps with Kotlin programming language.",
		url: "https://agc-storage.s3.eu-north-1.amazonaws.com/3516/ILZ2XNdQI1I5JOeqkS7bAHolc7nsDuGLbCYBrk5L.mp4", // Kotlin by freeCodeCamp
	},
];

export const JoinEarlyAccessEmbeddedLink =
	"https://docs.google.com/forms/d/e/1FAIpQLSe5P7VJwBC1Xzj2LsRZ7YQckF2o7e682XSo6ZeGNO_bbswhxQ/viewform";

export const navItems = [
	// { name: "Pricing", href: "/pricing" },
	{ name: "Login", href: "/login" },
	{ name: "Sign Up", href: "/signup" },
];

export const NAV_ITEMS = [
	// { label: "Home", href: "/" },
	{
		label: "Products",
		href: "",
		submenu: [
			{ label: "Rumer Farmer", href: "/rumer-farmer", comingSoon: true },
			{ label: "Rumer Trader", href: "/trader" },
			{ label: "Rumer Track/VVD", href: "/rumer-track", comingSoon: true },
			{ label: "Rumer Lend", href: "/rumer-lend", comingSoon: true },
			{ label: "Rumer One", href: "/rumer-one", comingSoon: true },
		],
	},
	{ label: "Solutions", href: "/solutions" },
	// { label: "Learn", href: "/learn" },
	{ label: "About", href: "/about" },
	{ label: "Visit Rumer Market", href: "/marketplace" },
];

export const SocialAction = [
	// {
	// 	icon: LikeIcon,
	// 	className: "fill-bg-700",
	// 	key: "Like",
	// },
	{
		icon: SaveIcon,
		className: "fill-bg-700",
		key: "Save",
	},
	{
		icon: FaShareAlt,
		className: "text-bg-700",
		key: "Share",
	},
	{
		icon: MdAddCircle,
		className: "fill-bg-700",
		key: "Add",
	},
];

// Social icons
export const socialMediaPlatforms = [
	{ Button: WhatsappShareButton, Icon: WhatsappIcon, color: "#25D366" },
	{ Button: TwitterShareButton, Icon: XIcon, color: "#1DA1F2" },
	{ Button: FacebookShareButton, Icon: FacebookIcon2, color: "#1877f2" },
	{ Button: LinkedinShareButton, Icon: LinkedinIcon, color: "#0077B5" },
	{ Button: PinterestShareButton, Icon: PinterestIcon, color: "#25D366" },
	{ Button: EmailShareButton, Icon: EmailIcon, color: "#D44638" },
	{
		Button: FacebookMessengerShareButton,
		Icon: FacebookMessengerIcon,
		color: "#25D366",
	},
	// { Button: TelegramShareButton, Icon: TelegramIcon, color: "#25D366" },
	// { Button: GabShareButton, Icon: GabIcon, color: "#25D366" },
	// { Button: HatenaShareButton, Icon: HatenaIcon, color: "#25D366" },
	// { Button: InstapaperShareButton, Icon: InstapaperIcon, color: "#25D366" },
	// { Button: LineShareButton, Icon: LineIcon, color: "#25D366" },
	// { Button: LivejournalShareButton, Icon: LivejournalIcon, color: "#25D366" },
	// { Button: MailruShareButton, Icon: MailruIcon, color: "#25D366" },
	// { Button: OKShareButton, Icon: OKIcon, color: "#25D366" },
	// { Button: PocketShareButton, Icon: PocketIcon, color: "#25D366" },
	// { Button: RedditShareButton, Icon: RedditIcon, color: "#25D366" },
	// { Button: TumblrShareButton, Icon: TumblrIcon, color: "#25D366" },
	// { Button: ViberShareButton, Icon: ViberIcon, color: "#25D366" },
	// { Button: VKShareButton, Icon: VKIcon, color: "#25D366" },
	// { Button: WorkplaceShareButton, Icon: WorkplaceIcon, color: "#25D366" },
];

export interface EventType {
	id: string;
	image: string;
	title: string;
	description: string;
	date: string;
	location: string;
	price: string;
}

export const events: EventType[] = [
	{
		id: "1",
		title: "Community Wellness Workshop",
		date: "February 15, 2024 - 6:00 PM",
		description:
			"Join us for an interactive workshop focused on mental health awareness and community support strategies.",
		location: "Community Hall",
		price: "$15",
		image:
			"https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
	},

	{
		id: "2",
		title: "Mindfulness Meditation Session",
		date: "Every Tuesday - 7:00 PM",
		description:
			"Weekly guided meditation sessions to help reduce stress and improve mental clarity.",
		location: "Tranquility Garden",
		price: "Free",
		image:
			"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
	},
	{
		id: "3",
		title: "Family Support Network Meeting",
		date: "April 12, 2024 - 5:30 PM",
		description:
			"A supportive gathering for families dealing with mental health challenges, featuring guest speakers and resources.",
		location: "Family Resource Center",
		price: "Donation-based",
		image:
			"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
	},
	{
		id: "4",
		title: "Art Therapy Open Studio",
		date: "May 20, 2024 - 2:00 PM to 5:00 PM",
		description:
			"Express yourself through various art mediums in a supportive, therapeutic environment. No experience necessary.",
		location: "Creative Arts Studio",
		price: "$25",
		image:
			"https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80",
	},
];

export const CONTACT_SOCIAL_ICONS = [
	{
		id: 1,
		icon: <FiFacebook />,
		href: "#",
	},
	{
		id: 2,
		icon: <FaTwitter />,
		href: "#",
	},
	{
		id: 3,
		icon: <FiInstagram />,
		href: "#",
	},
];

export const SOCIAL_LINKS = [
	{
		name: "LinkedIn",
		href: "https://linkedin.com/company/your-church",
		icon: FaLinkedin,
		ariaLabel: "Visit our LinkedIn page",
	},
	{
		name: "Facebook",
		href: "https://facebook.com/your-church",
		icon: FaFacebookF,
		ariaLabel: "Visit our Facebook page",
	},
	{
		name: "Twitter",
		href: "https://twitter.com/your-church",
		icon: FaXTwitter,
		ariaLabel: "Visit our Twitter page",
	},
	{
		name: "Instagram",
		href: "https://instagram.com/your-church",
		icon: FaInstagram,
		ariaLabel: "Visit our Instagram page",
	},
	{
		name: "YouTube",
		href: "https://youtube.com/your-church",
		icon: FaYoutube,
		ariaLabel: "Visit our YouTube channel",
	},
];

export const FOOTER_SECTIONS = [
	{
		title: "Menu",
		links: [
			{
				label: "Our Church",
				href: "/our-church",
				description: "Learn about our church",
			},
			{
				label: "Contact Us",
				href: "/contact",
				description: "Get in touch with us",
			},
			{ label: "Blog", href: "/blog", description: "Read our latest articles" },
		],
	},
	{
		title: "Help",
		links: [
			{
				label: "FAQs",
				href: "/faqs",
				description: "Frequently asked questions",
			},
			{
				label: "Giving",
				href: "/give",
				description: "Support our ministry",
			},
		],
	},
	{
		title: "Legal",
		links: [
			{
				label: "Privacy Policy",
				href: "/privacy",
				description: "How we handle your data",
			},
			{
				label: "Terms & Conditions",
				href: "/terms",
				description: "Website usage terms",
			},
		],
	},
];

export const farmCards = [
	{
		title: "Rumer for Farmer",
		description: "Products to grow your business",
		bg: "bg-green-50",
		image: sellerImg,
		alt: "Farmer with livestock",
	},
	{
		title: "Rumer for Traders",
		description: "Source trade and contract livestock",
		bg: "bg-purple-50",
		image: traderImg,
		alt: "Butcher shop",
	},
	{
		title: "Rumer for Partners",
		description: "Access the power of our network",
		bg: "bg-yellow-50",
		image: partnerImg,
		alt: "Partners shaking hands",
	},
];

export const AGRICULTURE_TABS: AgricultureTab[] = [
	{
		id: "farmers",
		label: "Farmers & Cooperatives",
		badge: "Livestock Inventory",
		title: "Transforming Livestock Management",
		backgroundColor: "bg-primary-100",
		description:
			"From manual to modern, we empower farmers to manage efficiently and optimise their operations.",
		cta: "Explore RumerFarm",
		link: "/producer",
		heroImage: backgroundGroupImg,
		bgHeroImg: groupInventoryImg,
		curvyImg: curvyImg,
		benefits: [
			{
				title: "Result",
				subtitle: "Reduce costs and improve efficiency",
				color: "bg-yellowVB-100",
			},
			{
				icon: SvgDecisionIcon,
				subtitle: "Real-time data for better decisions",
				color: "bg-yellowVB-100",
				iconColor: "bg-cyan-100",
			},
			{
				icon: SvgMaterialIcon,
				subtitle: "Easier access to financing",
				color: "bg-yellowVB-100",
				iconColor: "bg-rose-900",
			},
		],
		bg: "bg-primary-100",
	},
	{
		id: "processors",
		label: "Processors & Exporters",
		badge: "Ecosystem",
		title: "Ensuring Quality and Compliance",
		description:
			"Dependable supply chains and clear, transparent transactions are essential for building trust and efficiency in business operations",
		cta: "Discover",
		link: "/processor",
		backgroundColor: "bg-buttonColor-100",
		// heroImage: backgroundGroupImg,
		bgHeroImg: sellerImg5,
		curvyImg: curvyImg3,
		benefits: [
			{
				title: "Result",
				subtitle: "Simplified vendor verification",
				color: "bg-vcjointherummer-800",
			},
			{
				icon: SvgCubeIcon,
				subtitle: "Traceability ensuring quality",
				color: "bg-vcjointherummer-800",
				iconColor: "bg-green-400",
			},
			{
				icon: SvgShieldIcon,
				subtitle: "Secure transactions",
				color: "bg-vcjointherummer-800",
				iconColor: "bg-green-400",
			},
		],
		bg: "bg-buttonColor-100",
	},
	{
		id: "buyers",
		label: "Buyers & Consumers",
		badge: "Quality Products",
		title: "Trust in Every Purchase",
		description:
			"Having confidence in the quality and origin of products is essential for making informed purchasing decisions",
		cta: "Learn About",
		link: "/buyer",
		curvyImg: curvyImg2,
		backgroundColor: "bg-primary-100",
		// heroImage: sellerImg2,
		bgHeroImg: sellerImg2,
		benefits: [
			{
				title: "Result",
				subtitle: "Complete traceability from farm to table",
				color: "bg-gray-200",
			},
			{
				icon: SvgEthicsIcon,
				subtitle: "Ethically sourced products",
				color: "bg-gray-200",
				iconColor: "bg-partnerheroicon-200",
			},
			{
				icon: SvgMapIcon,
				subtitle: "Detailed lifecycle information",
				color: "bg-gray-200",
				iconColor: "bg-partnerheroicon-200",
			},
		],
		bg: "bg-primary-100",
	},
	{
		id: "financial",
		label: "Financial Institutions & Insurers",
		badge: "Innovative",
		title: "Unlock New Opportunities in Agri-Finance",
		description:
			"Dependable data, minimized risk, and cutting-edge products that push the boundaries of innovation.",
		cta: "Explore",
		link: "/partner",
		backgroundColor: "bg-buttonColor-200",
		bgHeroImg: sellerImg3,
		benefits: [
			{
				title: "Result",
				subtitle: "Reliable collateral assessment",
				color: "bg-gray-200",
			},
			{
				icon: SvgPathsIcon,
				subtitle: "Transparent transactions",
				color: "bg-gray-200",
				iconColor: "bg-green-400",
			},
			{
				icon: SvgPathsIcon,
				subtitle: "Tailored financial products",
				color: "bg-gray-200",
				iconColor: "bg-green-400",
			},
		],
		bg: "bg-buttonColor-200",
	},
	{
		id: "government",
		label: "Government & Regulators",
		badge: "Livestock Inventory",
		title: "Enhancing Industry Oversight",
		description:
			"Making data-driven decisions is essential for creating a sustainable future that benefits both our planet and society.",
		cta: "Explore",
		link: "/partner",
		backgroundColor: "bg-buttonColor-300",
		bgHeroImg: sellerImg4,

		benefits: [
			{
				title: "Result",
				subtitle: "Monitor and regulate effectively",
				color: "bg-gray-200",
			},
			{
				icon: SvgPathsIcon,
				subtitle: "Support food security initiatives",
				color: "bg-gray-200",
				iconColor: "bg-green-400",
			},
			{
				icon: SvgPathsIcon,
				subtitle: "Improved data collection",
				color: "bg-gray-200",
				iconColor: "bg-green-400",
			},
		],
		bg: "bg-buttonColor-300",
	},
];

// constants.ts
export const marketplaceCategories = [
	{
		label: "Livestock",
		icon: "/category-icons/livestock.svg",
	},
	{
		label: "Processed Products",
		icon: "/category-icons/processed-products.svg",
	},
	{
		label: "Day Old Chicks",
		icon: "/category-icons/day-old-chicks.svg",
	},
	{
		label: "Poultry Equipment",
		icon: "/category-icons/poultry-equipment.svg",
	},
	{
		label: "Agricultural Equipment",
		icon: "/category-icons/agricultural-equipment.svg",
	},
	{
		label: "Veterinary Products",
		icon: "/category-icons/veterinary-products.svg",
	},
	{
		label: "Agro Processing Equipment",
		icon: "/category-icons/agro-processing.svg",
	},
	{
		label: "Scales",
		icon: "/category-icons/scales.svg",
	},
	{
		label: "Grain Seeds",
		icon: "/category-icons/grain-seeds.svg",
	},
	{
		label: "Crop",
		icon: "/category-icons/crop.svg",
	},
	{
		label: "Agrochemicals",
		icon: "/category-icons/agrochemicals.svg",
	},
];

export const supplierProducts = [
	{
		image: Cow,
		title: "GoSource",
		price: "₦450,000",
		timeLeft: "15 min",
		rating: 4.5,
		reviews: 34,
		supplier: "GoSource",
	},
	{
		image: Chicken,
		title: "Muka Enterprise",
		price: "₦480,000",
		timeLeft: "15 min",
		rating: 4.5,
		reviews: 23,
		supplier: "Muka Enterprise",
		isOutOfStock: true,
	},
	{
		image: Turkey,
		title: "Global Ventures",
		price: "₦450,000",
		timeLeft: "15 min",
		rating: 4.5,
		reviews: 45,
		supplier: "Global Ventures",
	},
	{
		image: FoodMarket,
		title: "TechFlow",
		price: "₦490,000",
		timeLeft: "20 min",
		rating: 4.5,
		reviews: 67,
		supplier: "TechFlow",
	},
];

export const supermarketProducts = [
	{
		image: Cow,
		title: "Muka Enterprise",
		price: "₦450,000",
		timeLeft: "15 min",
		rating: 4.5,
		reviews: 23,
		supplier: "Muka Enterprise",
		discount: "Up to 35% off",
	},
	{
		image: Chicken,
		title: "GoSource",
		price: "₦490,000",
		timeLeft: "15 min",
		rating: 4.5,
		reviews: 34,
		supplier: "GoSource",
	},
	{
		image: Turkey,
		title: "Global Ventures",
		price: "₦480,000",
		timeLeft: "15 min",
		rating: 4.5,
		reviews: 45,
		supplier: "Global Ventures",
	},
	{
		image: FoodMarket,
		title: "TechFlow",
		price: "₦490,000",
		timeLeft: "20 min",
		rating: 4.5,
		reviews: 67,
		supplier: "TechFlow",
		isOutOfStock: true,
	},
];

export const trendingProducts = [
	{
		image: Cow,
		title: "Muka Enterprise",
		price: "₦450,000",
		timeLeft: "15 min",
		rating: 4.5,
		reviews: 23,
		supplier: "Muka Enterprise",
		discount: "Up to 35% off",
	},
	{
		image: Chicken,
		title: "GoSource",
		price: "₦490,000",
		timeLeft: "15 min",
		rating: 4.5,
		reviews: 34,
		supplier: "GoSource",
	},
	{
		image: Turkey,
		title: "Global Ventures",
		price: "₦480,000",
		timeLeft: "15 min",
		rating: 4.5,
		reviews: 45,
		supplier: "Global Ventures",
	},
	{
		image: FoodMarket,
		title: "TechFlow",
		price: "₦490,000",
		timeLeft: "20 min",
		rating: 4.5,
		reviews: 67,
		supplier: "TechFlow",
		isOutOfStock: true,
	},
];

export const features = [
	{
		icon: ShoppingCart,
		title: "Original Products",
		description: "We ensure money-back guarantee if the product is counterfeit",
	},
	{
		icon: ShieldCheck,
		title: "Satisfaction Guarantee",
		description: "We ensure money-back guarantee if the product is counterfeit",
	},
	{
		icon: Sparkles,
		title: "New Arrival Everyday",
		description: "We ensure money-back guarantee if the product is counterfeit",
	},
	{
		icon: Truck,
		title: "Fast & Free Shipping",
		description: "We ensure money-back guarantee if the product is counterfeit",
	},
];

export const product1 = [
	{
		id: 1,
		name: "Lambs",
		price: 475000,
		supplier: "Red Stettos",
		rating: 5,
		reviews: 91,
		image: lambs,
	},
	{
		id: 2,
		name: "Hens",
		price: 475000,
		supplier: "Red Stettos",
		rating: 5,
		reviews: 91,
		image: hens,
	},
	{
		id: 3,
		name: "Meat",
		price: 475000,
		supplier: "Red Stettos",
		rating: 5,
		reviews: 91,
		image: meat,
	},
	{
		id: 4,
		name: "Agric Hen",
		price: 475000,
		supplier: "Red Stettos",
		rating: 5,
		reviews: 91,
		image: agricHens,
	},
];
