"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
	interface Window {
		SwaggerUIBundle: any;
		SwaggerUIStandalonePreset: any;
	}
}

export default function ApiDocsPage() {
	const swaggerRef = useRef<HTMLDivElement>(null);
	const initializedRef = useRef(false);

	const initSwagger = () => {
		if (typeof window === "undefined" || !swaggerRef.current || !window.SwaggerUIBundle) return;

		if (!initializedRef.current) {
			initializedRef.current = true;
			window.SwaggerUIBundle({
				url: "/openapi.yaml",
				dom_id: "#swagger-ui",
				layout: "BaseLayout",
			});
		}
	};

	useEffect(() => {
		initSwagger();
	}, []);

	return (
		<>
			<link
				rel='stylesheet'
				type='text/css'
				href='https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css'
			/>
			<Script
				src='https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js'
				strategy='afterInteractive'
				onLoad={initSwagger}
			/>
			<div className='min-h-screen bg-white'>
				<div id='swagger-ui' ref={swaggerRef} />
			</div>
		</>
	);
}
