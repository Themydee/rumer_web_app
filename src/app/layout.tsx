import React from "react";
import "react-phone-input-2/lib/bootstrap.css";
import "./globals.css";
import { Metadata } from "next";
import ReduxProvider from "./redux-provider";
import AuthBootstrap from "@/components/AuthBootstrap";
import ServiceWorkerRegistrar from "@/components/reusables/ServiceWorkerRegistrar";
import localFont from "next/font/local";
import { SEO_CONFIG } from "@/components/reusables/seoConstant";
const paliokaFont = localFont({
	src: "../../public/font/GC-Palioka.ttf",
	variable: "--font-palioka",
});

const { description, keywords, title } = SEO_CONFIG.default;
export const metadata: Metadata = {
	title: title,
	description: description,
	keywords: keywords,
	metadataBase: new URL("https://www.rumer.ng"),
	alternates: {
		canonical: "https://www.rumer.ng/",
	},
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		title: title,
		description: description,
		url: "https://www.rumer.ng/",
		siteName: "Rumer",
		type: "website",
		images: [
			{
				url: "https://www.rumer.ng/images/og-image.png",
				width: 1200,
				height: 630,
				alt: "Rumer",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: title,
		description: description,
		images: ["https://www.rumer.ng/images/og-image.png"],
	},
	icons: {
		icon: "/images/rummer-logo.png",
		apple: "/images/rummer-logo.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' className='overflow-x-hidden'>
		<body className={`bg-white ${paliokaFont.className}`}>
			<ReduxProvider>
			<AuthBootstrap />
			<ServiceWorkerRegistrar />
			{children}
		</ReduxProvider>
		</body>
		</html>
	);
}
