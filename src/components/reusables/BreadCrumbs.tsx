// components/Breadcrumb.tsx
"use client";
import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
	pageName: string;
	videoTitle?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ pageName, videoTitle }) => {
	const breadcrumbs = [
		{ path: "/", label: "Home", isCurrent: false },
		{
			path: `/${pageName.toLowerCase()}/${videoTitle
				?.toLowerCase()
				.replace(/\s+/g, "-")}`,
			label: videoTitle,
			isCurrent: true,
		},
	];
	return (
		<ol
			className='flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm'
			aria-label='Breadcrumb'
		>
			{breadcrumbs.map((crumb, index) => (
				<li key={index} className='flex items-center'>
					{crumb.isCurrent ? (
						<span
							className='text-primary-100 font-semibold'
							aria-current='page'
						>
							{crumb.label}
						</span>
					) : (
						<>
							<Link
								href={crumb.path}
								className='text-gray-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded'
							>
								{crumb.label}
							</Link>
							{breadcrumbs.length > 1 && (
								<span className='mx-2 text-gray-400' aria-hidden='true'>
									/
								</span>
							)}
						</>
					)}
				</li>
			))}
		</ol>
	);
};

export default Breadcrumb;
