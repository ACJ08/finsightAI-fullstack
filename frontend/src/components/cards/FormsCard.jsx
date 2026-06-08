const FormsCard = ({ label, children }) => {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>
			{children}
		</div>
	);
};

export default FormsCard;
