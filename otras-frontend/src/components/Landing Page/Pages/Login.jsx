import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import loginImage from "../assets/Login-Image.png";
import axios from "axios";

export default function Login({ onAuthSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { user, access_token } = response.data;

      // Store auth data
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Inform parent component
      if (onAuthSuccess) onAuthSuccess(user);

      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid OTR ID/Email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-2xl grid md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-blue-50 p-8">
          <img
            src={loginImage}
            alt="Login visual"
            className="w-full max-w-md object-contain"
          />
        </div>

        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-extrabold text-center text-blue-800">
              LOGIN
            </h1>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-600 text-sm font-medium">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <input
                  type="text"
                  name="email"
                  placeholder="OTR ID / Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-400 px-4 py-4 text-gray-800 outline-none focus:border-blue-600"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-400 px-4 py-4 pr-12 text-gray-800 outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-700 py-4 text-lg font-semibold text-white transition hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-700">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => navigate("/profile")}
                className="font-semibold text-orange-500 hover:text-orange-600"
              >
                Register here
              </button>
            </p>

            <p className="mt-6 text-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}