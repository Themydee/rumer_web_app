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

// WhatMakesRumerDifferent interfaces
interface ListItem {
	title: string;
	image: ImageNodeWrapper;
}

interface ListGroup {
	listOne: ListItem;
	listTwo: ListItem;
	listThree: ListItem;
	listFour: ListItem;
	listFive: ListItem;
	listSix: ListItem;
}

interface Points {
	pointOne: string;
	pointTwo: string;
	pointThree: string;
}

interface JoinEarlyAccess {
	title: string;
	url: string;
}

interface WhatMakesRumerDifferent {
	description: string;
	title: string;
	points: Points;
	joinEarlyAccess: JoinEarlyAccess;
	listGroup: ListGroup;
}

// Main content type
interface WhatMakesRumerContentType {
	id: string;
	title: string;
	whatMakesRumerDiffer: WhatMakesRumerDifferent;
}
