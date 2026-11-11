import { NextResponse } from "next/server";

// Local GraphQL fallback used when no WordPress endpoint is configured
// (NEXT_PUBLIC_WORDPRESS_URL points at localhost). Returns valid but empty
// data so server-rendered pages don't crash when CMS content is unavailable.
//
// The shapes mirror the selections in src/components/lib/queries.ts — every
// field the page components read must be present (as an empty string, object
// or array) so destructuring in the client components does not throw.

const emptyImage = () => ({
	node: {
		sourceUrl: "",
		altText: "",
		mediaDetails: { sizes: [] as unknown[] },
	},
});

const emptyFeRumerContent = () => ({
	id: "",
	title: "",
	introducingRumer: {
		description: "",
		tagName: "",
		title: "",
		titleBrea: "",
		leftCard: { cardTag: "", description: "", title: "" },
		rightCard: {
			logoImage: emptyImage(),
			boxOne: { title: "", logo1: emptyImage(), logo2: emptyImage() },
			boxTwo: { title: "", logo1: emptyImage(), logo2: emptyImage() },
			boxThree: {
				title: "",
				logo1: emptyImage(),
				logo2: emptyImage(),
				logo3: emptyImage(),
			},
		},
	},
	whatMakesRumerDiffer: {
		description: "",
		title: "",
		points: { pointOne: "", pointThree: "", pointTwo: "" },
		joinEarlyAccess: { title: "", url: "" },
		listGroup: {
			listOne: { title: "", image: emptyImage() },
			listTwo: { title: "", image: emptyImage() },
			listThree: { title: "", image: emptyImage() },
			listFour: { title: "", image: emptyImage() },
			listFive: { title: "", image: emptyImage() },
			listSix: { title: "", image: emptyImage() },
		},
	},
	joinTheRumerEarly: {
		description: "",
		tag: "",
		title: "",
		points: { pointOne: "", pointThree: "", pointTwo: "" },
		applyForEarlyAccess: { title: "", url: "" },
		rightGroup: {
			upCardGroup: { amount: "", rate: "", rateAmount: "" },
			downCard: { amount: "", tag: "" },
			icons: {
				iconOne: emptyImage(),
				iconTwo: emptyImage(),
				iconThree: emptyImage(),
				iconFour: emptyImage(),
			},
		},
	},
	frontViewComponent: {
		leftSection: {
			description: "",
			tag: "",
			titleBreaks: { one: "", two: "", three: "", four: "" },
			joinEarlyAccessButton: { title: "", url: "" },
		},
		rightSide: {
			imageViewOne: { image: emptyImage(), tag: { name: "", icon: emptyImage() } },
			imageViewTwo: { tag: "", image: emptyImage() },
		},
		additonalCard: {
			name: "",
			title: "",
			amount: "",
			dateAndCategory: "",
			image: emptyImage(),
		},
	},
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const operationName: string | undefined = body.operationName;

		let data: Record<string, unknown> = {};
		switch (operationName) {
			case "GetWhyRumerWorksPost":
				data = {
					post: {
						id: "",
						databaseId: 0,
						title: "",
						content: "",
						excerpt: "",
						date: "",
						modified: "",
						whyRumerWorks: {
							image: emptyImage(),
							points1: { description: "", title: "" },
							points2: { description: "", title: "" },
							points3: { description: "", title: "" },
							points4: { description: "", title: "" },
							points5: { description: "", title: "" },
						},
					},
				};
				break;
			case "GetFaqsPosts":
				data = { faqs: { nodes: [] } };
				break;
			case "GetTestimonialPosts":
				data = { testimonials: { nodes: [] } };
				break;
			case "GetPost":
				data = { feRumerContent: emptyFeRumerContent() };
				break;
			default:
				data = {};
		}

		return NextResponse.json({ data });
	} catch {
		return NextResponse.json({ data: {} });
	}
}
