"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import OverviewDashboard from "./_components/OverviewDashboard";
import OnboardingDashboard from "./_components/OnboardingDashboard";
import AuthGuard from "@/components/AuthGuard";
import { getToken } from "@/components/lib/supabase/auth";

const page = () => {
	const [userStatus, setUserStatus] = useState<"new" | "active">("new");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkUserProducts = async () => {
			try {
				const token = getToken();
				if (!token) {
					setLoading(false);
					return;
				}

				const headers = { Authorization: `Bearer ${token}` };

				const [productsRes, inventoryRes] = await Promise.all([
					fetch("/api/products", { headers }),
					fetch("/api/inventory", { headers }),
				]);

				const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
				const inventoryData = inventoryRes.ok ? await inventoryRes.json() : { inventory: [] };

				const hasProducts = (productsData.products?.length || 0) > 0;
				const hasInventory = (inventoryData.inventory?.length || 0) > 0;

				setUserStatus(hasProducts || hasInventory ? "active" : "new");
			} catch (error) {
				console.error("Failed to check user products:", error);
				setUserStatus("new");
			} finally {
				setLoading(false);
			}
		};

		checkUserProducts();
	}, []);

	if (loading) {
		return (
			<AuthGuard>
				<DashboardLayout className='px-2 lg:px-0'>
					<div className="min-h-[60vh] flex items-center justify-center">
						<div className="w-8 h-8 border-2 border-[#014834] border-t-transparent rounded-full animate-spin" />
					</div>
				</DashboardLayout>
			</AuthGuard>
		);
	}

	return (
		<AuthGuard>
			<DashboardLayout className='px-2 lg:px-0'>
				{userStatus === "new" ? <OnboardingDashboard /> : <OverviewDashboard />}
			</DashboardLayout>
		</AuthGuard>
	);
};

export default page;
