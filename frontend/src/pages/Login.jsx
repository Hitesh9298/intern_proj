import { useState } from "react";
import { useAuth } from "../components/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    alert("Login submitted! (Demo only)");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        {/* Demo Quick Login Buttons */}
        <div className="mt-8">
          <p className="mb-2 text-gray-500 text-center">Demo Quick Login:</p>
          <div className="flex gap-2 justify-center">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => login({ name: "Student User", role: "student" })}
            >
              Student
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => login({ name: "Faculty User", role: "faculty" })}
            >
              Faculty
            </button>
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded"
              onClick={() => login({ name: "Admin User", role: "admin" })}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 