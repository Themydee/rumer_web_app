import React, { ReactNode } from "react";
import DashboardSideNav from "./_component/DashboardSideNav";
import DashboardHeader from "./_component/DashboardHeader";
import AuthBootstrap from "@/components/AuthBootstrap";
// import Header from "./Header";

interface DashboardLayoutProps {
	children: ReactNode;
	className?: string;
}

const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
		return (
			<main className='flex relative h-screen'>
				<AuthBootstrap />
				<DashboardSideNav />
				<div className='overflow-y-scroll w-full lg:w-[85%] relative pb-32'>
					<DashboardHeader />
				<div
					className={`w-full relative md:px-2 lg:px-4 pb-5 mt-24 ${className}`}
				>
					{children}
				</div>
			</div>
		</main>
	);
};

export default DashboardLayout;
