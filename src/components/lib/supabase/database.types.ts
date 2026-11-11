export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					id: string;
					email: string;
					password_hash: string;
					is_email_verified: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					email: string;
					password_hash: string;
					is_email_verified?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					password_hash?: string;
					is_email_verified?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					id: string;
					first_name: string;
					last_name: string;
					phone: string;
					username: string | null;
					avatar_url: string | null;
					business_type: "individual" | "business" | "trader" | null;
					farm_name: string | null;
					farm_location: string | null;
					livestock_types: string[];
					id_type: "nin" | "passport" | "nimc" | null;
					id_number: string | null;
					date_of_birth: string | null;
					bvn: string | null;
					gender: string | null;
					state_of_origin: string | null;
					id_file_url: string | null;
					is_verified: boolean;
					is_admin: boolean;
					kyc_tier: "tier_0" | "tier_1" | "tier_2" | "tier_3";
					kyc_status: "unverified" | "pending" | "verified" | "rejected";
					cooperative_id: string | null;
					is_sole_proprietor: boolean;
					kyc_rejection_reason: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					first_name?: string;
					last_name?: string;
					phone?: string;
					username?: string | null;
					avatar_url?: string | null;
					business_type?: "individual" | "business" | null;
					farm_name?: string | null;
					farm_location?: string | null;
					livestock_types?: string[];
					id_type?: "nin" | "passport" | "nimc" | null;
					id_number?: string | null;
					date_of_birth?: string | null;
					bvn?: string | null;
					gender?: string | null;
					state_of_origin?: string | null;
					id_file_url?: string | null;
					is_verified?: boolean;
					is_admin?: boolean;
					kyc_tier?: "tier_0" | "tier_1" | "tier_2" | "tier_3";
					kyc_status?: "unverified" | "pending" | "verified" | "rejected";
					cooperative_id?: string | null;
					is_sole_proprietor?: boolean;
					kyc_rejection_reason?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					first_name?: string;
					last_name?: string;
					phone?: string;
					username?: string | null;
					avatar_url?: string | null;
					business_type?: "individual" | "business" | null;
					farm_name?: string | null;
					farm_location?: string | null;
					livestock_types?: string[];
					id_type?: "nin" | "passport" | "nimc" | null;
					id_number?: string | null;
					date_of_birth?: string | null;
					bvn?: string | null;
					gender?: string | null;
					state_of_origin?: string | null;
					id_file_url?: string | null;
					is_verified?: boolean;
					is_admin?: boolean;
					kyc_tier?: "tier_0" | "tier_1" | "tier_2" | "tier_3";
					kyc_status?: "unverified" | "pending" | "verified" | "rejected";
					cooperative_id?: string | null;
					is_sole_proprietor?: boolean;
					kyc_rejection_reason?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			otp_codes: {
				Row: {
					id: string;
					user_id: string;
					code: string;
					type: "phone" | "email";
					expires_at: string;
					used: boolean;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					code: string;
					type: "phone" | "email";
					expires_at: string;
					used?: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					code?: string;
					type?: "phone" | "email";
					expires_at?: string;
					used?: boolean;
					created_at?: string;
				};
				Relationships: [];
			};
			sessions: {
				Row: {
					id: string;
					user_id: string;
					token: string;
					device_info: Json | null;
					expires_at: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					token: string;
					device_info?: Json | null;
					expires_at: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					token?: string;
					device_info?: Json | null;
					expires_at?: string;
					created_at?: string;
				};
				Relationships: [];
			};
			livestock: {
				Row: {
					id: string;
					owner_id: string;
					type: string;
					breed: string | null;
					weight: number | null;
					age_months: number | null;
					gender: "male" | "female" | null;
					health_status: string | null;
					traceability_id: string | null;
					images: string[];
					price: number | null;
					currency: string;
					status: "available" | "sold" | "reserved";
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					owner_id: string;
					type: string;
					breed?: string | null;
					weight?: number | null;
					age_months?: number | null;
					gender?: "male" | "female" | null;
					health_status?: string | null;
					traceability_id?: string | null;
					images?: string[];
					price?: number | null;
					currency?: string;
					status?: "available" | "sold" | "reserved";
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					owner_id?: string;
					type?: string;
					breed?: string | null;
					weight?: number | null;
					age_months?: number | null;
					gender?: "male" | "female" | null;
					health_status?: string | null;
					traceability_id?: string | null;
					images?: string[];
					price?: number | null;
					currency?: string;
					status?: "available" | "sold" | "reserved";
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			transactions: {
				Row: {
					id: string;
					buyer_id: string;
					seller_id: string;
					livestock_id: string;
					amount: number;
					currency: string;
					status: "pending" | "completed" | "failed" | "refunded";
					payment_method: string | null;
					reference: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					buyer_id: string;
					seller_id: string;
					livestock_id: string;
					amount: number;
					currency?: string;
					status?: "pending" | "completed" | "failed" | "refunded";
					payment_method?: string | null;
					reference?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					buyer_id?: string;
					seller_id?: string;
					livestock_id?: string;
					amount?: number;
					currency?: string;
					status?: "pending" | "completed" | "failed" | "refunded";
					payment_method?: string | null;
					reference?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			bank_accounts: {
				Row: {
					id: string;
					user_id: string;
					bank_name: string;
					account_number: string;
					account_name: string;
					is_primary: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					bank_name: string;
					account_number: string;
					account_name: string;
					is_primary?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					bank_name?: string;
					account_number?: string;
					account_name?: string;
					is_primary?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
		products: {
			Row: {
				id: string;
				owner_id: string;
				product_type: "livestock" | "processed";
				listing_type: "individual" | "bulk" | null;
				product_name: string;
				livestock_type: string | null;
				cut_type: string | null;
				age: number | null;
				unit_size: number | null;
				unit_measure: "Kg" | "Pack" | null;
				storage_type: string | null;
				hs_code: string | null;
				base_price: number;
				description: string | null;
				status: "draft" | "pending" | "published" | "sold";
				images: string[] | null;
				created_at: string;
				updated_at: string;
			};
			Insert: {
				id?: string;
				owner_id: string;
				product_type: "livestock" | "processed";
				listing_type?: "individual" | "bulk" | null;
				product_name: string;
				livestock_type?: string | null;
				cut_type?: string | null;
				age?: number | null;
				unit_size?: number | null;
				unit_measure?: "Kg" | "Pack" | null;
				storage_type?: string | null;
				hs_code?: string | null;
				base_price?: number;
				description?: string | null;
				status?: "draft" | "pending" | "published" | "sold";
				images?: string[] | null;
				created_at?: string;
				updated_at?: string;
			};
			Update: {
				id?: string;
				owner_id?: string;
				product_type?: "livestock" | "processed";
				listing_type?: "individual" | "bulk" | null;
				product_name?: string;
				livestock_type?: string | null;
				cut_type?: string | null;
				age?: number | null;
				unit_size?: number | null;
				unit_measure?: "Kg" | "Pack" | null;
				storage_type?: string | null;
				hs_code?: string | null;
				base_price?: number;
				description?: string | null;
				status?: "draft" | "pending" | "published" | "sold";
				images?: string[] | null;
				created_at?: string;
				updated_at?: string;
			};
			Relationships: [];
		};
			inventory: {
				Row: {
					id: string;
					product_id: string;
					owner_id: string;
					serial_number: string;
					weight: number | null;
					quantity: number;
					status: "available" | "reserved" | "sold" | "archived";
					state: string | null;
					lga: string | null;
					town: string | null;
					image_url: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					product_id: string;
					owner_id: string;
					serial_number: string;
					weight?: number | null;
					quantity?: number;
					status?: "available" | "reserved" | "sold" | "archived";
					state?: string | null;
					lga?: string | null;
					town?: string | null;
					image_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					product_id?: string;
					owner_id?: string;
					serial_number?: string;
					weight?: number | null;
					quantity?: number;
					status?: "available" | "reserved" | "sold" | "archived";
					state?: string | null;
					lga?: string | null;
					town?: string | null;
					image_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			notifications: {
				Row: {
					id: string;
					user_id: string;
					title: string;
					message: string;
					type: "info" | "success" | "warning" | "error";
					read: boolean;
					link: string | null;
					image: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					title: string;
					message: string;
					type?: "info" | "success" | "warning" | "error";
					read?: boolean;
					link?: string | null;
					image?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					title?: string;
					message?: string;
					type?: "info" | "success" | "warning" | "error";
					read?: boolean;
					link?: string | null;
					image?: string | null;
					created_at?: string;
				};
				Relationships: [];
			};
			notification_settings: {
				Row: {
					id: string;
					user_id: string;
					in_app: boolean;
					push: boolean;
					email: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					in_app?: boolean;
					push?: boolean;
					email?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					in_app?: boolean;
					push?: boolean;
					email?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			push_subscriptions: {
				Row: {
					id: string;
					user_id: string;
					endpoint: string;
					p256dh: string;
					auth: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					endpoint: string;
					p256dh: string;
					auth: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					endpoint?: string;
					p256dh?: string;
					auth?: string;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			cooperatives: {
				Row: {
					id: string;
					name: string;
					cac_registration_number: string | null;
					tin: string | null;
					constitution_url: string | null;
					officers: Json;
					authority_letter_url: string | null;
					bank_name: string | null;
					account_number: string | null;
					account_name: string | null;
					governance_rules_url: string | null;
					is_eewyla_cluster: boolean;
					eewyla_file_url: string | null;
					status: "pending" | "verified" | "rejected";
					rejection_reason: string | null;
					lead_user_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					cac_registration_number?: string | null;
					tin?: string | null;
					constitution_url?: string | null;
					officers?: Json;
					authority_letter_url?: string | null;
					bank_name?: string | null;
					account_number?: string | null;
					account_name?: string | null;
					governance_rules_url?: string | null;
					is_eewyla_cluster?: boolean;
					eewyla_file_url?: string | null;
					status?: "pending" | "verified" | "rejected";
					rejection_reason?: string | null;
					lead_user_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					cac_registration_number?: string | null;
					tin?: string | null;
					constitution_url?: string | null;
					officers?: Json;
					authority_letter_url?: string | null;
					bank_name?: string | null;
					account_number?: string | null;
					account_name?: string | null;
					governance_rules_url?: string | null;
					is_eewyla_cluster?: boolean;
					eewyla_file_url?: string | null;
					status?: "pending" | "verified" | "rejected";
					rejection_reason?: string | null;
					lead_user_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			business_verifications: {
				Row: {
					id: string;
					user_id: string;
					business_name: string;
					cac_number: string | null;
					cac_file_url: string | null;
					cac_status: string | null;
					bank_name: string | null;
					account_number: string | null;
					account_name: string | null;
					proof_of_address_type: string | null;
					proof_of_address_file_url: string | null;
					declaration_consent: boolean;
					terms_consent: boolean;
					status: "pending" | "verified" | "rejected";
					rejection_reason: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					business_name: string;
					cac_number?: string | null;
					cac_file_url?: string | null;
					cac_status?: string | null;
					bank_name?: string | null;
					account_number?: string | null;
					account_name?: string | null;
					proof_of_address_type?: string | null;
					proof_of_address_file_url?: string | null;
					declaration_consent?: boolean;
					terms_consent?: boolean;
					status?: "pending" | "verified" | "rejected";
					rejection_reason?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					business_name?: string;
					cac_number?: string | null;
					cac_file_url?: string | null;
					cac_status?: string | null;
					bank_name?: string | null;
					account_number?: string | null;
					account_name?: string | null;
					proof_of_address_type?: string | null;
					proof_of_address_file_url?: string | null;
					declaration_consent?: boolean;
					terms_consent?: boolean;
					status?: "pending" | "verified" | "rejected";
					rejection_reason?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
}

export type KycTier = "tier_0" | "tier_1" | "tier_2" | "tier_3";
export type KycStatus = "unverified" | "pending" | "verified" | "rejected";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type OtpCode = Database["public"]["Tables"]["otp_codes"]["Row"];
export type Session = Database["public"]["Tables"]["sessions"]["Row"];
export type Livestock = Database["public"]["Tables"]["livestock"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type BankAccount = Database["public"]["Tables"]["bank_accounts"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationSettingsRow = Database["public"]["Tables"]["notification_settings"]["Row"];
export type PushSubscriptionRow = Database["public"]["Tables"]["push_subscriptions"]["Row"];
export type Inventory = Database["public"]["Tables"]["inventory"]["Row"];
export type Cooperative = Database["public"]["Tables"]["cooperatives"]["Row"];
export type BusinessVerification = Database["public"]["Tables"]["business_verifications"]["Row"];
