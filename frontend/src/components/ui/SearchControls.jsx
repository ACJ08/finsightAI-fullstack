import { Search, Grid, List } from "lucide-react";

const SearchControls = ({
	searchTerm,
	setSearchTerm,
	viewMode,
	setViewMode,
}) => {
	const toggleView = () => {
		setViewMode(viewMode === "grid" ? "list" : "grid");
	};

	return (
		<div className="flex items-center space-x-4">
			{/* Toggle Button */}
			<button
				onClick={toggleView}
				className="p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none hover:cursor-pointer"
			>
				{viewMode === "grid" ? (
					<List className="h-4 w-4" />
				) : (
					<Grid className="h-4 w-4" />
				)}
			</button>

			{/* Search Bar */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
				<input
					id="search_sim"
					type="text"
					placeholder="Search simulations..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>
	);
};

export default SearchControls;
