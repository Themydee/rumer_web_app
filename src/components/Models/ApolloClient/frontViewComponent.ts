interface FrontViewComponentContent {
	id: string;
	title: string;
	frontViewComponent: FrontViewComponent;
}

interface FrontViewComponent {
	leftSection: LeftSection;
	rightSide: RightSide;
	additonalCard: AdditionalCard;
}

interface LeftSection {
	description: string;
	tag: string;
	titleBreaks: TitleBreaks;
	joinEarlyAccessButton: JoinEarlyAccessButton;
}

interface TitleBreaks {
	one: string;
	two: string;
	three: string;
	four: string;
}

interface JoinEarlyAccessButton {
	title: string;
	url: string;
}

interface RightSide {
	imageViewOne: ImageViewOne;
	imageViewTwo: ImageViewTwo;
}

interface ImageViewOne {
	image: FrontImageNode;
	tag: ImageViewTag;
}

interface ImageViewTwo {
	tag: string;
	image: FrontImageNode;
}

interface ImageViewTag {
	name: string;
	icon: IconNode;
}

interface AdditionalCard {
	name: string;
	title: string;
	amount: number;
	dateAndCategory: string;
	image: FrontImageNode;
}

interface IconNode {
	node: {
		sourceUrl: string;
		altText: string;
		mediaDetails: MediaDetails;
	};
}

interface FrontImageNode {
	node: {
		sourceUrl: string;
		altText: string;
		mediaDetails: MediaDetails;
	};
}

interface MediaDetails {
	sizes: ImageSize[];
}

interface ImageSize {
	name: string;
	sourceUrl: string;
	width: string;
}
