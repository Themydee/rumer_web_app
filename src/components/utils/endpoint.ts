import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
export const BaseUrl = process.env.NEXT_PUBLIC_FRONT_URL || "";
export const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "";

export const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL!;

export const getPageDataById = async (pageId: number) =>
	axios.get(`${API_URL}/wp-json/wp/v2/pages/${pageId}`);

export const contactFormSubmit = async (data: any) =>
	axios.post(`${API_URL}/wp-json/contact/v1/submit`, data);
