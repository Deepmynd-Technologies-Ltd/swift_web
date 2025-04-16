// Navbar.jsx
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "../assets/styles/navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container mt-4">
        <a href="/" className="navbar-logo">
          <div className="text-2xl font-bold text-white">
                Swift<span className="text-green">Aza</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <div className="nav-menu-list">
            <div className="nav-menu-item">
              <button
                className={`nav-trigger ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                Products
              </button>
            </div>

            <div className="nav-menu-item">
              <button
                className={`nav-trigger ${activeTab === "about" ? "active" : ""}`}
                onClick={() => setActiveTab("about")}
              >
                About Us
              </button>
            </div>

            <div className="nav-menu-item">
              <button
                className={`nav-trigger ${activeTab === "contact" ? "active" : ""}`}
                onClick={() => setActiveTab("contact")}
              >
                Contact Us
              </button>
            </div>
          </div>
        </nav>

        <div className="button-group">
          <a href="/auth/login" className="login-button">Login</a>
          <a href="/get-started" className="get-started-button">Get Started</a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
