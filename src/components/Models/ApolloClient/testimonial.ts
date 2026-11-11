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

// Testimonials data
interface TestimonialType {
	companyName: string;
	content: string;
	location: string;
	name: string;
	image: ImageNodeWrapper;
}

// Individual testimonial post
interface TestimonialPostType {
	id: string;
	databaseId: number;
	testimonials: TestimonialType;
}
