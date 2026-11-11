import ProductsPage from "../components/ProductsPage";

export const metadata = {
	title: "Sold | Rumer Trader",
	description: "Your sold products",
	robots: { index: false, follow: false },
};

export default function Sold() {
	return <ProductsPage statusFilter="sold" />;
}
