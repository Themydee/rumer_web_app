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

export function getGraphqlFallbackData(
	operationName?: string,
): Record<string, unknown> {
	switch (operationName) {
		case "GetWhyRumerWorksPost":
			return {
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
		case "GetFaqsPosts":
			return { faqs: { nodes: [] } };
		case "GetTestimonialPosts":
			return { testimonials: { nodes: [] } };
		case "GetPost":
			return { feRumerContent: emptyFeRumerContent() };
		default:
			return {};
	}
}

