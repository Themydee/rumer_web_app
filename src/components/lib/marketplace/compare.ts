"use client";

export interface CompareItem {
	id: string;
	name: string;
	price: number;
	image: string;
	supplier: string;
}

const COMPARE_KEY = "rumer_marketplace_compare";

export function getCompareList(): CompareItem[] {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(COMPARE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

export function saveCompareList(compare: CompareItem[]): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
	window.dispatchEvent(new Event("rumer-compare-updated"));
}

export function addToCompare(item: CompareItem): CompareItem[] {
	const compare = getCompareList();
	if (compare.find((i) => i.id === item.id)) return compare;
	const updated = [...compare, item];
	saveCompareList(updated);
	return updated;
}

export function removeFromCompare(id: string): CompareItem[] {
	const updated = getCompareList().filter((item) => item.id !== id);
	saveCompareList(updated);
	return updated;
}

export function isInCompare(id: string): boolean {
	return getCompareList().some((item) => item.id === id);
}

export function toggleCompare(item: CompareItem): boolean {
	if (isInCompare(item.id)) {
		removeFromCompare(item.id);
		return false;
	} else {
		addToCompare(item);
		return true;
	}
}
