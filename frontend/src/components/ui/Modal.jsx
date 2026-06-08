const Modal = ({ onClose, children }) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
			<div className="max-h-[100vh] overflow-y-auto bg-white rounded-lg shadow-lg w-full max-w-4xl p-7 relative">
				<button
					className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
					onClick={onClose}
				>
					✕
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
