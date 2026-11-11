"use client";
import React, { ReactNode, Suspense } from "react";
import { useState } from "react";
import Header from "./globals/Header";
import Footer from "./globals/Footer";
import ScrollToTopBottom from "./buttons/ScrollToTopBottom";
// import Footer from "./globals/Footer";

interface AppLayoutProps {
	children: ReactNode;
	bgClassName?: string;
	className?: string;
}

const AppLayout = ({ children, bgClassName, className }: AppLayoutProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	return (
		<main className='bg-white relative'>
			<Header />
			<div className={`${className} relative w-full min-h-screen`}>
				{children}
				<ScrollToTopBottom />
			</div>
			<Footer />
		</main>
	);
};

export default AppLayout;
