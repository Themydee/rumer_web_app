import React, { ReactNode, Suspense } from "react";
import MarketplaceLayout from "@/components/global-b/MarketplaceLayout";

interface LayoutProps {
	children: ReactNode;
}

export default function MarketplaceRouteLayout({ children }: LayoutProps) {
	return (
		<Suspense fallback={null}>
			<MarketplaceLayout>{children}</MarketplaceLayout>
		</Suspense>
	);
}
