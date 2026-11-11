// "use client";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useCallback, useState } from "react";
// import { CiSearch } from "react-icons/ci";
// import { ImSpinner2 } from "react-icons/im";

// interface SearchInput2Props {
// 	className?: string;
// 	placeholder?: string;
// 	searchQuery: string;
// 	setSearchQuery: (query: string) => void;
// }

// const SearchInput2 = ({
// 	className,
// 	placeholder = "Search",
// 	searchQuery,
// 	setSearchQuery,
// }: SearchInput2Props) => {
// 	const [isSearchLoading, setIsSearchLoading] = useState(false);

// 	const handleSearch = useCallback(() => {
// 		if (!searchQuery.trim()) return;

// 		setIsSearchLoading(true);

// 		// Simulate loading (remove if your search is instant)
// 		const timer = setTimeout(() => {
// 			setIsSearchLoading(false);
// 		}, 500);

// 		return () => clearTimeout(timer);
// 	}, [searchQuery]);

// 	return (
// 		<div className={`flex w-full items-center relative`}>
// 			<CiSearch
// 				className='text-2xl text-black-100/80 absolute left-2.5 cursor-pointer'
// 				onClick={handleSearch}
// 			/>

// 			<input
// 				type='text'
// 				placeholder={placeholder}
// 				className={`font-medium text-sm pl-9 pr-1 lg:py-3.5 py-3 border outline-none focus:ring-[0.8px] ring-primary-100 rounded-sm lg:rounded-xl bg-bg-800 w-[300px] text-black-300 placeholder:text-black-300/40 ${className}`}
// 				value={searchQuery}
// 				onChange={(e) => setSearchQuery(e.target.value)}
// 				onKeyDown={(e) => e.key === "Enter" && handleSearch()}
// 			/>

// 			<button
// 				onSubmit={handleSearch}
// 				type='button'
// 				className='bg-primary-100 text-black text-sm rounded-r-sm lg:rounded-r-xl w-20 h-full absolute right-0 flex items-center justify-center'
// 			>
// 				{isSearchLoading ? (
// 					<ImSpinner2 className='text-xl animate-spin text-white mx-auto' />
// 				) : (
// 					"Search"
// 				)}
// 			</button>
// 		</div>
// 	);
// };

// export default SearchInput2;

"use client";

import { useCallback } from "react";
import { CiSearch } from "react-icons/ci";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: () => void;
}

const SearchInput2 = ({
  className,
  placeholder,
  searchQuery,
  setSearchQuery,
  onSearch,
}: SearchInputProps) => {
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim() || !onSearch) return;
    onSearch();
  }, [searchQuery, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={`relative flex items-center w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-250 focus-within:border-gray-400 transition-all ${className}`}>
      {/* Search Icon */}
      <CiSearch className="absolute left-4 text-xl text-gray-500 pointer-events-none z-10" />

      {/* Input – increased right padding so the ⌘K badge doesn't cover it */}
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-12 pr-24 py-3  text-gray-700 placeholder-gray-400 bg-transparent outline-none text-base font-normal"
      />

      {/* ⌘K badge – pointer-events-none so it doesn't block typing */}
      <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
        <kbd className="flex items-center gap-1 px-2 py-1 bg-white shadow-sm rounded-md text-xs text-gray-600 font-medium">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </div>
    </div>
  );
};

export default SearchInput2;
