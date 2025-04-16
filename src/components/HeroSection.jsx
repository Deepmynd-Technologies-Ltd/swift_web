// HeroSection.jsx
import { Button } from "./ui/button";
import { Globe, Zap, Shield, PieChart } from "lucide-react";
import "../assets/styles/hero.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Background gradient circles */}
      <div className="hero-background">
        <div className="background-circle green-circle"></div>
        <div className="background-circle green-circle"></div>
      </div>

      <div className="hero-container">
        {/* Fast Crypto Tag */}
        <div className="tag-container">
          <div className="feature-tag">
            Fast Crypto: Fiat Transactions
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Swap, Trade and do Crypto transactions swiftly
          </h1>

          <p className="hero-description">
            Experience swift and seamless crypto-fiat transactions, enjoy worldwide
            ease by trading in over 80 fiat currencies!
          </p>

          <div className="hero-cta">
            <a href="get-started" className="cta-button">Get Started</a>
          </div>
        </div>

        {/* Dashboard Images */}
        <div className="dashboard-images">
          <div className="image-wrapper">
            <img 
              src={require("../assets/img/hero_image_header.png")}
              alt="Header border" 
              className="header-image"
            />
            <img 
              src={require("../assets/img/hero_page_image.png")}
              alt="Crypto trading dashboard" 
              className="dashboard-image"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {/* Instant Transactions */}
          <div className="feature-card">
            <div className="feature-icon-container">
              <Zap className="feature-icon" />
            </div>
            <h3 className="feature-title">Instant Transactions</h3>
            <p className="feature-description">
              Swift and secure transactions are instantly executed, ensuring you capitalize on opportunities without delay.
            </p>
          </div>
          
          {/* Global Connectivity */}
          <div className="feature-card">
            <div className="feature-icon-container">
              <Globe className="feature-icon" />
            </div>
            <h3 className="feature-title">Global Connectivity</h3>
            <p className="feature-description">
              SwiftAza supports transactions and swapping operations in over a hundred fiat currencies.
            </p>
          </div>
          
          {/* Cutting-Edge Security */}
          <div className="feature-card">
            <div className="feature-icon-container">
              <Shield className="feature-icon" />
            </div>
            <h3 className="feature-title">Cutting-Edge Security</h3>
            <p className="feature-description">
              We prioritize your financial security with advanced measures, safeguarding your assets and personal information effectively.
            </p>
          </div>
        </div>
        
        {/* Trade Worldwide section */}
        <div className="worldwide-section">
          <div className="section-tag">Features</div>
          <h2 className="section-heading">
            Trade Worldwide with <span className="highlight">SwiftAza</span>
          </h2>
          <p className="section-description">
            Unlock global investment opportunities with SwiftAza's seamless trading capabilities, allowing you to trade effortlessly across international markets from the comfort of your own home.
          </p>
        </div>

        {/* Market Updates Section */}
      <div className="content-section-block">
        <div className="section-grid-layout">
          <div className="section-visual">
            <img src={require("../assets/img/side1.png")} alt="Market data" />
          </div>
          <div className="section-details">
            <div className="section-marker">
              <Zap className="section-icon" />
              <span>Real-Time Market Updates</span>
            </div>
            <h2 className="section-main-heading">Startup-to-date with Real-time Market Updates</h2>
            <p className="section-description-text">
              Stay ahead of the curve with SwiftMade real-time market updates, keeping you informed of the latest trends and opportunities in the financial world.
            </p>
            <ul className="benefits-list">
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Index: market movement updates.</span>
              </li>
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Trendy analysis and news alerts.</span>
              </li>
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Customizable notifications.</span>
              </li>
            </ul>
            <a href="#" className="section-action">
              Learn more →
            </a>
          </div>
        </div>
      </div>

      {/* Portfolio Management Section */}
      <div className="content-section-block">
        <div className="portfolio-management-grid">
          <div className="portfolio-content">
            <div className="section-marker">
              <PieChart className="section-icon" />
              <span>Overview Portfolio Management</span>
            </div>
            <h2 className="section-main-heading">Manage your Investments Portfolio seamlessly</h2>
            <p className="section-description-text">
              Manage your investments seamlessly with SwiftMade intuitive portfolio management tools, allowing you to track, analyze, and optimize your products with ease.
            </p>
            <ul className="benefits-list">
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">View portfolio performance.</span>
              </li>
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Decode index easily.</span>
              </li>
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Utilize advanced analytics.</span>
              </li>
            </ul>
            <a href="#" className="section-action">
              Learn more →
            </a>
          </div>
          <div className="portfolio-image">
            <img src={require("../assets/img/side2.png")} alt="Portfolio analytics" />
          </div>
        </div>
      </div>

      {/* Diverse Investments Section */}
      <div className="content-section-block">
        <div className="section-grid-layout">
          <div className="section-visual">
            <img src={require("../assets/img/side3.png")} alt="Investment options" />
          </div>
          <div className="section-details">
            <div className="section-marker">
              <Globe className="section-icon" />
              <span>Diverse Investment Options</span>
            </div>
            <h2 className="section-main-heading">Explore different investment options</h2>
            <p className="section-description-text">
              Explore a wide range of investment options with SwiftAge, offering access to stocks, bonds, cryptocurrencies, and more, all in our convenient platform.
            </p>
            <ul className="benefits-list">
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Rise(s), bonds, and cryptocurrencies.</span>
              </li>
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Alternative assets like real estate.</span>
              </li>
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Disaster for risk mitigation.</span>
              </li>
            </ul>
            <a href="#" className="section-action">
              Learn more →
            </a>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="content-section-block security-section">
        <div className="security-grid">
          <div className="security-content">
            <div className="section-marker">
              <Shield className="section-icon" />
              <span>Truist that SwiftAza cares about your security.</span>
            </div>
            <p className="section-description-text">
              Truist SwiftAza is prioritising your security with robust measures to safeguard your assets and personal information from unauthorized access and cyber threats.
            </p>
            <ul className="benefits-list">
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Two-factor authentication.</span>
              </li>
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Encryption for data and transactions.</span>
              </li>
              <li className="benefit-item">
                <span className="benefit-marker">*</span>
                <span className="benefit-text">Monitor account activity.</span>
              </li>
            </ul>
            <a href="#" className="section-action">
              Learn more →
            </a>
          </div>
          <div className="security-image">
            <img src={require("../assets/img/side4.png")} alt="Security" />
          </div>
        </div>
      </div>
      </div>
  </section>
  );
};

export default HeroSection;
