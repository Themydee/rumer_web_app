"use client";

export interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
	supplier: string;
}

const CART_KEY = "rumer_marketplace_cart";

export function getCart(): CartItem[] {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(CART_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

export function saveCart(cart: CartItem[]): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(CART_KEY, JSON.stringify(cart));
	window.dispatchEvent(new Event("rumer-cart-updated"));
}

export function addToCart(item: Omit<CartItem, "quantity">): CartItem[] {
	const cart = getCart();
	const existing = cart.find((i) => i.id === item.id);
	let updated: CartItem[];
	if (existing) {
		updated = cart.map((i) =>
			i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
		);
	} else {
		updated = [...cart, { ...item, quantity: 1 }];
	}
	saveCart(updated);
	return updated;
}

export function removeFromCart(id: string): CartItem[] {
	const updated = getCart().filter((item) => item.id !== id);
	saveCart(updated);
	return updated;
}

export function updateQuantity(id: string, quantity: number): CartItem[] {
	const updated = getCart()
		.map((item) => (item.id === id ? { ...item, quantity } : item))
		.filter((item) => item.quantity > 0);
	saveCart(updated);
	return updated;
}

export function clearCart(): void {
	saveCart([]);
}

export function formatNaira(amount: number): string {
	if (!amount || isNaN(amount)) return "₦0";
	return `₦${amount.toLocaleString("en-NG")}`;
}

export function getCartCount(): number {
	return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(): number {
	return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}
