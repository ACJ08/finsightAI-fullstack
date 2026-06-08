const TitleCard = ({ title, children }) => {
	return (
		<div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
			<h2 className="text-2xl font-bold mb-2">{title}</h2>
			<div className="text-blue-100">{children}</div>
		</div>
	);
};

export default TitleCard;
