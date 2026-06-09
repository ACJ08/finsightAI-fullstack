import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api"; // 1. Use your configured Axios instance
import Header from "../components/layout/Header";
import SimulationDetailsItem from "../components/ui/SimulationDetailsItem";
import TitleCard from "../components/cards/TitleCard";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import NewSimulationForm from "../components/forms/NewSimulationForm";
import RerunSimulationForm from "../components/forms/RerunSimulationForm";
import DeleteSimulationForm from "../components/forms/DeleteSimulationForm";

const SimulationDetailsPage = ({ onLogout }) => {
    const { id } = useParams();
    const [simulation, setSimulation] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 2. Fetch data as a memoized function so it can be called again after rerun/delete
    const fetchSimulationDetails = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`get-sim/${id}`);
            setSimulation(res.data.data);
        } catch (err) {
            console.error("Failed to load details:", err);
            alert("Error loading simulation details.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSimulationDetails();
    }, [fetchSimulationDetails]);

    // Track which modal is open
    const [modalType, setModalType] = useState(null); 

    const openModal = (type) => setModalType(type);
    
    // 3. Close modal and refresh data if something changed
    const closeModal = () => {
        setModalType(null);
       // fetchSimulationDetails();
    };

    if (loading) return <div className="p-4 text-center">Loading simulation...</div>;
    if (!simulation) return <div className="p-4 text-center">Simulation not found.</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header
                onNewSimulationClick={() => openModal("new")}
                onLogout={onLogout}
            />
            <div className="container mx-auto px-20 py-8 space-y-8 flex flex-col">
                <div className="max-w-6xl mx-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline" size="md" onClick={() => navigate("/dashboard")}>
                            Return to Dashboard
                        </Button>
                        <Button
                            variant="rerun"
                            size="md"
                            onClick={() => openModal("rerun")}
                        >
                            Re-run Simulation
                        </Button>
                        <Button
                            variant="delete"
                            size="md"
                            onClick={() => openModal("delete")}
                        >
                            Delete Simulation
                        </Button>
                    </div>

                    <section id="print-area">
                        <TitleCard title={simulation.project_name}>
                            <p className="text-white font-medium">{simulation.target_segment}</p>
                        </TitleCard>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                            <SimulationDetailsItem
                                title="Market Fit Score"
                                content={`${simulation.sim_results?.market_fit?.score ?? "N/A"} / 10`}
                                type="market_fit"
                                justification={simulation.sim_results?.market_fit?.justification ?? "N/A"}
                            />
                            <SimulationDetailsItem
                                title="Risk Level"
                                content={simulation.sim_results?.risk_level?.category ?? "N/A"}
                                type="risk"
                                justification={simulation.sim_results?.risk_level?.justification ?? "N/A"}
                            />
                            <SimulationDetailsItem
                                title="Compliance Status"
                                content={simulation.sim_results?.compliance_status?.category ?? "N/A"}
                                type="compliance"
                                justification={simulation.sim_results?.compliance_status?.justification ?? "N/A"}
                            />
                            <SimulationDetailsItem
                                title="Key Features"
                                content={simulation.key_features}
                            />
                            <SimulationDetailsItem
                                title="Market Conditions"
                                content={simulation.market_conditions}
                            />
                            <SimulationDetailsItem
                                title="Compliance Notes"
                                content={simulation.compliance_notes}
                            />
                        </div>
                    </section>
                </div>
            </div>

            {modalType && (
                <Modal onClose={closeModal}>
                    {/* Added onSuccess prop to NewSimulationForm */}
                    {modalType === "new" && (
                        <NewSimulationForm 
                            onClose={closeModal} 
                            onSuccess={fetchSimulationDetails} 
                        />
                    )}
                    
                    {/* Added onSuccess prop to RerunSimulationForm */}
                    {modalType === "rerun" && (
                        <RerunSimulationForm 
                            simId={id} 
                            simulation={simulation} 
                            onClose={closeModal} 
                            onSuccess={fetchSimulationDetails}
                        />
                    )}
                    
                    {/* Delete form does NOT get onSuccess because the data is gone */}
                    {modalType === "delete" && (
                        <DeleteSimulationForm 
                            simId={id} 
                            onClose={closeModal} 
                        />
                    )}
                </Modal>
            )}
        </div>
    );
};

export default SimulationDetailsPage;