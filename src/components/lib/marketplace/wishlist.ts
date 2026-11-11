"use client";

export interface WishlistItem {
	id: string;
	name: string;
	price: number;
	image: string;
	supplier: string;
}

const WISHLIST_KEY = "rumer_marketplace_wishlist";

export function getWishlist(): WishlistItem[] {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(WISHLIST_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

export function saveWishlist(wishlist: WishlistItem[]): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
	window.dispatchEvent(new Event("rumer-wishlist-updated"));
}

export function addToWishlist(item: WishlistItem): WishlistItem[] {
	const wishlist = getWishlist();
	if (wishlist.find((i) => i.id === item.id)) return wishlist;
	const updated = [...wishlist, item];
	saveWishlist(updated);
	return updated;
}

export function removeFromWishlist(id: string): WishlistItem[] {
	const updated = getWishlist().filter((item) => item.id !== id);
	saveWishlist(updated);
	return updated;
}

export function isInWishlist(id: string): boolean {
	return getWishlist().some((item) => item.id === id);
}

export function toggleWishlist(item: WishlistItem): boolean {
	if (isInWishlist(item.id)) {
		removeFromWishlist(item.id);
		return false;
	} else {
		addToWishlist(item);
		return true;
	}
}
