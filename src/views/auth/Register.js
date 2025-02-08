import React from "react";
import { Link, useHistory } from "react-router-dom";

export default function Register() {
  const history = useHistory();

  const [formData, setFormData] = React.useState({
    fullname: "",
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
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        sessionStorage.setItem("userId", data.user_id); // Save user_id
        history.push("/auth/createpin");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed.");
      }
    } catch (err) {
      // console.error("Error:", err);
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
            Create Account
          </h2>
          <p className="text-sm text-blueGray-500 mb-6 font-semibold">
            Enter your details below.
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
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="What should we call you?"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring focus:outline-none mb-1"
                  required
                />
              </div>
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
                  placeholder="Make it strong, don't use 1-8"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring focus:outline-none mb-1"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-green-500 text-white font-semibold p-3 rounded-my"
              >
                Create Account
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-blueGray-500">
              Already have an account?{" "}
              <Link to="/auth/login" className="hover:underline text-green font-bold">
                Sign In
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
