import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

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
    <header className={`
      fixed top-0 left-0 right-0 z-50 
      transition-all duration-300 
      ${isScrolled ? "bg-green/80 backdrop-blur-md py-3" : "bg-transparent py-5"}
    `}>
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <a href="/" className="flex items-center">
          <span className="text-2xl font-bold text-white">
            Swift<span className="text-swiftaza-purple">Aza</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-1 bg-zinc-800/80 backdrop-blur-sm rounded-full px-3 py-1.5">
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  onClick={() => setActiveTab("products")}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${activeTab === "products" 
                      ? "bg-white text-swiftaza-darker" 
                      : "bg-transparent text-white/80 hover:text-white"}
                  `}
                >
                  Products <ChevronDown className="ml-1 h-3 w-3" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[200px]">
                    <li>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="text-sm font-medium">Trading</div>
                        <p className="text-sm text-muted-foreground">
                          Buy and sell cryptocurrencies
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="text-sm font-medium">Wallet</div>
                        <p className="text-sm text-muted-foreground">
                          Store and manage your assets
                        </p>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <button 
                  onClick={() => setActiveTab("about")}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${activeTab === "about" 
                      ? "bg-white text-swiftaza-darker" 
                      : "bg-transparent text-white/80 hover:text-white"}
                  `}
                >
                  About Us
                </button>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <button 
                  onClick={() => setActiveTab("contact")}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${activeTab === "contact" 
                      ? "bg-white text-swiftaza-darker" 
                      : "bg-transparent text-white/80 hover:text-white"}
                  `}
                >
                  Contact Us
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="rounded-full border-none bg-transparent hover:bg-white/5 text-white text-sm font-medium"
          >
            Login
          </Button>
          <Button className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-full px-4 py-2 text-sm font-medium">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;