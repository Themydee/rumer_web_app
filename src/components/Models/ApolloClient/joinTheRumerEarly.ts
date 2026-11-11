interface JoinTheRumerEarlyContent {
	id: string;
	title: string;
	joinTheRumerEarly: JoinTheRumerEarly;
}

// Interface for the joinTheRumerEarly object
interface JoinTheRumerEarly {
	description: string;
	tag: string;
	title: string;
	points: Points;
	applyForEarlyAccess: ApplyForEarlyAccess;
	rightGroup: RightGroup;
}

// Interface for points object
interface Points {
	pointOne: string;
	pointTwo: string;
	pointThree: string;
}

// Interface for applyForEarlyAccess object
interface ApplyForEarlyAccess {
	title: string;
	url: string;
}

// Interface for rightGroup object
interface RightGroup {
	upCardGroup: UpCardGroup;
	downCard: DownCard;
	icons: Icons;
}

// Interface for upCardGroup object
interface UpCardGroup {
	amount: number;
	rate: string;
	rateAmount: number;
}

// Interface for downCard object
interface DownCard {
	amount: number;
	tag: string;
}

// Interface for icons object
interface Icons {
	iconOne: Icon;
	iconTwo: Icon;
	iconThree: Icon;
	iconFour: Icon;
}

// Interface for each icon object
interface Icon {
	node: ImageNode;
}

// Interface for image node
interface ImageNode {
	sourceUrl: string;
	altText: string;
	mediaDetails: MediaDetails;
}

// Interface for media details
interface MediaDetails {
	sizes: ImageSize[];
}

// Interface for image size
interface ImageSize {
	name: string;
	sourceUrl: string;
	width: string;
}

// Product Content Post Type
// Main interface for the entire object
interface ProductContentPostType {
	id: string;
	databaseId: number;
	productContent: ProductContent;
}

// Interface for the productContent object
interface ProductContent {
	title: string;
	description: string;
	join: Join;
	icon: Icon;
}

// Interface for join object
interface Join {
	title: string;
	url: string;
}

// Interface for icon object
interface Icon {
	node: ImageNode;
}

// Interface for image node
interface ImageNode {
	sourceUrl: string;
	altText: string;
	mediaDetails: MediaDetails;
}

// Interface for media details
interface MediaDetails {
	sizes: ImageSize[];
}

// Interface for image size
interface ImageSize {
	name: string;
	sourceUrl: string;
	width: string;
}
