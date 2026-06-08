const DescriptionCard = ({ title, icon: Icon, children, className = "" }) => {
	return (
		<div className={`bg-white rounded-lg shadow p-6 ${className}`}>
			{title && (
				<div className="flex items-center mb-4">
					{Icon && <Icon className="h-5 w-5 mr-2 text-blue-600" />}
					<h3 className="text-lg font-semibold">{title}</h3>
				</div>
			)}
			<div>{children}</div>
		</div>
	);
};

export default DescriptionCard;
