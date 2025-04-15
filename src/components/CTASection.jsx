import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/5 w-64 h-64 bg-purple-300 rounded-full filter blur-[80px] -z-10"></div>
      <div className="absolute bottom-0 right-1/5 w-64 h-64 bg-blue-300 rounded-full filter blur-[80px] -z-10"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="glass-card p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to <span className="gradient-text">Revolutionize</span> Your Trading Experience?
          </h2>
          
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who've already made the switch to SwiftAza. 
            Sign up today and experience the future of cryptocurrency trading.
          </p>
          
          <Button className="bg-purple-500 hover:bg-purple-700 text-white font-medium text-lg px-8 py-6">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
