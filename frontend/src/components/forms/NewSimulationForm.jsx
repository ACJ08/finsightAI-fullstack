import { useState } from "react"; 
import { FileText } from "lucide-react";
import TitleCard from "../cards/TitleCard";
import DescriptionCard from "../cards/DescriptionCard";
import FormCard from "../cards/FormsCard";
import { createSim } from "../../utils/simUtils";

const NewSimulationForm = ({ onClose, onSuccess }) => { 
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => { 
        e.preventDefault();
        
        // Disable submission during loading
        setIsLoading(true);

        const simData = { 
            // Extract form data from all input fields
            project_name: e.target.elements["name"].value,
            target_segment: e.target.elements["segment"].value, 
            key_features: e.target.elements["features"].value, 
            market_conditions: e.target.elements["market"].value, 
            compliance_notes: e.target.elements["compliance"].value, 
        };

        try { 
            // Attempt to call the backend API
            const response = await createSim(simData); 
            
            // Verify successful response before proceeding
            if (!response || !response.data) {
                throw new Error("Invalid response from server - no data returned");
            }
            
            // If API succeeds, refresh the dashboard and close
            if (onSuccess) {
                await onSuccess(); 
            }
            
            // Show success message
            alert("✅ Simulation created successfully!");
            
            // Close the modal - this will also reset form state
            onClose(); 
        } catch (err) { 
            // CRITICAL FIX: Always reset loading state on error
            // This allows users to retry after a failure
            setIsLoading(false);
            
            // Extract meaningful error message for the user
            let displayError = "Failed to create simulation";
            
            if (typeof err === 'string') {
                displayError = err;
            } else if (err.response?.data?.error) {
                displayError = err.response.data.error;
            } else if (err.message) {
                displayError = err.message;
            } else if (err.code === 'ECONNREFUSED') {
                displayError = "Backend server is offline. Please try again later.";
            }
            
            // Log full error to console for debugging
            console.error("❌ Simulation creation failed:", err);
            
            // Show user-friendly error message with more context
            alert("❌ Simulation Failed:\n" + displayError); 
        } 
    }; 

    return (
        <div className="space-y-4">
            <TitleCard title="Create New MSME Product Simulation">
                <p>
                    Design and test your next MSME product with AI-powered market insights
                    and compliance validation.
                </p>
            </TitleCard>

            <DescriptionCard title="Simulation Details">
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <FormCard label="Simulation Name">
                        <input
                            type="text"
                            name="name"
                            required
                            disabled={isLoading}
                            className="w-full p-2 border rounded disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                        />
                    </FormCard>

                    <FormCard label="Segment">
                        <input
                            type="text"
                            name="segment"
                            required
                            disabled={isLoading}
                            className="w-full p-2 border rounded disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                        />
                    </FormCard>

                    <FormCard label="Key Features">
                        <textarea
                            name="features"
                            required
                            disabled={isLoading}
                            className="min-h-16 w-full p-2 border rounded placeholder-italic placeholder:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            placeholder="Describe the main features and benefits of this product..."
                        ></textarea>
                    </FormCard>

                    <FormCard label="Market Conditions">
                        <textarea
                            name="market"
                            required
                            disabled={isLoading}
                            className="min-h-16 w-full p-2 border rounded placeholder-italic placeholder:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            placeholder="Describe the current market environment, competition, and opportunities..."
                        ></textarea>
                    </FormCard>

                    <FormCard label="Compliance Notes">
                        <textarea
                            name="compliance"
                            required
                            disabled={isLoading}
                            className="min-h-16 w-full p-2 border rounded placeholder-italic placeholder:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            placeholder="Include BSP requirements, regulatory considerations, and compliance strategy..."
                        ></textarea>
                    </FormCard>

                    {isLoading && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-center space-x-3 mt-4">
                            <span className="font-medium text-sm animate-pulse">
                                AI is generating simulation... (This takes 10-20 seconds)
                            </span>
                        </div>
                    )}

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 rounded flex items-center space-x-2 transition-colors ${
                                isLoading 
                                    ? "bg-blue-400 cursor-not-allowed text-white" 
                                    : "bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white"
                            }`}
                        >
                            {isLoading ? "Processing..." : "Submit"}
                        </button>
                    </div>
                </form>
            </DescriptionCard>
        </div>
    );
};

export default NewSimulationForm;