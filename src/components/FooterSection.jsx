import { Twitter, Facebook, Instagram, Linkedin, Github, ExternalLink } from "lucide-react";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company info */}
          <div>
            <div className="mb-6">
              <a href="/" className="flex items-center">
                <span className="text-2xl font-bold text-white">Swift<span className="text-purple-500">Aza</span></span>
              </a>
            </div>
            <p className="text-white opacity-70 mb-6">
              Your all-in-one platform for secure, fast cryptocurrency trading. Join thousands of traders today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white opacity-70 hover:text-purple-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white opacity-70 hover:text-purple-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white opacity-70 hover:text-purple-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white opacity-70 hover:text-purple-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-white opacity-70 hover:text-purple-500 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  How It Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-white opacity-70 hover:text-white transition-colors flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Licenses
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} SwiftAza. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
