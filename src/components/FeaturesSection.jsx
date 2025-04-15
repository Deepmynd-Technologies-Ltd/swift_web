import { Cpu, Lock, Zap, Globe, PieChart, Wallet } from "lucide-react";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:-translate-y-2">
      <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Icon className="text-white h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Trades",
      description: "Execute trades in milliseconds with our advanced matching engine that ensures optimal pricing."
    },
    {
      icon: Lock,
      title: "Bank-Grade Security",
      description: "Your assets are secured with military-grade encryption and multi-signature technology."
    },
    {
      icon: Wallet,
      title: "Multi-Currency Wallet",
      description: "Store, manage, and transfer multiple cryptocurrencies in one secure wallet."
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Trade from anywhere in the world with our platform that supports multiple languages and currencies."
    },
    {
      icon: PieChart,
      title: "Advanced Analytics",
      description: "Make informed decisions with real-time market data and in-depth analytics tools."
    },
    {
      icon: Cpu,
      title: "AI-Powered Insights",
      description: "Get trading recommendations powered by our proprietary AI algorithm that analyzes market patterns."
    }
  ];

  return (
    <section id="features" className="section-padding relative">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-full h-full -z-10">
        <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-purple-200 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-0 left-[20%] w-[500px] h-[500px] bg-blue-200 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features That Make<br />
            <span className="gradient-text">Trading Effortless</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Our comprehensive suite of trading tools and features designed to empower both beginners and professional traders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
