import StatusStyles from "../ui/StatusStyles.jsx";
import { getStatusTextColor } from "../../utils/statusUtils";

const FilterCard = ({
	variant = "all",
	title,
	value,
	onClick,
	subtitle = "Click to filter",
}) => {
	const textColor = getStatusTextColor(variant);

	return (
		<div
			className="rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
			onClick={onClick}
		>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-600">{title}</p>
						<p className={`text-2xl font-bold ${textColor}`}>{value}</p>
						<p className={`text-xs ${textColor}`}>{subtitle}</p>
					</div>
					<StatusStyles status={variant} />
				</div>
			</div>
		</div>
	);
};

export default FilterCard;
