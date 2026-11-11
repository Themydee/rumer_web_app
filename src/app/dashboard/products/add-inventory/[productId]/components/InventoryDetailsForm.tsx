"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/components/lib/supabase/database.types";
import { getToken } from "@/components/lib/supabase/auth";
import { addNotification } from "@/components/lib/notifications";
import { Trash2, ChevronDown, ChevronUp, Plus, X } from "lucide-react";

interface InventoryDetailsFormProps {
	product: Product;
}

const NIGERIAN_STATES: Record<string, string[]> = {
	"Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"],
	"Adamawa": ["Demsa", "Fufure", "Ganye", "Girei", "Gombi", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
	"Akwa Ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat Enin", "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung Uko", "Ukanafun", "Uruan", "Uyo"],
	"Anambra": ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
	"Bauchi": ["Alkaleri", "Bauchi", "Bogoro", "Dass", "Darazo", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", " Toro", "Warji", "Zaki"],
	"Bayelsa": ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
	"Benue": ["Ado", "Agatu", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
	"Borno": ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
	"Cross River": ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"],
	"Delta": ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
	"Ebonyi": ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
	"Edo": ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Oredo", "Orhionmwon", "Ovia North-East", "Ovia South-East", "Owan East", "Owan West", "Uhunmwonde"],
	"Ekiti": ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
	"Enugu": ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"],
	"FCT": ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"],
	"Gombe": ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Talba", "Yamaltu/Deba"],
	"Imo": ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Onuimo", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"],
	"Jigawa": ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
	"Kaduna": ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
	"Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garum Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
	"Katsina": ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsin-Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
	"Kebbi": ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Birnin Yauri", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
	"Kogi": ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa-Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Omalara", "Ogori/Magongo", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
	"Kwara": ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke-Ero", "Oyun", "Pategi"],
	"Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
	"Nasarawa": ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
	"Niger": ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Muya", "Pailoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
	"Ogun": ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu"],
	"Ondo": ["Akoko North-East", "Akoko North-West", "Akoko South-West", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
	"Osun": ["Atakunmosa East", "Atakunmosa West", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"],
	"Oyo": ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo", "Oyo East", "Saki East", "Saki West", "Surulere"],
	"Plateau": ["Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
	"Rivers": ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Emohua", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
	"Sokoto": ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
	"Taraba": ["Ardo Kola", "Bali", "Donga", "Gashaka", "Germola", "Girei", "Gumti", "Karim Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
	"Yobe": ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Magumeri", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
	"Zamfara": ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Tsafe", "Zurmi"],
};

const InventoryDetailsForm = ({ product }: InventoryDetailsFormProps) => {
	const router = useRouter();
	const [images, setImages] = useState<{ file: File; preview: string; uploading: boolean }[]>([]);
	const [weight, setWeight] = useState("");
	const [age, setAge] = useState("");
	const [ageUnit, setAgeUnit] = useState<"Months" | "Years">("Months");
	const [state, setState] = useState("");
	const [lga, setLga] = useState("");
	const [town, setTown] = useState("");
	const [locationOpen, setLocationOpen] = useState(true);
	const [detailsOpen, setDetailsOpen] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const availableLGAs = state ? NIGERIAN_STATES[state] || [] : [];

	const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newImages = Array.from(files).map((file) => ({
			file,
			preview: URL.createObjectURL(file),
			uploading: true,
		}));

		setImages((prev) => [...prev, ...newImages]);

		// Simulate upload complete
		newImages.forEach((img, i) => {
			setTimeout(() => {
				setImages((prev) =>
					prev.map((im) => (im.file === img.file ? { ...im, uploading: false } : im))
				);
			}, 1500 + i * 500);
		});
	};

	const handleImageRemove = (index: number) => {
		setImages((prev) => {
			const removed = prev[index];
			URL.revokeObjectURL(removed.preview);
			return prev.filter((_, i) => i !== index);
		});
	};

	const handleAddToStock = async () => {
		setSaving(true);
		setError(null);

		const token = getToken();
		if (!token) {
			setError("Not authenticated");
			setSaving(false);
			return;
		}

		const res = await fetch("/api/inventory", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				productId: product.id,
				weight,
				age,
				ageUnit,
				state,
				lga,
				town,
			}),
		});

		const data = await res.json();
		setSaving(false);

		if (!res.ok) {
			setError(data.error || "Failed to add inventory");
			return;
		}

		addNotification({
			title: "Inventory added",
			message: `New inventory has been added to "${product.product_name || "your product"}".`,
			type: "success",
			link: `/dashboard/products/stock/${product.id}`,
		});

		router.push(`/dashboard/products/stock/${product.id}`);
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100">
			{/* Header */}
			<div className="flex items-center justify-between p-6 border-b border-gray-100">
				<h2 className="text-lg font-semibold text-gray-900">Product Details #1</h2>
				<div className="flex items-center gap-3">
					<button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition">
						<Trash2 className="w-4 h-4" />
						Delete
					</button>
					<button
						onClick={() => setDetailsOpen(!detailsOpen)}
						className="p-1.5 hover:bg-gray-100 rounded-lg transition"
					>
						{detailsOpen ? (
							<ChevronUp className="w-5 h-5 text-gray-400" />
						) : (
							<ChevronDown className="w-5 h-5 text-gray-400" />
						)}
					</button>
				</div>
			</div>

			{/* Content */}
			{detailsOpen && (
				<div className="p-6 space-y-6">
					{/* Product Images */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3">
							Product Images <span className="text-red-500">*</span>
						</label>
						<div className="flex items-center gap-3 flex-wrap">
							{images.map((img, index) => (
								<div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
									<img
										src={img.preview}
										alt={`Product ${index + 1}`}
										className="w-full h-full object-cover"
									/>
									{img.uploading && (
										<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
											<div className="text-center">
												<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto mb-1" />
												<span className="text-white text-xs">Uploading</span>
											</div>
										</div>
									)}
									<button
										onClick={() => handleImageRemove(index)}
										className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition"
									>
										<X className="w-3 h-3 text-white" />
									</button>
								</div>
							))}
							<label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition">
								<input
									type="file"
									multiple
									accept="image/*"
									className="hidden"
									onChange={handleImageAdd}
								/>
								<Plus className="w-6 h-6 text-gray-400" />
							</label>
						</div>
					</div>

					{/* Weight & Age */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Weight (kg) <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								value={weight}
								onChange={(e) => setWeight(e.target.value)}
								placeholder="Enter quantity"
								className="w-full px-4 py-3 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition"
								min="0"
								step="0.1"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Age <span className="text-red-500">*</span>
							</label>
							<div className="flex">
								<input
									type="number"
									value={age}
									onChange={(e) => setAge(e.target.value)}
									placeholder="Enter Age"
									className="flex-1 px-4 py-3 border border-gray-250 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition"
									min="0"
								/>
								<div className="flex border border-gray-200 rounded-r-xl overflow-hidden">
									<button
										type="button"
										onClick={() => setAgeUnit("Months")}
										className={`px-4 py-3 text-sm font-medium transition ${
											ageUnit === "Months"
												? "bg-gray-900 text-white"
												: "bg-gray-100 text-gray-600 hover:bg-gray-200"
										}`}
									>
										Months
									</button>
									<button
										type="button"
										onClick={() => setAgeUnit("Years")}
										className={`px-4 py-3 text-sm font-medium transition ${
											ageUnit === "Years"
												? "bg-gray-900 text-white"
												: "bg-gray-100 text-gray-600 hover:bg-gray-200"
										}`}
									>
										Years
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Location Section */}
					<div className="border border-gray-200 rounded-xl overflow-hidden">
						<button
							onClick={() => setLocationOpen(!locationOpen)}
							className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
						>
							<span className="font-semibold text-gray-900">Location</span>
							{locationOpen ? (
								<ChevronUp className="w-5 h-5 text-gray-400" />
							) : (
								<ChevronDown className="w-5 h-5 text-gray-400" />
							)}
						</button>
						{locationOpen && (
							<div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										State <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<select
											value={state}
											onChange={(e) => {
												setState(e.target.value);
												setLga("");
												setTown("");
											}}
											className="w-full px-4 py-3 border border-gray-250 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition bg-white"
										>
											<option value="">Select State</option>
											{Object.keys(NIGERIAN_STATES).map((s) => (
												<option key={s} value={s}>{s}</option>
											))}
										</select>
										<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										LGA <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<select
											value={lga}
											onChange={(e) => setLga(e.target.value)}
											className="w-full px-4 py-3 border border-gray-250 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition bg-white"
											disabled={!state}
										>
											<option value="">{state ? "Select LGA" : "Select State first"}</option>
											{availableLGAs.map((l) => (
												<option key={l} value={l}>{l}</option>
											))}
										</select>
										<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Town
									</label>
									<input
										type="text"
										value={town}
										onChange={(e) => setTown(e.target.value)}
										placeholder="Enter town (optional)"
										className="w-full px-4 py-3 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#014834]/20 focus:border-[#014834] transition"
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Footer Buttons */}
			<div className="flex items-center justify-between p-6 border-t border-gray-100">
				<button className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition">
					Preview
				</button>
				<div className="flex items-center gap-3">
					{error && (
						<p className="text-sm text-red-600 mr-3">{error}</p>
					)}
					<button
						onClick={handleCancel}
						className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
					>
						Cancel
					</button>
					<button
						onClick={handleAddToStock}
						disabled={saving}
						className="px-6 py-3 bg-[#014834] text-white rounded-xl font-medium hover:bg-[#013824] transition disabled:opacity-50"
					>
						{saving ? "Adding..." : "Add to stock"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default InventoryDetailsForm;
