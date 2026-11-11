import EditProductPage from "./components/EditProductPage";

export const metadata = {
	title: "Edit Listing | Rumer Trader",
	description: "Edit your product listing",
	robots: { index: false, follow: false },
};

export default async function EditProduct({
	params,
}: {
	params: Promise<{ productId: string }>;
}) {
	const { productId } = await params;
	return <EditProductPage productId={productId} />;
}
