import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import "./index.css";

import LoadingScreen from "./pages/LoadingScreen.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SimulationDetailsPage from "./pages/SimulationDetailsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import { logout } from "./utils/authUtils";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
    const navigate = useNavigate();

    // Check if user already logged in (session persists)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        }
        setIsCheckingAuth(false); 
    }, []);

    // --- THESE WERE MISSING! ---
    const handleLogin = () => {
        setIsAuthenticated(true);
        setIsLoaded(false); // replay loading animation
    };

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
        navigate("/"); // go back to login
    };
    // ---------------------------

    // Prevent the app from rendering the routes until the auth check is 100% complete
    if (isCheckingAuth) {
        return null; 
    }

    return (
        <>
            {isAuthenticated && !isLoaded && (
                <LoadingScreen onComplete={() => setIsLoaded(true)} />
            )}

            <div
                className={`min-h-screen transition-opacity duration-700 ${
                    isLoaded || !isAuthenticated ? "opacity-100" : "opacity-0"
                } bg-gray-50 text-black-100`}
            >
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <DashboardPage onLogout={handleLogout} />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/simulations/:id"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <SimulationDetailsPage onLogout={handleLogout} />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;