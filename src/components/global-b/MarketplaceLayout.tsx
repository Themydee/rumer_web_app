import React, { ReactNode, Suspense } from "react";
import MarketplaceHeader from "@/components/global-b/MarketplaceHeader";
import FooterB from "@/components/global-b/FooterB";
import ScrollToTopBottom from "@/components/buttons/ScrollToTopBottom";

interface MarketplaceLayoutProps {
	children: ReactNode;
}

const MarketplaceLayout = ({ children }: MarketplaceLayoutProps) => {
	return (
		<main className='bg-white relative'>
			<Suspense fallback={null}>
				<MarketplaceHeader />
			</Suspense>
			<div className='relative w-full min-h-screen'>
				{children}
			</div>
			<ScrollToTopBottom />
			<FooterB />
		</main>
	);
};

export default MarketplaceLayout;
