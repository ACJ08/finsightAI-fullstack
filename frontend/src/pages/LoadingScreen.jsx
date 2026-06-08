import { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete }) => {
	const [index, setIndex] = useState(0);
	const fullText = "Finsight AI";

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => {
				if (prev < fullText.length) {
					return prev + 1;
				} else {
					clearInterval(interval);
					setTimeout(() => {
						onComplete();
					}, 1000);
					return prev;
				}
			});
		}, 100);

		return () => clearInterval(interval);
	}, [onComplete]);

	return (
		<div className="fixed inset-0 z-50 bg-white text-black flex flex-col items-center justify-center space-y-6">
			{/* Logo and Text side-by-side */}
			<div className="flex items-center">
				<img
					src="/src/assets/FinSightAI-Logo2.png"
					alt="Finsight AI Logo"
					className="w-12 h-12 object-contain"
				/>
				<div className="text-4xl font-bold flex items-center">
					{fullText.substring(0, index)}
					<span className="animate-blink ml-1">|</span>
				</div>
			</div>

			{/* Progress bar */}
			<div className="w-[200px] h-[2px] bg-gray-800 rounded relative overflow-hidden">
				<div className="w-[40%] h-full bg-blue-500 shadow-[0_0_15px#3b82f6] animate-loading-bar"></div>
			</div>
		</div>
	);
};

export default LoadingScreen;
