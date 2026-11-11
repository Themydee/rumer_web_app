// Image related interfaces
interface ImageSize {
	name: string;
	sourceUrl: string;
	width: string;
	height: string;
}

interface MediaDetails {
	sizes: ImageSize[];
}

interface ImageNode {
	sourceUrl: string;
	altText: string;
	mediaDetails: MediaDetails;
}

interface ImageField {
	node: ImageNode;
}

// WhyRumerWorks points - using index signature for dynamic points
interface WhyRumerPoint {
	title: string;
	description: string;
}

interface WhyRumerWorksFields {
	image: ImageField;
	[key: `points${number}`]: WhyRumerPoint; // Dynamic keys like points1, points2, etc.
}

// Or if you want to keep it strict with exactly 5 points:
interface WhyRumerWorksFieldsStrict {
	image: ImageField;
	points1: WhyRumerPoint;
	points2: WhyRumerPoint;
	points3: WhyRumerPoint;
	points4: WhyRumerPoint;
	points5: WhyRumerPoint;
}

// Main Post interface
interface WhyRumerWorksDataType {
	id: string;
	databaseId: number;
	title: string;
	content: string;
	excerpt: string;
	date: string;
	modified: string;
	whyRumerWorks: WhyRumerWorksFields | WhyRumerWorksFieldsStrict;
}
