// Shared image interfaces (put these in a shared types file if used across multiple files)
interface ImageNode {
	sourceUrl: string;
	altText: string;
	mediaDetails: MediaDetails;
}

interface MediaDetails {
	sizes: ImageSize[];
}

interface ImageSize {
	name: string;
	sourceUrl: string;
	width: string;
}

// ====================================================
// Solution Images Interfaces
// ====================================================

// Interface for each edge in the array
interface SolutionImageEdge {
	node: SolutionImageNode;
}

// Interface for node object
interface SolutionImageNode {
	id: string;
	databaseId: number;
	title: string;
	productImageContent: ProductImageContent;
}

// Interface for productImageContent object
interface ProductImageContent {
	solutionType: string;
	image: {
		node: ImageNode; // Use the shared ImageNode interface
	};
}

// ====================================================
// Your existing interfaces (Rename conflicting ones)
// ====================================================

// Rename your existing Icon interface to avoid conflict
interface IconType {
	node: ImageNode; // Use the shared ImageNode
}

// Rename your existing ImageNodeWrapper to avoid conflict
interface WrappedImageNode {
	node: ImageNode; // Use the shared ImageNode
}

// If you have an existing Image interface, rename it:
interface ImageType {
	node: ImageNode; // Use the shared ImageNode
}
