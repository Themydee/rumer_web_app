import AddInventoryPage from "./components/AddInventoryPage";

export const metadata = {
	title: "Add Inventory | Rumer Trader",
	description: "Add inventory for your product",
	robots: { index: false, follow: false },
};

export default async function AddInventory({ params }: { params: Promise<{ productId: string }> }) {
	const { productId } = await params;
	return <AddInventoryPage productId={productId} />;
}
