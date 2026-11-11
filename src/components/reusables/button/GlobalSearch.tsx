"use client";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";

interface SearchProps {
	searchQuery?: string;
	className?: string;
	placeholder?: string;
	setSearchQuery?: Dispatch<React.SetStateAction<any>>;
}

const GlobalSearchInput = ({
	searchQuery,
	className,
	placeholder = "Search",
	setSearchQuery,
}: SearchProps) => {
	const pathname = usePathname();
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const router = useRouter();
	// const [searchValue, setSearchValue] = useState("");

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery && setSearchQuery(event.target.value);
		// setSearchQuery && setSearchQuery(event.target.value);
	};
	const handleSearch = () => {
		setIsSearchLoading(true);

		router.push(`/search?q=${encodeURIComponent(searchQuery as string)}`);
		setIsSearchLoading(false);
	};

	return (
		<div className={`flex w-fit items-center relative`}>
			<IoSearch
				className='text-lg text-bg-300 absolute left-2.5'
				onClick={handleSearch}
			/>

			<input
				type='text'
				placeholder={placeholder}
				className={`font-medium text-sm pl-9 pr-1 py-3 border outline-none focus:ring-[0.8px] ring-primary-100 rounded-full bg-white w-[300px] text-black-300 placeholder:text-bg-300/40 ${className}`}
				value={searchQuery}
				onChange={handleInputChange}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						handleSearch();
					}
				}}
			/>
			{isSearchLoading && (
				<ImSpinner2 className='text-xl animate-spin absolute right-2 text-primary-100/60' />
			)}
		</div>
	);
};

export default GlobalSearchInput;
