// HeroSection.jsx
import { Globe, Zap, Shield } from "lucide-react";
import "../assets/styles/hero.css";

const AboutHeroSection = () => {
  return (
    <div>
      <section className="hero-section">
        {/* Background gradient circles */}
        <div className="hero-background">

          <div className="background-circle green-circle"></div>
        </div>

        <div className="hero-container">
          {/* Fast Crypto Tag */}
          <div className="tag-container">
            <div className="feature-tag">
              About Us
            </div>
          </div>

          <div className="hero-content">
            <h1 className="hero-title">
              “speed isn’t just an option, it’s our obsession”
            </h1>

            <p className="hero-description">
              At SwiftAza, we’re all about making your financial journey as smooth and speedy as a sports car on an open highway.
            </p>

            <div className="hero-cta">
              <a href="get-started" className="cta-button">Get Started</a>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-black -mt-8">
        {/* Main Content */}
        <div className="hero-content">

          <div className="about-sections">
            <div className="tag-container">
              <div className="feature-tag">
                Identity
              </div>
            </div>
            {/* First Paragraph Section */}
            <div className="about-section">
              <h1 className="section-heading text-xl">
                Who We Are
              </h1>
              <p className="about-text">
                When the needs of the finance world—tech goals, financial worries, and visionaries who believe that managing your money should be quick, easy, or so, more a little bit far. SwiftAza was born out of a frustration with slow, outdated platforms that just don't cut it. So we decided to build something better—something faster. And here we are, ready to take your finances from zero to sixty in no time flat.
              </p>
            </div>

            <div className="tag-container mt-16">
              <div className="feature-tag">
                Work
              </div>
            </div>
            {/* Second Paragraph Section */}
            <div className="about-section">
              <h1 className="section-heading">
                What we do
              </h1>
              <p className="about-text">
                Think of us as your financial pit crew; here to supercharge your investments. Whether you're dipping your toes into crypto, playing the global markets, or just trying to keep your fiat currencies in check, SwiftAza gives you the tools to do it all at very speed. Our platform is so intuitive, even your grandma could use it (no offense to grandmas—we love you!).
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="about-section">
          <h2 className="section-heading text-center">Why Choose SwiftAza?</h2>
          
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
      </div>
      </section>
    </div>
  );
};

export default AboutHeroSection;
