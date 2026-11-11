import ProductsPage from "../components/ProductsPage";

export const metadata = {
	title: "Pending Approval | Rumer Trader",
	description: "Products pending review",
	robots: { index: false, follow: false },
};

export default function Pending() {
	return <ProductsPage statusFilter="pending" />;
}
