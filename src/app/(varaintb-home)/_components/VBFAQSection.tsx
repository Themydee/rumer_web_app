"use client";
import React, { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import sanitizeHtml from "sanitize-html";
import { motion, AnimatePresence } from "framer-motion";

interface FAQPostType {
	id: string;
	databaseId: number;
	title: string;
	content: string;
}

interface VBFAQSectionProps {
	Faqs?: FAQPostType[];
}

const defaultFaqs: FAQPostType[] = [
	{
		id: "1",
		databaseId: 1,
		title: "Why should I use Rumer?",
		content: "Rumer provides a secure, transparent platform for buying and selling livestock with full traceability.",
	},
	{
		id: "2",
		databaseId: 2,
		title: "What types of sessions is Rumer best for?",
		content: "Rumer is best for sourcing livestock, processing, and international trade.",
	},
	{
		id: "3",
		databaseId: 3,
		title: "Is Rumer free?",
		content: "Rumer offers competitive pricing with no hidden fees.",
	},
];

const VBFAQSection = ({ Faqs }: VBFAQSectionProps) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const faqList = Faqs && Faqs.length > 0 ? Faqs : defaultFaqs;

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className='py-16 sm:py-20 lg:pt-10 lg:pb-20'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* FAQ Title */}
				<h2 className='text-3xl sm:text-4xl lg:text-6xl font-medium text-black-100 mb-8 sm:mb-10 tracking-tighter'>
					FAQ.
				</h2>

				<div className='space-y-4 sm:space-y-6'>
					{[...faqList]?.reverse()?.map((faq, index) => (
						<motion.div
							key={faq.id || index}
							initial={false}
							className='bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden'
						>
							<button
								onClick={() => toggleFAQ(index)}
								className='w-full px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200 group'
							>
								<h3 className='text-base sm:text-lg lg:text-xl font- text-bg-500 pr-4 sm:pr-8'>
									{faq.title}
								</h3>

								<div className='size-6 sm:size-8 flex-shrink-0 flex items-center justify-center rounded-full group-hover:bg-gray-100 transition-colors'>
									{openIndex === index ? (
										<MinusIcon className='w-4 h-4 sm:w-5 sm:h-5 text-bg-500' />
									) : (
										<PlusIcon className='w-4 h-4 sm:w-5 sm:h-5 text-bg-500' />
									)}
								</div>
							</button>

							<AnimatePresence initial={false}>
								{openIndex === index && (
									<motion.div
										initial='collapsed'
										animate='open'
										exit='collapsed'
										variants={{
											open: { opacity: 1, height: "auto" },
											collapsed: { opacity: 0, height: 0 },
										}}
										transition={{ duration: 0.4, ease: "easeInOut" }}
									>
										<div className='px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6'>
											<div
												className='text-black-100/90 font-inter leading-relaxed font-light text-sm sm:text-base lg:text-lg 
    [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-2'
												dangerouslySetInnerHTML={{
													__html: sanitizeHtml(faq.content, {
														allowedTags: [
															"h1",
															"h2",
															"h3",
															"h4",
															"h5",
															"h6",
															"p",
															"br",
															"em",
															"strong",
															"i",
															"b",
															"ul",
															"ol",
															"li",
															"blockquote",
															"a",
															"img",
															"div",
															"span",
														],
														allowedAttributes: {
															a: ["href", "title", "target", "rel"],
															img: ["src", "alt", "width", "height", "class"],
															"*": ["class", "style"],
														},
														transformTags: {
															a: (tagName, attribs) => ({
																tagName,
																attribs: {
																	...attribs,
																	rel: attribs.href?.startsWith("http")
																		? "noopener noreferrer"
																		: "",
																	target: attribs.target || "_blank",
																},
															}),
														},
													}),
												}}
											/>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default VBFAQSection;
