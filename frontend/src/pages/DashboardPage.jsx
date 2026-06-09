// src/pages/DashboardPage.jsx
import { useState, useEffect } from "react";
// Import your pre-built utility function
import { getAllSims } from "../utils/simUtils";

import Header from "../components/layout/Header";
import FilterCard from "../components/cards/FilterCard";
import SearchControls from "../components/ui/SearchControls";
import SimulationCard from "../components/cards/SimulationCard";
import Modal from "../components/ui/Modal";
import SimulationForm from "../components/forms/NewSimulationForm";

export const DashboardPage = ({ onLogout }) => {
  const [simulations, setSimulations] = useState([]);

// 1. EXTRACT into a reusable, named function
  const fetchSimulations = async () => {
    try {
      const json = await getAllSims();
      setSimulations(Object.values(json.data));
    } catch (error) {
      console.error("Failed to load simulations:", error);
    }
  };

  // 2. CALL the function inside useEffect on initial load
  useEffect(() => { 
    fetchSimulations(); 
  }, []);

	// FILTERS
	const [searchTerm, setSearchTerm] = useState("");
	const [viewMode, setViewMode] = useState("grid");
	const [filterStatus, setFilterStatus] = useState("all");

	// MODAL CONTROL
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	// Calculate counts for each compliance status
	const countByStatus = (status) =>
	simulations.filter(
		(sim) =>
		sim.sim_results &&
		sim.sim_results.compliance_status &&
		sim.sim_results.compliance_status.category === status
	).length;

	const totalCount = simulations.length;
	const passedCount = countByStatus("passed");
	const pendingCount = countByStatus("pending");
	const failedCount = countByStatus("failed");

	// Apply search + compliance filter
	const filteredSimulations = simulations.filter((sim) => {
	const matchesSearch = sim.project_name
		.toLowerCase()
		.includes(searchTerm.toLowerCase());
	const matchesStatus =
		filterStatus === "all" ||
		(sim.sim_results &&
		sim.sim_results.compliance_status &&
		sim.sim_results.compliance_status.category === filterStatus);
	return matchesSearch && matchesStatus;
	});

	//DASHBOARD LAYOUT
	return (
		<div className="bg-gray-50 min-h-screen">
			<Header onNewSimulationClick={openModal} onLogout={onLogout} />
			<div className="container mx-auto px-20 py-8 space-y-8 flex flex-col">
				{/* Filter Card Section */}
				<section
					id="dashboard_filters"
					className="grid grid-cols-1 md:grid-cols-4 gap-4"
				>
					<FilterCard
						variant="all"
						title="Total Simulations"
						value={totalCount}
						onClick={() => setFilterStatus("all")}
						subtitle="Click to view all"
					/>
					<FilterCard
						variant="passed"
						title="Compliance Passed"
						value={passedCount}
						onClick={() => setFilterStatus("passed")}
					/>
					<FilterCard
						variant="pending"
						title="Pending Review"
						value={pendingCount}
						onClick={() => setFilterStatus("pending")}
					/>
					<FilterCard
						variant="failed"
						title="High Risk Items"
						value={failedCount}
						onClick={() => setFilterStatus("failed")}
					/>
				</section>

				{/* Toggle View and Search Bar */}
				<section
					id="dashboard_controls"
					className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
				>
					<SearchControls
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						viewMode={viewMode}
						setViewMode={setViewMode}
					/>
				</section>

				{/* Simulation Cards */}
				<section id="print-area">
					<section
						id="dashboard_main"
						className={`grid ${viewMode === "grid"
								? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
								: "space-y-4"
							}`}
					>
						{filteredSimulations.map((sim) => (
							<SimulationCard
								key={sim.uuid}
								id={sim.uuid}
								name={sim.project_name}
								segment={sim.target_segment}
								marketFitScore={sim.sim_results?.market_fit ?? { score: "N/A" }} // pass object
								riskLevel={sim.sim_results?.risk_level ?? { category: "N/A" }}   // pass object
								complianceStatus={sim.sim_results?.compliance_status ?? { category: "N/A" }} // pass object
								lastUpdated={'12 minutes ago'}
							/>
						))}
						
					</section>
				</section>
			</div>

			
			{isModalOpen && (
				<Modal onClose={closeModal}>
					<SimulationForm 
						onClose={closeModal} 
						// FIX: Pass the fetch function so the form can tell the dashboard to refresh
						onSuccess={fetchSimulations} 
					/>
				</Modal>
			)}
        </div>
    );
};

export default DashboardPage;

