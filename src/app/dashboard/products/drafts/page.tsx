import ProductsPage from "../components/ProductsPage";

export const metadata = {
	title: "Drafts | Rumer Trader",
	description: "Manage your draft products",
	robots: { index: false, follow: false },
};

export default function Drafts() {
	return <ProductsPage statusFilter="draft" />;
}
