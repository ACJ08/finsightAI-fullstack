import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/forms/InputField";
import Button from "../components/ui/Button";
import { login } from "../utils/authUtils";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState(""); // changed from email to username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(username, password); // call async login

    if (result.success) {
      setError("");
      onLogin && onLogin(); // update App state if provided
      navigate("/dashboard"); // go to dashboard
    } else {
      setError(result.message || "Invalid username or password!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Logo + Title */}
      <div className="flex items-center mb-6">
        <img
          src="/FinSightAI-Logo2.png"
          alt="Finsight AI Logo"
          className="w-16 h-16 object-contain mr-3"
        />
        <p className="text-4xl font-bold text-gray-900">FinSight AI</p>
      </div>

      {/* Login Box */}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button type="submit" variant="primary" className="w-full">
            Sign In
          </Button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;