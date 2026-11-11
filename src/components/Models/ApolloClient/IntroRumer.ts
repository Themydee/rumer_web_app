// Reuse existing interfaces from your example
interface ImageSize {
	name: string;
	sourceUrl: string;
	width: string;
}

interface MediaDetails {
	sizes: ImageSize[];
}

interface Image {
	sourceUrl: string;
	altText: string;
	mediaDetails: MediaDetails;
}

interface ImageNodeWrapper {
	node: Image;
}

interface Link {
	title: string;
	url: string;
}

// Rumer Box interfaces
interface RumerBox {
	title: string;
	logo1: ImageNodeWrapper;
	logo2: ImageNodeWrapper;
	logo3?: ImageNodeWrapper; // Optional for boxThree
}

// Right Card interface
interface IntroducingRumerRightCard {
	logoImage: ImageNodeWrapper;
	boxOne: RumerBox;
	boxTwo: RumerBox;
	boxThree: RumerBox;
}

// Left Card interface
interface IntroducingRumerLeftCard {
	cardTag: string;
	description: string;
	title: string;
}

// Main IntroducingRumer interface
interface IntroducingRumerType {
	description: string;
	tagName: string;
	title: string;
	titleBrea: string;
	leftCard: IntroducingRumerLeftCard;
	rightCard: IntroducingRumerRightCard;
}

// Main content type
interface FeRumerContentType {
	id: string;
	title: string;
	introducingRumer: IntroducingRumerType;
}
