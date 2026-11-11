"use client";

import { useEffect, useState, useCallback } from "react";

export interface MarketplaceProduct {
	id: string;
	owner_id: string;
	product_type: string;
	listing_type: string | null;
	product_name: string;
	livestock_type: string | null;
	cut_type: string | null;
	unit_size: number | null;
	unit_measure: string | null;
	storage_type: string | null;
	hs_code: string | null;
	base_price: number;
	description: string | null;
	status: "draft" | "pending" | "published" | "sold";
	images: string[];
	created_at: string;
	profiles?: {
		first_name: string | null;
		last_name: string | null;
		farm_name: string | null;
	};
}

interface UseMarketplaceProductsOptions {
	productType?: string;
	livestockType?: string;
	search?: string;
	state?: string;
	lga?: string;
	enabled?: boolean;
}

export function useMarketplaceProducts(options: UseMarketplaceProductsOptions = {}) {
	const [products, setProducts] = useState<MarketplaceProduct[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = useCallback(async () => {
		if (options.enabled === false) return;
		setLoading(true);
		setError(null);

		try {
			const params = new URLSearchParams();
			params.set("status", "published");
			if (options.productType) params.set("productType", options.productType);
			if (options.livestockType) params.set("livestockType", options.livestockType);
			if (options.search) params.set("search", options.search);
			if (options.state) params.set("state", options.state);
			if (options.lga) params.set("lga", options.lga);

			const response = await fetch(`/api/marketplace/products?${params.toString()}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to fetch products");
			}

			setProducts(data.products || []);
		} catch (err: any) {
			console.error("Marketplace fetch error:", err);
			setError(err.message || "Failed to fetch products");
		} finally {
			setLoading(false);
		}
	}, [options.productType, options.livestockType, options.search, options.state, options.lga, options.enabled]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return { products, loading, error, refetch: fetchProducts };
}

export function getProductImage(product: MarketplaceProduct): string {
	if (product.images && product.images.length > 0) {
		return product.images[0];
	}
	// Fallback placeholder
	return "https://placehold.co/400x300/png?text=No+Image";
}

export function getSupplierName(product: MarketplaceProduct): string {
	if (product.profiles?.farm_name) {
		return product.profiles.farm_name;
	}
	const first = product.profiles?.first_name || "";
	const last = product.profiles?.last_name || "";
	const name = `${first} ${last}`.trim();
	return name || "Rumer Seller";
}
