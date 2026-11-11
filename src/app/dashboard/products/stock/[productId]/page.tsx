import StockListPage from "./components/StockListPage";

export const metadata = {
	title: "Stock List | Rumer Trader",
	description: "View inventory for your product",
	robots: { index: false, follow: false },
};

export default async function StockList({ params }: { params: Promise<{ productId: string }> }) {
	const { productId } = await params;
	return <StockListPage productId={productId} />;
}
