import { useNavigate } from "react-router-dom";
import { deleteSim } from "../../utils/simUtils";
import Button from "../ui/Button";

// We receive simId from the SimulationDetailsPage
const DeleteSimulationForm = ({ simId, onClose }) => {
  // We use navigate to automatically route you away from deleted data
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await deleteSim(simId);
        // Navigate away FIRST, so the UI doesn't try to render deleted data
        navigate("/dashboard", { replace: true }); 
        
        // Then close the modal cleanly
        onClose(); 
    } catch (err) { 
        alert("Failed to delete: " + err);
    }
};

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-red-600 mb-4">Are you sure?</h2>
      <p className="mb-4">This action cannot be undone.</p>
      <div className="flex gap-4">
        {/* Wired up the "Yes, Delete" button to trigger the handleSubmit command */}
        <Button variant="delete" size="md" onClick={handleSubmit} className="flex-1">
          Yes, Delete
        </Button>
        <Button variant="outline" size="md" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteSimulationForm;