import {
	getComplianceColor,
	getRiskColor,
	statusIcons,
} from "../../utils/statusUtils";

const StatusStyles = ({ status }) => {
	const { icon: Icon, color } = statusIcons[status] || {};
	return Icon ? <Icon className={`h-8 w-8 ${color}`} /> : null;
};

export default StatusStyles;

export const ComplianceBadge = ({ status }) => {
	const label =
		{
			passed: "Passed",
			failed: "Failed",
			pending: "Manual Review",
		}[status] || "Unknown";

	const { icon: Icon, color } = statusIcons[status] || {};

	return (
		<span
			className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-3xl ${getComplianceColor(
				status
			)}`}
		>
			{Icon && <Icon className={`h-4 w-4 ${color}`} />}
		</span>
	);
};

export const RiskBadge = ({ risk }) => {
	const label =
		{
			low: "LOW RISK",
			medium: "MEDIUM RISK",
			high: "HIGH RISK",
		}[risk] || "UNKNOWN";

	const { icon: Icon, color } = statusIcons[risk] || {};

	return (
		<span
			className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-3xl ${getRiskColor(
				risk
			)}`}
		>
			{Icon && <Icon className={`h-4 w-4 ${color}`} />}
			{label}
		</span>
	);
};
