"use client";
import React, { ReactNode } from "react";
import { useState } from "react";
import HeaderB from "./HeaderB";
import ScrollToTopBottom from "../buttons/ScrollToTopBottom";
import FooterB from "./FooterB";

interface AppLayoutBProps {
	children: ReactNode;
	bgClassName?: string;
	className?: string;
}

const AppLayoutB = ({ children, bgClassName, className }: AppLayoutBProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	return (
		<main className='bg-white relative'>
			<HeaderB />
			<div className={`${className} relative w-full min-h-screen`}>
				{children}
				<ScrollToTopBottom />
			</div>
			<FooterB />
		</main>
	);
};

export default AppLayoutB;
