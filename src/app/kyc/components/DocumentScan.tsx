"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

interface DocumentScanProps {
	idType: string;
	onComplete: () => void;
	onCancel: () => void;
}

type ScanStep = "get-ready" | "camera-access" | "review-id";

const DocumentScan = ({ idType, onComplete, onCancel }: DocumentScanProps) => {
	const [currentStep, setCurrentStep] = useState<ScanStep>("get-ready");
	const [captureMode, setCaptureMode] = useState<"auto" | "manual">("auto");
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [cameraError, setCameraError] = useState("");
	const [cameraReady, setCameraReady] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const streamRef = useRef<MediaStream | null>(null);

	const startCamera = useCallback(async () => {
		setCameraError("");
		setCameraReady(false);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "environment",
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
				audio: false,
			});
			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.onloadedmetadata = () => {
					videoRef.current?.play();
					setCameraReady(true);
				};
			}
		} catch (err) {
			console.error("Camera error:", err);
			setCameraError("Could not access camera. Please allow camera permissions and try again.");
		}
	}, []);

	const stopCamera = useCallback(() => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
	}, []);

	useEffect(() => {
		if (currentStep === "camera-access") {
			startCamera();
		} else {
			stopCamera();
		}
		return () => {
			stopCamera();
		};
	}, [currentStep, startCamera, stopCamera]);

	const captureFrame = () => {
		if (!videoRef.current || !canvasRef.current || !cameraReady) return null;
		const video = videoRef.current;
		const canvas = canvasRef.current;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg", 0.92);
	};

	const handleGetReadyContinue = () => {
		setCurrentStep("camera-access");
	};

	const handleCameraContinue = () => {
		const image = captureFrame();
		if (image) {
			setCapturedImage(image);
			setCurrentStep("review-id");
		}
	};

	const handleRetake = () => {
		setCapturedImage(null);
		setCurrentStep("camera-access");
	};

	const handleReviewGood = () => {
		onComplete();
	};

	// Get Ready to Scan
	if (currentStep === "get-ready") {
		return (
			<div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
					<div className="flex justify-center mb-6">
						<div className="w-16 h-16 bg-[#014834] rounded-full flex items-center justify-center">
							<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
							</svg>
						</div>
					</div>

					<h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
						Get ready to scan your ID
					</h2>
					<p className="text-gray-600 text-center mb-8">
						You must scan your driving licence, passport or government-issued photo ID.
					</p>

					<div className="flex gap-4">
						<button
							onClick={onCancel}
							className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
						>
							Cancel
						</button>
						<button
							onClick={handleGetReadyContinue}
							className="flex-1 py-3 rounded-xl bg-[#014834] text-white font-medium hover:bg-[#013628] transition-all"
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Camera Access / ID Scanning
	if (currentStep === "camera-access") {
		return (
			<div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl max-w-md w-full relative">
					<button
						onClick={onCancel}
						className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center"
					>
						<svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>

					<div className="p-8 pt-12">
						<h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
							Allow camera access
						</h2>

						<div className="flex justify-center mb-4">
							<div className="bg-gray-100 rounded-lg p-1 flex">
								<button
									onClick={() => setCaptureMode("auto")}
									className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
										captureMode === "auto"
											? "bg-white text-gray-900 shadow-sm"
											: "text-gray-500"
									}`}
								>
									Auto
								</button>
								<button
									onClick={() => setCaptureMode("manual")}
									className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
										captureMode === "manual"
											? "bg-white text-gray-900 shadow-sm"
											: "text-gray-500"
									}`}
								>
									Manual
								</button>
							</div>
						</div>

						<div className="bg-gray-800 rounded-xl aspect-[4/3] mb-4 flex items-center justify-center relative overflow-hidden">
							<video
								ref={videoRef}
								autoPlay
								playsInline
								muted
								className="absolute inset-0 w-full h-full object-cover"
							/>
							<canvas ref={canvasRef} className="hidden" />
							{!cameraReady && !cameraError && (
								<div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
									<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
								</div>
							)}
							{cameraError && (
								<div className="absolute inset-0 flex items-center justify-center p-6 bg-gray-900/80 text-white text-center">
									<p>{cameraError}</p>
									<button
										onClick={startCamera}
										className="mt-3 px-4 py-2 bg-[#014834] rounded-lg text-sm font-medium"
									>
										Try Again
									</button>
								</div>
							)}
						</div>

						<div className="bg-white rounded-lg p-3 text-center mb-4 shadow-sm">
							<p className="font-semibold text-gray-900">
								{idType === "passport" ? "Passport" : "ID"} - Face Up & Open
							</p>
							<p className="text-sm text-gray-500">
								Frame your {idType === "passport" ? "passport" : "ID"} and capture
							</p>
						</div>

						<p className="text-gray-600 text-center text-sm mb-6">
							When prompted, allow camera access to continue your verification.
						</p>

						<div className="flex gap-4">
							<button
								onClick={onCancel}
								className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
							>
								Cancel
							</button>
							<button
								onClick={handleCameraContinue}
								disabled={!cameraReady}
								className="flex-1 py-3 rounded-xl bg-[#014834] text-white font-medium hover:bg-[#013628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Continue
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Review ID
	return (
		<div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl max-w-md w-full relative">
				<button
					onClick={onCancel}
					className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center"
				>
					<svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<div className="p-8 pt-12">
					<h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
						Review front of ID
					</h2>
					<p className="text-gray-600 text-center mb-4">
						Check that all your details are visible and in focus.
					</p>

					<div className="bg-gray-200 rounded-xl aspect-[4/3] mb-4 flex items-center justify-center overflow-hidden">
						{capturedImage ? (
							<img src={capturedImage} alt="Captured ID" className="w-full h-full object-cover" />
						) : (
							<div className="bg-white/80 rounded-lg p-4 border-2 border-dashed border-gray-300">
								<div className="text-gray-500 text-center">
									<svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<p className="text-sm">Captured ID image</p>
								</div>
							</div>
						)}
					</div>

					<div className="bg-white rounded-lg p-3 text-center mb-6 shadow-sm border border-gray-100">
						<p className="font-semibold text-gray-900">
							{idType === "passport" ? "Passport" : "ID"} - Face Up & Open
						</p>
						<p className="text-sm text-gray-500">
							Frame your {idType === "passport" ? "passport" : "ID"} and capture
						</p>
					</div>

					<div className="flex gap-4">
						<button
							onClick={handleRetake}
							className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
						>
							Retake Photo
						</button>
						<button
							onClick={handleReviewGood}
							className="flex-1 py-3 rounded-xl bg-[#014834] text-white font-medium hover:bg-[#013628] transition-all"
						>
							Look Good
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DocumentScan;
