import ProductsPage from "../components/ProductsPage";

export const metadata = {
	title: "Published | Rumer Trader",
	description: "Your published products",
	robots: { index: false, follow: false },
};

export default function Published() {
	return <ProductsPage statusFilter="published" />;
}
