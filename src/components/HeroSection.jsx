import { Button } from "./ui/button";
import { Zap, Globe, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-0 md:pt-40 md:pb-0 overflow-hidden bg-gray-900">
      {/* Background gradient circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-[10%] w-[600px] h-[600px] bg-swiftaza-purple/10 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-swiftaza-blue/10 rounded-full filter blur-[80px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Fast Crypto Tag */}
        <div className="flex justify-center mb-14">
          <div className="bg-zinc-900/60 backdrop-blur-sm border border-emerald-500/30 rounded-full px-4 py-1 text-sm text-white/90">
            Fast Crypto: Fiat Transactions
          </div>
        </div>
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Swap, Trade and do Crypto transactions swiftly
          </h1>
          
          <p className="text-lg text-white/80 mb-10">
            Experience swift and seamless crypto-fiat transactions, enjoy worldwide
            ease by trading in over 80 fiat currencies!
          </p>
          
          <div className="flex justify-center mb-16">
            <Button className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-base px-8 py-6 rounded-md">
              Get Started
            </Button>
          </div>
        </div>
        
        {/* Dashboard Image */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative z-10">
            <div className="rounded-t-xl overflow-hidden border border-white/10 shadow-lg">
              <div className="bg-zinc-900 flex items-center p-2 space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="flex-1 mx-2 bg-zinc-800 rounded-full h-6 flex items-center justify-between px-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-zinc-500 rounded-full mr-2"></div>
                    <span className="text-xs text-white/60">figma.com/swiftaza.io</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-zinc-600 rounded-full"></div>
                    <div className="w-4 h-4 bg-zinc-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              <img 
                src="/lovable-uploads/e89a66c7-b5a3-4c54-b0b1-792d87e6779a.png" 
                alt="SwiftAza crypto trading dashboard" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Feature cards section - exactly as in the image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 mb-20">
          {/* Instant Transactions */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-900/40 mb-4">
              <Zap className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-emerald-400 font-medium text-lg mb-2">Instant Transactions</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Swift and secure transactions are instantly executed, ensuring you capitalize on opportunities without delay.
            </p>
          </div>
          
          {/* Global Connectivity */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-900/40 mb-4">
              <Globe className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-emerald-400 font-medium text-lg mb-2">Global Connectivity</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              SwiftAza supports transactions and swapping operations in over a hundred fiat currencies.
            </p>
          </div>
          
          {/* Cutting-Edge Security */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-900/40 mb-4">
              <Shield className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-emerald-400 font-medium text-lg mb-2">Cutting-Edge Security</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              We prioritize your financial security with advanced measures, safeguarding your assets and personal information effectively.
            </p>
          </div>
        </div>
        
        {/* Trade Worldwide section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-xs bg-violet-900/50 text-white px-3 py-1 rounded-full">Features</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Trade Worldwide with <span className="text-emerald-400">SwiftAza</span>.</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-sm leading-relaxed">
            Unlock global investment opportunities with SwiftAza's seamless trading capabilities, allowing you to trade effortlessly across international markets from the comfort of your home.
          </p>
        </div>
        
        {/* Market Updates section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-emerald-900/20 rounded-lg overflow-hidden">
            <img 
              src="https://placehold.co/600x400" 
              alt="Real-time market dashboard" 
              className="w-full h-auto"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-violet-400" />
              <span className="text-violet-400 text-sm font-medium">Real-Time Market Updates</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Stay up-to-date with Real-time Market Updates</h3>
            <p className="text-white/70 mb-6">
              Stay ahead of the curve with SwiftAza's real-time market updates, keeping you informed of the latest trends and opportunities in the financial world.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="min-w-5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-white/70 text-sm">Instant market movement updates.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-white/70 text-sm">Timely analysis and news alerts.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-white/70 text-sm">Customizable notifications.</span>
              </li>
            </ul>
            <div className="mt-6">
              <a href="#" className="text-sm text-violet-400 flex items-center gap-2">
                Learn more <span className="text-lg">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
