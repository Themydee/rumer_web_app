import ViewProductPage from "./components/ViewProductPage";

export const metadata = {
	title: "View Listing | Rumer Trader",
	description: "View your product listing",
	robots: { index: false, follow: false },
};

export default async function ViewProduct({
	params,
}: {
	params: Promise<{ productId: string }>;
}) {
	const { productId } = await params;
	return <ViewProductPage productId={productId} />;
}
