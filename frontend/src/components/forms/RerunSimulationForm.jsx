import { useState } from "react"; // 1. IMPORT useState to track loading
import { FileText } from "lucide-react";
import TitleCard from "../cards/TitleCard";
import DescriptionCard from "../cards/DescriptionCard";
import FormCard from "../cards/FormsCard";
import { rerunSim } from "../../utils/simUtils";

const RerunSimulationForm = ({ simId, simulation, onClose, onSuccess }) => {
    // 2. ADD state to track whether the form is currently processing
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Turn on the loading state the moment the user clicks submit
        setIsLoading(true);
        
        const updatedData = {
            project_name: e.target.elements["name"].value,
            target_segment: e.target.elements["segment"].value,
            key_features: e.target.elements["features"].value,
            market_conditions: e.target.elements["market"].value,
            compliance_notes: e.target.elements["compliance"].value,
        };

        try {
            // Call the API to rerun the simulation
            const response = await rerunSim(simId, updatedData);
            
            // Validate response was successful
            if (!response || !response.data) {
                throw new Error("Invalid response from server - no data returned");
            }
            
            // Show success message to user
            alert("✅ Simulation re-run successfully! Refreshing data...");
            
            // 1. Update the data silently in the background without refreshing the page
            if (onSuccess) {
                await onSuccess();
            }
            
            // 2. Close the modal smoothly
            onClose();
            
        } catch (err) {
            // CRITICAL FIX: Always reset loading state on error
            // This allows users to retry after failures
            setIsLoading(false);
            
            // Extract meaningful error message
            let displayError = "Failed to re-run simulation";
            
            if (typeof err === 'string') {
                displayError = err;
            } else if (err.response?.data?.error) {
                displayError = err.response.data.error;
            } else if (err.message) {
                displayError = err.message;
            } else if (err.code === 'ECONNREFUSED') {
                displayError = "Backend server is offline. Please try again.";
            }
            
            // Log full error to console for debugging
            console.error("❌ Simulation rerun failed:", err);
            
            // Show user-friendly error message
            alert("❌ Error re-running simulation:\n" + displayError);
        }
    };

    return (
        <div className="space-y-4">
            <TitleCard title="Rerun Product Simulation">
                <p>Edit and test your current MSME product for compliance.</p>
            </TitleCard>

            <DescriptionCard title="Simulation Details">
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <FormCard label="Simulation Name">
                        <input
                            type="text"
                            name="name"
                            required
                            defaultValue={simulation.project_name}
                            disabled={isLoading} // 5. Disable input when loading
                            className="w-full p-2 border rounded disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            style={{ color: "#FFFFFF" }}
                       />
                    </FormCard>

                    <FormCard label="Segment">
                        <input
                            type="text"
                            name="segment"
                            required
                            defaultValue={simulation.target_segment}
                            disabled={isLoading}
                            className="w-full p-2 border rounded disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            style={{ color: "#FFFFFF" }}
                        />
                    </FormCard>

                    <FormCard label="Key Features">
                        <textarea
                            name="features"
                            required
                            defaultValue={simulation.key_features}
                            disabled={isLoading}
                            className="min-h-16 w-full p-2 border rounded placeholder-italic placeholder:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            placeholder="Describe the main features and benefits of this product..."
                        ></textarea>
                    </FormCard>

                    <FormCard label="Market Conditions">
                        <textarea
                            name="market"
                            required
                            defaultValue={simulation.market_conditions}
                            disabled={isLoading}
                            className="min-h-16 w-full p-2 border rounded placeholder-italic placeholder:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            placeholder="Describe the current market environment, competition, and opportunities..."
                        ></textarea>
                    </FormCard>

                    <FormCard label="Compliance Notes">
                        <textarea
                            name="compliance"
                            required
                            defaultValue={simulation.compliance_notes}
                            disabled={isLoading}
                            className="min-h-16 w-full p-2 border rounded placeholder-italic placeholder:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            placeholder="Include BSP requirements, regulatory considerations, and compliance strategy..."
                        ></textarea>
                    </FormCard>

                    {/* 6. SHOW a progress message ONLY when isLoading is true */}
                    {isLoading && (
                        <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded flex items-center space-x-3 mt-4 animate-pulse">
                            <span className="font-medium text-sm">
                                AI is analyzing your updated data and re-running the simulation. Please wait...
                            </span>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading} // Disable cancel button while loading
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancel
                        </button>
                        
                        {/* 7. CHANGE button appearance based on isLoading state */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 rounded flex items-center space-x-2 transition-colors ${
                                isLoading 
                                    ? "bg-purple-400 cursor-not-allowed text-white" 
                                    : "bg-purple-600 hover:bg-purple-700 hover:cursor-pointer text-white"
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    {/* Built-in Tailwind SVG Spinner */}
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>Re-run Simulation</span>
                            )}
                        </button>
                    </div>
                </form>
            </DescriptionCard>
        </div>
    );
};

export default RerunSimulationForm;