import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import "../assets/styles/navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [indicatorLeft, setIndicatorLeft] = useState("0px");
  const [indicatorWidth, setIndicatorWidth] = useState("0px");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  }, [activeTab, location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`navbar-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container mt-4">
        <a href="/" className="navbar-logo">
          <div className="text-2xl font-bold text-white">
            Swift<span style={{ color: "#27C499" }}>Aza</span>
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

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Auth Buttons - Visible on Desktop */}
        <div className="button-group">
          <a href="/auth/login" className="login-button">Login</a>
          <a href="/get-started" className="get-started-button">Get Started</a>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay">
          <div className="mobile-nav-content">
            <Link
              to="/products"
              className={`mobile-nav-link ${activeTab === "products" ? "active" : ""}`}
              onClick={handleMobileNavClick}
            >
              Products <ChevronDown className="chevron-icon-mobile" />
            </Link>

            <Link
              to="/about-us"
              className={`mobile-nav-link ${activeTab === "about" ? "active" : ""}`}
              onClick={handleMobileNavClick}
            >
              About Us
            </Link>

            <Link
              to="/contact-us"
              className={`mobile-nav-link ${activeTab === "contact" ? "active" : ""}`}
              onClick={handleMobileNavClick}
            >
              Contact Us
            </Link>

            {/* Auth Buttons - Mobile Version */}
            <div className="mobile-button-group">
              <a href="/auth/login" className="mobile-login-button">Login</a>
              <a href="/get-started" className="mobile-get-started-button">Get Started</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
