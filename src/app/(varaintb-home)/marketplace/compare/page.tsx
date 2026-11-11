"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Heart, ShoppingCart, Star, X, ArrowLeft } from "lucide-react";
import MarketplaceFooterSections from "../_components/MarketplaceFooterSections";
import { getCompareList, removeFromCompare, type CompareItem } from "@/components/lib/marketplace/compare";

function formatNaira(amount: number): string {
	return `₦${amount.toLocaleString("en-NG")}`;
}

function StarRating({ rating }: { rating: number }) {
	return (
		<div className='flex items-center gap-1'>
			{Array.from({ length: 5 }).map((_, i) => (
				<Star
					key={i}
					className={`w-4 h-4 ${
						i < Math.floor(rating)
							? "fill-yellow-400 text-yellow-400"
							: "fill-gray-200 text-gray-200"
					}`}
				/>
			))}
		</div>
	);
}

export default function ComparePage() {
	const [products, setProducts] = useState<CompareItem[]>([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		setProducts(getCompareList());

		const handleUpdate = () => {
			setProducts(getCompareList());
		};
		window.addEventListener("rumer-compare-updated", handleUpdate);
		return () => window.removeEventListener("rumer-compare-updated", handleUpdate);
	}, []);

	const handleRemove = (id: string) => {
		removeFromCompare(id);
		setProducts(getCompareList());
	};

	if (!mounted) return null;

	return (
		<div className='bg-white min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				{/* Breadcrumb */}
				<nav className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
					<Link href='/' className='hover:text-[#014834] transition-colors'>Home</Link>
					<ChevronRight className='w-4 h-4' />
					<span className='text-gray-900 font-medium'>Compare</span>
				</nav>

				{products.length === 0 ? (
					/* Empty State */
					<div className='flex flex-col items-center justify-center py-20'>
						<div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
							<svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' />
							</svg>
						</div>
						<h2 className='text-xl font-semibold text-gray-900 mb-2'>No products to compare</h2>
						<p className='text-gray-500 mb-6'>Add products from the shop to compare them side by side.</p>
						<Link
							href='/marketplace/shop'
							className='flex items-center gap-2 px-6 py-3 bg-[#014834] text-white rounded-lg font-medium hover:bg-[#013628] transition-colors'
						>
							<ArrowLeft className='w-4 h-4' />
							Browse Shop
						</Link>
					</div>
				) : (
					/* Comparison Table */
					<div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
						<div className='overflow-x-auto'>
							<table className='w-full min-w-[640px]'>
								{/* Product Headers */}
								<thead>
									<tr>
										<th className='w-40 p-4'></th>
										{products.map((product) => (
											<th key={product.id} className='p-4 text-center'>
												<div className='flex flex-col items-center'>
													<div className='relative mb-3'>
														<img
															src={product.image || "https://placehold.co/200?text=No+Image"}
															alt={product.name}
															className='w-40 h-40 object-cover rounded-xl border border-gray-200'
														/>
														<button
															onClick={() => handleRemove(product.id)}
															className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md'
															aria-label='Remove from compare'
														>
															<X className='w-3 h-3' />
														</button>
													</div>
													<h3 className='font-semibold text-gray-900 text-sm'>{product.name}</h3>
													<p className='text-xs text-gray-500 mt-0.5'>{product.supplier}</p>
													<Link
														href={`/marketplace/product/${product.id}`}
														className='mt-3 flex items-center gap-2 px-4 py-2 bg-[#014834] text-white text-xs font-medium rounded-lg hover:bg-[#013628] transition-colors'
													>
														<ShoppingCart className='w-3 h-3' />
														VIEW PRODUCT
													</Link>
												</div>
											</th>
										))}
									</tr>
								</thead>

								{/* Spec Rows */}
								<tbody>
									<tr className='bg-gray-50'>
										<td className='p-4 text-sm font-medium text-gray-700 border-t border-gray-200'>Price</td>
										{products.map((product) => (
											<td key={product.id} className='p-4 text-center border-t border-gray-200'>
												<span className='text-sm font-semibold text-[#014834]'>
													{formatNaira(product.price)}
												</span>
											</td>
										))}
									</tr>
									<tr className='bg-white'>
										<td className='p-4 text-sm font-medium text-gray-700 border-t border-gray-200'>Supplier</td>
										{products.map((product) => (
											<td key={product.id} className='p-4 text-center border-t border-gray-200'>
												<span className='text-sm text-gray-700'>{product.supplier}</span>
											</td>
										))}
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)}

				<MarketplaceFooterSections />
			</div>
		</div>
	);
}
