import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import defaultAvatar from "../assets/default-avatar.png";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/profile";

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", department: "", rollno: "", empid: "", profileImage: "" });
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(API_URL, { headers: { authorization: token } })
      .then(res => {
        setForm(res.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(API_URL, { ...form, password: password || undefined }, { headers: { authorization: token } });
      setMsg("Profile updated!");
      login(res.data); // Update context
      setPassword("");
    } catch (err) {
      setMsg(err.response?.data?.error || "Update failed");
    }
  };

  const handleImageChange = async (e) => {
    if (!e.target.files[0]) return;
    setUploading(true);
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("profileImage", e.target.files[0]);
    try {
      const res = await axios.post(`${API_URL}/image`, data, {
        headers: { authorization: token, "Content-Type": "multipart/form-data" }
      });
      setForm(f => ({ ...f, profileImage: res.data.profileImage }));
      setMsg("Profile image updated!");
    } catch (err) {
      setMsg("Image upload failed");
    }
    setUploading(false);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">My Profile</h1>
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={form.profileImage ? `http://localhost:5000${form.profileImage}` : defaultAvatar}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-200 object-cover shadow"
          />
          <button
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700"
            onClick={() => fileInputRef.current.click()}
            type="button"
            title="Change profile image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7v6a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h7a2 2 0 012 2z" />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            disabled={uploading}
          />
        </div>
        {uploading && <div className="text-xs text-gray-500 mt-2">Uploading...</div>}
      </div>
      {msg && <div className="mb-4 text-green-600 text-center">{msg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        {user?.role === "student" && (
          <div>
            <label className="block font-medium">Roll No</label>
            <input name="rollno" value={form.rollno || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        )}
        {(user?.role === "faculty" || user?.role === "admin") && (
          <div>
            <label className="block font-medium">Employee ID</label>
            <input name="empid" value={form.empid || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        )}
        <div>
          <label className="block font-medium">Department</label>
          <input name="department" value={form.department || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium">Change Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Leave blank to keep current" />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Update Profile</button>
      </form>
    </div>
  );
}