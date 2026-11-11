"use client";
import Link from "next/link";
import HamburgerMenu from "react-hamburger-menu";
import { navItems } from "../utils/constants";

interface SidebarMenuProps {
	isMenuOpen: boolean;
	setIsMenuOpen: (value: boolean) => void;
	pathname: string;
}

const SidebarMenu = ({
	isMenuOpen,
	setIsMenuOpen,
	pathname,
}: SidebarMenuProps) => {
	//   const router = useRouter();

	return (
		<>
			<div className='lg:hidden'>
				{/* @ts-ignore */}
				<HamburgerMenu
					isOpen={isMenuOpen}
					menuClicked={() => setIsMenuOpen(!isMenuOpen)}
					width={24}
					height={16}
					strokeWidth={2}
					rotate={0}
					color='white'
					borderRadius={0}
					animationDuration={0.3}
				/>
			</div>

			{isMenuOpen && (
				<div className='lg:hidden absolute -z-10 top-[80px] left-0 right-0 bg-bg-100 w-[75%] h-screen shadow-md transition-all duration-300'>
					<div className='flex flex-col space-y-4 p-4'>
						{navItems.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								onClick={() => setIsMenuOpen(false)}
								className={`text-base font-medium py-2 px-4 rounded-md hover:bg-gray-700 transition-colors ${
									pathname === item.href
										? "text-primary-100 bg-gray-800"
										: "text-white"
								}`}
							>
								{item.name}
							</Link>
						))}
					</div>
				</div>
			)}
		</>
	);
};
export default SidebarMenu;
