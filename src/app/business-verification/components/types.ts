export interface BusinessData {
	businessName: string;
	cacFile: File | null;
	cacStatus: string;
	bankName: string;
	accountNumber: string;
	accountName: string;
	proofOfAddressType: string;
	proofOfAddressFile: File | null;
	declarationConsent: boolean;
	termsConsent: boolean;
}
