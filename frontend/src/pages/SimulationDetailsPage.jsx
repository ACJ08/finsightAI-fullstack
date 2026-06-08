// src/pages/SimulationDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
	// data from backend
	const [simulation, setSimulation] = useState(null);
	useEffect(() => {
		(async function () {
			const fetchRes = await fetch(`/api/get-sim/${id}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});

			const json = await fetchRes.json();

			setSimulation(json.data);
		})()
	}, []);

	const navigate = useNavigate();

	// track which modal is open
	const [modalType, setModalType] = useState(null); // "new" | "rerun" | "delete" | null

	const openModal = (type) => setModalType(type);
	const closeModal = () => setModalType(null);


	if (!simulation) return <div className="p-4">Loading...</div>;

	return (
		<div className="bg-gray-50 min-h-screen">
			<Header
				onNewSimulationClick={() => openModal("new")}
				onLogout={onLogout}
			/>
			<div className="container mx-auto px-20 py-8 space-y-8 flex flex-col">
				<div className="max-w-6xl mx-auto p-6 space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Button variant="outline" size="md" onClick={() => navigate(-1)}>
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
							<p>{simulation.target_segment}</p>
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
					{modalType === "new" && <NewSimulationForm onClose={closeModal} />}
					{modalType === "rerun" && (
						// We pass the "simulation" data prop so the form can pre-fill the boxes!
                        <RerunSimulationForm simId={id} simulation={simulation} onClose={closeModal} />
					)}
					{modalType === "delete" && (
						
						<>
                            {/* We add simId={id} so the form knows exactly which project to destroy */}
                            <DeleteSimulationForm simId={id} onClose={closeModal} />
                        </>
						
					)}
				</Modal>
			)}
		</div>
	);
};

export default SimulationDetailsPage;



