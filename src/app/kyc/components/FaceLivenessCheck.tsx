"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

interface FaceLivenessCheckProps {
	onComplete: () => void;
	onCancel: () => void;
}

const FaceLivenessCheck = ({ onComplete, onCancel }: FaceLivenessCheckProps) => {
	const [captureMode, setCaptureMode] = useState<"auto" | "manual">("auto");
	const [faceInstruction, setFaceInstruction] = useState("Turn your head to the right");
	const [cameraError, setCameraError] = useState("");
	const [cameraReady, setCameraReady] = useState(false);

	const faceVideoRef = useRef<HTMLVideoElement>(null);
	const faceCanvasRef = useRef<HTMLCanvasElement>(null);
	const faceStreamRef = useRef<MediaStream | null>(null);
	const faceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const startFaceCamera = useCallback(async () => {
		setCameraError("");
		setCameraReady(false);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
				audio: false,
			});
			faceStreamRef.current = stream;
			if (faceVideoRef.current) {
				faceVideoRef.current.srcObject = stream;
				faceVideoRef.current.onloadedmetadata = () => {
					faceVideoRef.current?.play();
					setCameraReady(true);
				};
			}
		} catch (err) {
			console.error("Face camera error:", err);
			setCameraError("Could not access camera. Please allow camera permissions and try again.");
		}
	}, []);

	const stopFaceCamera = useCallback(() => {
		if (faceStreamRef.current) {
			faceStreamRef.current.getTracks().forEach((track) => track.stop());
			faceStreamRef.current = null;
		}
		if (faceVideoRef.current) {
			faceVideoRef.current.srcObject = null;
		}
		if (faceTimeoutRef.current) {
			clearTimeout(faceTimeoutRef.current);
			faceTimeoutRef.current = null;
		}
	}, []);

	useEffect(() => {
		startFaceCamera();
		faceTimeoutRef.current = setTimeout(() => {
			setFaceInstruction("Face scan complete");
		}, 3000);
		return () => {
			stopFaceCamera();
		};
	}, [startFaceCamera, stopFaceCamera]);

	const handleContinue = () => {
		onComplete();
	};

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
						Facial liveness check
					</h2>
					<p className="text-gray-600 text-center mb-4">
						When prompted, allow camera access to continue your verification.
					</p>

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

					<div className="bg-gray-900 rounded-xl aspect-[3/4] mb-4 flex items-center justify-center relative overflow-hidden">
						<video
							ref={faceVideoRef}
							autoPlay
							playsInline
							muted
							className="absolute inset-0 w-full h-full object-cover"
						/>
						<canvas ref={faceCanvasRef} className="hidden" />
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<div className="w-48 h-64 border-2 border-dashed border-[#4fd1c5] rounded-full" />
						</div>

						{!cameraReady && !cameraError && (
							<div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
								<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
							</div>
						)}
						{cameraError && (
							<div className="absolute inset-0 flex items-center justify-center p-6 bg-gray-900/80 text-white text-center">
								<p>{cameraError}</p>
								<button
									onClick={startFaceCamera}
									className="mt-3 px-4 py-2 bg-[#014834] rounded-lg text-sm font-medium"
								>
									Try Again
								</button>
							</div>
						)}

						<div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-3">
							<p className="font-semibold text-gray-900">{faceInstruction}</p>
							<div className="flex items-center justify-between mt-1">
								<p className="text-sm text-gray-500">Waiting...</p>
								<div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin" />
							</div>
						</div>
					</div>

					<div className="flex gap-4">
						<button
							onClick={onCancel}
							className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
						>
							Cancel
						</button>
						<button
							onClick={handleContinue}
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
};

export default FaceLivenessCheck;
