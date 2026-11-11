import AddProductPage from "./components/AddProductPage";

export const metadata = {
	title: "Add Product | Rumer Trader",
	description: "Add a new product to your inventory",
	robots: { index: false, follow: false },
};

export default function AddProduct() {
	return <AddProductPage />;
}
