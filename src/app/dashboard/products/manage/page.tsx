import ManageStockPage from "./components/ManageStockPage";

export const metadata = {
	title: "Manage Stock | Rumer Trader",
	description: "Manage inventory across all products",
	robots: { index: false, follow: false },
};

export default function ManageStock() {
	return <ManageStockPage />;
}
