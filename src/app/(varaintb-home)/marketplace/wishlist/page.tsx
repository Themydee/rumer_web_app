"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, ChevronRight, Trash2 } from "lucide-react";
import {
	getWishlist,
	removeFromWishlist,
	type WishlistItem,
} from "@/components/lib/marketplace/wishlist";
import { addToCart, formatNaira } from "@/components/lib/marketplace/cart";
import MarketplaceFooterSections from "../_components/MarketplaceFooterSections";

export default function WishlistPage() {
	const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		setWishlist(getWishlist());
	}, []);

	const handleRemove = (id: string) => {
		setWishlist(removeFromWishlist(id));
	};

	const handleAddToCart = (item: WishlistItem) => {
		addToCart({
			id: item.id,
			name: item.name,
			price: item.price,
			image: item.image,
			supplier: item.supplier,
		});
	};

	if (!mounted) return null;

	return (
		<div className='bg-white min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				{/* Breadcrumb */}
				<nav className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
					<Link href='/' className='hover:text-[#014834] transition-colors'>
						Home
					</Link>
					<ChevronRight className='w-4 h-4' />
					<span className='text-gray-900 font-medium'>Wishlist</span>
				</nav>

				<h1 className='text-2xl font-bold text-gray-900 mb-6'>Wishlist</h1>

				{wishlist.length === 0 ? (
					<div className='bg-white rounded-xl p-12 text-center border border-gray-200'>
						<Heart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
						<p className='text-gray-600 mb-6 text-lg'>Your wishlist is empty.</p>
						<Link
							href='/marketplace/shop'
							className='inline-flex items-center px-6 py-3 bg-[#014834] text-white rounded-lg hover:bg-[#013628] transition-colors font-medium'
						>
							Continue Shopping
						</Link>
					</div>
				) : (
					<div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
						{/* Table Header */}
						<div className='grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wide'>
							<div className='col-span-5'>Products</div>
							<div className='col-span-2 text-right'>Price</div>
							<div className='col-span-2 text-center'>Stock Status</div>
							<div className='col-span-3 text-right'>Actions</div>
						</div>

						{/* Table Rows */}
						{wishlist.map((item) => (
							<div
								key={item.id}
								className='grid grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors'
							>
								{/* Product */}
								<div className='col-span-5 flex items-center gap-4'>
									<input
										type='checkbox'
										className='w-5 h-5 rounded border-gray-300 text-[#014834] focus:ring-[#014834] cursor-pointer'
									/>
									<img
										src={item.image || "https://placehold.co/80?text=No+Image"}
										alt={item.name}
										className='w-16 h-16 object-cover rounded-lg border border-gray-200'
									/>
									<div>
										<h3 className='font-semibold text-gray-900 text-sm'>{item.name}</h3>
										<p className='text-xs text-gray-500 mt-0.5'>Color: Default</p>
									</div>
								</div>

								{/* Price */}
								<div className='col-span-2 text-right font-medium text-gray-900'>
									{formatNaira(item.price)}
								</div>

								{/* Stock Status */}
								<div className='col-span-2 flex justify-center'>
									<span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700'>
										IN STOCK
									</span>
								</div>

								{/* Actions */}
								<div className='col-span-3 flex items-center justify-end gap-2'>
									<button
										onClick={() => handleAddToCart(item)}
										className='flex items-center gap-2 px-4 py-2 bg-[#014834] text-white text-sm font-medium rounded-lg hover:bg-[#013628] transition-colors'
									>
										<ShoppingCart className='w-4 h-4' />
										ADD TO CART
									</button>
									<button
										onClick={() => handleRemove(item.id)}
										className='p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50'
										aria-label='Remove from wishlist'
									>
										<Trash2 className='w-4 h-4' />
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				<MarketplaceFooterSections />
			</div>
		</div>
	);
}
