"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { ImSpinner2 } from "react-icons/im";

interface SearchProps {
	className?: string;
	placeholder?: string;
}

const SearchInput = ({ className, placeholder = "Search" }: SearchProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
	const [isSearchLoading, setIsSearchLoading] = useState(false);

	const handleSearch = useCallback(() => {
		if (!searchQuery.trim()) return;

		setIsSearchLoading(true);

		const params = new URLSearchParams();
		params.set("q", searchQuery.trim());

		router.push(`/search?${params.toString()}`);
		// Simulate loading (remove if your search is instant)
		const timer = setTimeout(() => {
			setIsSearchLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery, router]);

	return (
		<div className={`flex w-full sm:w-fit items-center relative`}>
			<CiSearch
				className='text-2xl text-black-100/80 absolute left-2.5 cursor-pointer'
				onClick={handleSearch}
			/>

			<input
				type='text'
				placeholder={placeholder}
				className={`font-medium text-sm pl-9 pr-1 lg:py-3.5 py-3 border outline-none focus:ring-[0.8px] ring-primary-100 rounded-sm lg:rounded-xl bg-bg-800 w-[300px] text-black-300 placeholder:text-black-300/40 ${className}`}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleSearch()}
			/>

			<button
				onSubmit={handleSearch}
				type='button'
				className='bg-primary-100 text-black text-sm rounded-r-sm lg:rounded-r-xl w-20 h-full absolute right-0 flex items-center justify-center'
			>
				{isSearchLoading ? (
					<ImSpinner2 className='text-xl animate-spin text-white mx-auto' />
				) : (
					"Search"
				)}
			</button>
		</div>
	);
};

export default SearchInput;
