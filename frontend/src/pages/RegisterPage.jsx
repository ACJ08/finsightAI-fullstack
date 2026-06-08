import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/forms/InputField";
import Button from "../components/ui/Button";
import { register } from "../utils/authUtils";

const RegisterPage = () => {
  const [username, setUsername] = useState(""); // changed from name/email to username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const result = await register(username, password); // call async register

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
    navigate("/"); // back to login
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

      {/* Register Box */}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Register
        </h2>
        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
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
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button type="submit" variant="primary" className="w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;