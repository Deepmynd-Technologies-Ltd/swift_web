import React from "react";
import { Link, useHistory } from "react-router-dom";

export default function Login() {
  const history = useHistory();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [error, setError] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        history.push("/admin/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <div className="relative flex flex-col w-full lg:w-6/12 px-4">
        <div className="bg-white rounded-my shadow-lg p-8">
          <a
            className="relative left-90 text-black text-3xl font-bold font-weight-900"
            onClick={() => window.history.back()}
          >
            ←
          </a>
          <h2 className="text-2xl font-semibold mb-4 text-green text-aeonik">
            Log In
          </h2>
          <p className="text-sm text-blueGray-500 mb-6 font-semibold">
            Welcome Back
          </p>
          {error && (
            <div className="text-red-500 text-sm font-semibold mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black font-semibold text-aeonik">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Where can we reach you?"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring focus:outline-none mb-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black font-semibold text-aeonik">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring focus:outline-none mb-1"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-green-500 text-white font-semibold p-3 rounded-my"
              >
                Sign In
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-blueGray-500">
              Don't have an account?{" "}
              <Link to="/auth/register" className="hover:underline text-green font-bold">
                Register
              </Link>
            </p>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-blueGray-500 font-semibold">
              By using Swiftaza, you agree to our{" "}
              <Link to="/terms" className="hover:underline text-green font-semibold">
                Terms of Service
              </Link>,{" "}
              <Link to="/privacy" className="hover:underline text-green font-semibold">
                Privacy Policy
              </Link>, and{" "}
              <Link to="/cardholder" className="hover:underline text-green font-semibold">
                Card Holder Agreement
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
