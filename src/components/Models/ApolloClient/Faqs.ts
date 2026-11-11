// Individual FAQ item
interface FAQPostType {
	id: string;
	databaseId: number;
	title: string;
	content: string;
}

// Array of FAQ items
interface FAQPostsType {
	nodes: FAQPostType[];
}
