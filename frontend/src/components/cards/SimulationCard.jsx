// src/components/cards/SimulationCard.jsx
import { Link } from "react-router-dom";
import StatusStyles, { RiskBadge, ComplianceBadge } from "../ui/StatusStyles";

const SimulationCard = ({
  id,
  name,
  marketFitScore,
  riskLevel,
  complianceStatus,
  segment,
  lastUpdated,
}) => {
  // Use optional chaining and fallback values for safety
  const score = marketFitScore?.score ?? "N/A";
  const riskCategory = riskLevel?.category ?? "N/A";
  const complianceCategory = complianceStatus?.category ?? "N/A";

  // For progress bar, use 0 if score is not a number
  const progress = typeof score === "number" ? score : 0;

  return (
    <Link to={`/simulations/${id}`}>
      <div className="cursor-pointer rounded-xl border-l-4 border-l-blue-500 bg-white p-4 shadow-sm hover:shadow-lg transition-shadow space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {name}
          </h3>
          <ComplianceBadge status={complianceCategory} />
        </div>

        <p className="text-sm font-medium text-gray-500">
           Segment: <span className="text-white">{segment}</span>
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Market Fit Score: </span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(progress / 10) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold">{score}/10</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <RiskBadge risk={riskCategory} />
          <span className="text-xs text-gray-500">Updated: {lastUpdated}</span>
        </div>
      </div>
    </Link>
  );
};

export default SimulationCard;