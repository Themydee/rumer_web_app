"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { FOOTER_SECTIONS } from "../utils/constants";
import Link from "next/link";

const FooterPathnames = () => {
	const pathname = usePathname();
	return (
		<div className='col-span-6 flex pl-2 sm:justify-center lg:grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12'>
			{FOOTER_SECTIONS.map((section) => (
				<div key={section.title} className=''>
					<h3 className='font-semibold mb-3 sm:mb-4 lg:mb-5 text-white text-sm sm:text-base lg:text-lg'>
						{section.title}
					</h3>
					<ul className='space-y-2 sm:space-y-3 lg:space-y-4'>
						{section.links.map((link) => (
							<li key={link.label}>
								<Link
									href={link.href}
									className={`text-xs sm:text-sm lg:text-base hover:text-primary-100  transition-colors duration-200 block py-1 sm:py-0 hover:translate-x-1 ${
										pathname === link.href
											? "text-primary-100"
											: "text-gray-300"
									}`}
									title={link.description}
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default FooterPathnames;
