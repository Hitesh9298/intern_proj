import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMsg("If this email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.error || "Error sending reset email");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl animate-fade-in-up">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12v1a4 4 0 01-8 0v-1m8 0V8a4 4 0 10-8 0v4m8 0H8" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 mb-1">Forgot Password</h1>
          <p className="text-gray-500 text-sm">Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border-2 border-blue-100 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-bold text-lg shadow-md hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-transform duration-150" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Sending...
              </span>
            ) : "Send Reset Link"}
          </button>
          {msg && <div className="text-green-600 text-center font-semibold animate-fade-in">{msg}</div>}
          {error && <div className="text-red-600 text-center font-semibold animate-fade-in">{error}</div>}
        </form>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 