import { useState } from "react"; // 1. IMPORT useState to track loading
import { FileText } from "lucide-react";
import TitleCard from "../cards/TitleCard";
import DescriptionCard from "../cards/DescriptionCard";
import FormCard from "../cards/FormsCard";
import { createSim } from "../../utils/simUtils";

const NewSimulationForm = ({ onClose, onSuccess }) => { 
    // 2. ADD state to track whether the form is currently processing
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => { 
        e.preventDefault();
        
        // 3. TURN ON the loading state the moment the user clicks submit
        setIsLoading(true);

        const simData = { 
            project_name: e.target.elements["name"].value,
            target_segment: e.target.elements["segment"].value, 
            key_features: e.target.elements["features"].value, 
            market_conditions: e.target.elements["market"].value, 
            compliance_notes: e.target.elements["compliance"].value, 
        };

        try { 
            await createSim(simData); 
            
            if (onSuccess) {
                await onSuccess(); 
            }
            
            alert("Simulation created successfully!");
            onClose(); 
        } catch (err) { 
            alert(err || "Network error. Please try again."); 
            // 4. TURN OFF loading if there is an error, so the user can fix it and try again
            setIsLoading(false);
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
                            disabled={isLoading} // 5. Disable input when loading
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

                    {/* 6. SHOW a progress message ONLY when isLoading is true */}
                    {isLoading && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-center space-x-3 mt-4 animate-pulse">
                            <span className="font-medium text-sm">
                                AI is analyzing market data and generating your simulation. Please wait...
                            </span>
                        </div>
                    )}

                    <div className="flex justify-end mt-4">
                        {/* 7. CHANGE button appearance based on isLoading state */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 rounded flex items-center space-x-2 transition-colors ${
                                isLoading 
                                    ? "bg-blue-400 cursor-not-allowed text-white" 
                                    : "bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white"
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
                                <span>Submit</span>
                            )}
                        </button>
                    </div>
                </form>
            </DescriptionCard>
        </div>
    );
};

export default NewSimulationForm;