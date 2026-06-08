import { getComplianceColor, getRiskColor } from "../../utils/statusUtils";

const SimulationDetailsItem = ({ title, content, type, justification }) => {
    let styledContent = content;

    if (type === "risk") {
        styledContent = (<>
            <span
                className={`text-sm font-semibold px-2 rounded-2xl ${getRiskColor(
                    content
                )}`}
            >
                {content.toUpperCase()}
            </span>
            <br />
            <span className={'text-sm font-semibold px-2 rounded-2xl'}>
                {justification}
            </span>
        </>);
    } else if (type === "compliance") {
        styledContent = (<>
            <span
                className={`text-sm font-semibold px-2 rounded-2xl ${getComplianceColor(
                    content
                )}`}
            >
                {content.toUpperCase()}
            </span>
            <br />
            <span className={'text-sm font-semibold px-2 rounded-2xl'}>
                {justification}
            </span>
        </>);
    } else if (type === "market_fit")
        styledContent = (<>
            <span
                className={`text-sm font-semibold px-2 rounded-2xl ${getComplianceColor(
                    content
                )}`}
            >
                {content.toUpperCase()}
            </span>
            <br />
            <span className={'text-sm font-semibold px-2 rounded-2xl'}>
                {justification}
            </span>
        </>);

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="text-xs text-gray-500 font-semibold uppercase mb-1 tracking-wide">
                {title}
            </h4>
            <div className="text-sm text-black-100 font-medium">{styledContent}</div>
        </div>
    );
};

export default SimulationDetailsItem;