import React from 'react';
import { ArrowRight } from 'lucide-react';
import "../assets/styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer mt-16 -mb-8">
      <div className="footer-container w-10/12 justify-center mx-auto mb-0">
        <div className="footer-grid">
          {/* Product Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">Product</h3>
            <ul className="footer-list">
              <li>Wallet</li>
              <li>Swap Funds</li>
              <li>Cards</li>
              <li>P2P</li>
              <li>Investment</li>
              <li>Business</li>
            </ul>
          </div>

          {/* Information Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">Information</h3>
            <ul className="footer-list">
              <li>FAQ</li>
              <li>Blog</li>
              <li>Support</li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">Company</h3>
            <ul className="footer-list">
              <li>About us</li>
              <li>Careers</li>
              <li>Contact us</li>
              <li>SwiftAza</li>
            </ul>
          </div>

          {/* Subscribe Section - Updated to match image */}
          <div className="footer-subscribe">
            <h3 className="footer-column-title">Subscribe</h3>
            <div className="footer-input-container">
              <input 
                type="email" 
                placeholder="Email address" 
                className="footer-input"
              />
              <span className="footer-input-icon">→</span>
            </div>
            <p className="footer-subscribe-text">
              Hello, we are SwiftAza. Our goal is to allow users deal in crypto transaction with any fiat currency from anywhere in the world.
            </p>
          </div>
        </div>
        
        <div className="footer-divider"></div>

        <div className="footer-bottom flex flex-row w-full">
            <p className="footer-brand text-xl">Swift<span className="text-green">Aza</span></p>
            
            <div className="footer-links justify-center mx-auto">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Cookies</a>
            </div>
            
            <div className="footer-social-media">
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
