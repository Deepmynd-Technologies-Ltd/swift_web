import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation, Link } from "react-router-dom"; // Add this import
import "../assets/styles/navbar.css";

const Navbar = () => {
  const location = useLocation(); // Get current location
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [indicatorLeft, setIndicatorLeft] = useState("0px");
  const [indicatorWidth, setIndicatorWidth] = useState("0px");

  const tabRefs = useRef({
    products: null,
    about: null,
    contact: null,
  });

  // Sync active tab with URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/products")) setActiveTab("products");
    else if (path.includes("/about-us")) setActiveTab("about");
    else if (path.includes("/contact-us")) setActiveTab("contact");
  }, [location]);

  // Rest of your existing useEffect hooks
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const activeElement = tabRefs.current[activeTab];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setIndicatorLeft(`${offsetLeft}px`);
      setIndicatorWidth(`${offsetWidth}px`);
    }
  }, [activeTab, location]); // Add location to dependencies

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
            <div className="nav-indicator" style={{ left: indicatorLeft, width: indicatorWidth }}></div>

            <Link
              to="/products"
              ref={(el) => (tabRefs.current.products = el)}
              className={`nav-trigger ${activeTab === "products" ? "active" : ""}`}
            >
              Products <ChevronDown className="chevron-icon" />
            </Link>

            <Link
              to="/about-us"
              ref={(el) => (tabRefs.current.about = el)}
              className={`nav-trigger ${activeTab === "about" ? "active" : ""}`}
            >
              About Us
            </Link>

            <Link
              to="/contact-us"
              ref={(el) => (tabRefs.current.contact = el)}
              className={`nav-trigger ${activeTab === "contact" ? "active" : ""}`}
            >
              Contact Us
            </Link>

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
